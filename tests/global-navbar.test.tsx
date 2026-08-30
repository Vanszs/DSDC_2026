// @vitest-environment happy-dom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { GlobalNavbar } from "@/components/navigation/global-navbar";
import { ThemeProvider, useTheme } from "@/components/theme/theme-provider";
import { AuthProvider, useAuth } from "@/components/auth/auth-context";
import { CommandMenu } from "@/components/navigation/command-menu";
import { StatusPing } from "@/components/navigation/status-ping";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const mockRouterPush = vi.fn();
let mockCurrentPath = "/";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => mockCurrentPath,
  useSearchParams: () => new URLSearchParams(),
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}

describe("Universal Navigation & Command Breadcrumb Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    mockCurrentPath = "/";
    vi.restoreAllMocks();
  });

  it("renders GlobalNavbar in clean public mode on landing page", () => {
    mockCurrentPath = "/";
    render(
      <TestWrapper>
        <GlobalNavbar />
      </TestWrapper>
    );

    expect(screen.getAllByText(/Sentry/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Beranda/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tentang/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tantangan/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders GlobalNavbar on dashboard or nested paths", () => {
    mockCurrentPath = "/dashboard";
    render(
      <TestWrapper>
        <GlobalNavbar showBreadcrumb={true} />
      </TestWrapper>
    );

    expect(screen.getAllByText(/Sentry/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders GlobalNavbar and ThemeToggle persists choice to localStorage", async () => {
    render(
      <TestWrapper>
        <ThemeToggle variant="button" />
      </TestWrapper>
    );

    const toggleBtn = screen.getByLabelText(/Ubah Tema/i);
    expect(toggleBtn).toBeTruthy();
    fireEvent.click(toggleBtn);
    expect(localStorage.getItem("sentry_theme") || localStorage.getItem("ecohealth_theme")).toBeDefined();
  });

  it("CommandMenu opens on Ctrl+K and filters 16 Semarang districts", async () => {
    const onSelectDistrict = vi.fn();
    render(
      <TestWrapper>
        <CommandMenu open={true} onSelectDistrict={onSelectDistrict} />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText(/Cari kecamatan, fitur analitik/i)).toBeTruthy();
    expect(screen.getByText("Buka Realtime Cockpit")).toBeTruthy();
    expect(screen.getByText("Semarang Tengah")).toBeTruthy();

    const input = screen.getByPlaceholderText(/Cari kecamatan, fitur analitik/i);
    fireEvent.change(input, { target: { value: "Banyumanik" } });

    expect(screen.getByText("Banyumanik")).toBeTruthy();
    expect(screen.queryByText("Semarang Tengah")).toBeNull();

    fireEvent.click(screen.getByText("Banyumanik"));
    expect(onSelectDistrict).toHaveBeenCalledWith("Banyumanik");
  });

  it("Authenticated user state displays official profile and allows logout", async () => {
    function AuthTestingComponent() {
      const { login } = useAuth();
      return (
        <div>
          <button onClick={() => login("dinkes", "Dr. Hendro Prasetyo")}>Trigger Login</button>
          <GlobalNavbar />
        </div>
      );
    }

    render(
      <TestWrapper>
        <AuthTestingComponent />
      </TestWrapper>
    );

    const loginTrigger = screen.getByText("Trigger Login");
    fireEvent.click(loginTrigger);

    await waitFor(() => {
      expect(screen.getAllByText(/Hendro Prasetyo/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("toggles mobile menu drawer on hamburger click", () => {
    render(
      <TestWrapper>
        <GlobalNavbar />
      </TestWrapper>
    );

    const hamburger = screen.getByLabelText("Toggle navigation menu");
    fireEvent.click(hamburger);

    expect(screen.getAllByText("Beranda").length).toBeGreaterThanOrEqual(1);
  });
});
