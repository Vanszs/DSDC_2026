import { pgTable, serial, varchar, real, integer, timestamp, date, boolean, text, index, uniqueIndex, customType } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const geometryPoint = customType<{ data: { lat: number; lng: number }; driverData: string }>({
  dataType() {
    return "geometry(Point, 4326)";
  },
  toDriver(value: { lat: number; lng: number }): string {
    return `SRID=4326;POINT(${value.lng} ${value.lat})`;
  },
  fromDriver(value: string): { lat: number; lng: number } {
    if (!value) return { lat: 0, lng: 0 };
    
    // Format A: WKT String "POINT(110.4208 -6.9825)" or "SRID=4326;POINT(...)"
    const wktMatch = value.match(/POINT\s*\(\s*([-+]?[0-9]*\.?[0-9]+)\s+([-+]?[0-9]*\.?[0-9]+)\s*\)/i);
    if (wktMatch) {
      return { lng: parseFloat(wktMatch[1]), lat: parseFloat(wktMatch[2]) };
    }

    // Format B: PostGIS Hex EWKB (e.g. 0101000020E6100000...)
    if (typeof value === "string" && /^[0-9a-fA-F]+$/.test(value) && value.length >= 42) {
      try {
        const buf = Buffer.from(value, "hex");
        const isLittleEndian = buf.readUInt8(0) === 1;
        const type = isLittleEndian ? buf.readUInt32LE(1) : buf.readUInt32BE(1);
        const hasSrid = (type & 0x20000000) !== 0;
        const offset = hasSrid ? 9 : 5;
        const lng = isLittleEndian ? buf.readDoubleLE(offset) : buf.readDoubleBE(offset);
        const lat = isLittleEndian ? buf.readDoubleLE(offset + 8) : buf.readDoubleBE(offset + 8);
        return { lat, lng };
      } catch {
        return { lat: 0, lng: 0 };
      }
    }

    return { lat: 0, lng: 0 };
  },
});

export const districts = pgTable(
  "districts",
  {
    id: serial("id").primaryKey(),
    kemendagriCode: varchar("kemendagri_code", { length: 10 }).notNull().unique(),
    name: varchar("name", { length: 64 }).notNull(),
    typology: varchar("typology", { length: 32 }).notNull(),
    isCoastalRobRisk: boolean("is_coastal_rob_risk").notNull().default(false),
    population: integer("population").notNull(),
    areaKm2: real("area_km2").notNull(),
    elevationMeters: real("elevation_meters").notNull().default(10),
    sanitationIndex: real("sanitation_index").notNull().default(0.75),
    centroid: geometryPoint("centroid").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    centroidGistIdx: index("districts_centroid_gist_idx").using("gist", table.centroid),
  })
);

export const weatherObservations = pgTable(
  "weather_observations",
  {
    id: serial("id").primaryKey(),
    districtId: integer("district_id").notNull().references(() => districts.id, { onDelete: "cascade" }),
    observationDate: date("observation_date").notNull(),
    temperatureAvg: real("temperature_avg").notNull(),
    temperatureMin: real("temperature_min").notNull(),
    temperatureMax: real("temperature_max").notNull(),
    humidityAvg: real("humidity_avg").notNull(),
    rainfallMm: real("rainfall_mm").notNull(),
    windSpeedKmh: real("wind_speed_kmh").notNull(),
    pm25: real("pm25").notNull().default(35.0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    districtDateUniqueIdx: uniqueIndex("weather_district_date_unique_idx").on(table.districtId, table.observationDate),
  })
);

export const epidemiologicalRiskScores = pgTable(
  "epidemiological_risk_scores",
  {
    id: serial("id").primaryKey(),
    districtId: integer("district_id").notNull().references(() => districts.id, { onDelete: "cascade" }),
    scoreDate: date("score_date").notNull(),
    dengueRiskScore: real("dengue_risk_score").notNull(),
    ispaRiskScore: real("ispa_risk_score").notNull(),
    compositeVulnerabilityScore: real("composite_vulnerability_score").notNull(),
    primaryRiskFactor: varchar("primary_risk_factor", { length: 128 }).notNull(),
    actionablePolicyRecommendation: text("actionable_policy_recommendation").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    scoreDistrictDateUniqueIdx: uniqueIndex("score_district_date_unique_idx").on(table.districtId, table.scoreDate),
  })
);

export const districtsRelations = relations(districts, ({ many }) => ({
  weatherObservations: many(weatherObservations),
  epidemiologicalRiskScores: many(epidemiologicalRiskScores),
}));

export const weatherObservationsRelations = relations(weatherObservations, ({ one }) => ({
  district: one(districts, {
    fields: [weatherObservations.districtId],
    references: [districts.id],
  }),
}));

export const epidemiologicalRiskScoresRelations = relations(epidemiologicalRiskScores, ({ one }) => ({
  district: one(districts, {
    fields: [epidemiologicalRiskScores.districtId],
    references: [districts.id],
  }),
}));
