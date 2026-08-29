"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LogIn,
  LogOut,
  Search,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  FileCode2,
  Database,
  Building2,
} from "lucide-react";
import { StatusPing } from "./status-ping";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuth } from "@/components/auth/auth-context";
import { CommandMenu } from "./command-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface GlobalNavbarProps {
  className?: string;
  selectedDistrictName?: string;
  onSelectDistrict?: (name: string) => void;
  showBreadcrumb?: boolean;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  className,
  selectedDistrictName,
  onSelectDistrict,
  showBreadcrumb = false,
}) => {
  let pathname = "/";
  try {
    pathname = usePathname() || "/";
  } catch {
    pathname = "/";
  }

  const { user, isAuthenticated, logout } = useAuth();
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";
  const isLandingRoute = pathname === "/";

  const renderDashboardBreadcrumbs = () => {
    if (selectedDistrictName) {
      return [
        { label: "KOTA SEMARANG", href: "/" },
        { label: "EPIDEMIOLOGI", href: "/dashboard" },
        {
          label: selectedDistrictName.toUpperCase(),
          href: `/dashboard?district=${encodeURIComponent(selectedDistrictName)}`,
          current: true,
        },
      ];
    }
    if (isLoginRoute) {
      return [
        { label: "PORTAL RESMI", href: "/" },
        { label: "OTENTIKASI PETUGAS", href: "/login", current: true },
      ];
    }
    return [
      { label: "KOTA SEMARANG", href: "/" },
      { label: "EPIDEMIOLOGI", href: "/" },
      { label: "REALTIME COCKPIT", href: "/dashboard", current: true },
    ];
  };

  const breadcrumbs = renderDashboardBreadcrumbs();

  return (
    <>
      <header
        role="banner"
        className={cn(
          "sticky top-0 z-40 border-b border-[#E5E0D8] bg-[#FAF8F5]/95 backdrop-blur-md dark:border-[#1E2638] dark:bg-[#080C14]/95 transition-colors duration-150",
          className
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          {/* Left: Brand Identity / Dashboard Breadcrumbs */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full p-0.5"
            >
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#181818] text-white dark:bg-[#F8FAFC] dark:text-[#080C14] shadow-xs transition-transform group-hover:scale-105 active-press">
                <Activity className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-emerald-400 dark:text-emerald-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-[#141824] dark:text-[#F8FAFC]">
                  EcoHealth Pulse
                </span>
                <span className="rounded-full bg-[#EFEAE2] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#141824] dark:bg-[#131B2C] dark:text-emerald-300 border border-[#DCD6CA] dark:border-slate-800">
                  DSDC 2026
                </span>
              </div>
            </Link>

            {/* If on Dashboard / Internal Route: Render Command Breadcrumbs */}
            {(isDashboardRoute || isLoginRoute || showBreadcrumb) && (
              <>
                <div className="hidden md:block h-5 w-px bg-[#E5E0D8] dark:bg-[#1E2638]" />
                <nav
                  aria-label="Breadcrumb Navigasi Komando"
                  className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono font-medium text-[#645E54] dark:text-[#94A3B8]"
                >
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={crumb.label}>
                      {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400 opacity-60" />}
                      {crumb.current ? (
                        <span className="text-[#141824] dark:text-[#F8FAFC] font-bold px-2 py-0.5 rounded-full bg-[#EFEAE2] dark:bg-[#131B2C] border border-[#DCD6CA] dark:border-slate-800">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="hover:text-[#141824] dark:hover:text-[#F8FAFC] hover:underline px-1 py-0.5"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              </>
            )}

            {/* If on Public Landing (/): Render Clean Editorial Navigation Links */}
            {isLandingRoute && !showBreadcrumb && (
              <nav
                aria-label="Navigasi Menu Publik"
                className="hidden md:flex items-center gap-1 text-xs font-medium text-[#645E54] dark:text-[#94A3B8] ml-2"
              >
                <Link
                  href="/dashboard"
                  className="rounded-full px-3 py-1.5 hover:bg-[#EFEAE2] hover:text-[#141824] dark:hover:bg-slate-800 dark:hover:text-[#F8FAFC] transition-colors flex items-center gap-1.5 font-semibold text-[#141824] dark:text-[#F8FAFC]"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Cockpit Realtime</span>
                </Link>
                <a
                  href="#mitra-institusional"
                  className="rounded-full px-3 py-1.5 hover:bg-[#EFEAE2] hover:text-[#141824] dark:hover:bg-slate-800 dark:hover:text-[#F8FAFC] transition-colors"
                >
                  Mitra & Standar
                </a>
                <a
                  href="#arsitektur-sistem"
                  className="rounded-full px-3 py-1.5 hover:bg-[#EFEAE2] hover:text-[#141824] dark:hover:bg-slate-800 dark:hover:text-[#F8FAFC] transition-colors"
                >
                  Arsitektur DLNM
                </a>
                <a
                  href="#kemendagri-catalog"
                  className="rounded-full px-3 py-1.5 hover:bg-[#EFEAE2] hover:text-[#141824] dark:hover:bg-slate-800 dark:hover:text-[#F8FAFC] transition-colors"
                >
                  Direktori 16 Kec
                </a>
              </nav>
            )}
          </div>

          {/* Right: Quick Search, Telemetry (Dashboard only), Theme Toggle & Auth Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status Ping Telemetry only for Dashboard / Internal */}
            {(isDashboardRoute || showBreadcrumb) && (
              <StatusPing className="hidden sm:inline-block" />
            )}

            {/* Command Palette Search Button */}
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#DCD6CA] bg-white px-3 py-1.5 text-xs text-[#645E54] hover:bg-[#FAF8F5] hover:text-[#141824] hover:border-[#94A3B8] dark:border-[#1E2638] dark:bg-[#0E1420] dark:text-[#94A3B8] dark:hover:bg-slate-800 dark:hover:text-[#F8FAFC] active-press transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 shadow-xs"
              title="Buka Menu Perintah (Ctrl+K)"
              aria-label="Buka Menu Perintah Cepat"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden lg:inline text-[11px] font-medium">Cari Perintah...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-[#FAF8F5] dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-[#645E54] dark:text-[#94A3B8] border border-[#E5E0D8] dark:border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* User Session / Login CTA */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5">
                <div
                  className="hidden sm:flex items-center gap-2 rounded-full border border-[#E5E0D8] bg-white px-3 py-1 dark:border-[#1E2638] dark:bg-[#0E1420] text-left shadow-xs"
                  title={`${user.name} (${user.role})`}
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#181818] text-[10px] font-bold text-white uppercase">
                    {user.name.slice(0, 1)}
                  </div>
                  <div className="max-w-[120px] sm:max-w-[140px] truncate">
                    <div className="text-[11px] font-semibold text-[#141824] dark:text-[#F8FAFC] truncate">
                      {user.name.split(",")[0]}
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="rounded-full border border-[#DCD6CA] p-1.5 text-[#645E54] hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:border-[#1E2638] dark:text-[#94A3B8] dark:hover:bg-red-950/40 dark:hover:text-red-400 active-press transition-colors shadow-xs"
                  title="Keluar dari Sesi Petugas"
                  aria-label="Keluar dari Sesi Petugas"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : isLoginRoute ? (
              <Link href="/dashboard">
                <Button
                  size="pill"
                  variant="default"
                  className="gap-1.5 bg-[#181818] hover:bg-black text-white dark:bg-[#FAF8F5] dark:text-[#181818] dark:hover:bg-white text-xs font-semibold px-4 py-1.5 shadow-sm rounded-full transition-transform active:scale-95"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
                  <span>Buka Cockpit</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  size="pill"
                  variant="default"
                  className="gap-1.5 bg-[#181818] hover:bg-black text-white dark:bg-[#FAF8F5] dark:text-[#181818] dark:hover:bg-white text-xs font-semibold px-4 py-1.5 shadow-sm rounded-full transition-transform active:scale-95"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Portal Petugas</span>
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full border border-[#DCD6CA] text-[#141824] dark:border-[#1E2638] dark:text-[#F8FAFC] hover:bg-[#FAF8F5] dark:hover:bg-slate-800 transition-colors"
              aria-label="Buka Menu Mobile"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E0D8] bg-[#FAF8F5] dark:border-[#1E2638] dark:bg-[#080C14] px-4 py-3 space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-[#141824] dark:text-[#F8FAFC] hover:bg-[#EFEAE2] dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cockpit Realtime</span>
            </Link>
            <a
              href="#mitra-institusional"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg text-xs text-[#645E54] dark:text-[#94A3B8] hover:bg-[#EFEAE2] dark:hover:bg-slate-800"
            >
              Mitra & Standar Otoritatif
            </a>
            <a
              href="#arsitektur-sistem"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg text-xs text-[#645E54] dark:text-[#94A3B8] hover:bg-[#EFEAE2] dark:hover:bg-slate-800"
            >
              Arsitektur DLNM & PostGIS
            </a>
            <a
              href="#kemendagri-catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg text-xs text-[#645E54] dark:text-[#94A3B8] hover:bg-[#EFEAE2] dark:hover:bg-slate-800"
            >
              Direktori 16 Kecamatan
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full mt-2 rounded-full bg-[#181818] py-2 text-xs font-semibold text-white dark:bg-[#FAF8F5] dark:text-[#181818]"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Portal Masuk Petugas</span>
            </Link>
          </div>
        )}
      </header>

      {/* Global Command Palette Dialog Modal */}
      <CommandMenu
        open={commandMenuOpen}
        onOpenChange={setCommandMenuOpen}
        onSelectDistrict={onSelectDistrict}
      />
    </>
  );
};
