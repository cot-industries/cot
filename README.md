# Cot - AI-First Business Software Platform

**Infrastructure for AI agents building software**

[![License](https://img.shields.io/badge/license-BSL%201.1-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)

---

## What Is Cot?

**Cot is the platform AI agents use to build and deploy business software.**

Define entities (like "customer" or "invoice"), and Cot automatically generates:
- ✅ Postgres database tables
- ✅ REST API endpoints (CRUD)
- ✅ Type-safe SDK
- ✅ Admin dashboard UI
- ✅ Data validation & relationships

**Think:**
- **Stripe** for payments
- **Neon** for databases  
- **Clerk** for auth
- **Cot** for business operations

---

## Quick Example

### Using the API
```typescript
// Create entity
const response = await fetch("https://api.cot.dev/v1/entities", {
  method: "POST",
  headers: {
    "Authorization": "Bearer cot_live_...",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "customer",
    label: "Customer",
    fields: [
      { name: "email", type: "email", required: true },
      { name: "full_name", type: "text", required: true },
      { name: "phone", type: "phone" }
    ]
  })
});

// Postgres table created, API endpoints generated automatically
```

### Using the Dashboard
1. Sign in at [cot.dev](https://cot.dev)
2. Click "Create Entity"
3. Define your data structure
4. Submit → Table + API created instantly

### Using AI Agents (Coming Soon)
```
You: "Build me a CRM for real estate agents"

Cot Agent: "Created entities: Property, Client, Inspection, Offer
            Generated APIs, database schema, and dashboard.
            Preview ready at cot.dev/preview/abc123"
```

---

## Why Cot?

### For Developers
- **Ship 10x faster** - No boilerplate, instant APIs
- **Type-safe** - Full TypeScript, Zod validation
- **Modern stack** - Next.js 16, React 19, Postgres
- **Vercel-native** - Deploy to edge instantly

### For AI Agents
- **API-first design** - Everything programmable
- **Predictable** - Validation catches LLM mistakes
- **Idempotent** - Safe to retry operations
- **Well-documented** - Clear schema for generation

### vs Competitors
- **vs Notion/Airtable:** Developer infrastructure, not end-user software
- **vs Supabase:** Business logic layer, not just database
- **vs No-code:** Full code access when you need it
- **vs Building custom:** 100x faster, maintained for you

---

> **Note:** Cot is licensed under the Business Source License 1.1. Free for development and internal use. Converts to Apache 2.0 in 2029. See [LICENSE](LICENSE) for details.

## Structure

```
cot/
├── apps/
│   ├── web/           # Marketing site (cot.industries)
│   ├── dashboard/     # Platform dashboard (cot.dev)
│   └── marketplace/   # Module registry (cot.land) - Phase 3
├── packages/
│   ├── engine/       # Entity engine, schema generator
│   ├── schema/       # Shared types, Zod schemas
│   ├── db/           # Database layer (Drizzle ORM)
│   └── ui/           # UI components (future)
└── docs/             # Internal documentation
```

### Domain Architecture

| Domain | App | Purpose |
|--------|-----|---------|
| **cot.industries** | `apps/web` | Marketing, docs, blog |
| **cot.dev** | `apps/dashboard` | Platform, user data |
| **cot.land** | `apps/marketplace` | Module registry (Phase 3) |

## Development

```bash
bun install
bun dev
```

## Tech Stack

- Next.js 16 (App Router, RSC, Server Actions)
- TypeScript
- Tailwind CSS + shadcn/ui
- Neon Postgres
- Upstash Redis
- Vercel
- Clerk

## Key Features

### Phase 1 (Current) ✅
- [x] Entity definition & management
- [x] Dynamic Postgres table generation
- [x] REST API endpoints (CRUD)
- [x] Server Actions for Next.js
- [x] Dashboard UI with entity builder
- [x] API key authentication
- [x] Tenant isolation

### Phase 2 (Next)
- [ ] Dynamic data CRUD operations
- [ ] Entity relationships (foreign keys)
- [ ] Data browser UI
- [ ] SDK package (`@cot/sdk`)
- [ ] Embeddable UI components

### Phase 3 (Future)
- [ ] Cot Agent (AI-driven entity generation)
- [ ] Workflow engine
- [ ] Webhooks
- [ ] Marketplace templates

See [docs/ROADMAP.md](./docs/ROADMAP.md) for full timeline.

---

## Documentation

### For Contributors
- **[Getting Started](./docs/GETTING_STARTED.md)** - Set up dev environment
- **[Development Guide](./docs/DEVELOPMENT.md)** - Workflow and commands
- **[Architecture](./docs/ARCHITECTURE.md)** - Technical design
- **[MVP Plan](./docs/MVP_PLAN.md)** - Current phase

### For Users (Coming Soon)
- **[Quickstart](./content/quickstart.md)** - First entity in 5 minutes
- **[Core Concepts](./content/core-concepts/)** - How Cot works
- **[API Reference](./content/api-reference/)** - Complete API docs

**🤖 AI Agents/Developers:** Read [`LLM.md`](./LLM.md) first for rapid onboarding.

**📍 Product Vision:** See [docs/PRODUCT_VISION.md](./docs/PRODUCT_VISION.md) and [docs/AGENT_VISION.md](./docs/AGENT_VISION.md)

## License

This project is licensed under the Business Source License 1.1. See [LICENSE](LICENSE) for details.

**TL;DR:**
- ✅ Free to use, modify, and self-host
- ✅ Free for internal business use
- ❌ Cannot offer as a hosted service to third parties
- 🔄 Converts to Apache 2.0 on 2029-01-01

For commercial hosting licenses, contact: hello@cot.dev
