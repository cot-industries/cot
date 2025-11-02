import Link from "next/link";
import { Button } from "@cot/ui";
import { ArrowLeft, Trash2 } from "lucide-react";
import { EntityEngine, DataEngine } from "@cot/engine";
import { getCurrentTenantId } from "@/lib/tenant";
import { EntityRecordForm } from "@/components/entity-record-form";
import { DeleteRecordButton } from "@/components/delete-record-button";

/**
 * View/Edit record page
 * Server Component fetches data, Client Component handles form
 */
export default async function RecordPage({
  params,
}: {
  params: Promise<{ name: string; id: string }>;
}) {
  const { name: entityName, id } = await params;
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

  const dataEngine = new DataEngine();
  const record = await dataEngine.findOne(tenantId, entity, id);

  if (!record) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Record Not Found</h2>
        <p className="text-muted-foreground">
          The {entity.label.toLowerCase()} with ID "{id}" does not exist.
        </p>
        <Button asChild variant="outline">
          <Link href={`/entities/${entityName}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {entity.label}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href={`/entities/${entityName}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Edit {entity.label}
            </h2>
            <p className="text-muted-foreground mt-1 font-mono text-xs">
              ID: {id}
            </p>
          </div>
        </div>
        
        <DeleteRecordButton entityName={entityName} recordId={id} />
      </div>

      <div className="max-w-2xl rounded-lg border p-6">
        <EntityRecordForm entity={entity} record={record} />
      </div>
    </div>
  );
}
