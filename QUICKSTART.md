# 🚀 Cot Platform - Quick Start Guide

**Build your first custom ERP in 10 minutes**

---

## Prerequisites

```bash
# 1. Start dashboard
cd apps/dashboard
bun dev

# Dashboard will run on http://localhost:3000
```

---

## Step 1: Create Your First Entity with AI (2 min)

### Go to AI Generator

1. Open `http://localhost:3000/ai`
2. Sign in with Clerk (create account if needed)

### Generate Entity

Type this prompt:
```
Create a customers module with name, email, phone, company, and status
```

Click **"Generate with AI"** ✨

### Review & Create

- AI generates complete entity definition
- Preview shows all fields with types
- Click **"Create Entity"**

**Result:** 
- ✅ Postgres table created: `tenant_xxx_customers`
- ✅ REST API live: `/api/v1/data/customers`
- ✅ Admin UI ready: `/entities/customers`

---

## Step 2: Add Some Data (3 min)

### Via Dashboard UI

1. Go to `/entities/customers`
2. Click **"Add Customer"**
3. Fill in the form:
   ```
   Name: Acme Corporation
   Email: contact@acme.com
   Phone: +1 555-0100
   Company: Acme Corp
   Status: active
   ```
4. Click **"Create Customer"**

**Result:** Customer saved to Postgres and visible in table view

---

## Step 3: Generate API Key (1 min)

1. Go to `/settings`
2. Click **"Create API Key"**
3. Name it: `Demo App`
4. Click **"Create Key"**
5. **COPY THE KEY** (you won't see it again!)

Example key: `sk_abc123def456...`

---

## Step 4: Set Up Demo App (2 min)

### Configure Environment

```bash
# Create .env.local in apps/demo
cd apps/demo
cp .env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_COT_API_URL=http://localhost:3000/api/v1
COT_API_KEY=sk_your_actual_key_here
```

### Start Demo App

```bash
bun dev --port 3003

# Demo app runs on http://localhost:3003
```

---

## Step 5: See It Work! (2 min)

### View Customers in Demo App

1. Open `http://localhost:3003/customers`
2. See your customer data fetched from Cot API!
3. Beautiful table UI with your data

### What Just Happened?

```
Dashboard (localhost:3000)
  ├─ Defined "customers" entity via AI
  ├─ Generated Postgres table
  ├─ Created REST API endpoints
  └─ Issued API key

Demo App (localhost:3003)
  ├─ Called GET /api/v1/data/customers
  ├─ Authenticated with API key
  ├─ Received customer data
  └─ Rendered in custom UI
```

---

## 🎉 **You Did It!**

You just:
- ✅ Used AI to design a database schema
- ✅ Auto-generated a Postgres table
- ✅ Created a REST API with authentication
- ✅ Built a custom UI consuming the API

**All in 10 minutes!**

---

## Next Steps

### Add More Entities

Try these AI prompts:

```
"Build a projects tracker with title, description, status, and due date"

"Create an invoices entity with customer, amount, date, and paid status"

"Make a tasks module with title, priority, assignee, and status"
```

### Test the REST API

```bash
# List customers
curl -H "Authorization: Bearer sk_your_key" \
  http://localhost:3000/api/v1/data/customers

# Create customer
curl -X POST \
  -H "Authorization: Bearer sk_your_key" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}' \
  http://localhost:3000/api/v1/data/customers

# Get one customer
curl -H "Authorization: Bearer sk_your_key" \
  http://localhost:3000/api/v1/data/customers/{id}

# Update customer
curl -X PATCH \
  -H "Authorization: Bearer sk_your_key" \
  -H "Content-Type: application/json" \
  -d '{"company":"Acme Industries"}' \
  http://localhost:3000/api/v1/data/customers/{id}

# Delete customer
curl -X DELETE \
  -H "Authorization: Bearer sk_your_key" \
  http://localhost:3000/api/v1/data/customers/{id}
```

### Build More Demo Pages

See `DEMO_SETUP.md` for detailed implementation guide.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ Cot Platform (Dashboard)                                │
│                                                          │
│  AI Generator → Entity Definition → Auto-Generate:      │
│                                                          │
│  1. Postgres Table                                      │
│  2. REST API Routes                                     │
│  3. Admin UI                                            │
│  4. Type-safe Schemas                                   │
│                                                          │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ REST API (API Key Auth)
                  │
┌─────────────────▼───────────────────────────────────────┐
│ Your App (Demo / Customer App)                          │
│                                                          │
│  CotClient → Fetch Data → Render Custom UI              │
│                                                          │
│  - You control the UI                                   │
│  - You control the UX                                   │
│  - You control the features                             │
│  - Cot handles the backend                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### 1. **AI-First Development**
Describe what you want → AI generates schema → Deploy instantly

### 2. **API-First Architecture**
Everything is accessible via REST API with OpenAPI-style endpoints

### 3. **Multi-Tenant**
Each tenant (organization) has isolated data and API keys

### 4. **Type-Safe**
Full TypeScript support with auto-generated types

### 5. **No Lock-In**
Your app consumes standard REST APIs - migrate anytime

---

## Troubleshooting

### "Failed to load customers"

**Check:**
1. Is dashboard running? (`http://localhost:3000`)
2. Did you create "customers" entity?
3. Is API key in `.env.local`?
4. Is `COT_API_KEY` correct?

### "Not authenticated"

**Check:**
1. Is Clerk configured? (See `apps/dashboard/.env.local`)
2. Did you sign in?
3. Is organization created?

### "Entity not found"

**Check:**
1. Go to `/entities` in dashboard
2. Verify entity exists
3. Use exact entity name in API calls

---

## Learn More

- **Architecture:** `docs/architecture.md`
- **Demo Setup:** `DEMO_SETUP.md`
- **Product Vision:** `docs/PRODUCT_VISION.md`
- **Development:** `docs/development.md`

---

## Support

- **GitHub:** [github.com/cot-industries/cot](https://github.com/cot-industries/cot)
- **Dashboard:** [cot.dev](https://cot.dev)
- **Docs:** [cot.industries](https://cot.industries)

---

**Built with ❤️ by Cot Industries**

*Making custom ERP development accessible to everyone.*
