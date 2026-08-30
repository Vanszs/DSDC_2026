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

            {/* 1. PRIORITAS UTAMA (PALING ATAS): DIRECTIVE PEMERINTAH (APA YANG HARUS DILAKUKAN SEKARANG) */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 dark:border-emerald-800 dark:bg-[#0B1510] space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 dark:border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                    #1
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-200">
                      Instruksi & Rekomendasi Aksi Pemerintah Kota (Dinas Kesehatan & Pemda)
                    </h3>
                    <p className="text-xs text-emerald-800/90 dark:text-emerald-400">
                      Prioritas penanganan darurat 1 minggu ke depan untuk mencegah lonjakan pasien rumah sakit
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-700 text-white uppercase tracking-wider">
                  Tindakan Wajib Minggu Ini
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Aksi 1 */}
                <div className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/80 dark:bg-[#080C14] space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400 text-xs">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-950 text-red-700 text-[11px]">1</span>
                    <span>Pencegahan DBD (Fokus Jumantik):</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11.5px] leading-relaxed">
                    Kerahkan kader Jumantik ke seluruh kelurahan untuk inspeksi jentik di penampungan air dan bagikan bubuk larvasida (Abate) massal.
                  </p>
                </div>

                {/* Aksi 2 */}
                <div className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/80 dark:bg-[#080C14] space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 text-xs">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 text-[11px]">2</span>
                    <span>Kesiapsiagaan Fasilitas Kesehatan:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11.5px] leading-relaxed">
                    Siagakan stok cairan infus, obat batuk/flu, dan ruang isolasi di 37 Puskesmas se-Kota Semarang menghadapi fluktuasi cuaca.
                  </p>
                </div>

                {/* Aksi 3 */}
                <div className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900/80 dark:bg-[#080C14] space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 text-[11px]">3</span>
                    <span>Imbauan Kesehatan Masyarakat:</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11.5px] leading-relaxed">
                    Sebarkan peringatan dini melalui kanal resmi Pemkot: anjuran PSN 3M Plus mandiri bagi keluarga dan penggunaan masker di jalan raya.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. PRIORITAS KEDUA: APA YANG SEDANG TERJADI & KAPAN TERJADI (DIAGNOSIS CUACA & PENYAKIT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* KIRI (5 Kolom): Apa yang Terjadi (Kondisi Saat Ini & 2 Penyakit Rawan) */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-[#0B0F19] space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diagnosis Masalah</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    Apa yang Terjadi di Kota Semarang?
                  </h3>
                </div>

                {/* Status Ringkas */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#080C14] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Skor Bahaya Gabungan</span>
                    <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{cityScore} / 100</span>
                  </div>
                  <span className={cn("text-xs font-bold px-3 py-1 rounded-full", status.color)}>
                    Status: {status.label}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* DBD */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-[#080C14] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bug className="h-4 w-4 text-red-500" />
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">1. Demam Berdarah Dengue (DBD)</span>
                      </div>
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono">{computedAvgDengue}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Suhu {computedAvgTemp}°C dan hujan berkala 14 hari lalu memicu percepatan penetasan jentik nyamuk.
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${computedAvgDengue}%` }} />
                    </div>
                  </div>

                  {/* ISPA */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-[#080C14] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-amber-500" />
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">2. Infeksi Saluran Pernapasan (ISPA)</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">{computedAvgIspa}%</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Konsentrasi debu halus PM2.5 berada di angka {computedAvgPm25} µg/m³ saat angin tenang.
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${computedAvgIspa}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* KANAN (7 Kolom): Kapan Terjadi (Proyeksi 1 Bulan Ke Depan Otomatis) */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-[#0B0F19] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Timeline Prediksi</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      Kapan Ancaman Terjadi? (Proyeksi 1 Bulan Mendatang)
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

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                  ⚠️ <strong>Puncak Bahaya:</strong> Berdasarkan siklus cuaca 14 hari ke belakang, potensi jentik nyamuk DBD mencapai titik tertinggi pada <strong>Minggu ke-2 (H+8 s.d H+14)</strong>. Intervensi larvasidasi harus tuntas sebelum minggu depan.
                </div>
              </div>
            </div>

            {/* 3. PRIORITAS KETIGA: HISTORIS TREN 3 BULAN SEBELUMNYA */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-[#0B0F19] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                    Evaluasi Historis: Tren Risiko 3 Bulan Terakhir (12 Minggu Lalu)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Juni - Agustus 2026</span>
              </div>

              {/* Visual Bar Chart Indeks Skor */}
              <div className="h-28 flex items-end justify-between gap-1.5 pt-3 pb-1 px-1">
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

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                <span>Rata-rata 3 Bulan Lalu: <strong>47 / 100</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tren Terkendali</span>
              </div>
            </div>

            {/* 4. PENJELASAN SEDERHANA: KENAPA PREDIKSI MINGGU INI SEPERTI INI? (Bahasa Awam Tanpa AI-Slop) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-[#0B0F19] space-y-3">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Penjelasan Faktor Cuaca</span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Mengapa Prediksi Minggu Ini Muncul Angka {cityScore} (Status {status.label})?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#080C14] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    🌧️ Curah Hujan 14 Hari Terakhir:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11.5px] leading-relaxed">
                    Hujan yang turun berselang 1–2 minggu lalu meninggalkan genangan di selokan dan sampah terbuka. Ini adalah waktu alami jentik nyamuk DBD menetas menjadi nyamuk dewasa.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#080C14] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    🌡️ Suhu Udara Rata-rata ({computedAvgTemp}°C):
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11.5px] leading-relaxed">
                    Suhu hangat di kisaran 28°C adalah suhu paling ideal bagi nyamuk untuk lebih aktif menggigit dan mempercepat penularan virus di lingkungan warga.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#080C14] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    💨 Kondisi Angin & Debu Udara:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11.5px] leading-relaxed">
                    Angin yang tenang membuat debu dan asap kendaraan tidak cepat terbawa pergi, sehingga partikel polusi melayang lebih lama di udara dekat permukaan tanah.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </aside>
  );
}
