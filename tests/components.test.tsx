// @vitest-environment happy-dom
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { VulnerabilityTable } from "@/components/dashboard/vulnerability-table";
import { DiseaseBreakdown } from "@/components/dashboard/disease-breakdown";
import { DistrictSummaryDTO } from "@/lib/queries";
import { Activity } from "lucide-react";

const mockDistricts: DistrictSummaryDTO[] = [
  {
    id: 1,
    kemendagriCode: "33.74.01",
    name: "Semarang Tengah",
    typology: "Urban Dense",
    isCoastalRob: true,
    population: 65000,
    elevationMeters: 10,
    lat: -6.9825,
    lng: 110.4208,
    compositeScore: 78,
    dengueRisk: 82,
    ispaRisk: 60,
    primaryFactor: "Kapasitas Termal Vektor Aedes",
    recommendation: "Fokus PSN 3M Plus dan Larvasidasi Masif",
    temperatureAvg: 28.5,
    rainfallMm: 120.4,
    pm25: 35.2,
  },
  {
    id: 2,
    kemendagriCode: "33.74.02",
    name: "Semarang Utara",
    typology: "Coastal Coastal",
    isCoastalRob: true,
    population: 120000,
    elevationMeters: 2,
    lat: -6.9634,
    lng: 110.4236,
    compositeScore: 50,
    dengueRisk: 40,
    ispaRisk: 42,
    primaryFactor: "Genangan Rob Presipitasi",
    recommendation: "Pembersihan Drainase dan Polder",
    temperatureAvg: 29.1,
    rainfallMm: 80.0,
    pm25: 22.0,
  },
  {
    id: 3,
    kemendagriCode: "33.74.03",
    name: "Gunungpati",
    typology: "Hilly Suburban",
    isCoastalRob: false,
    population: 85000,
    elevationMeters: 250,
    lat: -7.0850,
    lng: 110.3600,
    compositeScore: 30,
    dengueRisk: 25,
    ispaRisk: 30,
    primaryFactor: "Sirkulasi Udara & Kelembapan",
    recommendation: "Monitoring Rutin",
    temperatureAvg: 26.2,
    rainfallMm: 45.0,
    pm25: 15.0,
  },
];

describe("UI Primitive Components", () => {
  afterEach(() => {
    cleanup();
  });
  it("Button renders variants and sizes properly", () => {
    const { rerender } = render(<Button variant="destructive" size="sm">Hapus</Button>);
    const btn = screen.getByRole("button", { name: "Hapus" });
    expect(btn.className).toContain("bg-red-500");

    rerender(<Button variant="outline" size="lg">Outline</Button>);
    expect(screen.getByRole("button", { name: "Outline" }).className).toContain("border");
  });

  it("Badge renders different variant colors", () => {
    const { rerender } = render(<Badge variant="warning">Siaga</Badge>);
    expect(screen.getByText("Siaga").className).toContain("bg-amber-500");

    rerender(<Badge variant="success">Aman</Badge>);
    expect(screen.getByText("Aman").className).toContain("bg-emerald-600");
  });

  it("Card renders subcomponents cleanly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Judul Kartu</CardTitle>
          <CardDescription>Deskripsi Kartu</CardDescription>
        </CardHeader>
        <CardContent>Konten Utama</CardContent>
        <CardFooter>Footer Info</CardFooter>
      </Card>
    );

    expect(screen.getByText("Judul Kartu")).toBeTruthy();
    expect(screen.getByText("Deskripsi Kartu")).toBeTruthy();
    expect(screen.getByText("Konten Utama")).toBeTruthy();
    expect(screen.getByText("Footer Info")).toBeTruthy();
  });
});

