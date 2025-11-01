"use client";

import { useState } from "react";
import { Trash2, GripVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { Field, FieldType } from "@cot/schema";

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "Date & Time" },
  { value: "time", label: "Time" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
  { value: "phone", label: "Phone" },
  { value: "currency", label: "Currency" },
  { value: "select", label: "Select (Dropdown)" },
  { value: "multiselect", label: "Multi-Select" },
  { value: "json", label: "JSON" },
  { value: "relation", label: "Relation" },
  { value: "file", label: "File" },
  { value: "image", label: "Image" },
  { value: "computed", label: "Computed" },
];

interface FieldBuilderProps {
  fields: Partial<Field>[];
  onChange: (fields: Partial<Field>[]) => void;
}

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addField = () => {
    onChange([
      ...fields,
      {
        name: "",
        label: "",
        type: "text",
        required: false,
        unique: false,
      },
    ]);
    setEditingIndex(fields.length);
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates } as Partial<Field>;
    onChange(newFields);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
    setEditingIndex(null);
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= fields.length) return;

    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    onChange(newFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Fields</Label>
        <Button type="button" variant="outline" size="sm" onClick={addField}>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-dashed">
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No fields yet. Click "Add Field" to get started.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={index} className="p-4">
              <div className="flex gap-4">
                <div className="flex flex-col justify-center">
                  <button
                    type="button"
                    className="cursor-move text-muted-foreground hover:text-foreground"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid flex-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor={`field-name-${index}`} className="text-xs">
                      Field Name
                    </Label>
                    <Input
                      id={`field-name-${index}`}
                      value={field.name || ""}
                      onChange={(e) =>
                        updateField(index, { name: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                      }
                      placeholder="email_address"
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`field-label-${index}`} className="text-xs">
                      Label
                    </Label>
                    <Input
                      id={`field-label-${index}`}
                      value={field.label || ""}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="Email Address"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`field-type-${index}`} className="text-xs">
                      Type
                    </Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { type: value as any })}
                    >
                      <SelectTrigger id={`field-type-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-4">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required ?? false}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Required</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.unique ?? false}
                        onChange={(e) => updateField(index, { unique: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Unique</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
