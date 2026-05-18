import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthModal } from "../AuthModal";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("AuthModal", () => {
  const onClose = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it("renders links to /cuenta/registro and /cuenta/login when open", () => {
    render(<AuthModal isOpen={true} onClose={onClose} />);

    expect(
      screen.getByRole("link", { name: "createAccount" })
    ).toHaveAttribute("href", "/cuenta/registro");
    expect(screen.getByRole("link", { name: "signIn" })).toHaveAttribute(
      "href",
      "/cuenta/login"
    );
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<AuthModal isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when the backdrop is clicked", () => {
    render(<AuthModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog"));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose when clicking inside the modal content", () => {
    render(<AuthModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByRole("link", { name: "createAccount" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders nothing when isOpen is false", () => {
    render(<AuthModal isOpen={false} onClose={onClose} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
