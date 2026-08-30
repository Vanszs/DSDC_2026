"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Command,
  MapPin,
  FileText,
  FileSpreadsheet,
  Sun,
  Moon,
  LayoutDashboard,
  Home,
  LogIn,
  Activity,
  ArrowRight,
  X,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export const SEMARANG_DISTRICTS = [
  { id: 1, name: "Semarang Tengah", code: "33.74.01", typology: "Urban Dense", score: 78 },
  { id: 2, name: "Semarang Utara", code: "33.74.02", typology: "Coastal Port & Rob", score: 72 },
  { id: 3, name: "Semarang Selatan", code: "33.74.03", typology: "Commercial Core", score: 65 },
  { id: 4, name: "Semarang Barat", code: "33.74.04", typology: "Mixed Industrial Urban", score: 58 },
  { id: 5, name: "Semarang Timur", code: "33.74.05", typology: "Dense Residential", score: 62 },
  { id: 6, name: "Gajahmungkur", code: "33.74.06", typology: "Hilly Suburban", score: 40 },
  { id: 7, name: "Candisari", code: "33.74.07", typology: "Undulating Urban", score: 48 },
  { id: 8, name: "Banyumanik", code: "33.74.08", typology: "Upper Plateau Suburban", score: 35 },
  { id: 9, name: "Gunungpati", code: "33.74.09", typology: "Forest Canopy & Agro", score: 30 },
  { id: 10, name: "Pedurungan", code: "33.74.10", typology: "Rapid Urban Sprawl", score: 68 },
  { id: 11, name: "Genuk", code: "33.74.11", typology: "Coastal Rob Critical", score: 80 },
  { id: 12, name: "Gayamsari", code: "33.74.12", typology: "River Basin Lowland", score: 55 },
  { id: 13, name: "Tembalang", code: "33.74.13", typology: "University Town & Hills", score: 42 },
  { id: 14, name: "Ngaliyan", code: "33.74.14", typology: "Industrial & Mixed Hills", score: 50 },
  { id: 15, name: "Mijen", code: "33.74.15", typology: "Agro-Forestry Frontier", score: 25 },
  { id: 16, name: "Tugu", code: "33.74.16", typology: "Coastal Mangrove Strip", score: 45 },
];

export interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

export interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectDistrict?: (districtName: string) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  open: controlledOpen,
  onOpenChange,
  onSelectDistrict,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  let router: { push: (url: string) => void } = { push: () => {} };
  try {
    router = useRouter();
  } catch {
    router = { push: () => {} };
  }

  let pathname = "/";
  try {
    pathname = usePathname() || "/";
  } catch {
    pathname = "/";
  }

  const { toggleTheme } = useTheme();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = useCallback(
    (val: boolean) => {
      if (onOpenChange) {
        onOpenChange(val);
      } else {
        setInternalOpen(val);
      }
    },
    [onOpenChange]
  );

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Reset query and selected index on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Navigation
      {
        id: "nav-dashboard",
        category: "Navigasi",
        title: "Buka Realtime Cockpit",
        subtitle: "Peta spasial MVT, EHV, sensor mikroklimat & triage",
        icon: LayoutDashboard,
        action: () => {
          router.push("/dashboard");
          setIsOpen(false);
        },
      },
      {
        id: "nav-landing",
        category: "Navigasi",
        title: "Beranda & Ikhtisar Eksekutif",
        subtitle: "Spesifikasi metodologi dan beban epidemiologi kota",
        icon: Home,
        action: () => {
          router.push("/");
          setIsOpen(false);
        },
      },
      {
        id: "nav-login",
        category: "Navigasi",
        title: "Portal Otentikasi Petugas",
        subtitle: "Masuk SSO Dinkes Semarang / Bappeda Gateway",
        icon: LogIn,
        action: () => {
          router.push("/login");
          setIsOpen(false);
        },
      },
      // Actions
      {
        id: "act-pdf",
        category: "Ekspor & Laporan",
        title: "Unduh Dokumen Eksekutif PDF",
        subtitle: "Kompilasi analitik 16 kecamatan untuk pimpinan daerah",
        icon: FileText,
        action: () => {
          window.location.href = "/api/export/pdf";
          setIsOpen(false);
        },
      },
      {
        id: "act-excel",
        category: "Ekspor & Laporan",
        title: "Ekspor Matriks Dataset Excel (OpenXML)",
        subtitle: "Tabel risiko DLNM dan data mikroklimat lengkap",
        icon: FileSpreadsheet,
        action: () => {
          window.location.href = "/api/export/excel";
          setIsOpen(false);
        },
      },
      {
        id: "act-theme",
        category: "Pengaturan Sistem",
        title: "Ganti Tema Tampilan (Terang / Gelap)",
        subtitle: "Peralihan mode warna kontras tinggi 60-30-10",
        icon: Moon,
        action: () => {
          toggleTheme();
          setIsOpen(false);
        },
      },
      // Districts
      ...SEMARANG_DISTRICTS.map((d) => ({
        id: `district-${d.id}`,
        category: "Lompat ke Kecamatan (Kota Semarang)",
        title: d.name,
        subtitle: `Kode: ${d.code} | Tipologi: ${d.typology} | EHV: ${d.score}/100`,
        icon: MapPin,
        badge: `EHV ${d.score}`,
        badgeColor:
          d.score >= 70
            ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
            : d.score >= 45
            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        action: () => {
          if (onSelectDistrict) {
            onSelectDistrict(d.name);
          }
          if (pathname !== "/dashboard") {
            router.push(`/dashboard?district=${encodeURIComponent(d.name)}`);
          }
          setIsOpen(false);
        },
      })),
    ];

    if (!query.trim()) return list;

    const q = query.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, router, pathname, toggleTheme, setIsOpen, onSelectDistrict]);

  // Handle keyboard navigation in menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < items.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : items.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu Perintah Cepat (Command Palette)"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-[10vh] sm:pt-[12vh] bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-100"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] shadow-2xl dark:border-[#1E2638] dark:bg-[#0b111a] text-[#181818] dark:text-[#FAF8F5] animate-in zoom-in-95 duration-100 flex flex-col max-h-[75vh]">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[#E5E0D8] dark:border-[#1E2638] px-4 py-3 bg-[#EFEAE2]/60 dark:bg-slate-900/50">
          <Search className="h-4 w-4 text-[#645E54] dark:text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Cari kecamatan, fitur analitik, atau perintah sistem..."
            className="flex-1 bg-transparent text-sm text-[#181818] dark:text-[#FAF8F5] placeholder:text-[#645E54]/70 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="rounded p-1 text-[#645E54] hover:bg-[#E5E0D8] dark:hover:bg-slate-800 dark:text-slate-400"
            aria-label="Tutup Menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results list */}
        <div
          className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin bg-white/70 dark:bg-transparent"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#645E54] dark:text-slate-400 font-mono">
              Tidak ada perintah atau kecamatan yang cocok dengan &quot;{query}&quot;
            </div>
          ) : (
            items.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                    isSelected
                      ? "bg-[#EFEAE2] dark:bg-emerald-950/50 border border-[#DCD6CA] dark:border-emerald-800/80 text-[#181818] dark:text-slate-50"
                      : "hover:bg-[#FAF8F5] dark:hover:bg-slate-900/60 text-[#645E54] dark:text-slate-300 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
                        isSelected
                          ? "bg-[#181818] text-white border-[#181818] dark:bg-emerald-500"
                          : "bg-[#EFEAE2] text-[#645E54] border-[#E5E0D8] dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate text-[#181818] dark:text-slate-100">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#645E54] dark:text-slate-400 font-mono hidden sm:inline">
                          ({item.category})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#645E54] dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-mono font-bold",
                          item.badgeColor
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        isSelected
                          ? "text-[#181818] dark:text-emerald-400 translate-x-0.5"
                          : "text-[#645E54] opacity-40"
                      )}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-[#E5E0D8] dark:border-slate-800 px-4 py-2 bg-[#EFEAE2]/60 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-[#645E54] dark:text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#E5E0D8] dark:bg-slate-800 px-1 py-0.5 text-[10px] text-[#181818] dark:text-slate-300">↑↓</span>
            <span>Navigasi</span>
            <span className="rounded bg-[#E5E0D8] dark:bg-slate-800 px-1 py-0.5 text-[10px] text-[#181818] dark:text-slate-300">ENTER</span>
            <span>Pilih</span>
            <span className="rounded bg-[#E5E0D8] dark:bg-slate-800 px-1 py-0.5 text-[10px] text-[#181818] dark:text-slate-300">ESC</span>
            <span>Tutup</span>
          </div>
          <div className="hidden sm:inline">Dinkes Kota Semarang x Bappeda (DSDC 2026)</div>
        </div>
      </div>
    </div>
  );
};
