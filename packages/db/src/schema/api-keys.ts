import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

/**
 * API Keys table
 * For external programmatic access to Cot API
 */
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // User-friendly name like "Production API Key"
  hashedKey: text("hashed_key").notNull().unique(),
  prefix: text("prefix").notNull(), // First 8 chars for identification (e.g., "cot_1234...")
  lastUsedAt: timestamp("last_used_at"),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
