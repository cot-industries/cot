import Link from "next/link";
import { Database, Plus } from "lucide-react";
import { EntityEngine } from "@cot/engine";
import { getCurrentTenantId } from "@/lib/tenant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EntitiesPage() {
  const tenantId = await getCurrentTenantId();
  const engine = new EntityEngine();
  const entities = await engine.listEntities(tenantId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entities</h1>
          <p className="mt-2 text-muted-foreground">
            Define your business objects and their data structure
          </p>
        </div>
        <Link href="/entities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Entity
          </Button>
        </Link>
      </div>

      {entities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No entities yet</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Get started by creating your first entity. It will automatically generate a database
              table and API endpoints.
            </p>
            <Link href="/entities/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Entity
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entities.map((entity) => (
            <Link key={entity.id} href={`/entities/${entity.name}`}>
              <Card className="transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {entity.label}
                  </CardTitle>
                  <CardDescription>
                    {entity.description || `${entity.fields.length} fields`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{entity.fields.length} fields</span>
                    <span>•</span>
                    <span className="font-mono text-xs">{entity.name}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
