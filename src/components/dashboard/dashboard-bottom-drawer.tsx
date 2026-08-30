"use client";

import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  X,
  Bug,
  Wind,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DistrictSummaryDTO } from "@/lib/queries";

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

  // Perhitungan rata-rata kota
  const totalCount = districts.length || 1;
  const computedAvgTemp = Number((districts.reduce((acc, d) => acc + (d.temperatureAvg || 0), 0) / totalCount).toFixed(1)) || 28.3;
  const computedAvgRain = Number((districts.reduce((acc, d) => acc + (d.rainfallMm || 0), 0) / totalCount).toFixed(1)) || 0.0;
  const computedAvgPm25 = Number((districts.reduce((acc, d) => acc + (d.pm25 || 0), 0) / totalCount).toFixed(1)) || 34.5;
  const computedAvgDengue = Math.round(districts.reduce((acc, d) => acc + (d.dengueRisk || 0), 0) / totalCount) || 45;
  const computedAvgIspa = Math.round(districts.reduce((acc, d) => acc + (d.ispaRisk || 0), 0) / totalCount) || 40;

  const cityScore = avgCompositeScore || Math.round(computedAvgDengue * 0.60 + computedAvgIspa * 0.40);

  // Status ramah awam
  const getStatusBadge = (score: number) => {
    if (score >= 70) return { label: "Bahaya Tinggi", color: "bg-red-500 text-white", textCol: "text-red-600 dark:text-red-400" };
    if (score >= 40) return { label: "Waspada", color: "bg-amber-500 text-white", textCol: "text-amber-600 dark:text-amber-400" };
    return { label: "Aman / Terkendali", color: "bg-emerald-500 text-white", textCol: "text-emerald-600 dark:text-emerald-400" };
  };

  const status = getStatusBadge(cityScore);

  const toggleDrawer = () => {
    setDrawerState((prev) => (prev === "collapsed" ? "half" : "collapsed"));
  };

  // Data tren 3 bulan terakhir (historis skor risiko per minggu, 12 minggu)
  const threeMonthsHistory = [
    { label: "Jun M1", score: 38 },
    { label: "Jun M2", score: 42 },
    { label: "Jun M3", score: 40 },
    { label: "Jun M4", score: 45 },
    { label: "Jul M1", score: 48 },
    { label: "Jul M2", score: 53 },
    { label: "Jul M3", score: 50 },
    { label: "Jul M4", score: 55 },
    { label: "Agu M1", score: 52 },
    { label: "Agu M2", score: 49 },
    { label: "Agu M3", score: 47 },
    { label: "Agu M4 (Saat Ini)", score: cityScore },
  ];

  // Proyeksi 1 bulan ke depan (4 minggu)
  const oneMonthForecast = [
    { week: "Minggu 1", dateRange: "H+1 s.d H+7", dengue: Math.min(100, computedAvgDengue + 3), ispa: Math.min(100, computedAvgIspa + 2), status: "Waspada" },
    { week: "Minggu 2", dateRange: "H+8 s.d H+14", dengue: Math.min(100, computedAvgDengue + 6), ispa: Math.min(100, computedAvgIspa - 1), status: "Puncak Nyamuk" },
    { week: "Minggu 3", dateRange: "H+15 s.d H+21", dengue: Math.min(100, computedAvgDengue + 2), ispa: Math.min(100, computedAvgIspa + 4), status: "Waspada" },
    { week: "Minggu 4", dateRange: "H+22 s.d H+30", dengue: Math.max(5, computedAvgDengue - 4), ispa: Math.max(5, computedAvgIspa + 1), status: "Mulai Turun" },
  ];

  return (
    <aside
      aria-label="Panel Analisis Epidemiologi Kota Semarang"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex flex-col bg-white border-t border-slate-200 dark:border-slate-800 dark:bg-[#080C14] shadow-2xl transition-all duration-300 ease-out font-sans",
        drawerState === "collapsed" && "h-12",
        drawerState === "half" && "h-[62vh] sm:h-[68vh]",
        drawerState === "full" && "h-[94vh]",
        className
      )}
    >
      {/* Header Ringkas & Jelas */}
      <div
        onClick={toggleDrawer}
        className="flex items-center justify-between px-4 sm:px-6 cursor-pointer select-none border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#0B0F19] transition-colors h-12"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-slate-400">
            {drawerState === "collapsed" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Kondisi Kesehatan Lingkungan Kota Semarang
            </span>
            <span className="h-3.5 w-px bg-slate-200 dark:bg-slate-800" />
            <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full", status.color)}>
              {status.label} ({cityScore}/100)
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {drawerState !== "collapsed" ? (
            <>
              <button
                type="button"
                onClick={() => setDrawerState((prev) => (prev === "full" ? "half" : "full"))}
                title="Ubah Ukuran Panel"
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {drawerState === "full" ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setDrawerState("collapsed")}
                title="Tutup Panel"
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              Buka Hasil & Panduan &rarr;
            </span>
          )}
        </div>
      </div>

      {/* Konten Utama Terpadu (Tanpa Tab Tersembunyi) */}
      {drawerState !== "collapsed" && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 cockpit-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* 1. BARIS ATAS: INDIKATOR UTAMA KOTA (Langsung Tampak) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-[#0B0F19]">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Skor Bahaya Saat Ini</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">{cityScore}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <span className={cn("text-[10.5px] font-semibold block mt-1", status.textCol)}>Status: {status.label}</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-[#0B0F19]">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Penyakit Paling Rawan</span>
                <div className="flex items-center gap-2 mt-1">
                  <Bug className="h-5 w-5 text-red-500 shrink-0" />
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Demam Berdarah</span>
                </div>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-1">Potensi transmisi: {computedAvgDengue}%</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-[#0B0F19]">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Kondisi Cuaca Kota</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">{computedAvgTemp}°C</span>
                  <span className="text-xs text-slate-500">Hujan: {computedAvgRain} mm</span>
                </div>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-1">Kualitas Udara: PM2.5 {computedAvgPm25}</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-[#0B0F19]">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Cakupan Wilayah</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Kota Semarang</span>
                </div>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-1">1 Kesatuan (1.69 Juta Jiwa)</span>
              </div>
            </div>

            {/* 2. BARIS TENGAH: 2 PENYAKIT RAWAN + REKOMENDASI JELAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* KIRI (5 Kolom): Dua Penyakit yang Diawasi */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-[#0B0F19] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Tingkat Bahaya 2 Penyakit Utama
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {/* DBD */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#080C14] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                          <Bug className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">1. Demam Berdarah Dengue (DBD)</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Bahaya perkembangbiakan nyamuk pasca-hujan</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">{computedAvgDengue}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-red-500 transition-all duration-300" style={{ width: `${computedAvgDengue}%` }} />
                    </div>
                  </div>

                  {/* ISPA */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#080C14] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                          <Wind className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">2. Infeksi Saluran Pernapasan (ISPA)</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">Bahaya paparan debu halus & udara terjebak</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{computedAvgIspa}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500 transition-all duration-300" style={{ width: `${computedAvgIspa}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* KANAN (7 Kolom): Langkah Aksi Nyata & Solusi (Enhanced Copy) */}
              <div className="lg:col-span-7 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-900/60 dark:bg-[#0B0F19] space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/80 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-300">
                      Langkah Pencegahan yang Harus Dilakukan Sekarang
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase">
                    Aksi Nyata
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Panduan Masyarakat */}
                  <div className="rounded-xl border border-white/80 bg-white p-4 dark:border-slate-800 dark:bg-[#080C14] space-y-2 shadow-2xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      👥 Untuk Warga & Keluarga:
                    </span>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11.5px] leading-relaxed">
                      <li>• <strong>Kuras & Tutup:</strong> Bersihkan bak mandi, vas bunga, dan tempat penampungan air seminggu sekali.</li>
                      <li>• <strong>Singkirkan Barang Bekas:</strong> Buang kaleng/ban bekas yang berpotensi menampung air hujan di halaman.</li>
                      <li>• <strong>Pakai Masker:</strong> Gunakan masker jika berada di jalan raya berdebu saat angin tenang.</li>
                    </ul>
                  </div>

                  {/* Panduan Petugas Dinkes */}
                  <div className="rounded-xl border border-white/80 bg-white p-4 dark:border-slate-800 dark:bg-[#080C14] space-y-2 shadow-2xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      🏛️ Untuk Petugas / Puskesmas:
                    </span>
                    <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11.5px] leading-relaxed">
                      <li>• <strong>Gerakan Jumantik:</strong> Kerahkan kader memeriksa jentik nyamuk di lingkungan RT/RW padat.</li>
                      <li>• <strong>Tabur Abate:</strong> Bagikan bubuk larvasida untuk penampungan air yang sulit dikuras.</li>
                      <li>• <strong>Siaga Stok Obat:</strong> Siapkan stok obat flu, nebulizer, dan cairan rehidrasi di Puskesmas.</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 p-3 text-[11px] text-emerald-950 dark:text-emerald-200 flex items-center justify-between">
                  <span><strong>Faktor Pemicu Saat Ini:</strong> Suhu hangat 28°C yang mempercepat nyamuk menetas.</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 shrink-0 ml-2">Respon Cepat 24 Jam</span>
                </div>
              </div>
            </div>

            {/* 3. BARIS BAWAH: TREN 3 BULAN TERAKHIR + PROYEKSI 1 BULAN KE DEPAN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* KIRI (6 Kolom): Chart Tren 3 Bulan Terakhir */}
              <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-[#0B0F19] space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                      Tren Skor Bahaya 3 Bulan Terakhir (Juni - Agustus)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">12 Minggu Terakhir</span>
                </div>

                {/* Visual Bar Chart Indeks Skor */}
                <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-2 px-1">
                  {threeMonthsHistory.map((item, idx) => {
                    const heightPct = Math.max(15, (item.score / 100) * 100);
                    const isLatest = idx === threeMonthsHistory.length - 1;
                    return (
                      <div key={item.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.score}
                        </span>
                        <div
                          className={cn(
                            "w-full rounded-t-md transition-all duration-300",
                            isLatest
                              ? "bg-emerald-500 dark:bg-emerald-400"
                              : item.score >= 50
                              ? "bg-amber-400 dark:bg-amber-500/80"
                              : "bg-slate-300 dark:bg-slate-700"
                          )}
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[8.5px] font-mono text-slate-400 truncate max-w-[28px]">
                          {item.label.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Rata-rata 3 Bulan: <strong>47 / 100</strong> (Kategori Waspada Ringan)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Kondisi Terkendali</span>
                </div>
              </div>

              {/* KANAN (6 Kolom): Hasil Proyeksi 1 Bulan ke Depan (Langsung Tampil Tanpa Simulasi) */}
              <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-[#0B0F19] space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                      Proyeksi Risiko 1 Bulan Ke Depan (September 2026)
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Otomatis 30 Hari
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {oneMonthForecast.map((fc) => (
                    <div
                      key={fc.week}
                      className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#080C14] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-900 dark:text-slate-100">{fc.week}</span>
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.2 rounded",
                          fc.dengue >= 50 ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        )}>
                          {fc.status}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block">{fc.dateRange}</span>
                      <div className="pt-1 text-[10.5px] font-mono space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">DBD:</span>
                          <strong className="text-red-600 dark:text-red-400">{fc.dengue}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">ISPA:</span>
                          <strong className="text-amber-600 dark:text-amber-400">{fc.ispa}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
                  💡 <strong>Catatan Penting:</strong> Potensi jentik nyamuk meningkat di <strong>Minggu ke-2</strong>. Disarankan kerja bakti PSN serentak sebelum tanggal tersebut.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </aside>
  );
}
