import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHero } from "../PageHero";

describe("PageHero", () => {
  // Ciclo 1 — tracer bullet
  it("renders an img when imagePath is provided", () => {
    const { container } = render(<PageHero title="Surf en Cerritos" imagePath="banners/surf/hero.jpg" />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  // Ciclo 2
  it("renders a dark overlay when imagePath is provided", () => {
    const { container } = render(<PageHero title="Surf en Cerritos" imagePath="banners/surf/hero.jpg" />);
    expect(container.querySelector(".bg-black\\/40")).toBeInTheDocument();
  });

  // Ciclo 3
  it("does not render an img when imagePath is null", () => {
    const { container } = render(<PageHero title="Surf en Cerritos" imagePath={null} />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  // Ciclo 4
  it("does not render an img when imagePath is omitted", () => {
    const { container } = render(<PageHero title="Surf en Cerritos" />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  // Ciclo 5
  it("does not render eyebrow element when eyebrow is empty string", () => {
    const { container } = render(<PageHero title="Surf en Cerritos" eyebrow="" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  // Ciclo 6
  it("does not render subtitle element when subtitle is null", () => {
    const { container } = render(<PageHero title="Surf en Cerritos" subtitle={null} />);
    // solo debe haber un párrafo de texto si el eyebrow tampoco está
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });
});
