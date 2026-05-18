import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResetPasswordForm } from "../ResetPasswordForm";
import { updatePassword } from "@/features/auth/lib/actions";

const mockPush = vi.fn();

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/features/auth/lib/actions", () => ({
  updatePassword: vi.fn(),
}));

function submitForm(container: HTMLElement) {
  fireEvent.submit(container.querySelector("form")!);
}

describe("ResetPasswordForm", () => {
  beforeEach(() => vi.clearAllMocks());

  // Tracer bullet
  it("redirects to /cuenta after successful password update", async () => {
    vi.mocked(updatePassword).mockResolvedValue({ status: "success" });
    const { container } = render(<ResetPasswordForm />);

    submitForm(container);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/cuenta");
    });
  });

  // Slice 2
  it("does not render the static success screen after password update", async () => {
    vi.mocked(updatePassword).mockResolvedValue({ status: "success" });
    const { container } = render(<ResetPasswordForm />);

    submitForm(container);

    await waitFor(() => {
      expect(screen.queryByText("successTitle")).not.toBeInTheDocument();
    });
  });
});
