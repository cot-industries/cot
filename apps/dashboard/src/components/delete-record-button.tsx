"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@cot/ui";
import { Trash2, Loader2 } from "lucide-react";
import { deleteRecord } from "@/app/actions/data";

/**
 * Delete record button with confirmation
 * Client Component for interactivity
 */
export function DeleteRecordButton({
  entityName,
  recordId,
}: {
  entityName: string;
  recordId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteRecord(entityName, recordId);

      if (result.success) {
        router.push(`/entities/${entityName}`);
        router.refresh();
      } else {
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
        <span className="text-sm text-muted-foreground">Are you sure?</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Delete
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
    <Button
      variant="outline"
      onClick={() => setShowConfirm(true)}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </Button>
  );
}
