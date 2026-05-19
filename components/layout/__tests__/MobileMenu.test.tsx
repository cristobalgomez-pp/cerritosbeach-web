import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileMenu } from "../MobileMenu";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({
    href,
    children,
    onClick,
    className,
    style,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <a href={href} onClick={onClick} className={className} style={style}>
      {children}
    </a>
  ),
}));

vi.mock("../LocaleSwitch", () => ({
  LocaleSwitch: () => <div data-testid="locale-switch" />,
}));

vi.mock("@/features/auth/lib/actions", () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
}));

const LINKS = [
  { href: "/hoteles", label: "Hoteles" },
  { href: "/surf", label: "Surf" },
  { href: "/comida", label: "Comida" },
] as const;

const BASE_PROPS = {
  links: LINKS,
  user: null,
  profile: null,
  locale: "es" as const,
};

afterEach(() => {
  document.body.style.overflow = "";
});

describe("MobileMenu", () => {
  // Ciclo 1 — tracer bullet
  it("renders the hamburger button", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    expect(screen.getByRole("button", { name: /abrir menú/i })).toBeInTheDocument();
  });

  // Ciclo 2 — panel off-screen initially
  it("panel is off-screen initially", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    expect(document.querySelector(".translate-x-full")).toBeInTheDocument();
  });

  // Ciclo 3 — hamburger opens panel
  it("clicking hamburger brings the panel on-screen", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /abrir menú/i }));
    expect(document.querySelector(".translate-x-0")).toBeInTheDocument();
  });

  // Ciclo 4 — nav links hidden when closed
  it("does not render nav links when the panel is closed", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    expect(screen.queryByText("Hoteles")).not.toBeInTheDocument();
  });

  // Ciclo 5 — nav links + editorial numbers visible when open
  it("shows nav links with editorial numbers when open", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /abrir menú/i }));
    expect(screen.getByText("Hoteles")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Surf")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("Comida")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  // Ciclo 6 — backdrop click closes panel
  it("clicking the backdrop closes the panel", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /abrir menú/i }));
    fireEvent.click(screen.getByTestId("menu-backdrop"));
    expect(document.querySelector(".translate-x-full")).toBeInTheDocument();
  });

  // Ciclo 7 — X button closes panel
  it("clicking the X button closes the panel", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /abrir menú/i }));
    fireEvent.click(screen.getByRole("button", { name: /cerrar menú/i }));
    expect(document.querySelector(".translate-x-full")).toBeInTheDocument();
  });

  // Ciclo 8 — body scroll lock
  it("locks body scroll when open and restores it when closed", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    fireEvent.click(screen.getByRole("button", { name: /abrir menú/i }));
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: /cerrar menú/i }));
    expect(document.body.style.overflow).toBe("");
  });

  // Ciclo 9 — LocaleSwitch always in footer
  it("always renders LocaleSwitch in the panel footer", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    expect(screen.getByTestId("locale-switch")).toBeInTheDocument();
  });

  // Ciclo 10 — sign-in link when no user
  it("shows a sign-in link when no user is logged in", () => {
    render(<MobileMenu {...BASE_PROPS} />);
    expect(screen.getByRole("link", { name: /signIn/i })).toBeInTheDocument();
  });

  // Ciclo 11 — user name + sign-out when logged in
  it("shows display name and sign-out button when a user is logged in", () => {
    render(
      <MobileMenu
        {...BASE_PROPS}
        user={{ email: "surf@cerritos.mx" }}
        profile={{ display_name: "Cristóbal", username: "cris", avatar_url: null }}
      />
    );
    expect(screen.getByText("Cristóbal")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signOut/i })).toBeInTheDocument();
  });
});
