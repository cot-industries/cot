"use client";

import { useState } from "react";
import { Button } from "@cot/ui";
import { Trash2, Loader2 } from "lucide-react";
import { deleteApiKey } from "@/app/actions/api-keys";

/**
 * Delete API key button with confirmation
 */
export function DeleteApiKeyButton({ keyId, keyName }: { keyId: string; keyName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteApiKey(keyId);

      if (!result.success) {
        alert(`Failed to delete: ${result.error}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Delete "{keyName}"?</span>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => setShowConfirm(true)}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
