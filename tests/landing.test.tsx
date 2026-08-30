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

    expect(screen.getAllByText(/Sentry/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Satu platform untuk memantau/i)).toBeTruthy();
  });

  it("renders Hero CTA actions and navigation links", () => {
    render(<LandingPage />);

    expect(screen.getAllByText("Mulai Analisa").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Jelajahi Fitur").length).toBeGreaterThanOrEqual(1);
  });

  it("renders actionable call-to-action buttons navigating to /dashboard and /login", () => {
    render(<LandingPage />);

    const dashboardLinks = screen.getAllByRole("link", { name: /Mulai Analisa/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
    expect(dashboardLinks[0].getAttribute("href")).toBe("/login");
  });
});
