import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { getPageBanner } from "../queries";

const mockedCreateClient = vi.mocked(createClient);

function makeChain(result: { data: unknown; error: unknown }) {
  const promise = Promise.resolve(result);
  const chain: any = Object.assign(promise, {
    select:      vi.fn(),
    eq:          vi.fn(),
    maybeSingle: vi.fn(),
  });
  for (const key of Object.keys(chain)) {
    if (typeof chain[key] === "function") chain[key].mockReturnValue(chain);
  }
  return chain;
}

function makeClient(chain: ReturnType<typeof makeChain>) {
  return { from: vi.fn().mockReturnValue(chain) } as unknown as Awaited<ReturnType<typeof createClient>>;
}

const BANNER = {
  page: "hoteles",
  image_path: "banners/hoteles/hero.jpg",
  title_es: "Hoteles en Cerritos",
  title_en: "Hotels in Cerritos",
  eyebrow_es: null, eyebrow_en: null,
  subtitle_es: null, subtitle_en: null,
  created_at: "2026-05-17T00:00:00Z",
  updated_at: "2026-05-17T00:00:00Z",
};

describe("getPageBanner", () => {
  beforeEach(() => vi.resetAllMocks());

  // Ciclo 1 — tracer bullet
  it("returns the banner when the row exists for the page slug", async () => {
    const chain = makeChain({ data: BANNER, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getPageBanner("hoteles");

    expect(result).toEqual(BANNER);
    expect(chain.eq).toHaveBeenCalledWith("page", "hoteles");
  });

  // Ciclo 2
  it("returns null when no row exists for the page slug", async () => {
    const chain = makeChain({ data: null, error: null });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    const result = await getPageBanner("home");

    expect(result).toBeNull();
  });

  // Ciclo 3
  it("throws when the database returns an error", async () => {
    const chain = makeChain({ data: null, error: { message: "DB error" } });
    mockedCreateClient.mockResolvedValue(makeClient(chain));

    await expect(getPageBanner("surf")).rejects.toMatchObject({ message: "DB error" });
  });
});
