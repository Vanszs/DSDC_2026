import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgres://vanszs:postgres@localhost:5432/ecohealth_db";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const client =
  globalForDb.conn ??
  postgres(connectionString, {
    max: process.env.DB_MAX_CONNECTIONS
      ? parseInt(process.env.DB_MAX_CONNECTIONS, 10)
      : process.env.NODE_ENV === "production"
      ? 10
      : 10,
    idle_timeout: 20,
    connect_timeout: 15,
    ssl: connectionString.includes("neon.tech") || connectionString.includes("sslmode=require") ? "require" : undefined,
    prepare: false, // Disables prepared statements for Neon transaction pooler compatibility
  });

globalForDb.conn = client;

export const db = drizzle(client, { schema });
export { client };
