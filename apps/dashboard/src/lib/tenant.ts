import { auth } from "@clerk/nextjs/server";
import { db, tenants, eq } from "@cot/db";

/**
 * Get or create tenant for current Clerk organization
 * 
 * Maps Clerk org → Cot tenant (simple 1:1 mapping)
 * This is all you need to start - no complex project management
 */
export async function getCurrentTenant() {
  const { orgId, userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // For MVP: If no org, use user's personal tenant
  const clerkOrgId = orgId || `user_${userId}`;

  // Find or create tenant
  let tenant = await db.query.tenants.findFirst({
    where: eq(tenants.clerkOrgId, clerkOrgId),
  });

  if (!tenant) {
    // Auto-create tenant on first access
    const [newTenant] = await db
      .insert(tenants)
      .values({
        clerkOrgId,
        name: orgId ? "Organization" : "Personal",
        slug: clerkOrgId.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      })
      .returning();

    tenant = newTenant;
  }

  return tenant;
}

/**
 * Get tenant ID for current user
 * Use this in all server actions/API routes
 */
export async function getCurrentTenantId(): Promise<string> {
  const tenant = await getCurrentTenant();
  return tenant.id;
}
