CREATE TABLE "districts" (
	"id" serial PRIMARY KEY NOT NULL,
	"kemendagri_code" varchar(10) NOT NULL,
	"name" varchar(64) NOT NULL,
	"typology" varchar(32) NOT NULL,
	"is_coastal_rob_risk" boolean DEFAULT false NOT NULL,
	"population" integer NOT NULL,
	"area_km2" real NOT NULL,
	"elevation_meters" real DEFAULT 10 NOT NULL,
	"sanitation_index" real DEFAULT 0.75 NOT NULL,
	"centroid" geometry(Point, 4326) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "districts_kemendagri_code_unique" UNIQUE("kemendagri_code")
);
--> statement-breakpoint
CREATE TABLE "epidemiological_risk_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"district_id" integer NOT NULL,
	"score_date" date NOT NULL,
	"dengue_risk_score" real NOT NULL,
	"leptospirosis_risk_score" real NOT NULL,
	"ispa_risk_score" real NOT NULL,
	"composite_vulnerability_score" real NOT NULL,
	"primary_risk_factor" varchar(64) NOT NULL,
	"actionable_policy_recommendation" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weather_observations" (
	"id" serial PRIMARY KEY NOT NULL,
	"district_id" integer NOT NULL,
	"observation_date" date NOT NULL,
	"temperature_avg" real NOT NULL,
	"temperature_min" real NOT NULL,
	"temperature_max" real NOT NULL,
	"humidity_avg" real NOT NULL,
	"rainfall_mm" real NOT NULL,
	"wind_speed_kmh" real NOT NULL,
	"pm25" real DEFAULT 35 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "epidemiological_risk_scores" ADD CONSTRAINT "epidemiological_risk_scores_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_observations" ADD CONSTRAINT "weather_observations_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "risk_district_date_idx" ON "epidemiological_risk_scores" USING btree ("district_id","score_date");--> statement-breakpoint
CREATE INDEX "weather_district_date_idx" ON "weather_observations" USING btree ("district_id","observation_date");