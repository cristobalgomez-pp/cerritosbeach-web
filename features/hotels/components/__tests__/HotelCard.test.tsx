import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { HotelCard } from "../HotelCard";
import type { Hotel } from "@/features/hotels/types";

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: unknown }) => (
    <a href={typeof href === "string" ? href : JSON.stringify(href)} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const BASE_HOTEL: Hotel = {
  id: "1",
  slug: "hotel-cerritos",
  name_es: "Hotel Cerritos",
  name_en: "Hotel Cerritos",
  description_es: null,
  description_en: null,
  category: null,
  phone: null,
  website: null,
  address: null,
  cover_image_path: null,
  gallery_paths: [],
  is_published: true,
  featured: false,
  created_at: "",
  updated_at: "",
};

describe("HotelCard", () => {
  it("renders an img with sizes when cover_image_path is provided", () => {
    const { container } = render(
      <HotelCard
        hotel={{ ...BASE_HOTEL, cover_image_path: "hotels/cerritos.jpg" }}
        locale="es"
        supabaseUrl="https://test.supabase.co"
      />,
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("sizes");
  });

  it("renders img with the correct src including Supabase URL", () => {
    const { container } = render(
      <HotelCard
        hotel={{ ...BASE_HOTEL, cover_image_path: "hotels/cerritos.jpg" }}
        locale="es"
        supabaseUrl="https://test.supabase.co"
      />,
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("hotels/cerritos.jpg");
  });

  it("renders img with the hotel name as alt text", () => {
    const { container } = render(
      <HotelCard
        hotel={{ ...BASE_HOTEL, name_es: "Hotel Playa", cover_image_path: "hotels/playa.jpg" }}
        locale="es"
        supabaseUrl="https://test.supabase.co"
      />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("alt", "Hotel Playa");
  });

  it("does not render an img when cover_image_path is null", () => {
    const { container } = render(
      <HotelCard hotel={BASE_HOTEL} locale="es" supabaseUrl="https://test.supabase.co" />,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
