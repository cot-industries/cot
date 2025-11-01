# Tech Stack - Cot

**Cutting-edge stack for 2025.**

## Core Framework
- **Next.js** `16.0.0-canary` - Cutting-edge with **Turbopack enabled** (dev + prod)
- **React** `19.0.0-rc` - Latest RC with React Compiler
- **TypeScript** `latest` - Latest with all new features
- **Bun** `latest` - Fastest JS runtime & package manager

### Turbopack
- ✅ Enabled in dev mode (`--turbo` flag)
- ✅ Enabled for production builds (experimental.turbopack)
- ⚡ 700x faster than Webpack
- ⚡ Incremental bundling
- ⚡ Hot Module Replacement (HMR) under 100ms

## Database & ORM
- **Neon Postgres** - Serverless Postgres (latest driver)
- **Drizzle ORM** `latest` - Type-safe SQL toolkit
- **Drizzle Kit** `latest` - Migration and studio tools

## Authentication & Security
- **Clerk** `latest` - Modern auth with organizations support
- **Zod** `latest` - Runtime validation & type safety

## UI & Styling
- **Tailwind CSS** `latest` - Utility-first CSS
- **shadcn/ui** - Radix UI components (all `latest`)
  - @radix-ui/react-dialog
  - @radix-ui/react-dropdown-menu
  - @radix-ui/react-label
  - @radix-ui/react-select
  - @radix-ui/react-slot
  - @radix-ui/react-tabs
- **Lucide React** `latest` - Beautiful icons
- **class-variance-authority** `latest` - Component variants
- **tailwind-merge** `latest` - Smart class merging

## Build & Dev Tools
- **Turborepo** `2.6.0` - High-performance monorepo builds
- **Biome** `latest` - Ultra-fast linting & formatting (replaces ESLint + Prettier)
- **PostCSS** `latest` - CSS processing
- **Autoprefixer** `latest` - CSS vendor prefixing

## Deployment
- **Vercel** - Zero-config deployment
- **Edge Functions** - Via Next.js middleware
- **Serverless Functions** - Via Next.js API routes

## Package Management Strategy

All packages use bleeding-edge versions:
- **Next.js**: `canary` - Get latest features before stable release
- **React**: `rc` - React 19 RC with compiler
- **Everything else**: `latest` - Always up-to-date
- **Workspace packages**: `workspace:*` for internal deps

This ensures:
- Cutting-edge features (Next.js 16, React 19 RC)
- Automatic updates via `bun update`
- Perfect for greenfield projects

## Update Strategy

```bash
# Update all packages to latest
bun update

# Update specific package
bun update <package-name>

# Check outdated
bun outdated
```

## Why This Stack?

### Performance
- ⚡ **Turbopack** - 700x faster than Webpack (written in Rust)
- ⚡ **Bun** - 3-4x faster than npm/pnpm
- ⚡ **Biome** - 35x faster than ESLint (written in Rust)
- ⚡ **Turborepo** - Parallelizes builds across packages
- ⚡ Edge deployment for low latency
- ⚡ React 19 Server Components reduce bundle size

### Developer Experience
- 🎯 Type-safety everywhere (TypeScript + Zod + Drizzle)
- 🎯 Hot reload under 100ms (Bun + Next.js)
- 🎯 shadcn/ui components copy-paste ready
- 🎯 Server actions eliminate API boilerplate

### Enterprise Ready
- 🏢 Clerk provides SSO, RBAC, organizations
- 🏢 Neon offers point-in-time recovery
- 🏢 Drizzle supports complex queries & migrations
- 🏢 Vercel provides 99.99% uptime SLA

### Future Proof
- 🚀 React 19 Compiler (automatic optimization)
- 🚀 Next.js 15+ features (Turbopack, PPR)
- 🚀 Bun native TypeScript (no transpilation)
- 🚀 All packages actively maintained

## Competitors Use Similar

- **Vercel Dashboard** - Next.js + shadcn/ui
- **Cal.com** - Next.js + Tailwind + shadcn
- **Dub.co** - Next.js + Tailwind + Turborepo
- **Trigger.dev** - Next.js + shadcn/ui

This is the standard for modern enterprise products in 2025.

---

**Last updated:** 2025-01-01  
**All packages:** `latest` (auto-update with `bun update`)
