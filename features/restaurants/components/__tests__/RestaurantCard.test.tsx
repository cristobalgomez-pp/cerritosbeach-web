import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { RestaurantCard } from "../RestaurantCard";
import type { Restaurant } from "@/features/restaurants/types";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const BASE_RESTAURANT: Restaurant = {
  id: "1",
  slug: "el-cerritos",
  name_es: "El Cerritos",
  name_en: "El Cerritos",
  description_es: null,
  description_en: null,
  cuisine_type: null,
  price_range: null,
  phone: null,
  website: null,
  address: null,
  hours: null,
  cover_image_path: null,
  gallery_paths: [],
  is_published: true,
  featured: false,
  created_at: "",
  updated_at: "",
};

describe("RestaurantCard", () => {
  it("renders an img with sizes when cover_image_path is provided", () => {
    const { container } = render(
      <RestaurantCard
        restaurant={{ ...BASE_RESTAURANT, cover_image_path: "restaurants/el-cerritos.jpg" }}
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
      <RestaurantCard
        restaurant={{ ...BASE_RESTAURANT, cover_image_path: "restaurants/el-cerritos.jpg" }}
        locale="es"
        supabaseUrl="https://test.supabase.co"
      />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toContain("restaurants/el-cerritos.jpg");
  });

  it("does not render an img when cover_image_path is null", () => {
    const { container } = render(
      <RestaurantCard
        restaurant={BASE_RESTAURANT}
        locale="es"
        supabaseUrl="https://test.supabase.co"
      />,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
