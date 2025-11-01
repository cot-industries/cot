# Implementation Guide - Enterprise-Grade Cot

## Next.js 16 RSC + Server Actions Best Practices

This guide documents the patterns and practices we use to build Cot with enterprise-grade quality.

---

## Architecture Patterns

### 1. Server Components by Default (RSC)

**Rule:** Use Server Components unless you need interactivity.

```tsx
// ✅ GOOD: Server Component (default)
// app/entities/page.tsx
import { getCurrentTenantId } from "@/lib/tenant";
import { EntityEngine } from "@cot/engine";

export default async function EntitiesPage() {
  const tenantId = await getCurrentTenantId();
  const engine = new EntityEngine();
  const entities = await engine.listEntities(tenantId);

  return (
    <div>
      <h1>Entities</h1>
      {entities.map(entity => (
        <EntityCard key={entity.id} entity={entity} />
      ))}
    </div>
  );
}
```

```tsx
// ❌ BAD: Client Component when not needed
"use client";

export default function EntitiesPage() {
  const [entities, setEntities] = useState([]);
  
  useEffect(() => {
    fetch("/api/entities").then(r => r.json()).then(setEntities);
  }, []);
  
  // ...
}
```

### 2. Server Actions for Mutations

**Rule:** Use Server Actions for all data mutations (create, update, delete).

```tsx
// ✅ GOOD: Server Action
// app/actions/entities.ts
"use server";

import { revalidatePath } from "next/cache";
import { getCurrentTenantId } from "@/lib/tenant";
import { EntityEngine } from "@cot/engine";
import { CreateEntityInputSchema } from "@cot/schema";

export async function createEntityAction(formData: FormData) {
  // 1. Get tenant
  const tenantId = await getCurrentTenantId();
  
  // 2. Parse and validate input
  const input = CreateEntityInputSchema.parse({
    name: formData.get("name"),
    label: formData.get("label"),
    fields: JSON.parse(formData.get("fields") as string),
  });
  
  // 3. Execute business logic
  const engine = new EntityEngine();
  const entity = await engine.createEntity(tenantId, input);
  
  // 4. Revalidate affected paths
  revalidatePath("/entities");
  
  // 5. Return result
  return { success: true, entity };
}
```

```tsx
// ❌ BAD: API route for mutation
// app/api/entities/route.ts
export async function POST(req: Request) {
  // Adds unnecessary API layer
}
```

### 3. API Routes for External Access

**Rule:** API routes are for external developers (SDK, webhooks), not internal UI.

```tsx
// ✅ GOOD: API route for SDK/external usage
// app/api/v1/entities/route.ts
import { NextRequest } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { EntityEngine } from "@cot/engine";

export async function GET(req: NextRequest) {
  // Validate API key (not Clerk session)
  const { tenantId } = await validateApiKey(req);
  
  const engine = new EntityEngine();
  const entities = await engine.listEntities(tenantId);
  
  return Response.json({ 
    entities,
    _meta: {
      count: entities.length,
      timestamp: new Date().toISOString()
    }
  });
}

export async function POST(req: NextRequest) {
  const { tenantId } = await validateApiKey(req);
  const body = await req.json();
  
  const engine = new EntityEngine();
  const entity = await engine.createEntity(tenantId, body);
  
  return Response.json({ entity }, { status: 201 });
}
```

### 4. Data Fetching Patterns

**Parallel Fetching:**
```tsx
// ✅ GOOD: Parallel fetching
export default async function EntityDetailPage({ params }) {
  const tenantId = await getCurrentTenantId();
  const engine = new EntityEngine();
  
  // Fetch in parallel
  const [entity, records] = await Promise.all([
    engine.getEntity(tenantId, params.name),
    queryBuilder.findMany(tenantId, params.name),
  ]);
  
  return <EntityDetail entity={entity} records={records} />;
}
```

**Streaming with Suspense:**
```tsx
// ✅ GOOD: Stream data progressively
export default function EntityPage() {
  return (
    <div>
      <h1>Entities</h1>
      <Suspense fallback={<EntityListSkeleton />}>
        <EntityList />
      </Suspense>
    </div>
  );
}

async function EntityList() {
  const entities = await fetchEntities();
  return <div>{/* render */}</div>;
}
```

