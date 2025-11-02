import Link from "next/link";
import { Button } from "@cot/ui";
import { Plus, ArrowLeft } from "lucide-react";
import { EntityEngine, DataEngine } from "@cot/engine";
import { getCurrentTenantId } from "@/lib/tenant";

/**
 * Entity data browser - Shows records for a specific entity
 * Server Component with dynamic route
 */
export default async function EntityDataPage({
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

  // Fetch records
  const dataEngine = new DataEngine();
  const records = await dataEngine.findMany(tenantId, entity, { limit: 100 });
  const total = await dataEngine.count(tenantId, entity);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/entities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{entity.label}</h2>
            <p className="text-muted-foreground mt-1">
              {total} {total === 1 ? "record" : "records"}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/entities/${entityName}/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add {entity.label}
          </Link>
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mt-4 text-lg font-semibold">No records yet</h3>
          <p className="text-muted-foreground mb-4 mt-2 text-sm">
            Create your first {entity.label.toLowerCase()} to get started
          </p>
          <Button asChild>
            <Link href={`/entities/${entityName}/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add {entity.label}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  {entity.fields.map((field) => (
                    <th
                      key={field.name}
                      className="px-4 py-3 text-left text-sm font-medium"
                    >
                      {field.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/50">
                    {entity.fields.map((field) => (
                      <td key={field.name} className="px-4 py-3 text-sm">
                        {formatFieldValue(record[field.name], field.type)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right text-sm">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/entities/${entityName}/${record.id}`}>
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format field value for display
 */
function formatFieldValue(value: any, fieldType: string): string {
  if (value === null || value === undefined) {
    return "-";
  }

  switch (fieldType) {
    case "boolean":
      return value ? "Yes" : "No";
    case "date":
      return new Date(value).toLocaleDateString();
    case "datetime":
      return new Date(value).toLocaleString();
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    default:
      return String(value);
  }
}
