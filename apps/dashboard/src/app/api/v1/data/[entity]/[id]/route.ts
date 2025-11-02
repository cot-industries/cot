import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DataEngine, EntityEngine } from "@cot/engine";
import { validateApiKey } from "@/lib/api-auth";

/**
 * GET /api/v1/data/:entity/:id - Get single record
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  try {
    const { tenantId } = await validateApiKey(req);
    const { entity: entityName, id } = await params;

    const entityEngine = new EntityEngine();
    const entity = await entityEngine.getEntity(tenantId, entityName);

    if (!entity) {
      return NextResponse.json(
        { error: `Entity "${entityName}" not found` },
        { status: 404 }
      );
    }

    const dataEngine = new DataEngine();
    const record = await dataEngine.findOne(tenantId, entity, id);

    if (!record) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error("GET /api/v1/data/:entity/:id error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/data/:entity/:id - Update record
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  try {
    const { tenantId } = await validateApiKey(req);
    const { entity: entityName, id } = await params;
    const body = await req.json();

    const entityEngine = new EntityEngine();
    const entity = await entityEngine.getEntity(tenantId, entityName);

    if (!entity) {
      return NextResponse.json(
        { error: `Entity "${entityName}" not found` },
        { status: 404 }
      );
    }

    const dataEngine = new DataEngine();
    const record = await dataEngine.update(tenantId, entity, id, body);

    return NextResponse.json({ data: record });
  } catch (error) {
    console.error("PATCH /api/v1/data/:entity/:id error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/data/:entity/:id - Delete record
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  try {
    const { tenantId } = await validateApiKey(req);
    const { entity: entityName, id } = await params;

    const entityEngine = new EntityEngine();
    const entity = await entityEngine.getEntity(tenantId, entityName);

    if (!entity) {
      return NextResponse.json(
        { error: `Entity "${entityName}" not found` },
        { status: 404 }
      );
    }

    const dataEngine = new DataEngine();
    await dataEngine.delete(tenantId, entity, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/v1/data/:entity/:id error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
