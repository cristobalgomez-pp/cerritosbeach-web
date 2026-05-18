import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HotelContact } from "../HotelContact";

describe("HotelContact", () => {
  it("renders phone as a tel: link", () => {
    render(<HotelContact phone="+526241234567" website={null} />);
    const link = screen.getByRole("link", { name: /\+526241234567/ });
    expect(link).toHaveAttribute("href", "tel:+526241234567");
  });

  it("renders WhatsApp link when phone is present", () => {
    render(<HotelContact phone="+526241234567" website={null} />);
    const waLink = screen.getByRole("link", { name: /whatsapp/i });
    expect(waLink.getAttribute("href")).toContain("wa.me/");
    expect(waLink.getAttribute("href")).toContain("526241234567");
  });

  it("omits WhatsApp when phone is null", () => {
    render(<HotelContact phone={null} website="https://hotel.com" />);
    expect(screen.queryByRole("link", { name: /whatsapp/i })).not.toBeInTheDocument();
  });
});
