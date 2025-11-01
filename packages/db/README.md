# @cot/db

Database layer for Cot platform using Drizzle ORM and Neon Postgres.

## Schema

The database stores **meta-data** about entities, fields, and relationships:

- `tenants` - Developer accounts
- `entities` - Entity definitions (Customer, Project, etc.)
- `fields` - Field definitions for each entity
- `relationships` - Relationships between entities

Dynamic entity data is stored in tenant-specific schemas created at runtime.

## Usage

```typescript
import { db } from "@cot/db";

const entities = await db.query.entities.findMany();
```

## Commands

- `bun db:generate` - Generate migrations
- `bun db:migrate` - Run migrations
- `bun db:push` - Push schema changes
- `bun db:studio` - Open Drizzle Studio
