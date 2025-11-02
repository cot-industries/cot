"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Input } from "@cot/ui";
import { Loader2 } from "lucide-react";
import type { EntityDefinition } from "@cot/schema";
import { createRecord, updateRecord } from "@/app/actions/data";

/**
 * Dynamic form that renders fields based on entity definition
 * Supports create and edit modes
 */
export function EntityRecordForm({
  entity,
  record,
}: {
  entity: EntityDefinition;
  record?: Record<string, any>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: record || {},
  });

  async function onSubmit(data: Record<string, any>) {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = record?.id
        ? await updateRecord(entity.name, record.id, data)
        : await createRecord(entity.name, data);

      if (result.success) {
        router.push(`/entities/${entity.name}`);
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save record");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {entity.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            
            {renderFieldInput(field, register, errors)}
            
            {field.description && (
              <p className="text-muted-foreground text-xs">{field.description}</p>
            )}
            
            {errors[field.name] && (
              <p className="text-destructive text-xs">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {record ? "Update" : "Create"} {entity.label}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

/**
 * Render appropriate input based on field type
 */
function renderFieldInput(
  field: any,
  register: any,
  errors: any
) {
  const baseProps = {
    id: field.name,
    ...register(field.name, {
      required: field.required ? `${field.label} is required` : false,
    }),
  };

  switch (field.type) {
    case "text":
    case "email":
    case "url":
      return (
        <Input
          {...baseProps}
          type={field.type}
          placeholder={field.description || `Enter ${field.label.toLowerCase()}`}
          className={errors[field.name] ? "border-destructive" : ""}
        />
      );

    case "number":
    case "currency":
      return (
        <Input
          {...baseProps}
          type="number"
          step={field.type === "currency" ? "0.01" : "1"}
          placeholder={field.description || `Enter ${field.label.toLowerCase()}`}
          className={errors[field.name] ? "border-destructive" : ""}
        />
      );

    case "textarea":
      return (
        <textarea
          {...baseProps}
          rows={4}
          placeholder={field.description || `Enter ${field.label.toLowerCase()}`}
          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors[field.name] ? "border-destructive" : ""
          }`}
        />
      );

    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <input
            {...baseProps}
            type="checkbox"
            className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      );

    case "date":
      return (
        <Input
          {...baseProps}
          type="date"
          className={errors[field.name] ? "border-destructive" : ""}
        />
      );

    case "datetime":
      return (
        <Input
          {...baseProps}
          type="datetime-local"
          className={errors[field.name] ? "border-destructive" : ""}
        />
      );

    case "time":
      return (
        <Input
          {...baseProps}
          type="time"
          className={errors[field.name] ? "border-destructive" : ""}
        />
      );

    case "select":
      if (field.config?.options) {
        return (
          <select
            {...baseProps}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors[field.name] ? "border-destructive" : ""
            }`}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.config.options.map((opt: any) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }
      return <Input {...baseProps} placeholder={`Enter ${field.label.toLowerCase()}`} />;

    default:
      return (
        <Input
          {...baseProps}
          type="text"
          placeholder={field.description || `Enter ${field.label.toLowerCase()}`}
          className={errors[field.name] ? "border-destructive" : ""}
        />
      );
  }
}
