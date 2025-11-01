import { type Database, db, entities, fields } from "@cot/db";
import { and, desc, eq } from "drizzle-orm";
import {
  CreateEntityInputSchema,
  type CreateEntityInput,
  type EntityDefinition,
} from "@cot/schema";
import { SchemaGenerator } from "./schema-generator";

/**
 * Entity Engine
 *
 * Core engine for managing entity definitions and generating database schemas
 */
export class EntityEngine {
  private db: Database;
  private schemaGenerator: SchemaGenerator;

  constructor(database: Database = db) {
    this.db = database;
    this.schemaGenerator = new SchemaGenerator(database);
  }

  /**
   * Create a new entity definition
   * This will:
   * 1. Validate the entity definition
   * 2. Store it in the meta-data tables
   * 3. Generate the actual Postgres table for storing entity data
   */
  async createEntity(tenantId: string, input: CreateEntityInput): Promise<EntityDefinition> {
    // 1. Validate input with Zod
    const validated = CreateEntityInputSchema.parse(input);

    // 2. Check for naming conflicts
    const existing = await this.db.query.entities.findFirst({
      where: and(eq(entities.tenantId, tenantId), eq(entities.name, validated.name)),
    });

    if (existing) {
      throw new Error(`Entity "${validated.name}" already exists`);
    }

    // 3. Insert into entities table
    const [entity] = await this.db
      .insert(entities)
      .values({
        tenantId,
        name: validated.name,
        label: validated.label,
        pluralLabel: validated.pluralLabel,
        description: validated.description,
        icon: validated.icon,
        timestamps: validated.timestamps,
        softDelete: validated.softDelete,
      })
      .returning();

    // 4. Insert fields into fields table
    if (validated.fields.length > 0) {
      await this.db.insert(fields).values(
        validated.fields.map((field, index) => ({
          entityId: entity.id,
          name: field.name,
          label: field.label,
          type: field.type,
          required: field.required ?? false,
          unique: field.unique ?? false,
          description: field.description,
          config: field, // Store full field config as JSONB
          order: index,
        }))
      );
    }

    // 5. Generate Postgres table using SchemaGenerator
    const fullEntity: EntityDefinition = {
      name: entity.name,
      label: entity.label,
      pluralLabel: entity.pluralLabel ?? undefined,
      description: entity.description ?? undefined,
      icon: entity.icon ?? undefined,
      timestamps: entity.timestamps,
      softDelete: entity.softDelete,
      tenantId,
      fields: validated.fields,
    };

    await this.schemaGenerator.generateTable(tenantId, fullEntity);

    // 6. Return complete entity definition
    return fullEntity;
  }

  /**
   * Get entity definition by name
   */
  async getEntity(tenantId: string, entityName: string): Promise<EntityDefinition | null> {
    const entity = await this.db.query.entities.findFirst({
      where: and(eq(entities.tenantId, tenantId), eq(entities.name, entityName)),
      with: {
        fields: {
          orderBy: (fields: any, { asc }: any) => [asc(fields.order)],
        },
      },
    });

    if (!entity) {
      return null;
    }

    // Transform database fields to EntityDefinition format
    return {
      id: entity.id,
      name: entity.name,
      label: entity.label,
      pluralLabel: entity.pluralLabel ?? undefined,
      description: entity.description ?? undefined,
      icon: entity.icon ?? undefined,
      fields: (entity as any).fields.map((f: any) => f.config as any), // JSONB contains full field config
      timestamps: entity.timestamps,
      softDelete: entity.softDelete,
      tenantId: entity.tenantId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * List all entities for a tenant
   */
  async listEntities(tenantId: string): Promise<EntityDefinition[]> {
    const entityRecords = await this.db.query.entities.findMany({
      where: eq(entities.tenantId, tenantId),
      with: {
        fields: {
          orderBy: (fields: any, { asc }: any) => [asc(fields.order)],
        },
      },
      orderBy: (entities: any, { desc }: any) => [desc(entities.createdAt)],
    });

    return entityRecords.map((entity: any) => ({
      id: entity.id,
      name: entity.name,
      label: entity.label,
      pluralLabel: entity.pluralLabel ?? undefined,
      description: entity.description ?? undefined,
      icon: entity.icon ?? undefined,
      fields: entity.fields.map((f: any) => f.config as any),
      timestamps: entity.timestamps,
      softDelete: entity.softDelete,
      tenantId: entity.tenantId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }));
  }

  /**
   * Update entity definition
   * Note: This is complex - may require data migration
   */
  async updateEntity(
    tenantId: string,
    entityName: string,
    updates: Partial<CreateEntityInput>
  ): Promise<EntityDefinition> {
    // TODO: Phase 2 implementation
    throw new Error("Not implemented yet");
  }

  /**
   * Delete entity definition
   * This will drop the Postgres table and remove all data
   */
  async deleteEntity(tenantId: string, entityName: string): Promise<void> {
    const entity = await this.getEntity(tenantId, entityName);

    if (!entity) {
      throw new Error(`Entity "${entityName}" not found`);
    }

    // Drop the Postgres table
    await this.schemaGenerator.dropTable(tenantId, entityName);

    // Delete from meta-tables (cascade will delete fields)
    await this.db.delete(entities).where(eq(entities.id, entity.id!));
  }
}
