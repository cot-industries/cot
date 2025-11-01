# Cot Architecture

This document describes the technical architecture of Cot.

## Overview

Cot uses a **two-layer database architecture**:

1. **Meta-layer**: Fixed Postgres tables that store entity definitions
2. **Data-layer**: Dynamic tables created at runtime to store actual entity data

This approach provides flexibility while maintaining query performance.

## System Components

### 1. Database Layer (`@cot/db`)

**Meta-tables:**
- `tenants` - Developer accounts
- `entities` - Entity definitions
- `fields` - Field definitions per entity
- `relationships` - Entity relationships

**Dynamic tables:**
- Created per entity as `tenant_{id}_{entity_name}`
- Schema based on field definitions
- Full Postgres features (indexes, foreign keys, constraints)

### 2. Schema Layer (`@cot/schema`)

Zod schemas for validation:
- Entity definitions
- Field types
- Relationships
- Common types

Provides type safety across the entire stack.

### 3. Engine Layer (`@cot/engine`)

**EntityEngine:**
- Manages entity lifecycle
- Orchestrates schema generation
- Validates definitions

**SchemaGenerator:**
- Converts entity definitions to Postgres DDL
- Creates tables, columns, indexes
- Handles migrations

**QueryBuilder:**
- Builds dynamic SQL queries
- Handles filtering, sorting, pagination
- Manages relationships

### 4. Dashboard App (`@cot/dashboard`)

Developer UI built with Next.js 16:
- Entity builder (visual designer)
- Field configuration
- Relationship designer
- API testing playground
- Generated documentation

### 5. Docs App (`@cot/docs`)

Documentation site with MDX:
- Quickstart guide
- Core concepts
- Tutorials
- API reference

## Data Flow

### Creating an Entity

1. Developer defines entity in dashboard
2. Dashboard calls Server Action
3. Server Action validates with Zod (`@cot/schema`)
4. EntityEngine stores definition in meta-tables
5. SchemaGenerator creates Postgres table
6. API endpoints auto-generated

### Querying Data

1. Client calls REST API
2. API validates tenant and entity exists
3. QueryBuilder constructs SQL query
4. Execute against dynamic table
5. Return validated results

## Multi-Tenancy

Each tenant gets:
- Isolated database tables (tenant-specific prefix)
- Separate API keys
- Isolated Redis cache namespace
- Subdomain (optional)

## Tech Stack

**Core:**
- TypeScript
- Next.js 16 (App Router, RSC, Server Actions)
- Drizzle ORM
- Zod validation

**Infrastructure:**
- Neon Postgres (serverless)
- Vercel (hosting)
- Upstash Redis (caching)
- Clerk (authentication)

**UI:**
- Tailwind CSS
- shadcn/ui (Radix UI)
- Lucide icons

## Deployment

**Monorepo** managed by Turborepo and Bun workspaces:
- Dashboard deploys to Vercel
- Docs deploys to Vercel
- Shared packages used across apps

## Future Architecture

**Phase 2:**
- Workflow engine (state machines)
- Webhook system
- Real-time subscriptions

**Phase 3:**
- Marketplace for modules
- Plugin system
- Multi-region support
