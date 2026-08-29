"use client";

import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  Activity,
  X,
  Bug,
  Droplet,
  Wind,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DistrictSummaryDTO } from "@/lib/queries";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TimelineSlider } from "@/components/map/timeline-slider";

export type DrawerState = "collapsed" | "half" | "full";

interface DashboardBottomDrawerProps {
  districts: DistrictSummaryDTO[];
  selectedDistrict: DistrictSummaryDTO | null;
  onSelectDistrict?: (d: DistrictSummaryDTO) => void;
  selectedDate: string;
  onDateChange: (d: string) => void;
  avgCompositeScore: number;
  highRiskCount: number;
  highestRiskDistrict: DistrictSummaryDTO | null;
  className?: string;
}

export function DashboardBottomDrawer({
  districts,
  selectedDistrict,
  selectedDate,
  onDateChange,
  avgCompositeScore,
  highRiskCount,
  highestRiskDistrict,
  className,
}: DashboardBottomDrawerProps) {
  const [drawerState, setDrawerState] = useState<DrawerState>("collapsed");
  const [activeTab, setActiveTab] = useState<"detail" | "kpi">("detail");

  // True city-wide telemetry average calculation
  const totalCount = districts.length || 1;
  const computedAvgTemp = Number((districts.reduce((acc, d) => acc + (d.temperatureAvg || 0), 0) / totalCount).toFixed(1)) || 28.3;
  const computedAvgRain = Number((districts.reduce((acc, d) => acc + (d.rainfallMm || 0), 0) / totalCount).toFixed(1)) || 0.0;
  const computedAvgPm25 = Number((districts.reduce((acc, d) => acc + (d.pm25 || 0), 0) / totalCount).toFixed(1)) || 34.5;
  const computedAvgDengue = Math.round(districts.reduce((acc, d) => acc + (d.dengueRisk || 0), 0) / totalCount) || 45;
  const computedAvgIspa = Math.round(districts.reduce((acc, d) => acc + (d.ispaRisk || 0), 0) / totalCount) || 40;

  const cityData: DistrictSummaryDTO = {
    id: 0,
    kemendagriCode: "33.74",
    name: "Kota Semarang",
    typology: "Pesisir & Perbukitan",
    isCoastalRob: true,
    population: 1690000,
    elevationMeters: 65,
    compositeScore: avgCompositeScore || Math.round(computedAvgDengue * 0.60 + computedAvgIspa * 0.40),
    dengueRisk: computedAvgDengue,
    ispaRisk: computedAvgIspa,
    primaryFactor: highestRiskDistrict?.primaryFactor ?? "Kapasitas Termal Vektor Aedes & Kelembapan",
    recommendation: highestRiskDistrict?.recommendation ?? "Pemberantasan Sarang Nyamuk (PSN 3M Plus) terpadu di seluruh wilayah kota.",
    temperatureAvg: computedAvgTemp,
    rainfallMm: computedAvgRain,
    pm25: computedAvgPm25,
    lat: -7.0000,
    lng: 110.4000,
  };

  const toggleDrawer = () => {
    if (drawerState === "collapsed") {
      setDrawerState("half");
    } else if (drawerState === "half") {
      setDrawerState("collapsed");
    } else {
      setDrawerState("half");
    }
  };

  const setFull = () => setDrawerState("full");
  const setHalf = () => setDrawerState("half");
  const setCollapsed = () => setDrawerState("collapsed");

  const diseases = [
    {
      id: "dengue",
      name: "Demam Berdarah Dengue (DBD)",
      score: cityData.dengueRisk,
      icon: Bug,
      model: "Suhu Optimum Nyamuk & Siklus Hujan 14 Hari",
      riskText: cityData.dengueRisk >= 70 ? "Kritis" : cityData.dengueRisk >= 40 ? "Waspada" : "Rendah",
      barBg: cityData.dengueRisk >= 70 ? "bg-red-500" : cityData.dengueRisk >= 40 ? "bg-amber-500" : "bg-emerald-500",
      textClass: cityData.dengueRisk >= 70 ? "text-red-600 dark:text-red-400" : cityData.dengueRisk >= 40 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "ispa",
      name: "Infeksi Saluran Pernapasan Akut (ISPA)",
      score: cityData.ispaRisk,
      icon: Wind,
      model: "Polusi Partikel Debu PM2.5 & Angin Tenang",
      riskText: cityData.ispaRisk >= 70 ? "Kritis" : cityData.ispaRisk >= 40 ? "Waspada" : "Rendah",
      barBg: cityData.ispaRisk >= 70 ? "bg-red-500" : cityData.ispaRisk >= 40 ? "bg-amber-500" : "bg-emerald-500",
      textClass: cityData.ispaRisk >= 70 ? "text-red-600 dark:text-red-400" : cityData.ispaRisk >= 40 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <aside
      aria-label="Panel Analisis Epidemiologi Kota Semarang"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex flex-col bg-white border-t border-slate-200 dark:border-slate-800 dark:bg-[#080C14] shadow-2xl transition-all duration-300 ease-out font-sans",
        drawerState === "collapsed" && "h-11",
        drawerState === "half" && "h-[60vh] sm:h-[65vh]",
        drawerState === "full" && "h-[94vh]",
        className
      )}
    >
      {/* Command Center Streamlined Header */}
      <div
        onClick={toggleDrawer}
        className="flex items-center justify-between px-4 sm:px-6 cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B0F19] transition-colors h-11"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-slate-400">
            {drawerState === "collapsed" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Cockpit Analisis Epidemiologi Kota Semarang
            </span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-slate-400 text-[11px]">Skor Risiko:</span>
              <span className={cn(
                "font-bold px-2 py-0.5 rounded-md text-[11px]",
                cityData.compositeScore >= 70 ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" :
                cityData.compositeScore >= 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
              )}>
                {cityData.compositeScore} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Quick Controls */}
        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {drawerState !== "collapsed" && (
            <>
              {/* Tab Switcher */}
              <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("detail")}
                  className={cn(
                    "px-3 py-1 rounded-md transition-colors text-[11px]",
                    activeTab === "detail"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-[#080C14] dark:text-slate-100 font-semibold"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  )}
                >
                  Analisis & Prediksi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("kpi")}
                  className={cn(
                    "px-3 py-1 rounded-md transition-colors text-[11px]",
                    activeTab === "kpi"
                      ? "bg-white text-slate-900 shadow-xs dark:bg-[#080C14] dark:text-slate-100 font-semibold"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  )}
                >
                  Indikator Kota
                </button>
              </div>

              {/* Maximize / Minimize Toggle */}
              {drawerState === "half" ? (
                <button
                  type="button"
                  onClick={setFull}
                  title="Maksimalkan Panel"
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={setHalf}
                  title="Tampilan Separuh"
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={setCollapsed}
                title="Tutup Panel"
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {drawerState === "collapsed" && (
            <button
              type="button"
              onClick={setHalf}
              aria-label="Buka Analisis"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Buka Analisis &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Expandable Drawer Content Area */}
      {drawerState !== "collapsed" && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 cockpit-scrollbar">
          {/* TAB 1: UNIFIED INTEGRATED COMMAND COCKPIT */}
          {activeTab === "detail" && (
            <div className="max-w-7xl mx-auto space-y-4">
              {/* TOP: Slim Integrated Timeline Scrubber */}
              <TimelineSlider
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                maxPastDays={28}
                maxFutureDays={30}
              />

              {/* MAIN: Balanced 3-Column Editorial Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                {/* KOLOM 1: Telemetri Iklim & Identitas Teritorial */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/75 p-5.5 sm:p-6 dark:border-slate-800 dark:bg-[#0B0F19] gap-5 shadow-xs">
                  <div className="space-y-4">
                    {/* Header Identitas Wilayah & Status */}
                    <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            {cityData.name}
                          </h2>
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-slate-200 dark:bg-[#141A28] border border-slate-300/60 dark:border-slate-700/60 rounded-md text-slate-800 dark:text-slate-200">
                            {cityData.kemendagriCode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {cityData.typology} &bull; 1 Kesatuan Teritorial
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                          Status Siaga
                        </span>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wide border",
                          cityData.compositeScore >= 70
                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/60"
                            : cityData.compositeScore >= 40
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/60"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/60"
                        )}>
                          {cityData.compositeScore >= 70 ? "Kritis" : cityData.compositeScore >= 40 ? "Waspada" : "Aman"}
                        </span>
                      </div>
                    </div>

                    {/* 3 Telemetri Sensor Mikroklimat */}
                    <div>
                      <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 font-semibold">
                        Kondisi Mikroklimat Terkini
                      </span>
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-[#080C14] border border-slate-200/90 dark:border-slate-800 text-center flex flex-col justify-center min-h-[72px] shadow-2xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Suhu Udara</span>
                          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                            {cityData.temperatureAvg}°C
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-[#080C14] border border-slate-200/90 dark:border-slate-800 text-center flex flex-col justify-center min-h-[72px] shadow-2xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Presipitasi</span>
                          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                            {cityData.rainfallMm} <span className="text-xs font-normal text-slate-500">mm</span>
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-white dark:bg-[#080C14] border border-slate-200/90 dark:border-slate-800 text-center flex flex-col justify-center min-h-[72px] shadow-2xs">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">PM2.5</span>
                          <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                            {cityData.pm25} <span className="text-[10px] font-normal text-slate-500">µg/m³</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basis Model Info Box */}
                  <div className="rounded-xl bg-white dark:bg-[#080C14] border border-slate-200/90 dark:border-slate-800 p-3.5 text-xs shadow-2xs mt-auto">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-mono tracking-wider font-semibold block">
                      Basis Model Reanalisis:
                    </span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 mt-1.5 leading-snug">
                      ECMWF ERA5 / IFS Reanalisis Iklim 30 Tahun (1994–2025)
                    </p>
                  </div>
                </div>

                {/* KOLOM 2: Beban 2 Penyakit Terlatih (DBD & ISPA) */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/75 p-5.5 sm:p-6 dark:border-slate-800 dark:bg-[#0B0F19] gap-5 shadow-xs">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
                      <div>
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Vektor Risiko Epidemiologi
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Estimasi Transmisi Berbasis Iklim
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-[#141A28] text-slate-600 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700/50">
                        L2 Ridge
                      </span>
                    </div>

                    <div className="space-y-3">
                      {diseases.map((d) => {
                        const Icon = d.icon;
                        return (
                          <div
                            key={d.id}
                            className="rounded-xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-[#080C14] space-y-3 shadow-2xs"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shrink-0">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                    {d.name}
                                  </h4>
                                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
                                    {d.model}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 font-mono shrink-0 pt-0.5">
                                <span className={cn(
                                  "text-[10.5px] font-bold px-1.5 py-0.5 rounded",
                                  d.score >= 70 ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" :
                                  d.score >= 40 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
                                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                )}>
                                  {d.riskText}
                                </span>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                  {d.score}%
                                </span>
                              </div>
                            </div>

                            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all duration-300", d.barBg)}
                                style={{ width: `${Math.min(100, Math.max(0, d.score))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-3 border-t border-slate-200/80 dark:border-slate-800 mt-auto">
                    <span>Formula Risiko Gabungan:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">0.60×DBD + 0.40×ISPA</span>
                  </div>
                </div>

                {/* KOLOM 3: Direktif Intervensi & Playbook Aksi Nyata */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/75 p-5.5 sm:p-6 dark:border-slate-800 dark:bg-[#0B0F19] gap-5 shadow-xs">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
                      <div>
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Playbook Aksi Kebijakan
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Rekomendasi Intervensi Terukur
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 font-bold">
                        PREVENTIF
                      </span>
                    </div>

                    {/* Primary Trigger Driver */}
                    <div className="rounded-xl bg-white dark:bg-[#080C14] border border-slate-200/90 dark:border-slate-800 p-4 text-xs shadow-2xs space-y-1.5">
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-mono tracking-wider font-semibold block">
                        Faktor Pemicu Dominan:
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {cityData.primaryFactor}
                      </p>
                    </div>

                    {/* Public Health Action Directive */}
                    <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/70 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/20 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Rekomendasi Tindakan Dinkes:</span>
                      </div>
                      <p className="text-xs text-emerald-950 dark:text-emerald-200/90 pl-6 leading-relaxed">
                        {cityData.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 text-right pt-3 border-t border-slate-200/80 dark:border-slate-800 mt-auto">
                    Cakupan Wilayah: <strong className="text-slate-800 dark:text-slate-200 font-semibold">1 Kesatuan Kota Semarang</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INDIKATOR & KPI KOTA */}
          {activeTab === "kpi" && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricCard
                  title="Skor Bahaya Kesehatan Kota"
                  value={`${cityData.compositeScore}`}
                  unit="/ 100"
                  description="Indikator gabungan risiko cuaca terhadap DBD & ISPA Kota Semarang"
                  variant={cityData.compositeScore >= 70 ? "danger" : cityData.compositeScore >= 40 ? "warning" : "success"}
                  icon={Activity}
                  badge="STATUS KOTA"
                  statusIndicator="live"
                  sparklineData={[42, 45, 48, 50, 47, 42, cityData.compositeScore]}
                  benchmark={{ label: "Ambang Waspada", value: "Skor ≥ 40" }}
                />
                <MetricCard
                  title="Cakupan Wilayah"
                  value="373.7"
                  unit="km²"
                  description="1 Kesatuan Teritorial Administratif Kota Semarang"
                  variant="success"
                  icon={Activity}
                  badge="KEMENDAGRI 33.74"
                  statusIndicator="nominal"
                  sparklineData={[373, 373, 373, 373, 373, 373, 373]}
                  benchmark={{ label: "Populasi", value: "1.69 Juta Jiwa" }}
                />
                <MetricCard
                  title="Model Iklim Aktif"
                  value="ERA5 / IFS"
                  description="Reanalisis 30 Tahun & Proyeksi Multi-Horizon Open-Meteo"
                  variant="success"
                  icon={Activity}
                  badge="ECMWF C3S"
                  statusIndicator="live"
                  sparklineData={[28, 28, 28, 28, 28, 28, 28]}
                  benchmark={{ label: "Resolusi Sel", value: "0.25° (~28 km)" }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
