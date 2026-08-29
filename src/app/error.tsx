"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-slate-50 text-slate-900 dark:bg-[#06090e] dark:text-slate-100 p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-8 max-w-md text-center shadow-lg dark:border-slate-800 dark:bg-[#0b111a] space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
            500 // TELEMETRY_PIPELINE_ERROR
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Terjadi kendala pada pemrosesan kernel analitik spasial atau koneksi pangkalan data.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Lagi
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-700">
              Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
