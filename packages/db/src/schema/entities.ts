import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

/**
 * Entity definitions table
 * Stores the meta-data for all custom entities (Customer, Project, etc.)
 */
export const entities = pgTable("entities", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  label: text("label").notNull(),
  pluralLabel: text("plural_label"),
  description: text("description"),
  icon: text("icon"),
  timestamps: boolean("timestamps").default(true).notNull(),
  softDelete: boolean("soft_delete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Entity = typeof entities.$inferSelect;
export type NewEntity = typeof entities.$inferInsert;
