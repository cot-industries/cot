import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { entities } from "./entities";

/**
 * Field definitions table
 * Stores all fields for each entity
 */
export const fields = pgTable("fields", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityId: uuid("entity_id")
    .notNull()
    .references(() => entities.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  label: text("label"),
  type: text("type").notNull(), // text, number, boolean, date, relation, etc.
  required: boolean("required").default(false).notNull(),
  unique: boolean("unique").default(false).notNull(),
  description: text("description"),
  config: jsonb("config"), // Type-specific configuration (min/max, options, etc.)
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Field = typeof fields.$inferSelect;
export type NewField = typeof fields.$inferInsert;