### 5. Error Handling

**Server-side errors:**
```tsx
// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Server Action errors:**
```tsx
"use server";

import { z } from "zod";

export async function createEntityAction(formData: FormData) {
  try {
    // Validation
    const input = CreateEntityInputSchema.parse(/* ... */);
    
    // Business logic
    const entity = await engine.createEntity(tenantId, input);
    
    return { success: true, entity };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Validation failed",
        issues: error.issues 
      };
    }
    
    if (error instanceof Error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    return { 
      success: false, 
      error: "Unknown error occurred" 
    };
  }
}
```

### 6. Type Safety End-to-End

**Zod schemas at boundaries:**
```tsx
// packages/schema/src/entity.ts
export const CreateEntityInputSchema = z.object({
  name: z.string().regex(/^[a-z_][a-z0-9_]*$/),
  label: z.string().min(1),
  fields: z.array(FieldSchema).min(1),
});

export type CreateEntityInput = z.infer<typeof CreateEntityInputSchema>;
```

**Type-safe server actions:**
```tsx
"use server";

import { CreateEntityInput, CreateEntityInputSchema } from "@cot/schema";

export async function createEntityAction(
  input: CreateEntityInput
): Promise<{ success: true; entity: Entity } | { success: false; error: string }> {
  // Type-safe throughout
}
```

### 7. Optimistic Updates

```tsx
"use client";

import { useOptimistic } from "react";
import { deleteEntityAction } from "@/app/actions/entities";

export function EntityList({ entities }) {
  const [optimisticEntities, deleteOptimistic] = useOptimistic(
    entities,
    (state, deletedId) => state.filter(e => e.id !== deletedId)
  );
  
  async function handleDelete(id: string) {
    // Update UI optimistically
    deleteOptimistic(id);
    
    // Perform actual deletion
    await deleteEntityAction(id);
  }
  
  return (
    <>
      {optimisticEntities.map(entity => (
        <EntityCard 
          key={entity.id} 
          entity={entity}
          onDelete={() => handleDelete(entity.id)}
        />
      ))}
    </>
  );
}
```

### 8. Caching Strategy

**Automatic caching:**
```tsx
// Default: fetch() results are cached
export default async function Page() {
  // Cached by default
  const data = await fetch("https://api.example.com/data");
  
  // Force no cache
  const fresh = await fetch("https://api.example.com/data", {
    cache: "no-store"
  });
  
  // Revalidate after 60 seconds
  const revalidated = await fetch("https://api.example.com/data", {
    next: { revalidate: 60 }
  });
}
```

**Manual revalidation:**
```tsx
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function createEntityAction(data) {
  const entity = await engine.createEntity(tenantId, data);
  
  // Revalidate specific path
  revalidatePath("/entities");
  
  // Or revalidate by tag
  revalidateTag("entities");
  
  return entity;
}
```

### 9. Loading States

**Route-level loading:**
```tsx
// app/entities/loading.tsx
export default function Loading() {
  return <EntitiesSkeleton />;
}
```

**Component-level suspense:**
```tsx
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <DataComponent />
    </Suspense>
  );
}
```

### 10. Form Handling

**Progressive Enhancement:**
```tsx
"use client";

import { useFormStatus, useFormState } from "react-dom";
import { createEntityAction } from "@/app/actions/entities";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Entity"}
    </button>
  );
}

