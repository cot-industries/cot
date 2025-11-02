# LLM Context - Cot Platform

**Read this first. Everything you need to be productive immediately.**

---

## What is Cot?

API-first platform for building custom ERPs. Developers define entities (like "Customer" or "Project"), Cot auto-generates:
- Postgres tables
- REST APIs  
- Admin UI
- Type-safe schemas

**Think:** Meta-layer that creates ERPs dynamically, not a static ERP.

---

## Project Status

**Phase 0: Complete ✅**
- Monorepo scaffolded
- Core packages created
- Database schema designed
- Dashboard skeleton built

**Phase 1: In Progress ✅**
- ✅ EntityEngine.createEntity() implemented
- ✅ EntityEngine.listEntities() implemented
- ✅ EntityEngine.getEntity() implemented
- ✅ SchemaGenerator.generateTable() implemented
- ✅ Server actions for dashboard
- ✅ API routes for external access (/api/v1/entities)
- ✅ Entity list page with RSC
- ✅ Entity creation UI with dynamic field builder
- ⏳ Testing with real database (next step)

**Phase 2: Not Started**
- Dynamic data CRUD
- Relationships
- Workflows
- Generated UI (@cot/ui package)

---

## Tech Stack

- **Bun v1.3.1** - Package manager, runtime
- **Turborepo** - Monorepo builds (latest)
- **Next.js 16 canary** - Dashboard with **Turbopack enabled** (700x faster builds)
- **React 19 RC** - Latest with compiler
- **Drizzle ORM** - Database (type-safe SQL)
- **Neon Postgres** - Serverless database
- **Clerk** - Authentication (Account Portal mode)
- **Zod** - Runtime validation
- **Biome latest** - Linting & formatting (replaces ESLint + Prettier)
- **Tailwind CSS v4** - Bleeding-edge CSS-first configuration
- **shadcn/ui** - UI components (using v4 syntax from their monorepo)
- **lucide-react** - Icon library
- **next-themes** - Dark mode support

**All packages:** Using `latest`, `canary`, or `rc` tags (bleeding-edge)

---

## shadcn/ui v4 + Tailwind v4 (CRITICAL)

**We use Tailwind CSS v4 with shadcn components.** The shadcn CLI installs v3 syntax components by default. **Always convert CSS variable syntax:**

```tsx
// ❌ WRONG (Tailwind v3 - doesn't work with v4)
className="w-[--sidebar-width] h-[--header-height]"

// ✅ CORRECT (Tailwind v4 syntax)
className="w-(--sidebar-width) h-(--header-height)"
```

**CSS Variable Patterns:**
- Width: `w-(--var-name)`
- Height: `h-(--var-name)`
- Background: `bg-(--var-name)`
- Max width: `max-w-(--var-name)`
- In calc(): `w-[calc(var(--var-name)+(--spacing(4)))]`

**Getting v4 Components:**

Reference cloned shadcn repo at `/tmp/shadcn-ui/apps/v4/registry/new-york-v4/`:
- **UI components:** `/ui/sidebar.tsx`, `/ui/button.tsx`, etc.
- **Blocks (full examples):** `/blocks/dashboard-01/`, `/blocks/sidebar-07/`, etc.
- **After `bunx shadcn add <component>`:** Manually convert all `[--var]` → `(--var)`

**Sidebar Implementation Pattern:**
```tsx
<SidebarProvider>
  <AppSidebar collapsible="icon" />
  <SidebarInset>
    <header>
      <SidebarTrigger /> {/* Hamburger for mobile */}
      {/* Navbar content */}
    </header>
    <main>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

- `collapsible="icon"` - Desktop: collapses to icons (not hidden)
- `collapsible="offcanvas"` - Mobile: overlay sheet
- `<SidebarRail />` - Adds toggle button to sidebar edge
- `<SidebarInset>` - Main content container (pushes content, doesn't overlay)

**Component Structure:**
```
apps/dashboard/src/components/
├── ui/                  # shadcn components (check for v3 syntax!)
├── app-sidebar.tsx      # Navigation sidebar
├── top-navbar.tsx       # Header content (workspace selector, user menu)
├── theme-toggle.tsx     # Dark/light mode switcher
└── theme-provider.tsx   # next-themes wrapper
```

---

## Architecture (Critical)

### Two-Layer Database
1. **Meta-layer** (fixed schema):
   - `tenants` - Developer accounts
   - `entities` - Entity definitions (name, label, etc.)
   - `fields` - Field definitions per entity
   - `relationships` - Entity relationships

2. **Data-layer** (dynamic schema):
   - Creates tables: `tenant_{id}_{entity_name}`
   - Generated from entity definitions at runtime
   - Full Postgres features (indexes, FKs, etc.)

### Request Flow
```
User defines entity 
  → EntityEngine validates
  → Store in meta-tables
  → SchemaGenerator creates Postgres table
  → API auto-generated
