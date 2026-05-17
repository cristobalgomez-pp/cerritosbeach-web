import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import { ComoLlegarSection } from "../ComoLlegarSection";

describe("ComoLlegarSection", () => {
  it("renders without crash", () => {
    const { container } = render(<ComoLlegarSection />);
    expect(container).toBeTruthy();
  });

  it("renders an iframe", () => {
    const { container } = render(<ComoLlegarSection />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
  });

  it("iframe src contains Cerritos coordinates", () => {
    const { container } = render(<ComoLlegarSection />);
    const iframe = container.querySelector("iframe");
    const src = iframe?.getAttribute("src") ?? "";
    expect(src).toContain("23.3956");
    expect(src).toContain("-110.2203");
  });

  it("iframe has a non-empty title attribute", () => {
    const { container } = render(<ComoLlegarSection />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("title");
    expect(iframe?.getAttribute("title")).not.toBe("");
  });

  it("iframe has allowFullScreen", () => {
    const { container } = render(<ComoLlegarSection />);
    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("allowFullScreen");
  });

  it("iframe is wrapped in a responsive aspect-ratio container", () => {
    const { container } = render(<ComoLlegarSection />);
    const iframe = container.querySelector("iframe");
    const wrapper = iframe?.parentElement;
    expect(wrapper?.className).toMatch(/aspect-video|aspect-\[/);
  });

  it("renders an h2 heading", () => {
    const { container } = render(<ComoLlegarSection />);
    expect(container.querySelector("h2")).toBeInTheDocument();
  });

  it("h2 text comes from translation key, not hardcoded", () => {
    // mock returns the key itself → if the component uses t("title"),
    // the rendered text will be "title". A hardcoded string would never equal "title".
    const { getByRole } = render(<ComoLlegarSection />);
    expect(getByRole("heading", { level: 2 })).toHaveTextContent("title");
  });
});
