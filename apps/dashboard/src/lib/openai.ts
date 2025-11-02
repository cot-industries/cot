import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY not set - AI features will be disabled");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

/**
 * System prompt for entity generation
 */
export const ENTITY_GENERATION_PROMPT = `You are an expert at designing database schemas for business applications.

Your task is to convert natural language descriptions into structured entity definitions.

Return ONLY valid JSON matching this exact TypeScript schema:

{
  name: string;           // snake_case, lowercase (e.g., "customers")
  label: string;          // Human-readable (e.g., "Customers")
  pluralLabel: string;    // Plural form (e.g., "Customers")
  description: string;    // Brief description
  icon: string;          // Lucide icon name (e.g., "users")
  fields: Array<{
    name: string;        // snake_case, lowercase
    label: string;       // Human-readable
    type: "text" | "email" | "number" | "currency" | "boolean" | "date" | "datetime" | "url" | "textarea" | "select";
    required: boolean;
    description?: string;
    config?: {
      options?: Array<{ label: string; value: string }>; // For select fields
    };
  }>;
}

Field type guidelines:
- text: Short text (names, titles)
- email: Email addresses
- number: Integers or decimals
- currency: Money amounts
- boolean: Yes/No flags
- date: Dates without time
- datetime: Dates with time
- url: Website URLs
- textarea: Long text (descriptions, notes)
- select: Dropdown with predefined options

Common patterns:
- Always include an "email" field for contacts
- Use "phone" for phone numbers (type: text)
- Use "status" as select with options like ["active", "inactive"]
- Use "notes" for additional information (type: textarea)
- Use "created_at" and "updated_at" are auto-added by system

Example input: "Create a customers module with name, email, phone, and company"

Example output:
{
  "name": "customers",
  "label": "Customer",
  "pluralLabel": "Customers",
  "description": "Customer contact and company information",
  "icon": "users",
  "fields": [
    { "name": "name", "label": "Name", "type": "text", "required": true },
    { "name": "email", "label": "Email", "type": "email", "required": true },
    { "name": "phone", "label": "Phone", "type": "text", "required": false },
    { "name": "company", "label": "Company", "type": "text", "required": false }
  ]
}

CRITICAL: Return ONLY the JSON object, no markdown, no explanation, no extra text.`;
