import type { NextRequest } from "next/server";
import { EntityEngine } from "@cot/engine";
import { validateApiKey } from "@/lib/api-auth";

/**
 * GET /api/v1/entities/:name
 * Get a specific entity by name
 */
export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const { tenantId } = await validateApiKey(req);
    const entityName = params.name;

    const engine = new EntityEngine();
    const entity = await engine.getEntity(tenantId, entityName);

    if (!entity) {
      return Response.json({ error: "Entity not found" }, { status: 404 });
    }

    return Response.json({
      entity,
      _meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/entities/:name
 * Delete an entity
 */
export async function DELETE(req: NextRequest, { params }: { params: { name: string } }) {
  try {
    const { tenantId } = await validateApiKey(req);
    const entityName = params.name;

    const engine = new EntityEngine();
    await engine.deleteEntity(tenantId, entityName);

    return Response.json({
      success: true,
      _meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
