"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@cot/ui";
import { Sparkles, Loader2, Check } from "lucide-react";
import { generateEntity } from "@/app/actions/ai";
import { createEntityAction } from "@/app/actions/entities";
import type { CreateEntityInput } from "@cot/schema";

/**
 * AI Chat Interface - Generate entities from natural language
 * Client Component for real-time interactivity
 */
export default function AIPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [generatedEntity, setGeneratedEntity] = useState<CreateEntityInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedEntity(null);

    try {
      const result = await generateEntity(prompt);

      if (result.success) {
        setGeneratedEntity(result.entity);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate entity");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCreate() {
    if (!generatedEntity) return;

    setIsCreating(true);
    setError(null);

    try {
      const result = await createEntityAction(generatedEntity);

      if (result.success && result.entity) {
        router.push(`/entities/${result.entity.name}`);
        router.refresh();
      } else {
        setError(result.error || "Failed to create entity");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entity");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Entity Generator</h2>
        <p className="text-muted-foreground mt-2">
          Describe what you want to build, and AI will generate the entity definition
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-lg border p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="text-sm font-medium">
              What do you want to build?
            </label>
            <p className="text-muted-foreground text-xs mt-1 mb-2">
              Example: "Create a customers module with name, email, phone, and company"
            </p>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="I want to build..."
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isGenerating}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Generated Entity Preview */}
      {generatedEntity && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Entity Generated</h3>
          </div>

          <div className="rounded-lg border">
            <div className="border-b p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold">{generatedEntity.label}</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    {generatedEntity.description}
                  </p>
                  <p className="text-muted-foreground font-mono text-xs mt-2">
                    Table: {generatedEntity.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h5 className="text-sm font-medium mb-3">Fields ({generatedEntity.fields.length})</h5>
              <div className="space-y-2">
                {generatedEntity.fields.map((field, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{field.label}</span>
                        {field.required && (
                          <span className="text-destructive text-xs">*</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-muted-foreground font-mono text-xs">
                          {field.name}
                        </span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-muted-foreground text-xs">{field.type}</span>
                      </div>
                      {field.description && (
                        <p className="text-muted-foreground text-xs mt-1">
                          {field.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-4 flex gap-3">
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Entity"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedEntity(null);
                  setPrompt("");
                }}
                disabled={isCreating}
              >
                Start Over
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Examples */}
      {!generatedEntity && !isGenerating && (
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-3">Example Prompts</h3>
          <div className="space-y-2">
            {[
              "Create a customers module with name, email, phone, and company",
              "Build a projects tracker with title, description, status, and due date",
              "Make an invoices entity with customer, amount, date, and paid status",
              "Create a tasks module with title, description, priority, assignee, and status",
            ].map((example, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(example)}
                className="text-muted-foreground hover:text-foreground text-left text-sm block w-full p-2 rounded hover:bg-muted transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
