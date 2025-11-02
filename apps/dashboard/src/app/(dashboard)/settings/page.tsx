import { Button } from "@cot/ui";
import { Plus, Key, Copy, Trash2 } from "lucide-react";
import { db, apiKeys, eq } from "@cot/db";
import { getCurrentTenantId } from "@/lib/tenant";
import { CreateApiKeyButton } from "@/components/create-api-key-button";
import { DeleteApiKeyButton } from "@/components/delete-api-key-button";

/**
 * Settings page - API Key management
 * Server Component fetches keys
 */
export default async function SettingsPage() {
  const tenantId = await getCurrentTenantId();

  // Fetch API keys for current tenant
  const keys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.tenantId, tenantId))
    .orderBy(apiKeys.createdAt);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your API keys and account settings
        </p>
      </div>

      {/* API Keys Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">API Keys</h3>
            <p className="text-muted-foreground text-sm">
              Use API keys to access your data from external applications
            </p>
          </div>
          <CreateApiKeyButton />
        </div>

        {keys.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Key className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No API keys yet</h3>
            <p className="text-muted-foreground mb-4 mt-2 text-sm">
              Create an API key to start accessing your data via REST API
            </p>
            <CreateApiKeyButton />
          </div>
        ) : (
          <div className="space-y-2">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{key.name}</span>
                  </div>
                  <div className="mt-1">
                    <code className="text-muted-foreground font-mono text-xs">
                      {key.prefix}...
                    </code>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">
                    Created {new Date(key.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <DeleteApiKeyButton keyId={key.id!} keyName={key.name} />
              </div>
            ))}
          </div>
        )}

        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            <strong>Important:</strong> API keys provide full access to your data. Keep them
            secure and never commit them to version control.
          </p>
        </div>
      </div>
    </div>
  );
}
