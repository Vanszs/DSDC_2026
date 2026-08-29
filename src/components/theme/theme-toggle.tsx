"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme, type Theme } from "./theme-provider";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
  className?: string;
  variant?: "segmented" | "button" | "dropdown";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = "segmented",
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0B0F19] dark:text-slate-300 dark:hover:bg-slate-800 active-press transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500",
          className
        )}
        title={`Ubah Tema (Saat ini: ${theme === "system" ? "Sistem (" + resolvedTheme + ")" : theme})`}
        aria-label="Ubah Tema Tampilan"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-4 w-4 text-emerald-400" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </button>
    );
  }

  if (variant === "dropdown") {
    const options: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { value: "light", label: "Terang", icon: Sun },
      { value: "dark", label: "Gelap", icon: Moon },
      { value: "system", label: "Sistem", icon: Laptop },
    ];

    return (
      <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0B0F19] dark:text-slate-300 dark:hover:bg-slate-800 active-press focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          title="Pengaturan Tema Tampilan"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500" />
          )}
          <span className="hidden sm:inline capitalize font-mono text-[11px]">
            {theme === "system" ? "Sistem" : theme === "dark" ? "Gelap" : "Terang"}
          </span>
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 z-50 mt-1.5 w-36 origin-top-right rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-[#0B0F19] focus:outline-none"
            role="menu"
            aria-orientation="vertical"
          >
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    isSelected
                      ? "bg-slate-100 font-semibold text-emerald-600 dark:bg-slate-800 dark:text-emerald-400"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#080C14]"
                  )}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Segmented control (default)
  return (
    <div
      role="radiogroup"
      aria-label="Pilihan Tema Tampilan"
      className={cn(
        "inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-[#080C14]",
        className
      )}
    >
      <button
        role="radio"
        aria-checked={theme === "light"}
        onClick={() => setTheme("light")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all active-press",
          theme === "light"
            ? "bg-white text-amber-600 shadow-sm dark:bg-slate-800 dark:text-amber-400 font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        )}
        title="Tema Terang"
        aria-label="Tema Terang"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>

      <button
        role="radio"
        aria-checked={theme === "dark"}
        onClick={() => setTheme("dark")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all active-press",
          theme === "dark"
            ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-emerald-400 font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        )}
        title="Tema Gelap"
        aria-label="Tema Gelap"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>

      <button
        role="radio"
        aria-checked={theme === "system"}
        onClick={() => setTheme("system")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all active-press",
          theme === "system"
            ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-emerald-400 font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        )}
        title="Ikuti Tema Sistem"
        aria-label="Ikuti Tema Sistem"
      >
        <Laptop className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
