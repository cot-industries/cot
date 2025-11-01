# Cot MVP Plan - 3 Weeks to Working Demo

## The Core Question

**Can developers define entities and get working ERPs?**

Everything else (billing, teams, projects) is standard SaaS - not the risky part.

---

## What We're NOT Building Yet

❌ Billing/subscription plans  
❌ API keys/authentication tokens  
❌ Project management UI  
❌ Team invitations (Clerk does this)  
❌ Usage limits  
❌ Marketplace  
❌ Generated UI  
❌ Relationships  
❌ Workflows  

**These come later. First, prove the core value.**

---

## Week 1: Entity Definition UI

### Goal
Create an entity through the dashboard and save it.

### Tasks

**1. Tenant Integration (2 hours)**
- ✅ Create `lib/tenant.ts` helper
- Map Clerk org → Cot tenant
- Auto-create tenant on first access
- Simple 1:1 mapping (no complex projects)

**2. Entity Creation Form (1 day)**

File: `apps/dashboard/src/app/(dashboard)/entities/new/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function NewEntityPage() {
  const [fields, setFields] = useState([]);

  return (
    <div>
      <h1>Create Entity</h1>
      
      <form action={createEntityAction}>
        <Label>Entity Name</Label>
        <Input name="name" placeholder="customer" />
        
        <Label>Label</Label>
        <Input name="label" placeholder="Customer" />
        
        <div>
          <h3>Fields</h3>
          {fields.map((field, i) => (
            <FieldBuilder key={i} />
          ))}
          <Button onClick={addField}>Add Field</Button>
        </div>
        
        <Button type="submit">Create Entity</Button>
      </form>
    </div>
  );
}
```

**3. Server Action (1 day)**

File: `apps/dashboard/src/app/actions/entities.ts`

```tsx
"use server";

import { getCurrentTenantId } from "@/lib/tenant";
import { EntityEngine } from "@cot/engine";

export async function createEntityAction(formData: FormData) {
  const tenantId = await getCurrentTenantId();
  
  const engine = new EntityEngine();
  
  const entity = await engine.createEntity(tenantId, {
    name: formData.get("name"),
    label: formData.get("label"),
    fields: JSON.parse(formData.get("fields")),
  });
  
  return { success: true, entity };
}
```

**4. Entity List Page (1 day)**

File: `apps/dashboard/src/app/(dashboard)/entities/page.tsx`

```tsx
import { getCurrentTenantId } from "@/lib/tenant";
import { EntityEngine } from "@cot/engine";

export default async function EntitiesPage() {
  const tenantId = await getCurrentTenantId();
  const engine = new EntityEngine();
  const entities = await engine.listEntities(tenantId);

  return (
    <div>
      <h1>Entities</h1>
      <Link href="/entities/new">
        <Button>Create Entity</Button>
      </Link>
      
      {entities.map(entity => (
        <div key={entity.id}>
          <h3>{entity.label}</h3>
          <p>{entity.fields.length} fields</p>
        </div>
      ))}
    </div>
  );
}
```

**Deliverable:** Can create and list entities through UI

---

## Week 2: Make It Actually Work (Schema Generation)

### Goal  
Creating an entity generates a real Postgres table.

### Tasks

**1. Implement EntityEngine.createEntity() (2 days)**

File: `packages/engine/src/entity-engine.ts`

```typescript
async createEntity(tenantId: string, input: CreateEntityInput) {
  // 1. Validate
  const validated = CreateEntityInputSchema.parse(input);
  
  // 2. Check conflicts
  const existing = await db.query.entities.findFirst({
    where: and(
      eq(entities.tenantId, tenantId),
      eq(entities.name, validated.name)
    ),
  });
  
  if (existing) {
    throw new Error(`Entity "${validated.name}" already exists`);
  }
  
  // 3. Insert entity
  const [entity] = await db.insert(entities)
    .values({
      tenantId,
      name: validated.name,
      label: validated.label,
      // ... other fields
    })
    .returning();
  
  // 4. Insert fields
  await db.insert(fields).values(
    validated.fields.map((field, index) => ({
      entityId: entity.id,
      name: field.name,
      type: field.type,
      required: field.required,
      order: index,
      config: field, // Store full field config as JSON
    }))
  );
  
  // 5. Generate Postgres table
  const fullEntity = { ...entity, fields: validated.fields };
  await this.schemaGenerator.generateTable(tenantId, fullEntity);
  
  return fullEntity;
}
```

**2. Complete SchemaGenerator (2 days)**

File: `packages/engine/src/schema-generator.ts`

