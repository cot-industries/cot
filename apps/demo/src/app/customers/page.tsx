import { cotClient } from "@/lib/cot-client";
import { Button } from "@cot/ui";
import Link from "next/link";
import { Users } from "lucide-react";

/**
 * Customers Page - Demo of Cot API consumption
 * Server Component fetches from Cot REST API
 */
export default async function CustomersPage() {
  try {
    // Fetch customers from Cot API
    const { data: customers, meta } = await cotClient.listRecords("customers", {
      limit: 50,
    });

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Customers</h1>
              <p className="text-muted-foreground mt-1">
                Managing {meta.total} customers via Cot API
              </p>
            </div>
            <Button asChild>
              <Link href="/customers/new">Add Customer</Link>
            </Button>
          </div>

          {customers.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No customers yet</h3>
              <p className="text-muted-foreground mb-4 mt-2 text-sm">
                Get started by adding your first customer
              </p>
              <Button asChild>
                <Link href="/customers/new">Add Customer</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium">Name</th>
                      <th className="p-4 text-left text-sm font-medium">Email</th>
                      <th className="p-4 text-left text-sm font-medium">Phone</th>
                      <th className="p-4 text-left text-sm font-medium">Company</th>
                      <th className="p-4 text-left text-sm font-medium">Status</th>
                      <th className="p-4 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {customers.map((customer: any) => (
                      <tr key={customer.id} className="hover:bg-muted/50">
                        <td className="p-4 text-sm font-medium">{customer.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{customer.email}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {customer.phone || "-"}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {customer.company || "-"}
                        </td>
                        <td className="p-4 text-sm">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500">
                            {customer.status || "active"}
                          </span>
                        </td>
                        <td className="p-4 text-right text-sm">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/customers/${customer.id}`}>View</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Showing {customers.length} of {meta.total} customers
          </div>

          {/* Demo Info */}
          <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <strong>This is a demo:</strong> This page is fetching customer data from the Cot
              platform via REST API. The customers entity was defined using AI in the Cot
              dashboard, and the table was auto-generated.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Customers</h1>
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
            <h3 className="font-semibold text-destructive">Failed to load customers</h3>
            <p className="text-muted-foreground text-sm mt-2">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <p className="text-muted-foreground text-sm mt-4">
              <strong>Setup Required:</strong>
            </p>
            <ol className="text-muted-foreground text-sm mt-2 ml-4 list-decimal space-y-1">
              <li>Create "customers" entity in Cot dashboard (/ai)</li>
              <li>Generate API key in Settings</li>
              <li>Add COT_API_KEY to apps/demo/.env.local</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}
