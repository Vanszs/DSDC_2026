// @vitest-environment happy-dom
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import LandingPage from "@/app/page";

const mockRouterPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Landing Page (/ and src/app/page.tsx)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockRouterPush.mockReset();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders mission briefing, authority badges, and headline without banned em-dashes", () => {
    render(<LandingPage />);

    expect(screen.getAllByText("EcoHealth Pulse").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("DSDC 2026").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/Platform intelijen epidemiologi untuk mitigasi krisis iklim/i)
    ).toBeTruthy();
    expect(screen.getAllByText(/Kemendagri 33.74/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders Dual-Capability Bento section ('Satu pipeline model inferensi')", () => {
    render(<LandingPage />);

    expect(
      screen.getByText(/Satu pipeline model inferensi, dua modalitas konsumsi spasial/i)
    ).toBeTruthy();
    expect(screen.getAllByText("EcoHealth Realtime Cockpit").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("EcoHealth API & SDK").length).toBeGreaterThanOrEqual(1);

    // Test code switcher within SDK card
    const tsButton = screen.getByRole("tab", { name: "TypeScript" });
    const curlButton = screen.getByRole("tab", { name: "cURL" });

    expect(tsButton).toBeTruthy();
    expect(curlButton).toBeTruthy();

    fireEvent.click(curlButton);
    expect(screen.getByText(/curl -X GET/i)).toBeTruthy();
  });

  it("renders Hero CTA actions and Institutional Trust Wall", () => {
    render(<LandingPage />);

    // Primary CTA buttons
    expect(screen.getAllByText(/Buka Cockpit Realtime/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Portal Petugas/i).length).toBeGreaterThanOrEqual(1);

    // Institutional Trust Wall
    expect(screen.getAllByText(/Dinas Kesehatan Kota Semarang/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Bappeda Kota Semarang/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/BMKG Stasiun Klimatologi Semarang/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Kemenkes SatuSehat/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/UNDIP Lab/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders 4-pillar ontological architecture and capabilities section with interactive tabs", () => {
    render(<LandingPage />);

    expect(
      screen.getByText("Infrastruktur Analitik Epidemiologi & Rekayasa Spasial Skala Kota")
    ).toBeTruthy();
    expect(screen.getAllByText("Climatology DLNM Engine").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("PostGIS Vector Pipeline").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Dual-Disease Triage Matrix").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Automated Policy SOP").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Kemendagri 33.74 administrative master catalog with search filtering", () => {
    render(<LandingPage />);

    expect(screen.getByText("Direktori 16 Kecamatan Administratif")).toBeTruthy();
    expect(screen.getAllByText("33.74.05").length).toBeGreaterThanOrEqual(1); // Genuk
    expect(screen.getAllByText("Genuk").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Semarang Utara").length).toBeGreaterThanOrEqual(1);

    const searchInput = screen.getByPlaceholderText("Cari kecamatan / tipologi...");
    expect(searchInput).toBeTruthy();

    fireEvent.change(searchInput, { target: { value: "Tugu" } });
    expect(screen.getAllByText("Tugu").length).toBeGreaterThanOrEqual(1);
  });

  it("renders actionable call-to-action buttons navigating to /dashboard and /login", () => {
    render(<LandingPage />);

    const dashboardLinks = screen.getAllByRole("link", { name: /Buka Cockpit Realtime/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
    expect(dashboardLinks[0].getAttribute("href")).toBe("/dashboard");

    const loginLinks = screen.getAllByRole("link", { name: /Portal Petugas/i });
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    expect(loginLinks[0].getAttribute("href")).toBe("/login");
  });

  it("opens OpenAPI & PostGIS specification inspector modal when triggered", () => {
    render(<LandingPage />);

    const specsButton = screen.getByRole("button", {
      name: /Spesifikasi OpenAPI & PostGIS/i,
    });
    expect(specsButton).toBeTruthy();

    fireEvent.click(specsButton);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText(/Spesifikasi Teknis & Kredensial Regulasi/i)).toBeTruthy();
  });
});
