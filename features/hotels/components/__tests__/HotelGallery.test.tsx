import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HotelGallery } from "../HotelGallery";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("HotelGallery", () => {
  it("shows the cover image when gallery_paths is empty", () => {
    const { container } = render(
      <HotelGallery
        coverUrl="https://test.supabase.co/cover.jpg"
        galleryUrls={[]}
      />,
    );
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute("src", "https://test.supabase.co/cover.jpg");
  });

  it("only renders one img at a time even with multiple gallery items", () => {
    const { container } = render(
      <HotelGallery
        coverUrl="https://test.supabase.co/cover.jpg"
        galleryUrls={[
          "https://test.supabase.co/g1.jpg",
          "https://test.supabase.co/g2.jpg",
        ]}
      />,
    );
    // carousel shows current slide only
    expect(container.querySelectorAll("img")).toHaveLength(1);
  });

  it("next button advances to the next slide", () => {
    const { container } = render(
      <HotelGallery
        coverUrl="https://test.supabase.co/cover.jpg"
        galleryUrls={["https://test.supabase.co/g1.jpg"]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://test.supabase.co/g1.jpg",
    );
  });

  it("prev on first slide wraps around to the last slide", () => {
    const { container } = render(
      <HotelGallery
        coverUrl="https://test.supabase.co/cover.jpg"
        galleryUrls={["https://test.supabase.co/g1.jpg"]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://test.supabase.co/g1.jpg",
    );
  });
});
