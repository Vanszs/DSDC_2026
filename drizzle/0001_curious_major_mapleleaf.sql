ALTER TABLE "epidemiological_risk_scores" DROP CONSTRAINT "epidemiological_risk_scores_district_id_districts_id_fk";
--> statement-breakpoint
ALTER TABLE "weather_observations" DROP CONSTRAINT "weather_observations_district_id_districts_id_fk";
--> statement-breakpoint
DROP INDEX "risk_district_date_idx";--> statement-breakpoint
DROP INDEX "weather_district_date_idx";--> statement-breakpoint
ALTER TABLE "epidemiological_risk_scores" ALTER COLUMN "primary_risk_factor" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "epidemiological_risk_scores" ADD CONSTRAINT "epidemiological_risk_scores_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_observations" ADD CONSTRAINT "weather_observations_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "districts_centroid_gist_idx" ON "districts" USING gist ("centroid");--> statement-breakpoint
CREATE UNIQUE INDEX "score_district_date_unique_idx" ON "epidemiological_risk_scores" USING btree ("district_id","score_date");--> statement-breakpoint
CREATE UNIQUE INDEX "weather_district_date_unique_idx" ON "weather_observations" USING btree ("district_id","observation_date");--> statement-breakpoint
ALTER TABLE "epidemiological_risk_scores" DROP COLUMN "leptospirosis_risk_score";