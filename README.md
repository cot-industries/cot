# Cot - AI-First Custom ERP Platform

**Build custom ERPs in minutes, not months.**

Cot is an API-first, AI-first platform where developers define entities (like "customers" or "invoices") using natural language, and the platform auto-generates:

- ✅ **Postgres tables** (via Drizzle ORM)
- ✅ **REST APIs** (with API key authentication)
- ✅ **Admin UI** (CRUD operations with beautiful forms)
- ✅ **Type-safe schemas** (Zod validation)

## 🎯 Vision

A meta-layer for building ERPs dynamically. Instead of building a static ERP, **Cot lets you describe what you need and generates it instantly.**

```
User: "Create a customers module with name, email, phone, and company"

AI: ✨ Generates complete entity definition

Result: 
- Postgres table created
- REST API endpoints live
- Beautiful CRUD UI ready
- Type-safe TypeScript types
```

## 🚀 Current Status

**Phase 1: ✅ COMPLETE**
- Entity definitions
- Schema generation
- Full CRUD operations (DataEngine)
- REST API with authentication
- Dynamic forms
- Entity browser UI

**Phase 2: ✅ COMPLETE**
- **AI Entity Generator** - Natural language to full entity
- OpenAI GPT-4 integration
- Real-time preview
- One-click deployment

**Phase 3: 🚧 In Progress**
- Demo app (cot.ac)
- Entity relationships
- Marketplace for modules

## 🏗️ Architecture

### Monorepo Structure

```
cot/
├── apps/
│   ├── dashboard/      # Developer dashboard (cot.dev)
│   ├── web/           # Marketing site (cot.industries)
│   ├── marketplace/   # Module marketplace (cot.land)
│   └── demo/          # Demo instance (cot.ac)
├── packages/
│   ├── db/            # Database client + schema
│   ├── engine/        # Core business logic
│   ├── schema/        # Zod schemas + types
│   └── ui/            # Shared UI components
```

### Tech Stack

- **Runtime:** Bun 1.3.1
- **Framework:** Next.js 16 (canary), React 19 RC
- **Database:** Neon Postgres (serverless)
- **ORM:** Drizzle ORM
- **Auth:** Clerk (Account Portal mode)
- **AI:** OpenAI GPT-4o-mini
- **Styling:** Tailwind CSS v4, shadcn/ui (v4 syntax)
- **Validation:** Zod
- **Monorepo:** Turborepo

## 💻 Quick Start

### Prerequisites

- Bun 1.3.1+
- Neon Postgres database
- Clerk account
- OpenAI API key

### Installation

```bash
# Clone repo
git clone https://github.com/cot-industries/cot.git
cd cot

# Install dependencies
bun install

# Set up environment variables
cp apps/dashboard/.env.example apps/dashboard/.env.local

# Required environment variables:
# - DATABASE_URL (Neon connection string)
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - OPENAI_API_KEY

# Run dashboard locally
cd apps/dashboard
bun dev

# Open http://localhost:3000
```

### Create Your First Entity with AI

1. Navigate to **AI Generator** in sidebar
2. Enter: _"Create a customers module with name, email, phone, and company"_
3. Click **Generate with AI**
4. Review the generated entity
5. Click **Create Entity**
6. Start adding customers immediately!

## 📚 Documentation

See `docs/` for detailed documentation:

- [Product Vision](docs/PRODUCT_VISION.md) - What we're building
- [Architecture](docs/architecture.md) - Technical design
- [Development Guide](docs/development.md) - How to contribute
- [LLM Context](LLM.md) - AI assistant reference

## 🔑 Key Features

### 1. **AI Entity Generation**
Describe what you want in plain English:
```
"I need to track projects with title, description, status, and due date"
```

AI generates:
```typescript
{
  name: "projects",
  label: "Project",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "status", type: "select", config: { options: [...] } },
    { name: "due_date", type: "date", required: true }
  ]
}
```

### 2. **Dynamic Forms**
Forms auto-generate based on entity definitions:
- 10+ field types (text, email, number, date, select, etc.)
- Built-in validation
- Beautiful UI with react-hook-form

### 3. **REST API**
Every entity gets automatic API endpoints:
```bash
POST   /api/v1/data/customers       # Create
GET    /api/v1/data/customers       # List (with pagination)
GET    /api/v1/data/customers/:id   # Get one
PATCH  /api/v1/data/customers/:id   # Update
DELETE /api/v1/data/customers/:id   # Delete
```

All protected with API key authentication.

### 4. **Type Safety**
TypeScript types generated automatically:
```typescript
import { DataEngine } from "@cot/engine"

const engine = new DataEngine()
const customers = await engine.findMany(tenantId, customerEntity)
// customers is fully typed based on entity definition
```

## 🎨 UI/UX

Built with modern design principles:
- Vercel-inspired aesthetic
- Dark mode support
- Responsive (desktop + mobile)
- shadcn/ui components
- Tailwind CSS v4

## 🔐 Multi-Tenancy

Built-in tenant isolation:
- Every entity scoped to tenant
- Clerk organization mapping
- Data isolation at database level
- API keys per tenant

## 📈 Performance

- **Serverless:** Neon Postgres, Vercel deployment
- **Edge-ready:** Next.js 16 with Turbopack
- **Type-safe:** End-to-end TypeScript
- **Fast builds:** Turborepo caching

## 🛣️ Roadmap

### Q1 2025
- ✅ Core CRUD operations
- ✅ AI entity generation
- 🚧 Demo app
- 🚧 Entity relationships

### Q2 2025
- Module marketplace
- Webhooks & triggers
- Custom workflows
- Advanced permissions

### Q3 2025
- GraphQL API
- Real-time subscriptions
- Mobile SDK
- Self-hosting options

## 🤝 Contributing

We welcome contributions! See [DEVELOPMENT.md](docs/development.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **Website:** [cot.industries](https://cot.industries)
- **Dashboard:** [cot.dev](https://cot.dev)
- **Marketplace:** [cot.land](https://cot.land)
- **Demo:** [cot.ac](https://cot.ac)

---

**Built with ❤️ by [Cot Industries](https://cot.industries)**

*Making custom ERP development accessible to everyone.*
