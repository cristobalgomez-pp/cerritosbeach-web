import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthIndicator } from "../AuthIndicator";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({
    href,
    children,
    className,
    role,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    role?: string;
  }) => (
    <a href={href} className={className} role={role}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/lib/actions", () => ({
  signOut: vi.fn(),
}));

const authenticatedProps = {
  user: { email: "surf@cerritosbeach.com" },
  profile: { display_name: "Surfer", username: "surfer", avatar_url: null },
  locale: "es" as const,
};

function openDropdown() {
  fireEvent.click(screen.getByRole("button"));
}

describe("AuthIndicator", () => {
  beforeEach(() => vi.clearAllMocks());

  // Slice 1 — tracer bullet
  it("shows myAccount link in dropdown when authenticated", () => {
    render(<AuthIndicator {...authenticatedProps} />);
    openDropdown();

    expect(screen.getByRole("menuitem", { name: "myAccount" })).toBeInTheDocument();
  });

  // Slice 2
  it("myAccount link points to /cuenta", () => {
    render(<AuthIndicator {...authenticatedProps} />);
    openDropdown();

    expect(screen.getByRole("menuitem", { name: "myAccount" })).toHaveAttribute("href", "/cuenta");
  });

  // Slice 4
  it("does not show myAccount link when user is not authenticated", () => {
    render(<AuthIndicator user={null} profile={null} locale="es" />);

    expect(screen.queryByRole("menuitem", { name: "myAccount" })).not.toBeInTheDocument();
  });

  // Slice 3
  it("myAccount appears before signOut in the dropdown", () => {
    render(<AuthIndicator {...authenticatedProps} />);
    openDropdown();

    const items = screen.getAllByRole("menuitem");
    const myAccountIndex = items.findIndex((el) => el.textContent === "myAccount");
    const signOutIndex = items.findIndex((el) => el.textContent === "signOut");

    expect(myAccountIndex).toBeLessThan(signOutIndex);
  });
});
