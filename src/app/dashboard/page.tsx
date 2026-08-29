"use client";

import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
  Activity,
  RefreshCw,
  Layers,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";
import { DistrictSummaryDTO } from "@/lib/queries";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const MapView = dynamic(
  () => import("@/components/map/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
          <Activity className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
          Memuat Peta Spasial 25km Grid Semarang...
        </div>
      </div>
    ),
  }
);

import { ExportButton } from "@/components/dashboard/export-button";
import { DashboardBottomDrawer } from "@/components/dashboard/dashboard-bottom-drawer";
import { LiveClockBadge } from "@/components/dashboard/live-clock-badge";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [districts, setDistricts] = useState<DistrictSummaryDTO[]>([]);
  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictSummaryDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = useCallback(async (dateStr: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?date=${dateStr}`);
      if (!res.ok) throw new Error("Gagal mengambil data analitik");
      const json = await res.json();
      const list: DistrictSummaryDTO[] = json.data ?? [];
      setDistricts(list);

      setSelectedDistrict((prev) => {
        if (!prev) return list[0] ?? null;
        const matching = list.find((d) => d.id === prev.id);
        return matching ?? list[0] ?? null;
      });
    } catch (err) {
      console.error("Fetch analytics error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(selectedDate);
  }, [selectedDate, fetchAnalytics]);

  // Aggregate metrics
  const totalDistricts = districts.length;
  const highRiskCount = districts.filter((d) => d.compositeScore >= 70).length;
  const avgCompositeScore = totalDistricts
    ? Math.round(
        districts.reduce((acc, d) => acc + d.compositeScore, 0) / totalDistricts
      )
    : 0;
  const highestRiskDistrict = districts[0] ?? null;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col bg-[#FAF8F5] text-slate-900 dark:bg-[#080C14] dark:text-slate-100 transition-colors duration-150">
      {/* 100% Fullscreen Map Layer (No Top Navbar & No Big HUD) */}
      <main id="main-content" role="main" className="relative flex-1 w-full h-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapView
            districts={districts}
            selectedDistrictId={selectedDistrict?.id}
            onSelectDistrict={(d: DistrictSummaryDTO) => setSelectedDistrict(d)}
          />
        </div>

        {/* Top-Left Live Ticking User Clock (Y/M/D HH:MM:SS) */}
        <div className="absolute top-4 left-4 z-20 pointer-events-auto">
          <LiveClockBadge />
        </div>

        {/* Top-Right Floating Controls (Minimal Pill Group) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-[#080C14]">
            <ThemeToggle variant="button" />
            <ExportButton />
            <button
              onClick={() => fetchAnalytics(selectedDate)}
              title="Perbarui Data Analitik"
              aria-label="Perbarui Data Analitik"
              className="rounded-lg border border-slate-200 dark:border-slate-800 p-2 text-slate-700 bg-slate-50 hover:bg-slate-100 active-press dark:text-slate-300 dark:bg-[#0B0F19] dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-slate-700 dark:text-slate-300 ${
                  loading ? "animate-spin text-emerald-600 dark:text-emerald-400" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div
            aria-live="polite"
            className="absolute inset-0 z-30 flex items-center justify-center bg-white dark:bg-[#080C14] pointer-events-none"
          >
            <div className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-mono font-semibold text-white shadow-xl border border-slate-700">
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
              Sinkronisasi Grid Spasial Semarang...
            </div>
          </div>
        )}
      </main>

      {/* Expandable Bottom Drawer (Bisa di-expand dari bawah ke atas) */}
      <DashboardBottomDrawer
        districts={districts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={(d: DistrictSummaryDTO) => setSelectedDistrict(d)}
        selectedDate={selectedDate}
        onDateChange={(newDate) => setSelectedDate(newDate)}
        avgCompositeScore={avgCompositeScore}
        highRiskCount={highRiskCount}
        highestRiskDistrict={highestRiskDistrict}
      />
    </div>
  );
}
