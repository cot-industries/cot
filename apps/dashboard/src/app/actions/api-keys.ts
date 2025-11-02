"use server";

import { revalidatePath } from "next/cache";
import { db, apiKeys, eq } from "@cot/db";
import { getCurrentTenantId } from "@/lib/tenant";
import { randomBytes } from "crypto";

/**
 * Create a new API key
 */
export async function createApiKey(
  name: string
): Promise<{ success: true; key: string } | { success: false; error: string }> {
  try {
    const tenantId = await getCurrentTenantId();

    // Generate API key
    const key = `sk_${randomBytes(32).toString("hex")}`;
    const prefix = key.substring(0, 12); // sk_xxxxxxxxxx

    // Hash the key for storage
    const crypto = require("crypto");
    const hashedKey = crypto.createHash("sha256").update(key).digest("hex");

    // Insert into database
    await db.insert(apiKeys).values({
      name,
      hashedKey,
      prefix,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/settings");

    return { success: true, key };
  } catch (error) {
    console.error("Failed to create API key:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create API key",
    };
  }
}

/**
 * Delete an API key
 */
export async function deleteApiKey(
  keyId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const tenantId = await getCurrentTenantId();

    // Verify key belongs to tenant before deleting
    const [key] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.id, keyId))
      .limit(1);

    if (!key || key.tenantId !== tenantId) {
      return { success: false, error: "API key not found" };
    }

    await db.delete(apiKeys).where(eq(apiKeys.id, keyId));

    revalidatePath("/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete API key:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete API key",
    };
  }
}
