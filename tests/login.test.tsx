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

  it("renders authentication portal with ASN security directives and role presets", () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    expect(screen.getAllByText("EcoHealth Pulse").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Autentikasi Aman Sistem Epidemiologi")).toBeTruthy();
    expect(screen.getByText("Protokol Keamanan Tingkat ASN")).toBeTruthy();
    expect(screen.getAllByText("Dinkes Operator").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Epidemiologist").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Public Viewer").length).toBeGreaterThanOrEqual(1);
  });

  it("switches persona roles and updates identifier, department and permissions dynamically", () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    // Click Epidemiologist preset
    const epidemButtons = screen.getAllByText("Epidemiologist");
    fireEvent.click(epidemButtons[epidemButtons.length - 1]);

    expect(
      screen.getByText("Bappeda & Tim Pakar Epidemiologi DSDC 2026")
    ).toBeTruthy();
    expect(
      screen.getByText("Kalibrasi bobot non-linear suhu Briere & Aerosol PM2.5")
    ).toBeTruthy();

    // Click Public Viewer preset
    const publicButtons = screen.getAllByText("Public Viewer");
    fireEvent.click(publicButtons[publicButtons.length - 1]);

    expect(
      screen.getByText("Portal Transparansi Kesehatan Masyarakat")
    ).toBeTruthy();
    expect(
      screen.getByText("Eksplorasi peta interaktif 16 kecamatan")
    ).toBeTruthy();
  });

  it("switches between Credentials and Passkey/WebAuthn tabs", () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    const passkeyTab = screen.getByRole("button", { name: /Passkey/i });
    fireEvent.click(passkeyTab);

    expect(
      screen.getByText("Autentikasi Kunci Sandi Hardware (FIDO2)")
    ).toBeTruthy();
    expect(
      screen.getByText(/Sentuh Sensor Biometrik/i)
    ).toBeTruthy();

    const passwordTab = screen.getByRole("button", { name: /Kredensial ASN/i });
    fireEvent.click(passwordTab);

    expect(screen.getByLabelText(/NIP Kedinasan/i)).toBeTruthy();
    expect(screen.getByLabelText(/Kata Sandi Kedinasan/i)).toBeTruthy();
  });

  it("toggles password visibility with show/hide button", () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    const passwordInput = screen.getByLabelText(/Kata Sandi Kedinasan/i) as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleBtn = screen.getByLabelText("Tampilkan kata sandi");
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("text");

    const hideBtn = screen.getByLabelText("Sembunyikan kata sandi");
    fireEvent.click(hideBtn);
    expect(passwordInput.type).toBe("password");
  });

  it("completes authentication and advances to MFA step for ASN operators", async () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    const submitBtn = screen.getByRole("button", { name: /Lanjutkan Autentikasi/i });
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(screen.getByText("Verifikasi Dua Langkah (MFA)")).toBeTruthy();
        expect(screen.getByText(/Kode OTP 6-Digit Terkirim/i)).toBeTruthy();
      },
      { timeout: 3000 }
    );

    // Use Demo OTP button
    const demoOtpBtn = screen.getByRole("button", { name: /Gunakan Kode Demo/i });
    fireEvent.click(demoOtpBtn);

    await waitFor(
      () => {
        expect(screen.getByText("Otorisasi Berhasil Divalidasi")).toBeTruthy();
        expect(screen.getByText(/Masuk ke Cockpit Sekarang/i)).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it("bypasses MFA for Public Viewer role and completes authentication immediately", async () => {
    render(
      <TestLoginWrapper>
        <LoginPage />
      </TestLoginWrapper>
    );

    // Select Public Viewer
    const publicButtons = screen.getAllByText("Public Viewer");
    fireEvent.click(publicButtons[publicButtons.length - 1]);

    const submitBtn = screen.getByRole("button", { name: /Lanjutkan Autentikasi/i });
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(screen.getByText("Otorisasi Berhasil Divalidasi")).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });
});
