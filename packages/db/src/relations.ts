import { relations } from "drizzle-orm";
import { entities, fields, tenants } from "./schema";

/**
 * Define relations for Drizzle ORM query builder
 */

export const tenantsRelations = relations(tenants, ({ many }) => ({
  entities: many(entities),
}));

export const entitiesRelations = relations(entities, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [entities.tenantId],
    references: [tenants.id],
  }),
  fields: many(fields),
}));

export const fieldsRelations = relations(fields, ({ one }) => ({
  entity: one(entities, {
    fields: [fields.entityId],
    references: [entities.id],
  }),
}));
