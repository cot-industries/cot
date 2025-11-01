import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

/**
 * Relationships table
 * Defines relationships between entities
 */
export const relationships = pgTable("relationships", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // one-to-one, one-to-many, many-to-many
  fromEntity: text("from_entity").notNull(),
  toEntity: text("to_entity").notNull(),
  foreignKey: text("foreign_key"),
  throughTable: text("through_table"),
  cascadeDelete: boolean("cascade_delete").default(false).notNull(),
  inverseName: text("inverse_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Relationship = typeof relationships.$inferSelect;
export type NewRelationship = typeof relationships.$inferInsert;
