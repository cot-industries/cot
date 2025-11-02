import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DataEngine, EntityEngine } from "@cot/engine";
import { validateApiKey } from "@/lib/api-auth";

/**
 * External API routes for entity data
 * Requires API key authentication
 */

/**
 * GET /api/v1/data/:entity - List records
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { tenantId } = await validateApiKey(req);
    const { entity: entityName } = await params;

    // Get entity definition
    const entityEngine = new EntityEngine();
    const entity = await entityEngine.getEntity(tenantId, entityName);

    if (!entity) {
      return NextResponse.json(
        { error: `Entity "${entityName}" not found` },
        { status: 404 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 100;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : 0;

    // Get data
    const dataEngine = new DataEngine();
    const records = await dataEngine.findMany(tenantId, entity, {
      limit,
      offset,
    });

    const total = await dataEngine.count(tenantId, entity);

    return NextResponse.json({
      data: records,
      meta: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("GET /api/v1/data/:entity error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/data/:entity - Create record
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { tenantId } = await validateApiKey(req);
    const { entity: entityName } = await params;
    const body = await req.json();

    // Get entity definition
    const entityEngine = new EntityEngine();
    const entity = await entityEngine.getEntity(tenantId, entityName);

    if (!entity) {
      return NextResponse.json(
        { error: `Entity "${entityName}" not found` },
        { status: 404 }
      );
    }

    // Create record
    const dataEngine = new DataEngine();
    const record = await dataEngine.create(tenantId, entity, body);

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/data/:entity error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
