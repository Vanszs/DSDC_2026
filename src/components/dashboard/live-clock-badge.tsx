"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiveClockBadgeProps {
  className?: string;
}

export function LiveClockBadge({ className }: LiveClockBadgeProps) {
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setDateTime({
        date: format(now, "yyyy/MM/dd"),
        time: format(now, "HH:mm:ss"),
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 bg-white/95 p-1 sm:p-1.5 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-[#080C14]/95 select-none",
        className
      )}
    >
      <Link
        href="/"
        title="Kembali ke Beranda"
        aria-label="Kembali ke Beranda"
        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0B0F19] dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Link>

      <div className="hidden sm:flex h-7 sm:h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 sm:px-2.5 dark:border-slate-800 dark:bg-[#0B0F19] shrink-0">
        <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
          Sentry
        </span>
        <span className="hidden md:inline text-[10px] font-mono text-slate-400 dark:text-slate-500">
          (33.74)
        </span>
      </div>

      <div className="flex h-7 sm:h-8 items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 sm:px-2.5 font-mono text-[11px] sm:text-xs text-slate-800 dark:border-slate-800 dark:bg-[#0B0F19] dark:text-slate-200 tabular-nums shrink-0">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="font-semibold whitespace-nowrap">
          {dateTime.time ? (
            <>
              <span className="hidden md:inline">{dateTime.date} </span>
              <span>{dateTime.time}</span>
            </>
          ) : (
            "----/--/-- --:--:--"
          )}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          WIB
        </span>
      </div>
    </div>
  );
}