```typescript
async generateTable(tenantId: string, entity: EntityDefinition) {
  const tableName = this.getTableName(tenantId, entity.name);
  const columns = this.generateColumns(entity);
  
  const ddl = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ${columns.join(",\n      ")},
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  
  // Execute DDL
  await db.execute(sql.raw(ddl));
  
  // Create indexes for unique fields
  for (const field of entity.fields) {
    if (field.unique) {
      const indexName = `${tableName}_${field.name}_unique`;
      await db.execute(sql.raw(
        `CREATE UNIQUE INDEX IF NOT EXISTS ${indexName} ON ${tableName} (${field.name})`
      ));
    }
  }
}
```

**3. Test & Verify (1 day)**

- Create "customer" entity through UI
- Open Drizzle Studio: `cd packages/db && bun db:studio`
- Verify table exists: `tenant_xxx_customer`
- Verify columns match field definitions

**Deliverable:** Entity creation generates working Postgres tables

---

## Week 3: Basic Data Operations

### Goal
Add and view data using the entities you created.

### Tasks

**1. Data Browser UI (2 days)**

File: `apps/dashboard/src/app/(dashboard)/entities/[name]/page.tsx`

```tsx
export default async function EntityDataPage({ params }) {
  const tenantId = await getCurrentTenantId();
  const entityName = params.name;
  
  // Get entity definition
  const engine = new EntityEngine();
  const entity = await engine.getEntity(tenantId, entityName);
  
  // Get data
  const queryBuilder = new QueryBuilder();
  const records = await queryBuilder.findMany(tenantId, entity);
  
  return (
    <div>
      <h1>{entity.label}</h1>
      
      <Button href={`/entities/${entityName}/new`}>
        Add {entity.label}
      </Button>
      
      <table>
        <thead>
          <tr>
            {entity.fields.map(field => (
              <th key={field.name}>{field.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.id}>
              {entity.fields.map(field => (
                <td key={field.name}>{record[field.name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**2. Implement QueryBuilder (2 days)**

File: `packages/engine/src/query-builder.ts`

```typescript
async findMany(tenantId: string, entity: EntityDefinition) {
  const tableName = this.getTableName(tenantId, entity.name);
  
  const results = await db.execute(sql.raw(
    `SELECT * FROM ${tableName} ORDER BY created_at DESC LIMIT 100`
  ));
  
  return results.rows;
}

async create(tenantId: string, entity: EntityDefinition, data: Record<string, any>) {
  const tableName = this.getTableName(tenantId, entity.name);
  
  // Validate data against entity fields
  // Build INSERT statement
  // Execute and return
}
```

**3. Create Record Form (1 day)**

File: `apps/dashboard/src/app/(dashboard)/entities/[name]/new/page.tsx`

- Dynamic form based on entity fields
- Different inputs for different field types
- Server action to create record

**Deliverable:** Can add and view records for custom entities

---

## End of Week 3: The Demo

You can now show:

1. **Create Entity**
   - Open dashboard
   - Click "Create Entity"
   - Define "customer" with fields: name, email, phone
   - Click save

2. **See Generated Table**
   - Open Drizzle Studio
   - See `tenant_xxx_customer` table
   - Has correct columns

3. **Use the Entity**
   - Click "Customers" in dashboard
   - Click "Add Customer"
   - Fill form, save
   - See customer in list

**This is the wow moment.** You've proven the core concept works.

---

## What Comes After MVP (Phase 2+)

Once the core works, add infrastructure:

### Phase 2: API Generation
- Auto-generate REST endpoints
- API key management
- SDK generation

### Phase 3: Relationships
- One-to-many
- Many-to-many
- Foreign keys

### Phase 4: SaaS Infrastructure
- Stripe billing
- Usage limits
- Plan tiers

### Phase 5: Advanced Features
- Workflows
- Webhooks
- Generated UI
- Marketplace

---

## Why This Order Works

1. **De-risks the hard part** - Entity system is unique/complex
2. **Fast feedback** - See it working in 3 weeks
3. **Clerk handles auth** - Don't rebuild what exists
4. **Can demo early** - Show to users, get feedback
5. **Iterative** - Add infrastructure once proven

---

## Common Pitfalls to Avoid

❌ **Building projects/workspaces first** - 3 weeks for no value  
❌ **Building billing first** - Need users before monetization  
❌ **Perfect UI** - Make it work, make it pretty later  
❌ **All field types** - Start with text, number, boolean  
❌ **Relationships** - Single entities first  

✅ **Just make entity creation → table generation work**

---

## Success Criteria

After 3 weeks, you can answer YES to:

- [ ] Can I create an entity through the UI?
- [ ] Does it generate a Postgres table?
- [ ] Can I add records to that entity?
- [ ] Can I view the records?

If yes to all four: **MVP is done. Ship it to beta users.**

---

**Start here:** Implement `lib/tenant.ts` and wire up Clerk → tenant mapping.
