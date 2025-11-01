import { z } from "zod";

/**
 * Field type definitions
 * These are the primitive types that can be used when defining entity fields
 */

export const FieldTypeEnum = z.enum([
  // Primitives
  "text",
  "number",
  "boolean",
  "date",
  "datetime",
  "time",

  // Rich types
  "email",
  "url",
  "phone",
  "currency",
  "json",

  // Relations
  "relation",

  // Files
  "file",
  "image",

  // Advanced
  "select",
  "multiselect",
  "computed",
]);

export type FieldType = z.infer<typeof FieldTypeEnum>;

/**
 * Base field configuration
 */
export const BaseFieldSchema = z.object({
  name: z.string().regex(/^[a-z_][a-z0-9_]*$/),
  label: z.string().optional(),
  type: FieldTypeEnum,
  required: z.boolean().default(false),
  unique: z.boolean().default(false),
  description: z.string().optional(),
});

/**
 * Text field
 */
export const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal("text"),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  defaultValue: z.string().optional(),
});

/**
 * Number field
 */
export const NumberFieldSchema = BaseFieldSchema.extend({
  type: z.literal("number"),
  min: z.number().optional(),
  max: z.number().optional(),
  decimals: z.number().optional(),
  defaultValue: z.number().optional(),
});

/**
 * Select field
 */
export const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal("select"),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  defaultValue: z.string().optional(),
});

/**
 * Relation field
 */
export const RelationFieldSchema = BaseFieldSchema.extend({
  type: z.literal("relation"),
  entity: z.string(),
  relationType: z.enum(["one-to-one", "one-to-many", "many-to-many"]),
  cascadeDelete: z.boolean().default(false),
});

/**
 * Currency field
 */
export const CurrencyFieldSchema = BaseFieldSchema.extend({
  type: z.literal("currency"),
  currency: z.string().default("USD"),
  defaultValue: z.number().optional(),
});

/**
 * Computed field
 */
export const ComputedFieldSchema = BaseFieldSchema.extend({
  type: z.literal("computed"),
  formula: z.string(), // Will support simple formulas like "SUM(line_items.amount)"
});

/**
 * Union of all field types
 */
export const FieldSchema = z.discriminatedUnion("type", [
  TextFieldSchema,
  NumberFieldSchema,
  SelectFieldSchema,
  RelationFieldSchema,
  CurrencyFieldSchema,
  ComputedFieldSchema,
  // Simple types without extra config
  BaseFieldSchema.extend({ type: z.literal("boolean") }),
  BaseFieldSchema.extend({ type: z.literal("date") }),
  BaseFieldSchema.extend({ type: z.literal("datetime") }),
  BaseFieldSchema.extend({ type: z.literal("email") }),
  BaseFieldSchema.extend({ type: z.literal("url") }),
  BaseFieldSchema.extend({ type: z.literal("phone") }),
  BaseFieldSchema.extend({ type: z.literal("json") }),
  BaseFieldSchema.extend({ type: z.literal("file") }),
  BaseFieldSchema.extend({ type: z.literal("image") }),
]);

export type Field = z.infer<typeof FieldSchema>;
export type TextField = z.infer<typeof TextFieldSchema>;
export type NumberField = z.infer<typeof NumberFieldSchema>;
export type SelectField = z.infer<typeof SelectFieldSchema>;
export type RelationField = z.infer<typeof RelationFieldSchema>;
export type CurrencyField = z.infer<typeof CurrencyFieldSchema>;
export type ComputedField = z.infer<typeof ComputedFieldSchema>;
