"use server";

import { openai, ENTITY_GENERATION_PROMPT } from "@/lib/openai";
import type { CreateEntityInput } from "@cot/schema";

/**
 * Generate entity definition from natural language prompt using OpenAI
 */
export async function generateEntity(
  prompt: string
): Promise<{ success: true; entity: CreateEntityInput } | { success: false; error: string }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: ENTITY_GENERATION_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "OpenAI returned empty response",
      };
    }

    // Parse JSON from response
    let entityDef: CreateEntityInput;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      entityDef = JSON.parse(jsonStr);
    } catch (parseError) {
      return {
        success: false,
        error: `Failed to parse OpenAI response: ${content}`,
      };
    }

    // Validate basic structure
    if (!entityDef.name || !entityDef.label || !entityDef.fields) {
      return {
        success: false,
        error: "Invalid entity definition: missing required fields",
      };
    }

    return { success: true, entity: entityDef };
  } catch (error) {
    console.error("Failed to generate entity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate entity",
    };
  }
}
