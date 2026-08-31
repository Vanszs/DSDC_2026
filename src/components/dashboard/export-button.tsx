"use client";

import React, { useState, useCallback } from "react";
import {
  FileText,
  FileSpreadsheet,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ExportFormat = "pdf" | "excel";
export type ExportStage = "idle" | "connecting" | "streaming" | "finalizing" | "success" | "error";

export interface ExportButtonProps {
  className?: string;
  selectedDate?: string;
  onExportStart?: (format: ExportFormat) => void;
  onExportComplete?: (format: ExportFormat) => void;
  onExportError?: (format: ExportFormat, error: Error) => void;
}

interface ExportStatus {
  stage: ExportStage;
  message?: string;
  error?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  className,
  selectedDate,
  onExportStart,
  onExportComplete,
  onExportError,
}) => {
  const [pdfStatus, setPdfStatus] = useState<ExportStatus>({ stage: "idle" });
  const [excelStatus, setExcelStatus] = useState<ExportStatus>({ stage: "idle" });

  const isPdfBusy = pdfStatus.stage === "connecting" || pdfStatus.stage === "streaming" || pdfStatus.stage === "finalizing";
  const isExcelBusy = excelStatus.stage === "connecting" || excelStatus.stage === "streaming" || excelStatus.stage === "finalizing";

  // Trigger file download helper
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExportPdf = useCallback(async () => {
    if (isPdfBusy) return;

    const dateIso = selectedDate || new Date().toISOString().slice(0, 10);
    const filename = `Sentry_Executive_Brief_${dateIso}.pdf`;

    onExportStart?.("pdf");
    setPdfStatus({ stage: "connecting", message: "Menghubungkan..." });

    try {
      setPdfStatus({ stage: "streaming", message: "Mengunduh PDF..." });
      const queryParam = selectedDate ? `?date=${encodeURIComponent(selectedDate)}` : "";
      const res = await fetch(`/api/export/pdf${queryParam}`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: Gagal mengunduh dokumen PDF eksekutif`);
      }

      setPdfStatus({ stage: "finalizing", message: "Memverifikasi..." });
      const blob = await res.blob();
      triggerDownload(blob, filename);

      setPdfStatus({ stage: "success", message: "Berhasil" });
      onExportComplete?.("pdf");

      setTimeout(() => {
        setPdfStatus({ stage: "idle" });
      }, 2000);
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error("Gagal export PDF:", errorObj);
      setPdfStatus({
        stage: "error",
        error: errorObj.message,
        message: "Gagal Mengunduh",
      });
      onExportError?.("pdf", errorObj);

      setTimeout(() => {
        setPdfStatus({ stage: "idle" });
      }, 3500);
    }
  }, [isPdfBusy, selectedDate, onExportStart, onExportComplete, onExportError]);

  const handleExportExcel = useCallback(async () => {
    if (isExcelBusy) return;

    const dateIso = selectedDate || new Date().toISOString().slice(0, 10);
    const filename = `Sentry_Vulnerability_Matrix_${dateIso}.xlsx`;

    onExportStart?.("excel");
    setExcelStatus({ stage: "connecting", message: "Menghubungkan..." });

    try {
      setExcelStatus({ stage: "streaming", message: "Menyusun Excel..." });
      const queryParam = selectedDate ? `?date=${encodeURIComponent(selectedDate)}` : "";
      const res = await fetch(`/api/export/excel${queryParam}`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: Gagal mengunduh dataset Excel`);
      }

      setExcelStatus({ stage: "finalizing", message: "Menyelesaikan..." });
      const blob = await res.blob();
      triggerDownload(blob, filename);

      setExcelStatus({ stage: "success", message: "Berhasil" });
      onExportComplete?.("excel");

      setTimeout(() => {
        setExcelStatus({ stage: "idle" });
      }, 2000);
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error("Gagal export Excel:", errorObj);
      setExcelStatus({
        stage: "error",
        error: errorObj.message,
        message: "Gagal Mengunduh",
      });
      onExportError?.("excel", errorObj);

      setTimeout(() => {
        setExcelStatus({ stage: "idle" });
      }, 3500);
    }
  }, [isExcelBusy, selectedDate, onExportStart, onExportComplete, onExportError]);

  return (
    <div className={cn("inline-flex items-center gap-1 sm:gap-1.5", className)}>
      {/* PDF Export Button */}
      <button
        type="button"
        onClick={handleExportPdf}
        disabled={isPdfBusy}
        aria-label="Unduh PDF Brief Eksekutif Dinkes Kota Semarang"
        className={cn(
          "flex h-7 sm:h-8 items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 sm:px-2.5 text-[11px] sm:text-xs font-medium transition-all select-none",
          "hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0B0F19] dark:hover:border-slate-700 dark:hover:bg-slate-800",
          "active:scale-95 transition-transform shrink-0",
          pdfStatus.stage === "error" && "bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:border-red-900 dark:text-red-300",
          pdfStatus.stage === "success" && "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-300",
          isPdfBusy && "opacity-80 cursor-wait"
        )}
      >
        {isPdfBusy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-700 dark:text-slate-200 shrink-0" />
        ) : pdfStatus.stage === "success" ? (
          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <FileText className="h-3.5 w-3.5 text-red-600 dark:text-red-400 shrink-0" />
        )}
        <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
          {isPdfBusy ? (
            <>
              <span className="hidden sm:inline">{pdfStatus.message ?? "PDF..."}</span>
              <span className="inline sm:hidden">PDF...</span>
            </>
          ) : pdfStatus.stage === "success" ? (
            "Berhasil"
          ) : (
            <>
              <span className="hidden sm:inline">Unduh </span>PDF
            </>
          )}
        </span>
        <span className="hidden md:inline-flex items-center rounded-md bg-slate-200 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          .PDF
        </span>
      </button>

      {/* Excel Export Button */}
      <button
        type="button"
        onClick={handleExportExcel}
        disabled={isExcelBusy}
        aria-label="Unduh Dataset Excel 16 Kecamatan Kota Semarang"
        className={cn(
          "flex h-7 sm:h-8 items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 sm:px-2.5 text-[11px] sm:text-xs font-medium transition-all select-none",
          "hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0B0F19] dark:hover:border-slate-700 dark:hover:bg-slate-800",
          "active:scale-95 transition-transform shrink-0",
          excelStatus.stage === "error" && "bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:border-red-900 dark:text-red-300",
          excelStatus.stage === "success" && "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-300",
          isExcelBusy && "opacity-80 cursor-wait"
        )}
      >
        {isExcelBusy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-700 dark:text-slate-200 shrink-0" />
        ) : excelStatus.stage === "success" ? (
          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        )}
        <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
          {isExcelBusy ? (
            <>
              <span className="hidden sm:inline">{excelStatus.message ?? "Excel..."}</span>
              <span className="inline sm:hidden">Excel...</span>
            </>
          ) : excelStatus.stage === "success" ? (
            "Berhasil"
          ) : (
            <>
              <span className="hidden sm:inline">Unduh </span>Excel
            </>
          )}
        </span>
        <span className="hidden md:inline-flex items-center rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          .XLSX
        </span>
      </button>
    </div>
  );
};
