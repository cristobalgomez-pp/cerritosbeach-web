import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/features/admin/lib/guard", () => ({
  requireAdmin: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/admin/lib/guard";
import { upsertPageBanner } from "../actions";

const mockedCreateClient = vi.mocked(createClient);
const mockedRequireAdmin = vi.mocked(requireAdmin);

const GUARD_OK   = null;
const GUARD_FAIL = { status: "error" as const, code: "UNAUTHORIZED" as const };

function makeChain(result: { data: unknown; error: unknown }) {
  const promise = Promise.resolve(result);
  const chain: any = Object.assign(promise, {
    select: vi.fn(),
    eq:     vi.fn(),
    upsert: vi.fn(),
  });
  for (const key of Object.keys(chain)) {
    if (typeof chain[key] === "function") chain[key].mockReturnValue(chain);
  }
  return chain;
}

function makeClient(chain: ReturnType<typeof makeChain>) {
  return { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<ReturnType<typeof createClient>>;
}

describe("upsertPageBanner", () => {
  beforeEach(() => vi.resetAllMocks());

  // Ciclo 1 — tracer bullet
  it("returns UNAUTHORIZED when the admin guard fails", async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_FAIL);

    const result = await upsertPageBanner("home", { title_es: "Bienvenidos" });

    expect(result).toEqual(GUARD_FAIL);
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  // Ciclo 2
  it("returns VALIDATION error when data fails schema validation", async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);

    const result = await upsertPageBanner("home", { title_es: "a".repeat(201) });

    expect(result).toMatchObject({ status: "error", code: "VALIDATION" });
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  // Ciclo 3
  it("calls upsert with the page slug and returns success when valid and admin", async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await upsertPageBanner("hoteles", { title_es: "Hoteles", title_en: "Hotels" });

    expect(result).toEqual({ status: "success" });
    expect(chain.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ page: "hoteles", title_es: "Hoteles" }),
      { onConflict: "page" }
    );
  });

  // Ciclo 4
  it("returns DB_ERROR when upsert fails", async () => {
    mockedRequireAdmin.mockResolvedValue(GUARD_OK);
    const chain = makeChain({ data: null, error: { message: "unique violation" } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await upsertPageBanner("surf", { title_es: "Surf" });

    expect(result).toMatchObject({ status: "error", code: "DB_ERROR" });
  });
});
