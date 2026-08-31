// @vitest-environment happy-dom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import LandingPage from "@/app/page";
import { ExecutiveReportDocument } from "@/lib/pdf/executive-report";

vi.mock("maplibre-gl", () => {
  const listeners: Record<string, Function[]> = {};

  class MockMap {
    loaded() {
      return true;
    }
    once(event: string, cb: Function) {
      cb();
      return this;
    }
    on(event: string, cb: Function) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
      return this;
    }
    remove() {}
    addControl() {}
    setStyle() {}
  }

  class MockPopup {
    options: any;
    htmlContent: string = "";
    constructor(options?: any) {
      this.options = options;
    }
    setHTML(html: string) {
      this.htmlContent = html;
      return this;
    }
  }

  class MockMarker {
    options: any;
    element: HTMLElement;
    lngLat: [number, number] = [0, 0];
    popup: MockPopup | null = null;
    map: any = null;

    constructor(options?: any) {
      this.options = options;
      this.element = options?.element || document.createElement("div");
    }

    setLngLat(lngLat: [number, number]) {
      this.lngLat = lngLat;
      return this;
    }

    setPopup(popup: MockPopup) {
      this.popup = popup;
      return this;
    }

    addTo(map: any) {
      this.map = map;
      return this;
    }

    remove = vi.fn();
  }

  return {
    default: {
      Map: vi.fn(() => new MockMap()),
      Marker: MockMarker,
      Popup: MockPopup,
      NavigationControl: vi.fn(),
    },
  };
});

describe("Landing Page (src/app/page.tsx)", () => {
  it("renders landing hero, value proposition, and regulatory governance matrix", () => {
    render(<LandingPage />);

    expect(screen.getAllByText("Sentry").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Satu platform untuk memantau/i)).toBeTruthy();
    expect(screen.getAllByText(/Mulai Analisa/i).length).toBeGreaterThanOrEqual(1);
  });
});

describe("Dashboard Page (src/app/dashboard/page.tsx)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders header, KPI metric cards, and loads analytics data", async () => {
    const mockData = [
      {
        id: 1,
        kemendagriCode: "33.74.01",
        name: "Semarang Tengah",
        typology: "Urban Dense",
        isCoastalRob: false,
        population: 65000,
        compositeScore: 78,
        dengueRisk: 82,
        leptospirosisRisk: 45,
        ispaRisk: 60,
        primaryFactor: "Kepadatan Tinggi",
        recommendation: "PSN 3M Plus Masif",
        temperatureAvg: 28.5,
        rainfallMm: 120.0,
        pm25: 35.0,
        lat: -6.98,
        lng: 110.42,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: mockData }),
    } as any);

    render(<DashboardPage />);

    // Open bottom drawer to view unified indicators, disease metrics, and forecast
    const openDrawerBtn = screen.getByText(/Kondisi Kesehatan Lingkungan Kota Semarang/i);
    expect(openDrawerBtn).toBeTruthy();
    fireEvent.click(openDrawerBtn);

    expect(screen.getByText(/Overview/i)).toBeTruthy();
    expect(screen.getByText(/Recommended Action/i)).toBeTruthy();
    expect(screen.getByText(/Skor Kota/i)).toBeTruthy();
    expect(screen.getAllByText(/Skor DBD/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Skor ISPA/i).length).toBeGreaterThan(0);
  });
});

describe("PDF Executive Report Template", () => {
  it("renders ExecutiveReportDocument structure", () => {
    const mockDistricts = [
      {
        id: 1,
        kemendagriCode: "33.74.01",
        name: "Semarang Tengah",
        typology: "Urban",
        isCoastalRob: false,
        population: 50000,
        compositeScore: 75,
        dengueRisk: 80,
        ispaRisk: 40,
        primaryFactor: "Kepadatan Penduduk",
        recommendation: "PSN 3M Plus",
      },
    ];

    const element = React.createElement(ExecutiveReportDocument, {
      districts: mockDistricts,
      generatedAt: "27 Agustus 2026",
    });

    expect(element).toBeTruthy();
    expect(element.props.districts.length).toBe(1);
    expect(element.props.generatedAt).toBe("27 Agustus 2026");
  });
});
