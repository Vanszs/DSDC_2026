import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 font-mono">404 // NOT_FOUND</h2>
        <p className="mt-2 text-xs text-slate-400 font-mono">
          Koordinat atau rute telemetri spasial tidak ditemukan dalam pangkalan data Sentry.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
        >
          Kembali ke Command Center
        </Link>
      </div>
    </div>
  );
}