export function EntityForm() {
  const [state, formAction] = useFormState(createEntityAction, null);
  
  return (
    <form action={formAction}>
      <input name="name" required />
      <input name="label" required />
      
      {state?.error && <p className="text-red-500">{state.error}</p>}
      
      <SubmitButton />
    </form>
  );
}
```

---

## File Structure Patterns

### App Directory Organization

```
apps/dashboard/src/app/
├── (auth)/                 # Auth routes (sign-in, sign-up)
│   ├── sign-in/
│   └── sign-up/
│
├── (dashboard)/            # Protected dashboard routes
│   ├── layout.tsx          # Dashboard layout (sidebar, header)
│   ├── dashboard/          # Overview page
│   ├── entities/           # Entity management
│   │   ├── page.tsx        # List entities (RSC)
│   │   ├── new/
│   │   │   └── page.tsx    # Create entity form
│   │   └── [name]/
│   │       ├── page.tsx    # Entity detail
│   │       └── edit/
│   │           └── page.tsx
│   ├── data/               # Data browser
│   │   └── [entity]/
│   │       ├── page.tsx    # Browse entity data
│   │       └── [id]/
│   │           └── page.tsx
│   └── settings/           # Settings
│
├── api/                    # API routes (external access)
│   └── v1/
│       ├── entities/
│       │   ├── route.ts    # GET, POST /api/v1/entities
│       │   └── [name]/
│       │       └── route.ts
│       └── data/
│           └── [entity]/
│               ├── route.ts
│               └── [id]/
│                   └── route.ts
│
├── actions/                # Server Actions
│   ├── entities.ts
│   └── data.ts
│
├── layout.tsx              # Root layout
├── page.tsx                # Home page
└── error.tsx               # Global error boundary
```

### Component Organization

```
apps/dashboard/src/components/
├── ui/                     # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── entities/               # Entity-specific components
│   ├── entity-card.tsx
│   ├── entity-form.tsx
│   ├── field-builder.tsx
│   └── entity-list.tsx
│
├── data/                   # Data-specific components
│   ├── data-table.tsx
│   ├── data-form.tsx
│   └── data-filters.tsx
│
├── layouts/                # Layout components
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── dashboard-shell.tsx
│
└── shared/                 # Shared components
    ├── loading-spinner.tsx
    └── empty-state.tsx
```

### Lib Organization

```
apps/dashboard/src/lib/
├── tenant.ts               # Tenant helpers (Clerk → Cot)
├── api-auth.ts             # API key validation
├── utils.ts                # General utilities (cn, etc.)
├── constants.ts            # App constants
└── validations.ts          # Extra Zod schemas
```

---

## Database Patterns

### Using Drizzle ORM

**Query patterns:**
```typescript
import { db } from "@cot/db";
import { entities, fields } from "@cot/db";
import { eq, and, desc } from "drizzle-orm";

// Simple query
const entity = await db.query.entities.findFirst({
  where: eq(entities.id, entityId),
});

// With relations
const entityWithFields = await db.query.entities.findFirst({
  where: eq(entities.id, entityId),
  with: {
    fields: {
      orderBy: [asc(fields.order)],
    },
  },
});

// Complex query
const tenantEntities = await db
  .select()
  .from(entities)
  .where(
    and(
      eq(entities.tenantId, tenantId),
      eq(entities.deleted, false)
    )
  )
  .orderBy(desc(entities.createdAt));
```

### Dynamic SQL (Schema Generation)

```typescript
import { sql } from "drizzle-orm";

// For DDL operations (CREATE TABLE, etc.)
await db.execute(sql.raw(`
  CREATE TABLE IF NOT EXISTS ${tableName} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ${columns.join(",\n    ")},
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )
`));

// Important: Sanitize table/column names to prevent SQL injection
function sanitizeIdentifier(name: string): string {
  // Only allow alphanumeric and underscores
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid identifier: ${name}`);
  }
  return name;
}
```

---

## Security Patterns

### 1. Tenant Isolation

**Always filter by tenantId:**
```typescript
// ✅ GOOD
const entities = await db.query.entities.findMany({
  where: eq(entities.tenantId, tenantId),
});

// ❌ BAD - Could leak data across tenants
const entities = await db.query.entities.findMany();
```

### 2. Input Validation

**Validate all inputs with Zod:**
```typescript
"use server";

export async function createEntityAction(input: unknown) {
  // Validate input
  const validated = CreateEntityInputSchema.parse(input);
  
  // Now safe to use
  const entity = await engine.createEntity(tenantId, validated);
}
```

### 3. API Key Authentication

```typescript
// lib/api-auth.ts
import { db } from "@cot/db";
import { apiKeys } from "@cot/db";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function validateApiKey(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing API key");
  }
  
  const apiKey = authHeader.slice(7);
  
  // Hash the key and look up
  const hashedKey = await hashApiKey(apiKey);
  const keyRecord = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.hashedKey, hashedKey),
  });
  
  if (!keyRecord || keyRecord.revokedAt) {
    throw new Error("Invalid API key");
  }
  
  return { tenantId: keyRecord.tenantId };
}
```

### 4. Rate Limiting

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 requests per hour
});

