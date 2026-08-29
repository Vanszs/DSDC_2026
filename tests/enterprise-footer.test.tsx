// @vitest-environment happy-dom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EnterpriseFooter } from "@/components/layout/enterprise-footer";
import { RegulatorySpecsModal } from "@/components/layout/regulatory-specs-modal";
import {
  REGULATORY_CREDENTIALS,
  KEMENDAGRI_33_74_DISTRICTS,
} from "@/lib/regulatory-specs";

describe("Regulatory Master Data & Specs Library (src/lib/regulatory-specs.ts)", () => {
  it("contains all 16 official Kemendagri 33.74 districts", () => {
    expect(KEMENDAGRI_33_74_DISTRICTS.length).toBe(16);
    expect(KEMENDAGRI_33_74_DISTRICTS[0].code).toBe("33.74.01");
    expect(KEMENDAGRI_33_74_DISTRICTS[0].name).toBe("Semarang Tengah");
    expect(KEMENDAGRI_33_74_DISTRICTS[15].code).toBe("33.74.16");
    expect(KEMENDAGRI_33_74_DISTRICTS[15].name).toBe("Tugu");
  });

  it("contains valid OpenAPI and PostGIS regulatory credentials without em-dashes", () => {
    expect(REGULATORY_CREDENTIALS.jurisdiction.kemendagriCode).toBe("33.74");
    expect(REGULATORY_CREDENTIALS.certification.registryId).toBe("DSDC-SMG-2026-CERT-V3");
    expect(REGULATORY_CREDENTIALS.openApiEndpoints.length).toBe(4);

    // Verify zero em-dashes in JSON serialization
    const serialized = JSON.stringify(REGULATORY_CREDENTIALS);
    expect(serialized.includes("—")).toBe(false);
    expect(serialized.includes("–")).toBe(false);
  });
});

describe("EnterpriseFooter Component (src/components/layout/enterprise-footer.tsx)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Kemendagri 33.74, DSDC 2026 certification badges and legal baselines", () => {
    const { container } = render(<EnterpriseFooter />);

    expect(screen.getByText("DSDC 2026 CERTIFIED")).toBeTruthy();
    expect(screen.getByText(/Reg No: DSDC-SMG-2026-CERT-V3/i)).toBeTruthy();
    expect(screen.getAllByText(/33.74 \(Kota Semarang\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Satu Data Indonesia/i)).toBeTruthy();
    expect(screen.getByText(/UU Pelindungan Data Pribadi/i)).toBeTruthy();
    expect(screen.getByText("Dinas Kesehatan Kota Semarang")).toBeTruthy();
    expect(screen.getByText("Bappeda Kota Semarang")).toBeTruthy();
    expect(screen.getByText("BMKG Stasiun Klimatologi Semarang")).toBeTruthy();

    // Verify zero em-dashes in rendered text content
    const textContent = container.textContent || "";
    expect(textContent.includes("—")).toBe(false);
    expect(textContent.includes("–")).toBe(false);
  });

  it("opens RegulatorySpecsModal when clicking OpenAPI, PostGIS, or Master 33.74 buttons", () => {
    render(<EnterpriseFooter />);

    // Initially modal is closed
    expect(screen.queryByRole("dialog")).toBeNull();

    // Click on OpenAPI 3.1 Spec button
    const openApiButtons = screen.getAllByRole("button", { name: /OpenAPI 3.1 Spec/i });
    fireEvent.click(openApiButtons[0]);

    // Modal dialog is open
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Spesifikasi Teknis & Kredensial Regulasi")).toBeTruthy();
    expect(screen.getByText("OpenAPI 3.1.0 Contract Definition")).toBeTruthy();
  });
});

describe("RegulatorySpecsModal Component (src/components/layout/regulatory-specs-modal.tsx)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <RegulatorySpecsModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all 4 tabs and allows switching between specifications", () => {
    const handleClose = vi.fn();
    render(<RegulatorySpecsModal isOpen={true} onClose={handleClose} defaultTab="openapi" />);

    expect(screen.getByText("OpenAPI 3.1.0 Contract Definition")).toBeTruthy();

    // Switch to PostGIS tab
    fireEvent.click(screen.getByRole("button", { name: /PostGIS 3.4 & MVT/i }));
    expect(screen.getByText("PostGIS 3.4 Spatial Database & Vector Tiles Architecture")).toBeTruthy();
    expect(screen.getByText("EPSG:4326 (WGS84 2D Geographic)")).toBeTruthy();
    expect(screen.getByText("EPSG:3857 (Spherical Mercator Web Tile)")).toBeTruthy();

    // Switch to Kemendagri 33.74 Catalog tab
    fireEvent.click(screen.getByRole("button", { name: /Katalog Kemendagri 33.74/i }));
    expect(screen.getByText("Master Wilayah Kemendagri RI: 33.74 (Kota Semarang)")).toBeTruthy();
    expect(screen.getByText("Semarang Tengah")).toBeTruthy();
    expect(screen.getByText("Tugu")).toBeTruthy();

    // Switch to DSDC 2026 Certification tab
    fireEvent.click(screen.getByRole("button", { name: /Sertifikasi DSDC 2026/i }));
    expect(screen.getByText(/Sertifikasi Resmi DSDC 2026 No: DSDC-SMG-2026-CERT-V3/i)).toBeTruthy();
    expect(screen.getByText("DLNM 14-Day Distributed Lag Non-linear Model")).toBeTruthy();
  });

  it("handles copy to clipboard and closes on close button or ESC key", () => {
    const handleClose = vi.fn();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      configurable: true,
      writable: true,
    });

    render(<RegulatorySpecsModal isOpen={true} onClose={handleClose} defaultTab="openapi" />);

    // Test copy button
    const copyButton = screen.getByRole("button", { name: /Salin JSON Schema/i });
    fireEvent.click(copyButton);
    expect(writeTextMock).toHaveBeenCalled();

    // Test close button
    const closeButtons = screen.getAllByRole("button", { name: /Tutup/i });
    fireEvent.click(closeButtons[0]);
    expect(handleClose).toHaveBeenCalled();

    // Test Escape key
    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