```

---

## Key Files (Priority Order)

### Must Read
1. `packages/schema/src/entity.ts` - Entity type definitions
2. `packages/schema/src/field.ts` - Field types (15+ supported)
3. `packages/db/src/schema/` - Database schema (meta-layer)
4. `packages/engine/src/entity-engine.ts` - Core logic (✅ IMPLEMENTED)
5. `packages/engine/src/schema-generator.ts` - DDL generation (✅ IMPLEMENTED)

### Important
6. `apps/dashboard/src/app/(dashboard)/` - Dashboard pages (✅ entity list/create)
7. `apps/dashboard/src/app/actions/entities.ts` - Server actions (✅ IMPLEMENTED)
8. `apps/dashboard/src/app/api/v1/entities/` - API routes (✅ IMPLEMENTED)
9. `apps/dashboard/src/lib/tenant.ts` - Clerk integration (✅ IMPLEMENTED)
10. `docs/architecture.md` - Detailed design
11. `docs/MVP_PLAN.md` - What to build next

### Reference
9. `packages/engine/src/query-builder.ts` - Dynamic queries (future)
10. `content/` - User-facing docs

---

## Code Patterns

### Server Actions (Next.js 16)
```typescript
// apps/dashboard/src/app/actions.ts
"use server"
export async function createEntity(data: CreateEntityInput) {
  const engine = new EntityEngine();
  return await engine.createEntity(tenantId, data);
}
```

### Type Safety Flow
```typescript
// Define schema
EntityDefinitionSchema.parse(input) // Runtime validation

// Infer types
type Entity = z.infer<typeof EntityDefinitionSchema>

// Use in engine
async createEntity(tenantId: string, input: CreateEntityInput)
```

### Database Operations
```typescript
// Use Drizzle
import { db } from "@cot/db";
await db.insert(entities).values({...});

// Dynamic SQL for generated tables
await db.execute(sql.raw(`CREATE TABLE ...`));
```

---

## Current Work (Phase 1)

### Priority 1: Implement EntityEngine.createEntity()
**File:** `packages/engine/src/entity-engine.ts`

**Steps:**
1. Validate input with Zod
2. Check entity name doesn't exist (tenant + name unique)
3. Insert into `entities` table
4. Insert fields into `fields` table (with order)
5. Call `SchemaGenerator.generateTable()`
6. Return complete entity definition

### Priority 2: Complete SchemaGenerator.generateTable()
**File:** `packages/engine/src/schema-generator.ts`

**Steps:**
1. Build DDL from entity definition (mostly done)
2. Execute using Drizzle: `db.execute(sql.raw(ddl))`
3. Handle errors gracefully
4. Create indexes for unique fields

### Priority 3: Build Entity Creation UI
**File:** `apps/dashboard/src/app/(dashboard)/entities/page.tsx`

**Add:**
- Modal/Dialog for new entity
- Form with field builder
- Add/remove fields dynamically
- Field type selector
- Validation display

---

## Shared Packages

### @cot/ui ✨ (NEW - Shared UI Library)
**All 3 apps use this for consistent UI**

**Exports:**
- shadcn components: `Button`, `Input`, `Select`, `Sidebar`, `Sheet`, `Avatar`, `Dropdown`, etc.
- Theme: `ThemeProvider`, `ThemeToggle`
- Utils: `cn()`, `useIsMobile()`

**Usage:**
```tsx
import { Button, Sidebar, ThemeProvider } from "@cot/ui"
```

**Location:** `packages/ui/src/` (all Tailwind v4 syntax)

### @cot/db
**Database + Drizzle ORM helpers**
- `db` - Neon client
- Tables: `entities`, `fields`, `tenants`, `relationships`  
- **ORM helpers:** `eq`, `and`, `or`, `sql`, `desc`, `asc`

**CRITICAL:** Import helpers from `@cot/db`, NOT `drizzle-orm`:
```tsx
// ✅ CORRECT
import { db, eq, and } from "@cot/db"

