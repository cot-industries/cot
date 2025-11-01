"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldBuilder } from "@/components/entities/field-builder";
import { createEntityAction } from "@/app/actions/entities";
import type { Field } from "@cot/schema";

export default function NewEntityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Partial<Field>[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createEntityAction({
        name,
        label,
        description: description || undefined,
        fields: fields as Field[],
      });

      if (!result.success) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to entities list
      router.push("/entities");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entity");
      setIsSubmitting(false);
    }
  };

  // Auto-generate entity name from label
  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (!name) {
      // Auto-generate machine name from label
      const autoName = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_");
      setName(autoName);
    }
  };

  const isValid = name && label && fields.length > 0 && fields.every((f) => f.name && f.type);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/entities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entities
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Entity</h1>
        <p className="mt-2 text-muted-foreground">
          Define a new business object and its data structure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Entity Details</CardTitle>
            <CardDescription>
              Basic information about your business object
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="Customer"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Human-friendly name (shown in UI)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="customer"
                  required
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Machine name (lowercase, underscores only)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Manages customer information and contacts"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fields</CardTitle>
            <CardDescription>
              Define the data structure for this entity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldBuilder fields={fields} onChange={setFields} />
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/entities">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Entity"}
          </Button>
        </div>
      </form>
    </div>
  );
}
