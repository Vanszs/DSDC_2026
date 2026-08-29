"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Building2,
  Layers,
  ArrowRight,
  Radio,
  FileCode2,
  Database,
  Lock,
  Compass,
  AlertTriangle,
  Bug,
  Droplets,
  Wind,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  BarChart3,
  Thermometer,
} from "lucide-react";
import { GlobalNavbar } from "@/components/navigation/global-navbar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { EnterpriseFooter } from "@/components/layout/enterprise-footer";
import {
  RegulatorySpecsModal,
  SpecTab,
} from "@/components/layout/regulatory-specs-modal";
import {
  KEMENDAGRI_33_74_DISTRICTS,
  REGULATORY_CREDENTIALS,
} from "@/lib/regulatory-specs";
import { DistrictSummaryDTO } from "@/lib/queries";
import { CapabilitiesArchitectureSection } from "@/components/layout/capabilities-architecture";
import { InstitutionalTrustWall } from "@/components/layout/institutional-trust-wall";
import { DualEngineBentoSection } from "@/components/layout/dual-engine-bento";

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<SpecTab>("openapi");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [districts, setDistricts] = useState<DistrictSummaryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?date=${new Date().toISOString().slice(0, 10)}`);
      if (!res.ok) throw new Error("Gagal mengambil data analitik");
      const json = await res.json();
      setDistricts(json.data ?? []);
    } catch {
      // Graceful fallback for test or offline environment
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const openSpecs = (tab: SpecTab) => {
    setModalTab(tab);
    setModalOpen(true);
  };

  const filteredDistricts = KEMENDAGRI_33_74_DISTRICTS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.includes(searchTerm) ||
      d.typology.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Aggregate metrics
  const totalDistricts = districts.length;
  const highRiskCount = districts.filter((d) => d.compositeScore >= 70).length;
  const avgCompositeScore = totalDistricts
    ? Math.round(
        districts.reduce((acc, d) => acc + d.compositeScore, 0) / totalDistricts
      )
    : 56;
  const highestRiskDistrict = districts[0] ?? {
    name: "Semarang Tengah",
    kemendagriCode: "33.74.01",
    compositeScore: 78,
    primaryFactor: "Kapasitas Termal Vektor Aedes",
    dengueRisk: 82,
    ispaRisk: 60,
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAF8F5] text-[#141824] dark:bg-[#080C14] dark:text-[#F8FAFC] transition-colors duration-150">
      {/* Universal Global Navigation Header */}
      <GlobalNavbar />

      {/* Main Landing Content Container */}
      <main id="main-content" role="main" className="flex-1">
        {/* HERO SECTION: Crucible Warm Editorial Initial Viewport */}
        <section
          aria-label="Ikhtisar Platform Komando Epidemiologi"
          className="border-b border-[#E5E0D8] bg-gradient-to-b from-[#FAF6EE] via-[#FAF8F5] to-[#FAF8F5] dark:border-[#1E2638] dark:from-[#0C121D] dark:via-[#080C14] dark:to-[#080C14] pt-10 pb-14 sm:pt-14 sm:pb-18 lg:pt-16 lg:pb-20 relative overflow-hidden"
        >
          {/* Ambient Champagne/Amber Warm Halo Glow */}
          <div
            className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-full max-w-4xl rounded-full bg-gradient-to-b from-amber-400/12 via-orange-300/8 to-transparent dark:from-emerald-500/10 dark:via-amber-500/5 dark:to-transparent blur-3xl"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 text-center">
            {/* Top Announcement Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCD6CA] bg-white/90 px-3.5 py-1 text-xs font-mono font-medium text-[#1B1916] dark:border-[#1E2638] dark:bg-[#0E1420]/90 dark:text-emerald-300 shadow-xs">
              <span className="rounded-full bg-[#181818] px-1.5 py-0.2 text-[9px] font-bold text-white dark:bg-emerald-500 dark:text-slate-950 uppercase">
                Resmi
              </span>
              <span>DSDC 2026 : Kemendagri 33.74 Kota Semarang</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-bold tracking-tight text-[#141824] dark:text-[#F8FAFC] leading-[1.12] mx-auto">
              Platform intelijen epidemiologi untuk mitigasi krisis iklim.
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-[#57534E] dark:text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
              Memprediksi potensi peningkatan kasus Demam Berdarah (DBD) dan ISPA di Kota Semarang berdasarkan pola cuaca 30 tahun (suhu, curah hujan, dan kualitas udara).
            </p>

            {/* Primary Action Button Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="h-10 sm:h-11 rounded-full bg-[#181818] text-white px-6 font-semibold hover:bg-black dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 active-press flex items-center gap-2 shadow-sm transition-transform active:scale-95 text-xs sm:text-sm"
              >
                <span>Buka Cockpit Realtime</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="h-10 sm:h-11 rounded-full border border-[#DCD6CA] bg-white px-5 font-semibold text-[#141824] hover:bg-[#FAF8F5] dark:border-[#1E2638] dark:bg-[#0E1420] dark:text-[#F8FAFC] dark:hover:bg-slate-800 active-press flex items-center gap-1.5 shadow-xs text-xs sm:text-sm"
              >
                <Building2 className="h-4 w-4 text-[#57534E] dark:text-[#94A3B8]" />
                <span>Portal Petugas</span>
              </Link>
              <button
                onClick={() => openSpecs("openapi")}
                className="h-10 sm:h-11 rounded-full px-4 font-semibold text-[#57534E] hover:text-[#141824] hover:bg-black/5 dark:text-[#94A3B8] dark:hover:text-emerald-400 dark:hover:bg-white/5 flex items-center gap-1.5 active-press transition-colors text-xs"
              >
                <FileCode2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Spesifikasi OpenAPI & PostGIS</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 1: INSTITUTIONAL TRUST & PARTNER MATRIX (Crucible Logo Wall) */}
        <InstitutionalTrustWall />

        {/* SECTION 2: DUAL-CAPABILITY BENTO (Crucible One Model Two Ways to Build) */}
        <DualEngineBentoSection onOpenSpecs={openSpecs} />

        {/* LIVE EXECUTIVE KPI METRIC CARDS SNAPSHOT */}
        <section
          aria-label="Ringkasan Metrik Kerentanan Kota"
          className="border-b border-[#E5E0D8] bg-[#FAF8F5] dark:border-[#1E2638] dark:bg-[#080C14] py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#141824] dark:text-[#F8FAFC]">
                  Ringkasan Status Bahaya Kesehatan Kota
                </h2>
                <p className="text-xs text-[#57534E] dark:text-[#94A3B8]">
                  Surveilans risiko iklim terintegrasi seluruh wilayah Kota Semarang secara real-time
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Lihat di Cockpit <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Skor Bahaya Kesehatan Kota"
                value={`${avgCompositeScore}`}
                unit="/ 100"
                description="Tingkat kerentanan gabungan DBD & ISPA seluruh wilayah Kota Semarang"
                variant={
                  avgCompositeScore >= 70
                    ? "danger"
                    : avgCompositeScore >= 45
                    ? "warning"
                    : "success"
                }
                icon={Activity}
                badge="STATUS KOTA"
                statusIndicator="live"
                sparklineData={[42, 45, 51, 58, 62, 65, avgCompositeScore]}
                benchmark={{ label: "Ambang Siaga", value: "Skor >= 70" }}
              />

              <MetricCard
                title="Status Kesiapsiagaan"
                value={avgCompositeScore >= 70 ? "SIAGA TINGGI" : avgCompositeScore >= 40 ? "WASPADA" : "TERKENDALI"}
                description="Status respon tanggap dini pencegahan wabah di tingkat kota"
                variant={avgCompositeScore >= 70 ? "danger" : avgCompositeScore >= 40 ? "warning" : "success"}
                icon={AlertTriangle}
                badge="PROTOKOL DINKES"
                statusIndicator={avgCompositeScore >= 70 ? "critical" : "nominal"}
                sparklineData={[1, 2, 2, 3, 4, 3, highRiskCount || 3]}
                benchmark={{ label: "Status Kota", value: "1 Kesatuan Teritorial" }}
              />

              <MetricCard
                title="Faktor Pemicu Utama"
                value="Suhu & Polusi"
                description={`Pemicu dominan: ${highestRiskDistrict.primaryFactor}`}
                variant="warning"
                icon={Bug}
                badge="ANALISIS IKLIM"
                statusIndicator="warning"
                sparklineData={[68, 70, 72, 75, 74, 76, highestRiskDistrict.compositeScore]}
                benchmark={{ label: "Kemendagri", value: "33.74 Semarang" }}
              />

              <MetricCard
                title="Monitoring Vektor & Lingkungan"
                value="2"
                unit="Penyakit Utama"
                description="DBD (Siklus Nyamuk Aedes) & ISPA (Partikel Debu PM2.5)"
                variant="neutral"
                icon={ShieldCheck}
                badge="SURVEILANS 1 KOTA"
                statusIndicator="nominal"
                sparklineData={[100, 100, 100, 100, 100, 100, 100]}
                benchmark={{ label: "Basis Model", value: "Reanalisis 30 Tahun" }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: ONTOLOGICAL ARCHITECTURE & 4-PILLAR CAPABILITIES */}
        <CapabilitiesArchitectureSection />

        {/* SECTION 4: KEMENDAGRI 33.74 ADMINISTRATIVE MATRIX */}
        <section
          aria-label="Katalog Data Wilayah Kemendagri 33.74"
          className="border-b border-[#E5E0D8] bg-[#FAF8F5] dark:border-[#1E2638] dark:bg-[#080C14] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-mono font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <Database className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Katalog Spasial Kemendagri 33.74 Kota Semarang</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141824] dark:text-[#F8FAFC]">
                  Direktori 16 Kecamatan Administratif
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#94A3B8] max-w-2xl">
                  Data master batas administratif, tipologi lingkungan, elevasi, indeks sanitasi dasar, dan titik koordinat centroid PostGIS.
                </p>
              </div>

              {/* Search Filter */}
              <div className="w-full sm:w-72">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari kecamatan / tipologi..."
                    className="w-full rounded-full border border-[#DCD6CA] bg-white py-2 pl-9 pr-4 text-xs text-[#141824] placeholder-slate-400 focus:border-emerald-600 focus:outline-none dark:border-[#1E2638] dark:bg-[#0E1420] dark:text-[#F8FAFC]"
                  />
                </div>
              </div>
            </div>

            {/* Table Matrix */}
            <div className="rounded-2xl border border-[#E5E0D8] bg-white dark:border-[#1E2638] dark:bg-[#0E1420] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E0D8] bg-[#FAF8F5] dark:border-[#1E2638] dark:bg-[#080C14] text-[11px] font-mono text-[#57534E] dark:text-[#94A3B8] uppercase tracking-wider">
                      <th className="py-3 px-4">Kode</th>
                      <th className="py-3 px-4">Kecamatan</th>
                      <th className="py-3 px-4">Tipologi</th>
                      <th className="py-3 px-4 text-center">Status Rob</th>
                      <th className="py-3 px-4 text-right">Populasi</th>
                      <th className="py-3 px-4 text-right">Luas (km²)</th>
                      <th className="py-3 px-4 text-right">Elevasi</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8] dark:divide-[#1E2638]">
                    {filteredDistricts.map((d) => (
                      <tr
                        key={d.code}
                        className="hover:bg-[#FAF8F5] dark:hover:bg-[#131B2C] transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                          {d.code}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#141824] dark:text-[#F8FAFC]">
                          {d.name}
                        </td>
                        <td className="py-3 px-4 text-[#57534E] dark:text-[#94A3B8]">
                          {d.typology}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {d.isCoastalRob ? (
                            <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-900">
                              Rawan Rob
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              Aman
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-mono-num text-[#141824] dark:text-[#F8FAFC]">
                          {d.population.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-mono-num text-[#57534E] dark:text-[#94A3B8]">
                          {d.areaKm2.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-mono-num text-[#57534E] dark:text-[#94A3B8]">
                          {d.elevationMeters} mdpl
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1 rounded-full border border-[#DCD6CA] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-[#FAF8F5] dark:border-[#1E2638] dark:bg-[#0E1420] dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <span>Cockpit</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Regulatory Technical Specs Modal */}
      <RegulatorySpecsModal
        isOpen={modalOpen}
        defaultTab={modalTab}
        onClose={() => setModalOpen(false)}
      />

      {/* B2B Enterprise Footer */}
      <EnterpriseFooter onOpenSpecs={openSpecs} />
    </div>
  );
}
