"use client";

import { useState } from "react";
import { Button, Input } from "@cot/ui";
import { Plus, Loader2, Copy, Check } from "lucide-react";
import { createApiKey } from "@/app/actions/api-keys";

/**
 * Create API key button with modal
 */
export function CreateApiKeyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const result = await createApiKey(name);

      if (result.success) {
        setCreatedKey(result.key);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  }

  function handleCopy() {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleClose() {
    setIsOpen(false);
    setName("");
    setCreatedKey(null);
    setError(null);
    setCopied(false);
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create API Key
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        {!createdKey ? (
          <>
            <h3 className="text-lg font-semibold">Create API Key</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Give your API key a descriptive name
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Production App, Demo Site"
                  disabled={isCreating}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={handleCreate} disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Key
                </Button>
                <Button variant="outline" onClick={handleClose} disabled={isCreating}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold">API Key Created!</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Copy this key now - you won't be able to see it again
            </p>

            <div className="mt-4 space-y-4">
              <div className="rounded-lg border bg-muted p-3">
                <code className="break-all text-sm">{createdKey}</code>
              </div>

              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  <strong>Security Warning:</strong> Keep this key secure and never commit it to
                  version control
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Key
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
