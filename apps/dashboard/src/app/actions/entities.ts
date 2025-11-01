"use server";

import { revalidatePath } from "next/cache";
import { EntityEngine } from "@cot/engine";
import { CreateEntityInputSchema, type CreateEntityInput } from "@cot/schema";
import { getCurrentTenantId } from "@/lib/tenant";

/**
 * Server action to create a new entity
 * Called from dashboard UI forms
 */
export async function createEntityAction(input: unknown) {
  try {
    // Get current tenant
    const tenantId = await getCurrentTenantId();

    // Validate input
    const validated = CreateEntityInputSchema.parse(input);

    // Create entity
    const engine = new EntityEngine();
    const entity = await engine.createEntity(tenantId, validated);

    // Revalidate entities page
    revalidatePath("/entities");

    return { success: true, entity };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

/**
 * Server action to delete an entity
 */
export async function deleteEntityAction(entityName: string) {
  try {
    const tenantId = await getCurrentTenantId();

    const engine = new EntityEngine();
    await engine.deleteEntity(tenantId, entityName);

    revalidatePath("/entities");

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}

/**
 * Server action to get entity by name
 */
export async function getEntityAction(entityName: string) {
  try {
    const tenantId = await getCurrentTenantId();

    const engine = new EntityEngine();
    const entity = await engine.getEntity(tenantId, entityName);

    if (!entity) {
      return { success: false, error: "Entity not found" };
    }

    return { success: true, entity };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error occurred" };
  }
}
