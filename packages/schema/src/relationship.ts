import { z } from "zod";
import { IdSchema } from "./common";

/**
 * Relationship definitions between entities
 */

export const RelationshipTypeEnum = z.enum(["one-to-one", "one-to-many", "many-to-many"]);

export type RelationshipType = z.infer<typeof RelationshipTypeEnum>;

export const RelationshipSchema = z.object({
  id: IdSchema.optional(),
  name: z.string().regex(/^[a-z_][a-z0-9_]*$/),
  type: RelationshipTypeEnum,
  fromEntity: z.string(),
  toEntity: z.string(),
  foreignKey: z.string().optional(), // For one-to-many
  throughTable: z.string().optional(), // For many-to-many
  cascadeDelete: z.boolean().default(false),
  inverseName: z.string().optional(), // Name for accessing from other side
  tenantId: IdSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Relationship = z.infer<typeof RelationshipSchema>;

export const CreateRelationshipInputSchema = RelationshipSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateRelationshipInput = z.infer<typeof CreateRelationshipInputSchema>;
