# Demo App Implementation Guide

## Architecture Overview

The demo app (`apps/demo`) is a **client application** that consumes the Cot platform APIs. It demonstrates how businesses would build their custom ERPs using Cot.

```
Dashboard (cot.dev) → Defines Entities → Generates APIs
                              ↓
Demo App (cot.ac) → Consumes APIs → Displays Custom UI
```

## Step-by-Step: Build Your First Demo Module

### Step 1: Create Entity in Dashboard

1. Go to `http://localhost:3000/ai` (dashboard)
2. Enter prompt: _"Create a customers module with name, email, phone, company, and status"_
3. Click "Generate with AI"
4. Review and click "Create Entity"
5. Note the entity name: `customers`

### Step 2: Generate API Key

Currently manual (we'll build UI later):

```sql
-- Connect to your Neon database
INSERT INTO api_keys (name, key, tenant_id, created_at)
VALUES (
  'Demo App',
  'sk_demo_' || gen_random_uuid()::text,
  'your-tenant-id-here',
  NOW()
);

-- Get the key
SELECT key FROM api_keys WHERE name = 'Demo App';
```

For now, let's build the infrastructure assuming we have an API key.

### Step 3: Set Up Demo App Environment

```bash
# apps/demo/.env.local
NEXT_PUBLIC_COT_API_URL=http://localhost:3000/api/v1
COT_API_KEY=sk_demo_xxx  # Your API key from Step 2
```

### Step 4: Create Cot API Client

```typescript
// apps/demo/src/lib/cot-client.ts
export class CotClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async listRecords(entity: string, options?: { limit?: number; offset?: number }) {
    const params = new URLSearchParams()
    if (options?.limit) params.set('limit', options.limit.toString())
    if (options?.offset) params.set('offset', options.offset.toString())

    const response = await fetch(
      \`\${this.baseUrl}/data/\${entity}?\${params}\`,
      {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(\`Failed to fetch \${entity}: \${response.statusText}\`)
    }

    return response.json()
  }

  async createRecord(entity: string, data: Record<string, any>) {
    const response = await fetch(\`\${this.baseUrl}/data/\${entity}\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(\`Failed to create \${entity}: \${response.statusText}\`)
    }

    return response.json()
  }

  async updateRecord(entity: string, id: string, data: Record<string, any>) {
    const response = await fetch(\`\${this.baseUrl}/data/\${entity}/\${id}\`, {
      method: 'PATCH',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(\`Failed to update \${entity}: \${response.statusText}\`)
    }

    return response.json()
  }

  async deleteRecord(entity: string, id: string) {
    const response = await fetch(\`\${this.baseUrl}/data/\${entity}/\${id}\`, {
      method: 'DELETE',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
      },
    })

    if (!response.ok) {
      throw new Error(\`Failed to delete \${entity}: \${response.statusText}\`)
    }

    return response.json()
  }
}

// Singleton instance
export const cotClient = new CotClient(
  process.env.NEXT_PUBLIC_COT_API_URL || 'http://localhost:3000/api/v1',
  process.env.COT_API_KEY || ''
)
```

### Step 5: Create Customers Page (Server Component)

```typescript
// apps/demo/src/app/customers/page.tsx
import { cotClient } from '@/lib/cot-client'
import { Button } from '@cot/ui'
import Link from 'next/link'

export default async function CustomersPage() {
  // Fetch customers from Cot API
  const { data: customers, meta } = await cotClient.listRecords('customers', {
    limit: 50
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button asChild>
          <Link href="/customers/new">Add Customer</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((customer: any) => (
              <tr key={customer.id}>
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.company || '-'}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                    {customer.status || 'active'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href=\`/customers/\${customer.id}\`>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {customers.length} of {meta.total} customers
      </p>
    </div>
  )
}
```

### Step 6: Create Form (Server Action)

```typescript
// apps/demo/src/app/actions/customers.ts
"use server"

import { cotClient } from '@/lib/cot-client'
import { revalidatePath } from 'next/cache'

export async function createCustomer(formData: FormData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    status: formData.get('status') || 'active',
  }

  try {
    await cotClient.createRecord('customers', data)
    revalidatePath('/customers')
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create customer'
    }
  }
}
```

```typescript
// apps/demo/src/app/customers/new/page.tsx
import { createCustomer } from '@/app/actions/customers'
import { Button, Input } from '@cot/ui'

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">New Customer</h1>

      <form action={createCustomer} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <Input name="name" required />
        </div>

        <div>
          <label className="text-sm font-medium">Email *</label>
          <Input name="email" type="email" required />
        </div>

        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input name="phone" type="tel" />
        </div>

        <div>
          <label className="text-sm font-medium">Company</label>
          <Input name="company" />
        </div>

        <Button type="submit">Create Customer</Button>
      </form>
    </div>
  )
}
```

## Key Concepts

### 1. **API-First**
Everything goes through REST API. No shared database, no shared code.

### 2. **Server Components**
Use RSC to fetch data server-side for better performance.

### 3. **Server Actions**
Use Server Actions for mutations (create, update, delete).

### 4. **Type Safety**
For production, generate TypeScript types from entity definitions.

### 5. **Error Handling**
Always handle API errors gracefully with user-friendly messages.

## Next Steps

1. **Build UI for API Key Management** in dashboard
2. **Add Entity Type Generation** for demo apps
3. **Create More Demo Modules** (projects, invoices, tasks)
4. **Add Authentication** to demo app (separate from Cot auth)
5. **Deploy Demo** to cot.ac

## Advanced: Auto-Generate Demo Pages

Future feature: Given an entity definition, auto-generate:
- List page
- Create form
- Edit form
- Detail view

This would be like shadcn CLI but for entire CRUD modules.
