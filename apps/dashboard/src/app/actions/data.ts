"use server";

import { revalidatePath } from "next/cache";
import { DataEngine, EntityEngine } from "@cot/engine";
import { getCurrentTenantId } from "@/lib/tenant";

/**
 * Server Actions for entity data operations
 * Used by dashboard UI forms
 */

/**
 * Create a new record for an entity
 */
export async function createRecord(
  entityName: string,
  data: Record<string, any>
): Promise<{ success: true; record: Record<string, any> } | { success: false; error: string }> {
  try {
    const tenantId = await getCurrentTenantId();

    // Get entity definition
    const entityEngine = new EntityEngine();
    const entity = await entityEngine.getEntity(tenantId, entityName);

    if (!entity) {
      return { success: false, error: `Entity "${entityName}" not found` };
    }

    // Create record
    const dataEngine = new DataEngine();
    const record = await dataEngine.create(tenantId, entity, data);

    // Revalidate the entity data page
    revalidatePath(`/entities/${entityName}`);

    return { success: true, record };
  } catch (error) {
    console.error("Failed to create record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create record",
    };
  }
}

/**
 * Update a record
 */
export async function updateRecord(
  entityName: string,
  id: string,
  data: Record<string, any>
): Promise<{ success: true; record: Record<string, any> } | { success: false; error: string }> {
  try {
    const tenantId = await getCurrentTenantId();

    const entityEngine = new EntityEngine();
    const entity = await entityEngine.getEntity(tenantId, entityName);

    if (!entity) {
      return { success: false, error: `Entity "${entityName}" not found` };
    }

    const dataEngine = new DataEngine();
    const record = await dataEngine.update(tenantId, entity, id, data);

    revalidatePath(`/entities/${entityName}`);
    revalidatePath(`/entities/${entityName}/${id}`);

    return { success: true, record };
  } catch (error) {
    console.error("Failed to update record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update record",
    };
  }
}

/**
 * Delete a record
 */
export async function deleteRecord(
  entityName: string,
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const tenantId = await getCurrentTenantId();

    const entityEngine = new EntityEngine();
    const entity = await entityEngine.getEntity(tenantId, entityName);

    if (!entity) {
      return { success: false, error: `Entity "${entityName}" not found` };
    }

    const dataEngine = new DataEngine();
    await dataEngine.delete(tenantId, entity, id);

    revalidatePath(`/entities/${entityName}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete record",
    };
  }
}
