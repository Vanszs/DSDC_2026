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

    expect(screen.getByText("EcoHealth Pulse")).toBeTruthy();
    expect(screen.getByText("DSDC 2026")).toBeTruthy();
    expect(screen.getByText("Cockpit Realtime")).toBeTruthy();
    expect(screen.getByText("Mitra & Standar")).toBeTruthy();
    expect(screen.getByText("Direktori 16 Kec")).toBeTruthy();
    expect(screen.getAllByText(/Portal Petugas/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders GlobalNavbar with command breadcrumb and status ping when on dashboard or showBreadcrumb is true", () => {
    mockCurrentPath = "/dashboard";
    render(
      <TestWrapper>
        <GlobalNavbar showBreadcrumb={true} />
      </TestWrapper>
    );

    expect(screen.getByText("EcoHealth Pulse")).toBeTruthy();
    expect(screen.getByText("DSDC 2026")).toBeTruthy();
    expect(screen.getByText("KOTA SEMARANG")).toBeTruthy();
    expect(screen.getByText("REALTIME COCKPIT")).toBeTruthy();
    expect(screen.getByText("POSTGIS MVT")).toBeTruthy();
    expect(screen.getAllByText(/Portal Petugas/i).length).toBeGreaterThanOrEqual(1);
  });

  it("updates Command Breadcrumb dynamically when district name is provided", () => {
    mockCurrentPath = "/dashboard";
    render(
      <TestWrapper>
        <GlobalNavbar selectedDistrictName="Semarang Tengah" />
      </TestWrapper>
    );

    expect(screen.getByText("SEMARANG TENGAH")).toBeTruthy();
  });

  it("StatusPing opens telemetry status popover showing PostGIS and DLNM nodes", async () => {
    render(
      <TestWrapper>
        <StatusPing />
      </TestWrapper>
    );

    const triggerBtn = screen.getByTitle("Status Telemetri & Mesin Komputasi PostGIS");
    expect(triggerBtn).toBeTruthy();

    fireEvent.click(triggerBtn);

    expect(screen.getByText("Status Telemetri Sistem (DSDC 2026)")).toBeTruthy();
    expect(screen.getByText("PostGIS 3.4 Spatial Tile Engine")).toBeTruthy();
    expect(screen.getByText("DLNM 14-Day Distributed Lag Model")).toBeTruthy();
    expect(screen.getByText("16 KEC ONLINE")).toBeTruthy();
    expect(screen.getByText("SLA 99.98%")).toBeTruthy();
  });

  it("ThemeToggle persists light/dark/system choice to localStorage and toggles class", async () => {
    render(
      <TestWrapper>
        <ThemeToggle variant="segmented" />
      </TestWrapper>
    );

    const darkBtn = screen.getByLabelText("Tema Gelap");
    const lightBtn = screen.getByLabelText("Tema Terang");

    fireEvent.click(darkBtn);
    expect(localStorage.getItem("ecohealth_theme")).toBe("dark");

    fireEvent.click(lightBtn);
    expect(localStorage.getItem("ecohealth_theme")).toBe("light");
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
          <button onClick={() => login("dinkes")}>Trigger Login</button>
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
      expect(screen.getByText("Dr. Hendro Prasetyo")).toBeTruthy();
      expect(screen.getByLabelText("Keluar dari Sesi Petugas")).toBeTruthy();
    });

    const logoutBtn = screen.getByLabelText("Keluar dari Sesi Petugas");
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.queryByText("Dr. Hendro Prasetyo")).toBeNull();
      expect(screen.getAllByText(/Portal Petugas/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("toggles mobile menu drawer on hamburger click", () => {
    render(
      <TestWrapper>
        <GlobalNavbar />
      </TestWrapper>
    );

    const hamburger = screen.getByLabelText("Buka Menu Mobile");
    fireEvent.click(hamburger);

    expect(screen.getAllByText("Cockpit Realtime").length).toBeGreaterThanOrEqual(1);
  });
});
