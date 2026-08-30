"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export function LiveClockBadge() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(format(now, "yyyy/MM/dd HH:mm:ss"));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-[#080C14] select-none">
      <Link
        href="/"
        title="Kembali ke Beranda"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0B0F19] dark:text-slate-300 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 dark:border-slate-800 dark:bg-[#0B0F19] shrink-0">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
          Sentry
        </span>
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
          (33.74)
        </span>
      </div>

      <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-[#0B0F19] dark:text-slate-200 tabular-nums shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="font-semibold">{timeStr || "----/--/-- --:--:--"}</span>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">WIB</span>
      </div>
    </div>
  );
}
