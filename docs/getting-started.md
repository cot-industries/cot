# Getting Started with Cot

Welcome! This guide will walk you through setting up Cot for development.

## What We've Built

You now have a **complete foundation** for an API-first ERP platform:

- ✅ Monorepo structure (Turborepo + Bun)
- ✅ Type-safe schema definitions (Zod)
- ✅ Database layer (Drizzle ORM + Neon)
- ✅ Entity engine architecture
- ✅ Dashboard UI (Next.js 16 + shadcn/ui)
- ✅ Documentation structure (MDX)
- ✅ Authentication ready (Clerk)

## Quick Setup

### 1. Install Dependencies

```bash
bun install
```

This installs all packages across the monorepo.

### 2. Set Up Database

**Option A: Neon (Recommended)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

**Option B: Local Postgres**
```bash
# Install Postgres locally
# Create a database called 'cot'
```

### 3. Configure Environment Variables

```bash
cd apps/dashboard
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Clerk (get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs (defaults work for local dev)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Set Up Clerk

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Enable "Email" authentication
4. Copy API keys to `.env.local`
5. (Optional) Enable organizations for multi-tenancy

### 5. Initialize Database

```bash
cd packages/db
bun db:push
```

This creates the meta-tables (tenants, entities, fields, relationships).

### 6. Start Development

```bash
# From root directory
bun dev
```

This starts:
- **Dashboard**: http://localhost:3000
- **Docs**: http://localhost:3001

## Project Structure Explained

```
cot/
├── apps/
│   ├── dashboard/       # Developer-facing UI
│   │   ├── src/app/     # Next.js 16 app directory
│   │   │   ├── (auth)/  # Sign in/up pages
│   │   │   └── (dashboard)/  # Main dashboard
│   │   └── src/components/   # Sidebar, header, etc.
│   └── docs/            # Documentation site
│       └── content/     # MDX documentation files
├── packages/
│   ├── schema/          # Zod schemas & TypeScript types
│   │   └── src/
│   │       ├── entity.ts       # Entity definitions
│   │       ├── field.ts        # Field types
│   │       └── relationship.ts # Relationships
│   ├── db/              # Database layer (Drizzle ORM)
│   │   └── src/schema/
│   │       ├── tenants.ts      # Tenant table
│   │       ├── entities.ts     # Entity definitions table
│   │       ├── fields.ts       # Field definitions table
│   │       └── relationships.ts # Relationships table
│   └── engine/          # Core business logic
│       └── src/
│           ├── entity-engine.ts    # CRUD for entities
│           ├── schema-generator.ts # Generate Postgres DDL
│           └── query-builder.ts    # Dynamic queries
└── content/             # Documentation content (MDX)
```

## Understanding the Architecture

### Two-Layer Database Design

**Layer 1: Meta-data (Fixed Schema)**
Stores entity definitions in standard tables:
- `tenants` - Developer accounts
- `entities` - Entity definitions (name, label, etc.)
- `fields` - Field definitions for each entity
- `relationships` - Relationships between entities

**Layer 2: Entity Data (Dynamic Schema)**
For each entity, Cot creates a Postgres table:
- Table name: `tenant_{id}_{entity_name}`
- Columns based on field definitions
- Full Postgres features (indexes, foreign keys)

### Example Flow

When a developer creates a "customer" entity:

1. **Dashboard UI** → Server Action validates input
2. **EntityEngine** → Stores definition in `entities` and `fields` tables
3. **SchemaGenerator** → Creates `tenant_xxx_customer` table in Postgres
4. **API** → Auto-generates REST endpoints
5. **SDK** → Type-safe client code generated

## Next Steps: Phase 1 Implementation

Now that the foundation is set, here's what to build next:

### 1. Implement Entity Creation

**File:** `packages/engine/src/entity-engine.ts`

Complete the `createEntity()` method:
- Validate input with Zod
- Insert into `entities` table
- Insert fields into `fields` table
- Call SchemaGenerator to create table
- Return complete entity definition

### 2. Complete Schema Generator

**File:** `packages/engine/src/schema-generator.ts`

Finish the `generateTable()` method:
- Build DDL statement (already drafted)
- Execute using Drizzle's raw SQL
- Handle errors gracefully
- Add indexes for unique fields

### 3. Build Entity Creation UI

**File:** `apps/dashboard/src/app/(dashboard)/entities/page.tsx`

Add:
- Modal/sheet for creating entities
- Form with field builder
- Field type selector
- Validation display

### 4. Test with Customer Entity

Create a "customer" entity through the UI:
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

Verify:
- Record saved in `entities` and `fields` tables
- Postgres table created: `tenant_xxx_customer`
- Table has correct columns

## Development Tips

### Working with the Monorepo

- **Adding dependencies**: Run from specific package directory
- **Shared types**: Export from `@cot/schema`, import in other packages
- **Hot reload**: Changes in packages trigger dashboard reload

### Database Tools

- **Drizzle Studio**: Visual database browser
  ```bash
  cd packages/db && bun db:studio
  ```

- **Direct SQL**: Connect with any Postgres client using your `DATABASE_URL`

### Debugging

- **Server Actions**: Add console.logs, check terminal output
- **RSC**: Remember server components run on server, no `useState`
- **Database**: Check Drizzle Studio for what's actually stored

## Common Issues

**"Error: DATABASE_URL not found"**
→ Make sure `.env.local` exists in `apps/dashboard/`

**"Clerk: Missing publishable key"**
→ Add Clerk keys to `.env.local`

**"Module not found: @cot/schema"**
→ Run `bun install` from root

**Port 3000 already in use**
→ Change port in dashboard's package.json: `"dev": "next dev -p 3001"`

## Resources

- **Architecture**: See `ARCHITECTURE.md` for system design
- **Development**: See `DEVELOPMENT.md` for workflow
- **Documentation**: See `content/` for user-facing docs

## Your Residential Building ERP

Once Phase 1 is complete, you'll be able to recreate your residential building ERP using Cot:

1. Define entities: Project, Client, Quote, Invoice, etc.
2. Define relationships: Project → Client, Project → Invoices
3. Use generated APIs in your frontend
4. Customize UI with generated components

This validates the platform and serves as the **perfect demo** for other developers.

---

**Questions?** Check the documentation in `content/` or review architecture in `ARCHITECTURE.md`.

**Ready to code?** Start with implementing `EntityEngine.createEntity()` in Phase 1!
