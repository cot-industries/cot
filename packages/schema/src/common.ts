import { z } from "zod";

/**
 * Common identifiers and metadata schemas
 */

export const IdSchema = z.string().uuid();

export const TimestampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TenantSchema = z.object({
  id: IdSchema,
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Tenant = z.infer<typeof TenantSchema>;
