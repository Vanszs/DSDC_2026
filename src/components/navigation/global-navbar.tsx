"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut,
  ChevronDown,
  ArrowUpRight,
  BarChart3,
  ShieldCheck,
  Layers,
  MapPin,
  LogIn,
  User as UserIcon,
  Check,
  Activity,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";
import { cn } from "@/lib/utils";

export interface GlobalNavbarProps {
  className?: string;
  selectedDistrictName?: string;
  onSelectDistrict?: (name: string) => void;
  showBreadcrumb?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "beranda",
    label: "Beranda",
    icon: Home,
    href: "/#main-content",
  },
  {
    id: "tentang",
    label: "Tentang Platform",
    icon: ShieldCheck,
    href: "/#tentang-sentry",
  },
  {
    id: "tantangan",
    label: "Tantangan",
    icon: Activity,
    href: "/#tantangan",
  },
  {
    id: "alur-kerja",
    label: "Alur Kerja Sistem",
    icon: Layers,
    href: "/#alur-kerja",
  },
];

export function NotchLeftWing({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      shapeRendering="geometricPrecision"
      className={cn(
        "pointer-events-none absolute right-full size-2.5 md:size-4 overflow-visible select-none text-background transition-colors duration-200 top-0",
        className
      )}
    >
      <path
        d="M 0 0 C 11.046 0 20 8.954 20 20 H 21 V -1 H 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NotchRightWing({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      shapeRendering="geometricPrecision"
      className={cn(
        "pointer-events-none absolute left-full size-2.5 md:size-4 overflow-visible select-none text-background transition-colors duration-200 top-0",
        className
      )}
    >
      <path
        d="M 20 0 C 8.954 0 0 8.954 0 20 H -1 V -1 H 20 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NotchDropdownItem({
  item,
  isSelected,
  onSelect,
}: {
  item: NavItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={() => onSelect(item.id)}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left text-sm outline-none transition-colors select-none",
        "focus-visible:ring-2 focus-visible:ring-accent",
        isSelected
          ? "bg-border/80 font-semibold text-foreground dark:bg-border"
          : "text-text-secondary hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-2.5">
        {Icon && (
          <Icon
            className={cn(
              "size-4 shrink-0",
              isSelected
                ? "text-foreground"
                : "text-text-secondary"
            )}
          />
        )}
        <span>{item.label}</span>
      </div>

      {isSelected && (
        <Check className="size-3.5 text-foreground" />
      )}
    </Link>
  );
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  className,
}) => {
  let pathname = "/";
  try {
    pathname = usePathname() || "/";
  } catch {
    pathname = "/";
  }

  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notchContainerRef = useRef<HTMLDivElement>(null);
  const savedScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) return;
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      savedScrollY.current = window.scrollY;
      const currentY = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${currentY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const topY = savedScrollY.current;
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (topY) {
        window.scrollTo({ top: topY, behavior: "instant" });
        setIsScrolled(topY > 30);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const isLoginRoute = pathname === "/login";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  const activeItem = useMemo(() => {
    if (isDashboardRoute) return NAV_ITEMS[0];
    const matched = NAV_ITEMS.find((item) => item.href === pathname);
    return matched || NAV_ITEMS[0];
  }, [pathname, isDashboardRoute]);

  return (
    <>
      {/* 1. TOP-ATTACHED NOTCH ISLAND (ALWAYS PRESENT AT Z-50) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 origin-top pointer-events-none">
        <div
          className={cn(
            "pointer-events-auto transition-all duration-300",
            !isScrolled && !mobileMenuOpen ? "xl:hidden" : "block"
          )}
        >
          <div
            ref={notchContainerRef}
            className={cn(
              "relative flex flex-col select-none transition-all duration-300",
              "bg-background text-foreground",
              mobileMenuOpen
                ? "w-auto px-4 rounded-b-[24px] shadow-none border-transparent"
                : "w-auto px-4 rounded-b-[24px] shadow-lg border-b border-x border-border/60"
            )}
          >
            <NotchLeftWing />
            <NotchRightWing />

            {/* Unified Horizontal Bar (Clean Logo + Hamburger/X) */}
            <div className="w-auto flex h-12 sm:h-13 items-center justify-between gap-4 sm:gap-6 px-1">
              {/* Left Logo Slot */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex shrink-0 items-center gap-2.5 text-inherit hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/logo.svg"
                  alt="Sentry Logo"
                  width={32}
                  height={36}
                  priority
                  className="h-7 sm:h-8 w-auto object-contain"
                />
                <span className="text-base sm:text-lg font-bold tracking-tight">
                  Sentry
                </span>
              </Link>

              {/* Subtle Divider */}
              <div className="h-4 w-px bg-border" />

              {/* Right Hamburger/X Icon Trigger */}
              <button
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-haspopup="listbox"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-foreground transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-accent flex items-center justify-center bg-transparent border-0 cursor-pointer"
              >
                <div className="w-4.5 h-4.5 flex flex-col justify-center items-center gap-[4.5px]">
                  <span
                    className={cn(
                      "block h-[1.5px] w-4 bg-current rounded-full transition-all duration-300 origin-center",
                      mobileMenuOpen ? "rotate-45 translate-y-[3px]" : ""
                    )}
                  />
                  <span
                    className={cn(
                      "block h-[1.5px] w-4 bg-current rounded-full transition-all duration-300 origin-center",
                      mobileMenuOpen ? "-rotate-45 -translate-y-[3px]" : ""
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FULLSCREEN 1-SCREEN MENU OVERLAY WITH WIPE-DOWN ANIMATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              "fixed inset-0 z-40 min-h-dvh w-full",
              "bg-background text-foreground",
              "flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24",
              "overflow-y-auto"
            )}
          >
            {/* Main Content: Centered (<1280px) and Right-Anchored (>=1280px) Swiss Menu */}
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full my-auto flex flex-col items-center xl:items-end"
            >
              <div className="text-xs font-bold tracking-[0.25em] text-text-secondary uppercase mb-6 sm:mb-8 text-center xl:text-right">
                ( NAVIGASI UTAMA )
              </div>

              <nav
                aria-label="Navigasi Menu Layar Penuh"
                className="w-full flex flex-col space-y-2 sm:space-y-3 lg:space-y-4"
              >
                {NAV_ITEMS.map((item, index) => {
                  const isSelected = item.href === pathname;
                  const number = String(index + 1).padStart(2, "0");
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-baseline justify-center xl:justify-end gap-3 sm:gap-5 lg:gap-6 py-1.5 sm:py-2 transition-colors"
                    >
                      <ArrowUpRight className="size-5 sm:size-7 md:size-8 text-text-secondary group-hover:text-foreground opacity-40 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all shrink-0" />
                      <span
                        className={cn(
                          "text-2xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[60px] font-medium tracking-tight transition-all group-hover:-translate-x-1 text-center xl:text-right",
                          isSelected
                            ? "text-foreground font-semibold"
                            : "text-foreground/80 group-hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-xs sm:text-sm md:text-base font-semibold text-text-secondary group-hover:text-foreground transition-colors shrink-0 -translate-y-2 sm:-translate-y-3">
                        {number}
                      </span>
                    </a>
                  );
                })}
              </nav>
            </motion.div>

            {/* Bottom Action Area */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="text-xs text-text-secondary text-center sm:text-left">
                Sentry • Early Warning Platform for Climate-Driven Epidemics
              </div>

              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary">
                    Login: <strong className="text-foreground">{user.name}</strong>
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-danger bg-danger/10 hover:bg-danger/20 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary hover:bg-black dark:hover:bg-white/90 text-background text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <span>Mulai Analisa</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. DESKTOP-ONLY (1280px+) INITIAL TOP STATE: Full Width Navbar */}
      <motion.div
        animate={{
          opacity: isScrolled ? 0 : 1,
          y: isScrolled ? -10 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "hidden xl:block sticky top-0 z-40 w-full bg-transparent",
          isScrolled ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        <SectionContainer
          as="header"
          role="banner"
          spacing="none"
          size="full"
          gutter="spacious"
          className={className}
          containerClassName="flex items-center justify-between py-4"
        >
          {/* Left: Hanya Logo & Text */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
          >
            <Image
              src="/logo.svg"
              alt="Sentry Logo"
              width={48}
              height={54}
              priority
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <span className="text-2xl sm:text-[28px] font-bold tracking-tight text-foreground">
              Sentry
            </span>
          </Link>

          {/* Right: Text Menu & Login Button */}
          <div className="flex items-center gap-6 lg:gap-8">
            <nav
              aria-label="Navigasi Menu Utama"
              className="flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-medium text-text-secondary"
            >
              <a
                href="/#main-content"
                className="hover:text-foreground transition-colors"
              >
                Beranda
              </a>
              <a
                href="/#tentang-sentry"
                className="hover:text-foreground transition-colors"
              >
                Tentang
              </a>
              <a
                href="/#tantangan"
                className="hover:text-foreground transition-colors"
              >
                Tantangan
              </a>
              <a
                href="/#alur-kerja"
                className="hover:text-foreground transition-colors"
              >
                Alur Kerja
              </a>
            </nav>

            {/* User Session / Login Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-left shadow-xs"
                  title={`${user.name} (${user.role})`}
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-background uppercase">
                    {user.name.slice(0, 1)}
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                    {user.name.split(",")[0]}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="rounded-xl border border-border p-1.5 text-text-secondary hover:bg-danger/10 hover:text-danger hover:border-danger/30 active-press transition-colors shadow-xs"
                  title="Keluar dari Sesi Petugas"
                  aria-label="Keluar dari Sesi Petugas"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  size="default"
                  variant="default"
                  className="bg-primary hover:bg-black dark:hover:bg-white/90 text-background text-xs sm:text-sm font-semibold px-5 py-2 shadow-xs rounded-xl transition-transform active:scale-95"
                >
                  Mulai Analisa
                </Button>
              </Link>
            )}
          </div>
        </SectionContainer>
      </motion.div>
    </>
  );
};
