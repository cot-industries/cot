import { type Database, db } from "@cot/db";
import { sql } from "drizzle-orm";
import type { EntityDefinition, Field } from "@cot/schema";

/**
 * Schema Generator
 *
 * Generates Postgres DDL statements from entity definitions
 * Creates actual tables, columns, indexes, and constraints
 */
export class SchemaGenerator {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  /**
   * Generate and execute CREATE TABLE statement for an entity
   */
  async generateTable(tenantId: string, entity: EntityDefinition): Promise<void> {
    const tableName = this.getTableName(tenantId, entity.name);
    const columns = this.generateColumns(entity);
    const constraints = this.generateConstraints(entity, tenantId);

    const ddl = `
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ${columns.join(",\n        ")}
        ${entity.timestamps ? ",\ncreated_at TIMESTAMP NOT NULL DEFAULT NOW(),\nupdated_at TIMESTAMP NOT NULL DEFAULT NOW()" : ""}
        ${entity.softDelete ? ",\ndeleted_at TIMESTAMP" : ""}
        ${constraints.length > 0 ? ",\n        " + constraints.join(",\n        ") : ""}
      )
    `;

    // Execute DDL
    await this.db.execute(sql.raw(ddl));

    // Create indexes for unique fields
    for (const field of entity.fields) {
      if (field.unique && field.type !== "computed") {
        const fieldName = this.sanitizeIdentifier(field.name);
        const indexName = `${tableName}_${fieldName}_unique`;
        await this.db.execute(
          sql.raw(`CREATE UNIQUE INDEX IF NOT EXISTS ${indexName} ON "${tableName}" (${fieldName})`)
        );
      }
    }
  }

  /**
   * Generate column definitions from entity fields
   */
  private generateColumns(entity: EntityDefinition): string[] {
    return entity.fields
      .map((field) => this.fieldToColumn(field))
      .filter((col) => col !== ""); // Filter out computed fields
  }

  /**
   * Convert a field definition to a Postgres column definition
   */
  private fieldToColumn(field: Field): string {
    const fieldName = this.sanitizeIdentifier(field.name);
    const nullable = field.required ? "NOT NULL" : "NULL";

    let pgType: string;
    switch (field.type as any) {
      case "text":
      case "email":
      case "url":
      case "phone":
        pgType = "TEXT";
        break;
      case "number":
        pgType = "NUMERIC";
        break;
      case "boolean":
        pgType = "BOOLEAN";
        break;
      case "date":
        pgType = "DATE";
        break;
      case "datetime":
      case "time":
        pgType = "TIMESTAMP";
        break;
      case "currency":
        pgType = "NUMERIC(19, 4)";
        break;
      case "json":
        pgType = "JSONB";
        break;
      case "relation":
        pgType = "UUID";
        break;
      case "file":
      case "image":
        pgType = "TEXT"; // Store URL/path
        break;
      case "select":
      case "multiselect":
        pgType = "TEXT";
        break;
      case "computed":
        // Computed fields are not stored in database
        return "";
      default:
        pgType = "TEXT";
    }

    return `${fieldName} ${pgType} ${nullable}`.trim();
  }

  /**
   * Generate table constraints (foreign keys, checks, etc.)
   */
  private generateConstraints(entity: EntityDefinition, tenantId: string): string[] {
    const constraints: string[] = [];

    // Add foreign key constraints for relation fields
    for (const field of entity.fields) {
      if (field.type === "relation") {
        const fieldName = this.sanitizeIdentifier(field.name);
        const targetTable = this.getTableName(tenantId, field.entity);
        constraints.push(
          `CONSTRAINT fk_${fieldName} FOREIGN KEY (${fieldName}) REFERENCES "${targetTable}"(id)`
        );
      }
    }

    return constraints;
  }

  /**
   * Get the fully qualified table name for a tenant's entity
   * Format: tenant_{tenantId}_{entityName}
   */
  private getTableName(tenantId: string, entityName: string): string {
    // Remove hyphens from UUID for valid Postgres identifier
    const cleanTenantId = tenantId.replace(/-/g, "_");
    const sanitizedName = this.sanitizeIdentifier(entityName);
    return `tenant_${cleanTenantId}_${sanitizedName}`;
  }

  /**
   * Sanitize identifier to prevent SQL injection
   * Only allows alphanumeric and underscores
   */
  private sanitizeIdentifier(identifier: string): string {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error(`Invalid SQL identifier: ${identifier}`);
    }
    return identifier;
  }

  /**
   * Drop table for an entity
   */
  async dropTable(tenantId: string, entityName: string): Promise<void> {
    const tableName = this.getTableName(tenantId, entityName);
    await this.db.execute(sql.raw(`DROP TABLE IF EXISTS "${tableName}" CASCADE`));
  }
}