export async function POST(req: NextRequest) {
  const { tenantId } = await validateApiKey(req);
  
  const { success } = await ratelimit.limit(tenantId);
  
  if (!success) {
    return Response.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }
  
  // Process request
}
```

---

## Testing Patterns

### Unit Tests (Vitest)

```typescript
// packages/engine/src/entity-engine.test.ts
import { describe, it, expect } from "vitest";
import { EntityEngine } from "./entity-engine";

describe("EntityEngine", () => {
  it("should create entity with valid input", async () => {
    const engine = new EntityEngine();
    
    const entity = await engine.createEntity("tenant-123", {
      name: "customer",
      label: "Customer",
      fields: [
        { name: "email", type: "email", required: true },
      ],
    });
    
    expect(entity.name).toBe("customer");
    expect(entity.fields).toHaveLength(1);
  });
  
  it("should reject invalid entity name", async () => {
    const engine = new EntityEngine();
    
    await expect(
      engine.createEntity("tenant-123", {
        name: "Invalid Name", // Has space
        label: "Test",
        fields: [],
      })
    ).rejects.toThrow();
  });
});
```

### Integration Tests

```typescript
// apps/dashboard/__tests__/entities.test.ts
import { createEntityAction } from "@/app/actions/entities";

describe("Entity Actions", () => {
  it("should create entity and generate table", async () => {
    const result = await createEntityAction({
      name: "test_entity",
      label: "Test Entity",
      fields: [
        { name: "name", type: "text", required: true },
      ],
    });
    
    expect(result.success).toBe(true);
    
    // Verify table was created
    const tableExists = await checkTableExists("tenant_xxx_test_entity");
    expect(tableExists).toBe(true);
  });
});
```

---

## Performance Patterns

### 1. Database Indexes

```sql
-- Add indexes for common queries
CREATE INDEX entities_tenant_id_idx ON entities(tenant_id);
CREATE INDEX fields_entity_id_idx ON fields(entity_id);
CREATE INDEX entities_name_tenant_id_idx ON entities(name, tenant_id);
```

### 2. Redis Caching

```typescript
import { redis } from "@/lib/redis";

export async function getEntity(tenantId: string, name: string) {
  const cacheKey = `entity:${tenantId}:${name}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const entity = await db.query.entities.findFirst({
    where: and(
      eq(entities.tenantId, tenantId),
      eq(entities.name, name)
    ),
    with: { fields: true },
  });
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(entity));
  
  return entity;
}
```

### 3. Pagination

```typescript
export async function listEntities(
  tenantId: string,
  { page = 1, pageSize = 50 } = {}
) {
  const offset = (page - 1) * pageSize;
  
  const [entities, total] = await Promise.all([
    db.query.entities.findMany({
      where: eq(entities.tenantId, tenantId),
      limit: pageSize,
      offset,
    }),
    db.$count(entities, eq(entities.tenantId, tenantId)),
  ]);
  
  return {
    data: entities,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
```

---

## Monitoring & Observability

### Error Tracking (Sentry)

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// In server actions
export async function createEntityAction(input) {
  try {
    // ...
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: "createEntity" },
      extra: { input },
    });
    throw error;
  }
}
```

### Logging

```typescript
// lib/logger.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty" }
      : undefined,
});

// Usage
logger.info({ entityId, tenantId }, "Entity created");
logger.error({ error, entityId }, "Failed to create entity");
```

---

## Deployment

### Environment Variables

```bash
# .env.local (never commit)
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
COT_API_BASE_URL=https://api.cot.dev
SENTRY_DSN=https://...
```

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "bun run build",
  "installCommand": "bun install",
  "env": {
    "DATABASE_URL": "@database-url",
    "CLERK_SECRET_KEY": "@clerk-secret-key"
  },
  "regions": ["iad1", "sfo1"],
  "functions": {
    "app/api/**": {
      "maxDuration": 10
    }
  }
}
```

---

This is our standard for enterprise-grade implementation. Every feature follows these patterns.
