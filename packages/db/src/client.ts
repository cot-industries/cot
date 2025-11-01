import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Database client for Cot platform
 * Uses Neon serverless driver for optimal Vercel edge performance
 */

// Allow build to proceed without database connection
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
  console.warn("DATABASE_URL not set, using placeholder for build");
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

export type Database = typeof db;