// ❌ WRONG (version conflicts)
import { eq } from "drizzle-orm"
```

### @cot/schema
- Zod schemas + types
- `EntityDefinition`, `CreateEntityInput`, `FieldType`

### @cot/engine  
- `EntityEngine` - Entity CRUD
- `SchemaGenerator` - DDL generation

---

## Conventions

### Naming
- **Files:** kebab-case.ts
- **Components:** PascalCase.tsx
- **Types:** PascalCase
- **Functions:** camelCase
- **Database:** snake_case

### Structure
- Apps in `apps/`
- Shared code in `packages/`
- Internal docs in `docs/`
- User docs in `content/`

### Imports
```typescript
// Shared packages
import { Button, Sidebar, ThemeProvider } from "@cot/ui";
import { EntityDefinition } from "@cot/schema";
import { db, eq, and } from "@cot/db";
import { EntityEngine } from "@cot/engine";

// Internal app-specific components
import { AppSidebar } from "@/components/app-sidebar";
```

---

## Commands

```bash
# Install
bun install

# Dev (all apps)
bun dev

# Lint & Format
bun lint              # Check for issues
bun format            # Format code
bun check             # Both lint + format

# Database
cd packages/db && bun db:push    # Push schema
cd packages/db && bun db:studio  # View data

# Specific apps
cd apps/dashboard && bun dev     # Dashboard only
cd apps/docs && bun dev          # Docs only
```

---

## Field Types Reference

Supported types (from `packages/schema/src/field.ts`):

**Primitives:** text, number, boolean, date, datetime, time  
**Rich:** email, url, phone, currency, json  
**Relations:** relation (to other entities)  
**Files:** file, image  
**Advanced:** select, multiselect, computed

Each has specific config (min/max, options, formulas, etc.)

---

## Database Schema (Meta-Layer)

### tenants
```typescript
id: uuid
name: text
slug: text (unique)
clerkOrgId: text
created_at, updated_at
```

### entities
```typescript
id: uuid
tenantId: uuid (FK)
name: text
label: text
pluralLabel: text
description: text
timestamps: boolean
softDelete: boolean
created_at, updated_at
```

### fields
```typescript
id: uuid
entityId: uuid (FK)
name: text
label: text
type: text
required: boolean
unique: boolean
config: jsonb (type-specific)
order: integer
created_at, updated_at
```

---

## Common Pitfalls

1. **Don't use pnpm/npm** - Use bun
2. **Server Actions need "use server"** - Top of file
3. **Dynamic SQL needs sql.raw()** - For DDL generation
4. **Tenant isolation critical** - Always filter by tenantId
5. **Field order matters** - Use order column for UI
6. **Validate everything** - Use Zod at boundaries

---

## Testing Strategy

**Phase 1:** Manual testing via dashboard
- Create entity through UI
- Check meta-tables in Drizzle Studio
- Verify Postgres table created
- Confirm schema matches definition

**Future:** Unit tests for engine, E2E for dashboard

---

## Debugging

**Dashboard issues:**
- Check terminal for server action errors
- Remember: Server components = no hooks

**Database issues:**
- Use Drizzle Studio: `cd packages/db && bun db:studio`
- Check migrations: tables should exist

**Type errors:**
- Run: `bun type-check` in package/app
- Ensure @cot/* packages are imported correctly

---

## What NOT to Build Yet

- ❌ Relationships (Phase 3)
- ❌ Workflows (Phase 7)
- ❌ Webhooks (Phase 7)
- ❌ Permissions (Phase 8)
- ❌ Generated UI (Phase 4)
- ❌ API endpoints (Phase 2)

Focus: Entity definition system only.

---

## Example: Customer Entity

What a developer would create:
```typescript
{
  name: "customer",
  label: "Customer",
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true, unique: true },
    { name: "phone", type: "phone" }
  ]
}
```

What Cot generates:
- Postgres table: `tenant_abc123_customer`
- Columns: id, name, email, phone, created_at, updated_at
- Unique index on email
- Future: REST API at `/v1/data/customer`

---

## When Stuck

1. Check if feature is supposed to exist yet (see roadmap)
2. Look at type definitions in `@cot/schema`
3. Check database schema in Drizzle Studio
4. Read `docs/architecture.md` for design decisions
5. Ask user for clarification on business logic

---

## Goals

**Short term:** Complete Phase 1 (entity creation working end-to-end)

**Medium term:** Full CRUD on entity data, relationships

**Long term:** Complete ERP platform that competes with legacy systems

---

## Success Criteria

✅ Create entity via dashboard  
✅ Meta-tables populated  
✅ Postgres table generated  
✅ Can view entity in dashboard  

That's Phase 1 done.

---

**Last updated:** Initial version  
**Keep this file under 500 lines.**
