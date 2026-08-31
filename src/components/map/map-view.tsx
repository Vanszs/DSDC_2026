"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { DistrictSummaryDTO } from "@/lib/queries";
import { useTheme } from "@/components/theme/theme-provider";
import semarangBoundaryGeoJSON from "@/data/semarang-boundary.json";

export interface MapViewProps {
  districts: DistrictSummaryDTO[];
  selectedDistrictId?: number;
  onSelectDistrict?: (district: DistrictSummaryDTO) => void;
  onPolygonClick?: () => void;
}

interface DynamicRiskColorPalette {
  fillColor: string;
  fillOpacity: number;
  glowColor: string;
  glowOpacity: number;
  strokeColor: string;
}

const getDynamicRiskPalette = (score: number, isDark: boolean): DynamicRiskColorPalette => {
  // SKALA STABILITAS LINGKUNGAN: Semakin KECIL angka (0 - 39), semakin TINGGI BAHAYANYA (Merah)
  // Semakin BESAR angka (70 - 100), semakin STABIL & OPTIMAL (Hijau)
  if (score <= 39) {
    // Siaga Kritis / Bahaya Ekstrim (Merah Berpendar)
    return {
      fillColor: isDark ? "#ef4444" : "#dc2626",
      fillOpacity: isDark ? 0.24 : 0.18,
      glowColor: isDark ? "#f87171" : "#ef4444",
      glowOpacity: isDark ? 0.45 : 0.32,
      strokeColor: isDark ? "#fca5a5" : "#b91c1c",
    };
  }
  if (score <= 69) {
    // Siaga Waspada / Moderat (Amber / Oranye)
    return {
      fillColor: isDark ? "#f59e0b" : "#d97706",
      fillOpacity: isDark ? 0.20 : 0.15,
      glowColor: isDark ? "#fbbf24" : "#f59e0b",
      glowOpacity: isDark ? 0.40 : 0.28,
      strokeColor: isDark ? "#fcd34d" : "#b45309",
    };
  }
  // Optimal / Terkendali / Aman (Emerald Hijau)
  return {
    fillColor: isDark ? "#10b981" : "#059669",
    fillOpacity: isDark ? 0.18 : 0.14,
    glowColor: isDark ? "#34d399" : "#10b981",
    glowOpacity: isDark ? 0.35 : 0.28,
    strokeColor: isDark ? "#6ee7b7" : "#047857",
  };
};

// Buat StyleSpecification MapLibre GL dengan Batas GeoJSON Resmi Kota Semarang & Warna Dinamis
const createMapStyle = (isDark: boolean, compositeScore: number = 41): maplibregl.StyleSpecification => {
  const palette = getDynamicRiskPalette(compositeScore, isDark);
  const baseTiles = [
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  ];

  const sources: Record<string, any> = {
    "base-raster": {
      type: "raster",
      tiles: baseTiles,
      tileSize: 256,
      attribution: "&copy; Esri &copy; OpenStreetMap contributors",
    },
    "reference-labels": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "&copy; Esri",
    },
    "semarang-boundary-data": {
      type: "geojson",
      data: semarangBoundaryGeoJSON as unknown as GeoJSON.FeatureCollection,
    },
  };

  const layers: any[] = [
    {
      id: "base-raster-layer",
      type: "raster",
      source: "base-raster",
      minzoom: 0,
      maxzoom: 19,
      paint: isDark
        ? {
            "raster-brightness-max": 0.55,
            "raster-brightness-min": 0.05,
            "raster-contrast": 0.35,
            "raster-saturation": -0.80,
          }
        : {
            "raster-brightness-max": 1.0,
            "raster-saturation": 0.0,
          },
    },
    // 1. Shading Area Batas Administratif Kota Semarang (Dinamis Sesuai Skor Bahaya EHV)
    {
      id: "semarang-boundary-fill",
      type: "fill",
      source: "semarang-boundary-data",
      paint: {
        "fill-color": palette.fillColor,
        "fill-opacity": palette.fillOpacity,
      },
    },
    // 2. Glow Border Outer Batas Kota (Dinamis)
    {
      id: "semarang-boundary-glow",
      type: "line",
      source: "semarang-boundary-data",
      paint: {
        "line-color": palette.glowColor,
        "line-width": isDark ? 6 : 8,
        "line-opacity": palette.glowOpacity,
      },
    },
    // 3. Garis Border Solid Batas Kota Semarang (Dinamis)
    {
      id: "semarang-boundary-stroke",
      type: "line",
      source: "semarang-boundary-data",
      paint: {
        "line-color": palette.strokeColor,
        "line-width": 2.5,
        "line-opacity": 1.0,
      },
    },
  ];

  return {
    version: 8,
    sources,
    layers,
  };
};

