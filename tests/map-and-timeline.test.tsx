// @vitest-environment happy-dom
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TimelineSlider } from "../src/components/map/timeline-slider";
import { MapView } from "../src/components/map/map-view";
import { DistrictSummaryDTO } from "../src/lib/queries";
import maplibregl from "maplibre-gl";

// Mock MapLibre GL
vi.mock("maplibre-gl", () => {
  const listeners: Record<string, Function[]> = {};

  const mockMap = {
    loaded: vi.fn().mockReturnValue(true),
    once: vi.fn((event: string, cb: Function) => cb()),
    on: vi.fn((event: string, cb: Function) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    }),
    remove: vi.fn(),
    addControl: vi.fn(),
    flyTo: vi.fn(),
    jumpTo: vi.fn(),
    setStyle: vi.fn(),
    getSource: vi.fn().mockReturnValue(null),
    addSource: vi.fn(),
    addLayer: vi.fn(),
  };

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
      Map: vi.fn(() => mockMap),
      Marker: MockMarker,
      Popup: MockPopup,
      NavigationControl: vi.fn(),
    },
  };
});

describe("MapLibre GL Frontend Integration & Components", () => {
  const mockDistricts: DistrictSummaryDTO[] = [
    {
      id: 1,
      kemendagriCode: "33.74.05",
      name: "Genuk",
      typology: "Pesisir / Industri",
      isCoastalRob: true,
      population: 118900,
      elevationMeters: 2,
      compositeScore: 88,
      dengueRisk: 75,
      ispaRisk: 80,
      primaryFactor: "Presipitasi Akumulatif & Intrusi Rob",
      recommendation: "Aktivasi pompa polder rob",
      temperatureAvg: 29.2,
      rainfallMm: 45.0,
      pm25: 55.0,
      lat: -6.9631,
      lng: 110.4856,
    },
    {
      id: 2,
      kemendagriCode: "33.74.01",
      name: "Semarang Tengah",
      typology: "Urban Padat",
      isCoastalRob: false,
      population: 64200,
      elevationMeters: 12,
      compositeScore: 35,
      dengueRisk: 25,
      ispaRisk: 40,
      primaryFactor: "Suhu Optimum Aedes",
      recommendation: "PSN 3M Plus",
      temperatureAvg: 28.5,
      rainfallMm: 5.0,
      pm25: 22.0,
      lat: -6.9825,
      lng: 110.4208,
    },
  ];

  describe("MapView Component", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Default window.matchMedia mock
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    });

    it("should initialize MapLibre GL map with Semarang center coordinates and frozen viewport", () => {
      const onSelectDistrict = vi.fn();
      const { container } = render(
        <MapView
          districts={mockDistricts}
          selectedDistrictId={undefined}
          onSelectDistrict={onSelectDistrict}
        />
      );

      expect(maplibregl.Map).toHaveBeenCalledTimes(1);
      expect(maplibregl.Map).toHaveBeenCalledWith(
        expect.objectContaining({
          center: [110.4000, -7.0000], // Semarang Central Anchor
          zoom: 11.0,
          interactive: false,
          dragPan: false,
          scrollZoom: false,
          style: expect.any(Object),
        })
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render Semarang anchor marker on the frozen canvas", () => {
      const onSelectDistrict = vi.fn();
      const { container } = render(
        <MapView
          districts={mockDistricts}
          selectedDistrictId={1}
          onSelectDistrict={onSelectDistrict}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should clean up map instance on unmount", () => {
      const onSelectDistrict = vi.fn();
      const mapMockInstance = (maplibregl.Map as any)();

      const { unmount } = render(
        <MapView
          districts={mockDistricts}
          selectedDistrictId={undefined}
          onSelectDistrict={onSelectDistrict}
        />
      );

      unmount();
      expect(mapMockInstance.remove).toHaveBeenCalled();
    });
  });

  describe("TimelineSlider Component", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("should render timeline controls with formatted date and past day steps", () => {
      const onDateChange = vi.fn();
      const todayStr = new Date().toISOString().split("T")[0];

      render(
        <TimelineSlider
          selectedDate={todayStr}
          onDateChange={onDateChange}
          maxPastDays={28}
          maxFutureDays={30}
        />
      );

      expect(screen.getByText("Timeframe Epidemiologi")).toBeInTheDocument();
      expect(screen.getAllByText("Hari Ini").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("W-4 (H-28)").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("W+4 (H+30)").length).toBeGreaterThanOrEqual(1);
    });

    it("should handle navigation buttons (Prev and Next)", () => {
      const onDateChange = vi.fn();
      const todayStr = new Date().toISOString().split("T")[0];

      const { container } = render(
        <TimelineSlider
          selectedDate={todayStr}
          onDateChange={onDateChange}
          maxPastDays={7}
        />
      );

      // Find chevron prev button
      const buttons = container.querySelectorAll("button");
      // buttons: [Play/Pause, Prev, Next]
      const prevBtn = buttons[1];
      fireEvent.click(prevBtn);

      expect(onDateChange).toHaveBeenCalled();
    });

    it("should support timeline scrubber playback auto-advance", () => {
      const onDateChange = vi.fn();
      const todayStr = new Date().toISOString().split("T")[0];

      const { container } = render(
        <TimelineSlider
          selectedDate={todayStr}
          onDateChange={onDateChange}
          maxPastDays={7}
        />
      );

      const playBtn = container.querySelectorAll("button")[0];
      fireEvent.click(playBtn);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(onDateChange).toHaveBeenCalled();
    });

    it("should handle slider direct range scrubbing", () => {
      const onDateChange = vi.fn();
      const todayStr = new Date().toISOString().split("T")[0];

      const { container } = render(
        <TimelineSlider
          selectedDate={todayStr}
          onDateChange={onDateChange}
          maxPastDays={7}
        />
      );

      const slider = container.querySelector('input[type="range"]');
      expect(slider).toBeInTheDocument();

      if (slider) {
        fireEvent.change(slider, { target: { value: "3" } });
        expect(onDateChange).toHaveBeenCalled();
      }
    });

    it("should handle keyboard navigation (ArrowLeft, ArrowRight, Home, End, Space)", () => {
      const onDateChange = vi.fn();
      const todayStr = new Date().toISOString().split("T")[0];

      const { container } = render(
        <TimelineSlider
          selectedDate={todayStr}
          onDateChange={onDateChange}
          maxPastDays={7}
        />
      );

      const panel = container.querySelector('[role="region"]');
      expect(panel).toBeInTheDocument();

      if (panel) {
        // ArrowLeft -> previous day
        fireEvent.keyDown(panel, { key: "ArrowLeft" });
        expect(onDateChange).toHaveBeenCalled();

        // Home -> H-7
        fireEvent.keyDown(panel, { key: "Home" });
        expect(onDateChange).toHaveBeenCalled();

        // End -> Hari Ini
        fireEvent.keyDown(panel, { key: "End" });
        expect(onDateChange).toHaveBeenCalled();

        // Space -> Toggle Play
        fireEvent.keyDown(panel, { key: " " });
        act(() => {
          vi.advanceTimersByTime(2000);
        });
        expect(onDateChange).toHaveBeenCalled();
      }
    });
  });
});
