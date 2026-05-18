import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { SurfShopCard } from "../SurfShopCard";
import type { SurfShop } from "@/features/surf/types";

vi.mock("next-intl", () => ({
  useTranslations: () => (k: string) => k,
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const BASE_SHOP: SurfShop = {
  id: "1",
  slug: "cerritos-surf",
  name_es: "Cerritos Surf",
  name_en: "Cerritos Surf",
  description_es: null,
  description_en: null,
  services: [],
  price_from: null,
  phone: null,
  website: null,
  address: null,
  cover_image_path: null,
  is_published: true,
  featured: false,
  created_at: "",
  updated_at: "",
};

describe("SurfShopCard", () => {
  it("renders an img with sizes when cover_image_path is provided", () => {
    const { container } = render(
      <SurfShopCard
        shop={{ ...BASE_SHOP, cover_image_path: "surf/shop.jpg" }}
        locale="es"
        supabaseUrl="https://test.supabase.co"
      />,
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("sizes");
  });

  it("renders img with the correct src", () => {
    const { container } = render(
      <SurfShopCard
        shop={{ ...BASE_SHOP, cover_image_path: "surf/shop.jpg" }}
        locale="es"
        supabaseUrl="https://test.supabase.co"
      />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toContain("surf/shop.jpg");
  });

  it("does not render an img when cover_image_path is null", () => {
    const { container } = render(
      <SurfShopCard shop={BASE_SHOP} locale="es" supabaseUrl="https://test.supabase.co" />,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
