// @vitest-environment happy-dom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { AuthProvider } from "@/components/auth/auth-context";
import { ThemeProvider } from "@/components/theme/theme-provider";

const mockRouterPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/login",
  useSearchParams: () => new URLSearchParams(),
}));

function TestLoginWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}

describe("Login Page (/login and src/app/login/page.tsx)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockRouterPush.mockReset();
    localStorage.clear();
  });

  it("renders authentication portal with ASN security directives and official credential fields", () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    expect(screen.getAllByText("Masuk").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText(/Email atau NIP/i)).toBeTruthy();
  });

  it("handles login submission with authorized account", async () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    const submitBtns = screen.getAllByRole("button", { name: "Masuk" });
    const submitBtn = submitBtns[submitBtns.length - 1];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Berhasil Masuk")).toBeTruthy();
    });
  });

  it("rejects unauthorized register attempts with notification", async () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    const registerTab = screen.getByRole("button", { name: "Daftar Akun" });
    fireEvent.click(registerTab);

    // Fill required register inputs
    const fullNameInput = screen.getByPlaceholderText("Nama Lengkap");
    fireEvent.change(fullNameInput, { target: { value: "Budi Santoso" } });

    const agencyInput = screen.getByPlaceholderText("Instansi / Unit Kerja");
    fireEvent.change(agencyInput, { target: { value: "Dinkes" } });

    const confirmPassInput = screen.getByPlaceholderText("Konfirmasi kata sandi");
    fireEvent.change(confirmPassInput, { target: { value: "SandiKedinasan@2026" } });

    const submitBtns = screen.getAllByRole("button", { name: "Daftar" });
    const submitBtn = submitBtns[submitBtns.length - 1];
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Pendaftaran ditolak/i)).toBeTruthy();
    }, { timeout: 4000 });
  });
});