describe("Dashboard Components", () => {
  afterEach(() => {
    cleanup();
  });
  it("MetricCard renders value, trend, and different color variants", () => {
    const { rerender } = render(
      <MetricCard
        title="Skor Rata-rata"
        value="75 / 100"
        description="Agregat Kota"
        trend={{ value: "+5%", positive: true }}
        icon={Activity}
        variant="danger"
      />
    );

    expect(screen.getByText("Skor Rata-rata")).toBeTruthy();
    expect(screen.getByText("75 / 100")).toBeTruthy();
    expect(screen.getByText("Agregat Kota")).toBeTruthy();
    expect(screen.getByText("+5%")).toBeTruthy();

    rerender(
      <MetricCard
        title="Status Wilayah"
        value="Aman"
        variant="success"
        badge="STATUS NOMINAL"
        trend={{ value: "-2%", positive: false }}
      />
    );
    expect(screen.getByText("Status Wilayah")).toBeTruthy();
    expect(screen.getByText("STATUS NOMINAL")).toBeTruthy();
    expect(screen.getByText("-2%")).toBeTruthy();
  });

  it("VulnerabilityTable lists all districts and triggers onSelectDistrict on click", () => {
    const handleSelect = vi.fn();
    render(
      <VulnerabilityTable
        districts={mockDistricts}
        selectedDistrictId={1}
        onSelectDistrict={handleSelect}
      />
    );

    expect(screen.getByText("Semarang Tengah")).toBeTruthy();
    expect(screen.getByText("Semarang Utara")).toBeTruthy();
    expect(screen.getByText("Gunungpati")).toBeTruthy();

    fireEvent.click(screen.getByText("Semarang Utara"));
    expect(handleSelect).toHaveBeenCalledWith(mockDistricts[1]);
  });

  it("VulnerabilityTable filters districts by search query and triage buttons", () => {
    render(<VulnerabilityTable districts={mockDistricts} />);

    // Filter by search query
    const searchInput = screen.getByPlaceholderText("Cari kecamatan, tipologi, aksi...");
    fireEvent.change(searchInput, { target: { value: "Gunungpati" } });
    expect(screen.getByText("Gunungpati")).toBeTruthy();
    expect(screen.queryByText("Semarang Tengah")).toBeNull();

    // Reset search
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Semarang Tengah")).toBeTruthy();

    // Triage filter: Critical EHV >= 70
    fireEvent.click(screen.getByText("Kritis EHV ≥ 70"));
    expect(screen.getByText("Semarang Tengah")).toBeTruthy();
    expect(screen.queryByText("Semarang Utara")).toBeNull();
    expect(screen.queryByText("Gunungpati")).toBeNull();

    // Triage filter: Rob Hazard
    fireEvent.click(screen.getByText("Pesisir / Rob"));
    expect(screen.getByText("Semarang Tengah")).toBeTruthy();
    expect(screen.getByText("Semarang Utara")).toBeTruthy();
    expect(screen.queryByText("Gunungpati")).toBeNull();
  });

  it("VulnerabilityTable displays empty state message when no data", () => {
    render(<VulnerabilityTable districts={[]} />);
    expect(
      screen.getByText("Tidak ada data analisis risiko kecamatan yang tersedia.")
    ).toBeTruthy();
  });

  it("DiseaseBreakdown renders placeholder when no district is selected", () => {
    render(<DiseaseBreakdown district={null} />);
    expect(screen.getByText("Pilih Kecamatan")).toBeTruthy();
  });

  it("DiseaseBreakdown renders full disease risk profile when district is provided", () => {
    render(<DiseaseBreakdown district={mockDistricts[0]} />);
    expect(screen.getByText("Semarang Tengah")).toBeTruthy();
    expect(screen.getByText("Skor Bahaya 78 / 100")).toBeTruthy();
    expect(screen.getByText("Demam Berdarah Dengue (DBD)")).toBeTruthy();
    expect(screen.getByText("Infeksi Saluran Pernapasan Akut (ISPA)")).toBeTruthy();
    expect(screen.getByText("28.5°C")).toBeTruthy();
    expect(screen.getByText("120.4 mm")).toBeTruthy();
    expect(screen.getByText("35.2 µg/m³")).toBeTruthy();
    expect(screen.getByText("Fokus PSN 3M Plus dan Larvasidasi Masif")).toBeTruthy();
  });
});
