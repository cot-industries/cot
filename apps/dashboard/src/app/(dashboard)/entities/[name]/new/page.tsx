import Link from "next/link";
import { Button } from "@cot/ui";
import { ArrowLeft } from "lucide-react";
import { EntityEngine } from "@cot/engine";
import { getCurrentTenantId } from "@/lib/tenant";
import { EntityRecordForm } from "@/components/entity-record-form";

/**
 * Create new record page - Dynamic form based on entity definition
 * Server Component fetches entity, Client Component handles form
 */
export default async function NewRecordPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: entityName } = await params;
  const tenantId = await getCurrentTenantId();

  const entityEngine = new EntityEngine();
  const entity = await entityEngine.getEntity(tenantId, entityName);

  if (!entity) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Entity Not Found</h2>
        <p className="text-muted-foreground">
          The entity "{entityName}" does not exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/entities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entities
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href={`/entities/${entityName}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            New {entity.label}
          </h2>
          <p className="text-muted-foreground mt-1">
            Fill in the details below
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-lg border p-6">
        <EntityRecordForm entity={entity} />
      </div>
    </div>
  );
}
