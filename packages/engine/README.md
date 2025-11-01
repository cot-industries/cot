# @cot/engine

Core entity engine for Cot platform.

## Components

### EntityEngine
Manages entity definitions and orchestrates schema generation.

### SchemaGenerator
Generates Postgres DDL from entity definitions. Creates actual database tables for storing entity data.

### QueryBuilder
Builds dynamic SQL queries for entity CRUD operations.

## Usage

```typescript
import { EntityEngine } from "@cot/engine";

const engine = new EntityEngine();

// Create an entity
const customer = await engine.createEntity(tenantId, {
  name: "customer",
  label: "Customer",
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true, unique: true },
  ],
});
```

## Architecture

The engine uses a **two-layer** database approach:

1. **Meta-layer**: Stores entity definitions in fixed tables
2. **Data-layer**: Dynamically creates tables for storing actual entity data

This allows full flexibility while maintaining query performance.
