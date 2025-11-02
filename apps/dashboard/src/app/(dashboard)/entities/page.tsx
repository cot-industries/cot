import Link from "next/link";
import { Button } from "@cot/ui";
import { Plus, Box } from "lucide-react";
import { EntityEngine } from "@cot/engine";
import { getCurrentTenantId } from "@/lib/tenant";

/**
 * Entity list page - Shows all entities for current tenant
 * Server Component fetches data
 */
export default async function EntitiesPage() {
  const tenantId = await getCurrentTenantId();
  const engine = new EntityEngine();
  const entities = await engine.listEntities(tenantId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Entities</h2>
          <p className="text-muted-foreground mt-2">
            Define your business data structures
          </p>
        </div>
        <Button asChild>
          <Link href="/entities/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Entity
          </Link>
        </Button>
      </div>

      {entities.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Box className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No entities yet</h3>
          <p className="text-muted-foreground mb-4 mt-2 text-sm">
            Create your first entity to get started
          </p>
          <Button asChild>
            <Link href="/entities/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Entity
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity) => (
            <Link
              key={entity.id}
              href={`/entities/${entity.name}`}
              className="group relative rounded-lg border p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {entity.label}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {entity.name}
                  </p>
                  {entity.description && (
                    <p className="text-muted-foreground text-sm mt-2">
                      {entity.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{entity.fields.length} fields</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
