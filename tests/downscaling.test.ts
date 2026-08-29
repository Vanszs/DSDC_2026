import { describe, it, expect } from "vitest";
import {
  downscaleERA5SingleGridToDistrict,
  SEMARANG_PRIMARY_ERA5_GRID,
  TargetDistrictSpatial,
} from "../src/lib/downscaling";

describe("Spatio-Temporal Downscaling (1-Grid ERA5 Anchor: -7.0000, 110.4000)", () => {
  it("harus memvalidasi parameter koordinat acuan 1 grid tunggal ERA5 Semarang", () => {
    expect(SEMARANG_PRIMARY_ERA5_GRID.lat).toBe(-7.0);
    expect(SEMARANG_PRIMARY_ERA5_GRID.lng).toBe(110.4);
    expect(SEMARANG_PRIMARY_ERA5_GRID.geopotentialElevationM).toBe(65.0);
    expect(SEMARANG_PRIMARY_ERA5_GRID.temperatureC).toBe(28.6);
  });

  it("harus menghasilkan suhu lebih panas di pesisir (Genuk 2 mdpl) dan lebih sejuk di perbukitan (Gunungpati 220 mdpl)", () => {
    const genuk: TargetDistrictSpatial = {
      kemendagriCode: "33.74.05",
      name: "Genuk",
      centroid: { lat: -6.9631, lng: 110.4856 },
      elevationMeters: 2,
      isCoastalRobRisk: true,
    };

    const gunungpati: TargetDistrictSpatial = {
      kemendagriCode: "33.74.12",
      name: "Gunungpati",
      centroid: { lat: -7.0864, lng: 110.3664 },
      elevationMeters: 220,
      isCoastalRobRisk: false,
    };

    const climateGenuk = downscaleERA5SingleGridToDistrict(genuk, SEMARANG_PRIMARY_ERA5_GRID);
    const climateGunungpati = downscaleERA5SingleGridToDistrict(gunungpati, SEMARANG_PRIMARY_ERA5_GRID);

    // Genuk (2 mdpl < 65 mdpl): Suhu naik karena lapse rate
    expect(climateGenuk.temperatureAvg).toBeGreaterThan(SEMARANG_PRIMARY_ERA5_GRID.temperatureC);
    expect(climateGenuk.temperatureAvg).toBe(29.0);

    // Gunungpati (220 mdpl > 65 mdpl): Suhu turun karena lapse rate
    expect(climateGunungpati.temperatureAvg).toBeLessThan(SEMARANG_PRIMARY_ERA5_GRID.temperatureC);
    expect(climateGunungpati.temperatureAvg).toBe(27.6);

    // Selisih suhu tepat mencerminkan delta elevasi 218m -> ~1.4°C
    expect(climateGenuk.temperatureAvg - climateGunungpati.temperatureAvg).toBeCloseTo(1.4, 1);
  });

  it("harus menghasilkan curah hujan orografis lebih tinggi di lereng selatan (Banyumanik)", () => {
    const semarangTengah: TargetDistrictSpatial = {
      kemendagriCode: "33.74.01",
      name: "Semarang Tengah",
      centroid: { lat: -6.9825, lng: 110.4208 },
      elevationMeters: 12,
      isCoastalRobRisk: false,
    };

    const banyumanik: TargetDistrictSpatial = {
      kemendagriCode: "33.74.11",
      name: "Banyumanik",
      centroid: { lat: -7.0678, lng: 110.4139 },
      elevationMeters: 180,
      isCoastalRobRisk: false,
    };

    const climateTengah = downscaleERA5SingleGridToDistrict(semarangTengah, SEMARANG_PRIMARY_ERA5_GRID);
    const climateBanyumanik = downscaleERA5SingleGridToDistrict(banyumanik, SEMARANG_PRIMARY_ERA5_GRID);

    expect(climateBanyumanik.rainfallMm).toBeGreaterThan(climateTengah.rainfallMm);
  });
});
