import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { SectionCard } from "../SectionCard";

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: unknown }) => (
    <a href={typeof href === "string" ? href : JSON.stringify(href)} {...props}>{children}</a>
  ),
}));

describe("SectionCard", () => {
  it("renders an img when imagePath is provided", () => {
    const { container } = render(
      <SectionCard href="/hoteles" badge="Hoteles" title="Hoteles" description="desc" imagePath="banners/hoteles.jpg" />,
    );
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("does not render an img when imagePath is not provided", () => {
    const { container } = render(
      <SectionCard href="/hoteles" badge="Hoteles" title="Hoteles" description="desc" />,
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});
