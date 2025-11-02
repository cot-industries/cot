import { type Database, db, sql } from "@cot/db";
import type { EntityDefinition } from "@cot/schema";

/**
 * Data Engine
 *
 * CRUD operations for entity data (not entity definitions)
 * Works with dynamically generated tables
 */
export class DataEngine {
  private db: Database;

  constructor(database: Database = db) {
    this.db = database;
  }

  /**
   * Get table name for tenant + entity
   */
  private getTableName(tenantId: string, entityName: string): string {
    return `tenant_${tenantId.replace(/-/g, "_")}_${entityName}`;
  }

  /**
   * Create a new record
   */
  async create(
    tenantId: string,
    entity: EntityDefinition,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    const tableName = this.getTableName(tenantId, entity.name);

    // Validate required fields
    for (const field of entity.fields) {
      if (field.required && !data[field.name]) {
        throw new Error(`Field "${field.name}" is required`);
      }
    }

    // Build column names and values
    const columns = Object.keys(data);
    const values = Object.values(data).map((v) =>
      typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : v
    );

    const query = `
      INSERT INTO ${tableName} (${columns.join(", ")})
      VALUES (${values.join(", ")})
      RETURNING *
    `;

    const result = await this.db.execute(sql.raw(query));
    return result.rows[0] as Record<string, any>;
  }

  /**
   * Find many records with optional filtering, sorting, pagination
   */
  async findMany(
    tenantId: string,
    entity: EntityDefinition,
    options?: {
      where?: Record<string, any>;
      orderBy?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<Record<string, any>[]> {
    const tableName = this.getTableName(tenantId, entity.name);
    
    let query = `SELECT * FROM ${tableName}`;

    // WHERE clause
    if (options?.where) {
      const conditions: string[] = [];
      
      for (const [key, value] of Object.entries(options.where)) {
        // Escape string values
        const escapedValue = typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value;
        conditions.push(`${key} = ${escapedValue}`);
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
    }

    // ORDER BY
    if (options?.orderBy) {
      query += ` ORDER BY ${options.orderBy}`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }

    // LIMIT/OFFSET
    if (options?.limit) {
      query += ` LIMIT ${options.limit}`;
    }
    if (options?.offset) {
      query += ` OFFSET ${options.offset}`;
    }

    const result = await this.db.execute(sql.raw(query));
    return result.rows as Record<string, any>[];
  }

  /**
   * Find a single record by ID
   */
  async findOne(
    tenantId: string,
    entity: EntityDefinition,
    id: string
  ): Promise<Record<string, any> | null> {
    const tableName = this.getTableName(tenantId, entity.name);
    
    const query = `SELECT * FROM ${tableName} WHERE id = '${id}' LIMIT 1`;
    const result = await this.db.execute(sql.raw(query));
    
    return (result.rows[0] as Record<string, any>) ?? null;
  }

  /**
   * Update a record
   */
  async update(
    tenantId: string,
    entity: EntityDefinition,
    id: string,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    const tableName = this.getTableName(tenantId, entity.name);

    // Build SET clause
    const updates: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      // Skip id, created_at, updated_at
      if (key === "id" || key === "created_at" || key === "updated_at") {
        continue;
      }
      const escapedValue = typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value;
      updates.push(`${key} = ${escapedValue}`);
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`);

    const query = `
      UPDATE ${tableName}
      SET ${updates.join(", ")}
      WHERE id = '${id}'
      RETURNING *
    `;

    const result = await this.db.execute(sql.raw(query));
    
    if (!result.rows[0]) {
      throw new Error(`Record with id "${id}" not found`);
    }

    return result.rows[0] as Record<string, any>;
  }

  /**
   * Delete a record
   */
  async delete(
    tenantId: string,
    entity: EntityDefinition,
    id: string
  ): Promise<void> {
    const tableName = this.getTableName(tenantId, entity.name);
    
    const query = `DELETE FROM ${tableName} WHERE id = '${id}'`;
    await this.db.execute(sql.raw(query));
  }

  /**
   * Count records
   */
  async count(
    tenantId: string,
    entity: EntityDefinition,
    where?: Record<string, any>
  ): Promise<number> {
    const tableName = this.getTableName(tenantId, entity.name);
    
    let query = `SELECT COUNT(*) as count FROM ${tableName}`;

    if (where) {
      const conditions: string[] = [];
      
      for (const [key, value] of Object.entries(where)) {
        const escapedValue = typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value;
        conditions.push(`${key} = ${escapedValue}`);
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }
    }

    const result = await this.db.execute(sql.raw(query));
    return Number((result.rows[0] as any).count);
  }
}
