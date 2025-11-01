import { db } from "@cot/db";
import { apiKeys } from "@cot/db";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

/**
 * Validate API key from request headers
 * Used for external API access (not dashboard)
 */
export async function validateApiKey(req: NextRequest): Promise<{ tenantId: string }> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const apiKey = authHeader.slice(7);

  // Hash the provided key
  const hashedKey = await hashApiKey(apiKey);

  // Look up in database
  const keyRecord = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.hashedKey, hashedKey),
  });

  if (!keyRecord) {
    throw new Error("Invalid API key");
  }

  if (keyRecord.revokedAt) {
    throw new Error("API key has been revoked");
  }

  // Update last used timestamp (async, don't await)
  db.update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, keyRecord.id))
    .then(() => {})
    .catch(() => {});

  return { tenantId: keyRecord.tenantId };
}

/**
 * Hash API key using Web Crypto API
 */
async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate new API key
 * Returns unhashed key (only time it's visible)
 */
export async function generateApiKey(tenantId: string, name: string): Promise<string> {
  // Generate random key: cot_live_<32 random chars>
  const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(36))
    .join("")
    .slice(0, 32);

  const apiKey = `cot_live_${randomPart}`;
  const prefix = apiKey.slice(0, 12); // "cot_live_abc"
  const hashedKey = await hashApiKey(apiKey);

  // Store hashed version
  await db.insert(apiKeys).values({
    tenantId,
    name,
    hashedKey,
    prefix,
  });

  // Return unhashed key (only shown once)
  return apiKey;
}
