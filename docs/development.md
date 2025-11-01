# Development Guide

## Prerequisites

- Bun 1.0+
- Postgres database (Neon recommended)

## Setup

1. **Install dependencies:**

\`\`\`bash
bun install
\`\`\`

2. **Set up environment variables:**

\`\`\`bash
# In apps/dashboard
cp .env.example .env.local
\`\`\`

Add your credentials:
- `DATABASE_URL` - Neon Postgres connection string
- Clerk API keys

3. **Run database migrations:**

\`\`\`bash
cd packages/db
bun db:push
\`\`\`

4. **Start development servers:**

\`\`\`bash
# From root
bun dev
\`\`\`

This starts:
- Dashboard: `http://localhost:3000`
- Docs: `http://localhost:3001`

## Project Structure

\`\`\`
cot/
├── apps/
│   ├── dashboard/          # Developer dashboard
│   └── docs/              # Documentation site
├── packages/
│   ├── schema/            # Zod schemas & types
│   ├── db/                # Database layer (Drizzle)
│   ├── engine/            # Entity engine
│   └── ui/                # Shared UI components (future)
└── content/               # Documentation content
\`\`\`

## Development Workflow

### Phase 1: Entity System (Current)

**Goal:** Create and store entity definitions

**Tasks:**
1. ✅ Project structure set up
2. ⏳ Implement EntityEngine.createEntity()
3. ⏳ Implement SchemaGenerator.generateTable()
4. ⏳ Build entity creation UI
5. ⏳ Test with "customer" entity

### Adding a New Feature

1. **Define schema** in `@cot/schema`
2. **Update database** if needed in `@cot/db`
3. **Implement logic** in `@cot/engine`
4. **Build UI** in dashboard
5. **Document** in docs site

## Commands

### Root
- `bun dev` - Start all apps (with Turbopack)
- `bun build` - Build all apps (with Turbopack)
- `bun lint` - Lint with Biome
- `bun format` - Format code with Biome
- `bun check` - Lint and format together
- `bun clean` - Clean all build artifacts

### Database
- `cd packages/db && bun db:push` - Push schema changes
- `cd packages/db && bun db:studio` - Open Drizzle Studio

### Dashboard
- `cd apps/dashboard && bun dev` - Start dashboard only

## Code Style

- Use TypeScript strictly
- Validate with Zod at boundaries
- Server Actions for mutations
- RSC for data fetching
- Tailwind for styling

## Testing Strategy

**Phase 1:**
- Manual testing via dashboard
- Verify database schema generation

**Future:**
- Unit tests for engine logic
- Integration tests for API
- E2E tests for critical flows