// Semarang Center Koordinat Tetap (Frozen Cockpit)
const SEMARANG_CENTER: [number, number] = [110.4000, -7.0000];

// Hitung zoom level responsif berdasarkan lebar layar perangkat
const getResponsiveZoom = (): number => {
  if (typeof window === "undefined") return 11.0;
  const width = window.innerWidth;
  if (width < 480) return 9.8; // Mobile kecil: zoom lebih jauh agar batas Kota Semarang terlihat utuh
  if (width < 640) return 10.0; // Mobile reguler
  if (width < 768) return 10.3; // Tablet kecil
  if (width < 1024) return 10.6; // Tablet reguler / iPad
  if (width < 1280) return 10.9; // Laptop kecil
  return 11.1; // Desktop lebar
};

export const MapView: React.FC<MapViewProps> = ({ districts, onPolygonClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const onPolygonClickRef = useRef(onPolygonClick);
  onPolygonClickRef.current = onPolygonClick;

  // Ambil skor rata-rata komposit EHV kota
  const totalCount = districts.length || 1;
  const currentCityScore = districts.length
    ? Math.round(districts.reduce((acc, d) => acc + (d.compositeScore ?? 0), 0) / totalCount)
    : 0;

  // Inisialisasi MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const activeStyle = createMapStyle(isDark, currentCityScore);
      const initialZoom = getResponsiveZoom();

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: activeStyle,
        center: SEMARANG_CENTER,
        zoom: initialZoom,
        minZoom: 7.0,
        maxZoom: 18.0,
        dragPan: false,
        scrollZoom: false,
        boxZoom: false,
        dragRotate: false,
        keyboard: false,
        doubleClickZoom: false,
        touchZoomRotate: false,
        touchPitch: false,
        pitchWithRotate: false,
        interactive: true,
      });

      // Hanya trigger onPolygonClick jika titik klik berada di dalam poligon batas Kota Semarang
      map.on("click", (e) => {
        try {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["semarang-boundary-fill"],
          });
          if (features && features.length > 0) {
            onPolygonClickRef.current?.();
          }
        } catch {
          // Abaikan jika layer belum siap
        }
      });

      // Indikator visual kursor pointer saat melayang di atas poligon
      map.on("mousemove", (e) => {
        try {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["semarang-boundary-fill"],
          });
          map.getCanvas().style.cursor = features && features.length > 0 ? "pointer" : "default";
        } catch {
          // Abaikan
        }
      });

      mapInstanceRef.current = map;
    }

    // Handler penyesuaian zoom otomatis saat ukuran layar / orientasi berubah
    const handleResize = () => {
      const map = mapInstanceRef.current;
      if (!map) return;
      map.resize();
      const targetZoom = getResponsiveZoom();
      map.setZoom(targetZoom);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Update style secara presisi via paint properties atau saat tema berganti
  const prevThemeRef = React.useRef(isDark);
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Jika tema berubah, update style secara penuh
    if (prevThemeRef.current !== isDark) {
      prevThemeRef.current = isDark;
      const targetStyle = createMapStyle(isDark, currentCityScore);
      map.setStyle(targetStyle);
      return;
    }

    // Jika hanya skor yang berubah, update paint properties tanpa me-reload raster base map
    if (typeof map.isStyleLoaded === "function" ? map.isStyleLoaded() : true) {
      const palette = getDynamicRiskPalette(currentCityScore, isDark);
      try {
        if (typeof map.getLayer === "function" && map.getLayer("semarang-boundary-fill")) {
          map.setPaintProperty("semarang-boundary-fill", "fill-color", palette.fillColor);
        }
        if (typeof map.getLayer === "function" && map.getLayer("semarang-boundary-glow")) {
          map.setPaintProperty("semarang-boundary-glow", "line-color", palette.glowColor);
        }
        if (typeof map.getLayer === "function" && map.getLayer("semarang-boundary-stroke")) {
          map.setPaintProperty("semarang-boundary-stroke", "line-color", palette.strokeColor);
        }
      } catch {
        // Fallback jika layer belum siap
      }
    }
  }, [isDark, currentCityScore]);

  // Cleanup map instance
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[480px] bg-[#FAF8F5] dark:bg-[#080C14] select-none"
    />
  );
};
