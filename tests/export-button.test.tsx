// @vitest-environment happy-dom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExportButton } from "@/components/dashboard/export-button";

describe("ExportButton Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("handles PDF export click and triggers file download", async () => {
    const mockBlob = new Blob(["%PDF-1.4 mock"], { type: "application/pdf" });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    } as any);

    window.URL.createObjectURL = vi.fn().mockReturnValue("blob:http://localhost/mock-pdf");
    window.URL.revokeObjectURL = vi.fn();

    render(<ExportButton />);
    const pdfBtn = screen.getByRole("button", { name: /Unduh PDF Brief/i });
    fireEvent.click(pdfBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/export/pdf");
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    });
  });

  it("handles Excel export click and triggers file download", async () => {
    const mockBlob = new Blob(["mock-xlsx-data"], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    } as any);

    window.URL.createObjectURL = vi.fn().mockReturnValue("blob:http://localhost/mock-excel");
    window.URL.revokeObjectURL = vi.fn();

    render(<ExportButton />);
    const excelBtn = screen.getByRole("button", { name: /Unduh Dataset Excel/i });
    fireEvent.click(excelBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/export/excel");
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    });
  });

  it("handles export error gracefully with error callbacks", async () => {
    const onExportError = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as any);

    render(<ExportButton onExportError={onExportError} />);
    const pdfBtn = screen.getByRole("button", { name: /Unduh PDF Brief/i });
    fireEvent.click(pdfBtn);

    await waitFor(() => {
      expect(onExportError).toHaveBeenCalled();
    });
  });
});
