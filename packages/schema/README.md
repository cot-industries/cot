# @cot/schema

Shared TypeScript types and Zod validation schemas for Cot platform.

## Usage

```typescript
import { EntityDefinitionSchema, CreateEntityInput } from "@cot/schema";

// Validate entity definition
const entity = EntityDefinitionSchema.parse(data);
```

## Schemas

- **Entity**: Business object definitions
- **Field**: Field type definitions and validation
- **Relationship**: Entity relationship definitions
- **Common**: Shared types and utilities
