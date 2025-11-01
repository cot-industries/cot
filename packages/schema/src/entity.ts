import { z } from "zod";
import { IdSchema, TimestampsSchema } from "./common";
import { FieldSchema } from "./field";

/**
 * Entity definition schema
 * This represents a business object (like Customer, Project, Invoice)
 */

export const EntityDefinitionSchema = z.object({
  id: IdSchema.optional(),
  name: z
    .string()
    .regex(/^[a-z_][a-z0-9_]*$/, "Entity name must be lowercase with underscores")
    .min(1)
    .max(63), // Postgres table name limit
  label: z.string().min(1),
  pluralLabel: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  fields: z.array(FieldSchema).min(1),
  timestamps: z.boolean().default(true),
  softDelete: z.boolean().default(false),
  tenantId: IdSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type EntityDefinition = z.infer<typeof EntityDefinitionSchema>;

/**
 * Entity creation input (what developers provide)
 */
export const CreateEntityInputSchema = EntityDefinitionSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateEntityInput = z.infer<typeof CreateEntityInputSchema>;

/**
 * Entity update input
 */
export const UpdateEntityInputSchema = CreateEntityInputSchema.partial();

export type UpdateEntityInput = z.infer<typeof UpdateEntityInputSchema>;
