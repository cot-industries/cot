import { NextRequest } from "next/server";
import { EntityEngine } from "@cot/engine";
import { CreateEntityInputSchema } from "@cot/schema";
import { validateApiKey } from "@/lib/api-auth";

/**
 * GET /api/v1/entities
 * List all entities for the authenticated tenant
 */
export async function GET(req: NextRequest) {
  try {
    // Validate API key
    const { tenantId } = await validateApiKey(req);

    // Fetch entities
    const engine = new EntityEngine();
    const entities = await engine.listEntities(tenantId);

    return Response.json({
      entities,
      _meta: {
        count: entities.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 401 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/v1/entities
 * Create a new entity
 */
export async function POST(req: NextRequest) {
  try {
    // Validate API key
    const { tenantId } = await validateApiKey(req);

    // Parse and validate body
    const body = await req.json();
    const validated = CreateEntityInputSchema.parse(body);

    // Create entity
    const engine = new EntityEngine();
    const entity = await engine.createEntity(tenantId, validated);

    return Response.json(
      {
        entity,
        _meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
