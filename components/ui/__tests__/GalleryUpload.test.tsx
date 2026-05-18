import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GalleryUpload } from "../GalleryUpload";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/client";

const mockedCreateClient = vi.mocked(createClient);

function makeStorageMock(uploadError: unknown = null) {
  const uploadFn = vi.fn().mockResolvedValue({ error: uploadError });
  const getPublicUrl = vi.fn().mockReturnValue({
    data: { publicUrl: "https://test.supabase.co/storage/v1/object/public/content-images/hotels/1/gallery/photo.jpg" },
  });
  const fromFn = vi.fn().mockReturnValue({ upload: uploadFn, getPublicUrl });
  return { storage: { from: fromFn }, _upload: uploadFn };
}

const BASE_PROPS = {
  bucket: "content-images",
  basePath: "hotels/1/gallery",
  paths: [] as string[],
  onChanged: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

// ─── Ciclo 1: tracer bullet ───────────────────────────────────────────────────

describe("GalleryUpload", () => {
  it("renders an add-photo button", () => {
    render(<GalleryUpload {...BASE_PROPS} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  // ─── Ciclo 2: muestra fotos existentes ──────────────────────────────────────

  it("renders an img for each existing path", () => {
    const { container } = render(
      <GalleryUpload
        {...BASE_PROPS}
        paths={["hotels/1/gallery/a.jpg", "hotels/1/gallery/b.jpg"]}
      />,
    );
    expect(container.querySelectorAll("img")).toHaveLength(2);
  });

  // ─── Ciclo 3: eliminar foto ──────────────────────────────────────────────────

  it("calls onChanged without the deleted path when delete is clicked", () => {
    const onChanged = vi.fn();
    render(
      <GalleryUpload
        {...BASE_PROPS}
        paths={["hotels/1/gallery/a.jpg", "hotels/1/gallery/b.jpg"]}
        onChanged={onChanged}
      />,
    );
    const deleteButtons = screen.getAllByRole("button", { name: /eliminar|×|delete/i });
    fireEvent.click(deleteButtons[0]);
    expect(onChanged).toHaveBeenCalledWith(["hotels/1/gallery/b.jpg"]);
  });

  // ─── Ciclo 4: subida agrega path al array ────────────────────────────────────

  it("calls onChanged with new path appended after successful upload", async () => {
    const onChanged = vi.fn();
    const { _upload } = makeStorageMock();
    mockedCreateClient.mockReturnValue(makeStorageMock()._upload ? makeStorageMock() as any : ({} as any));

    // Reset and set up properly
    vi.clearAllMocks();
    const mock = makeStorageMock();
    mockedCreateClient.mockReturnValue(mock as any);

    render(
      <GalleryUpload
        {...BASE_PROPS}
        paths={["hotels/1/gallery/existing.jpg"]}
        onChanged={onChanged}
      />,
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["img"], "new-photo.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(onChanged).toHaveBeenCalled());
    const [newPaths] = onChanged.mock.calls[0];
    expect(newPaths).toContain("hotels/1/gallery/existing.jpg");
    expect(newPaths.length).toBe(2);
  });

  // ─── Ciclo 5: estado de carga ────────────────────────────────────────────────

  it("disables the add button while a file is uploading", async () => {
    // Upload that never resolves during this test
    let resolveUpload!: () => void;
    const pendingUpload = new Promise<{ error: null }>((res) => {
      resolveUpload = () => res({ error: null });
    });
    const mock = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockReturnValue(pendingUpload),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://x" } }),
        }),
      },
    };
    mockedCreateClient.mockReturnValue(mock as any);

    render(<GalleryUpload {...BASE_PROPS} onChanged={vi.fn()} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const btn = screen.getByRole("button", { name: /subiendo|uploading/i });
      expect(btn).toBeDisabled();
    });

    resolveUpload();
  });
});
