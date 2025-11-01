# Restructure Plan - Three Domain Architecture

## Current Structure
```
apps/
├── dashboard/  → Currently mapped to cot.dev
└── docs/       → Currently mapped to localhost:3001 (no domain yet)
```

## Proposed Structure
```
apps/
├── web/         → cot.industries (marketing + public docs)
├── dashboard/   → cot.dev (platform/app) ✅ Keep as-is
└── marketplace/ → cot.land (module registry)
```

---

## Domain Mapping

| Domain | App | Purpose | Vercel Project |
|--------|-----|---------|----------------|
| **cot.industries** | `apps/web` | Marketing site, public docs, blog | `cot-web` |
| **cot.dev** | `apps/dashboard` | Dashboard, user data, platform | `cot-dashboard` |
| **cot.land** | `apps/marketplace` | Module registry, browse, install | `cot-marketplace` |

---

## Migration Steps

### 1. Rename `apps/docs` → `apps/web`
```bash
mv apps/docs apps/web
```

**Update:**
- `apps/web/package.json`: Change name to `@cot/web`
- `apps/web/README.md`: Update description
- Vercel project: Point to `apps/web`

**Content structure:**
```
apps/web/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── features/          # Features page
│   │   │   ├── pricing/           # Pricing page
│   │   │   └── about/             # About page
│   │   ├── docs/
│   │   │   ├── page.tsx           # Docs home
│   │   │   ├── getting-started/
│   │   │   ├── entities/
│   │   │   └── api-reference/
│   │   ├── blog/
│   │   │   ├── page.tsx           # Blog index
│   │   │   └── [slug]/            # Blog posts
│   │   └── legal/
│   │       ├── privacy/
│   │       └── terms/
│   └── components/
│       ├── marketing/             # Marketing components
│       └── docs/                  # Docs components
```

---

### 2. Keep `apps/dashboard` as-is ✅
No changes needed - already mapped correctly.

**Just update Vercel:**
- Domain: `cot.dev`
- Root directory: `apps/dashboard`

---

### 3. Create `apps/marketplace`
```bash
mkdir -p apps/marketplace
```

**Purpose:** Module registry (browse, search, install)

**Structure:**
```
apps/marketplace/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Homepage (browse modules)
│   │   ├── x/
│   │   │   └── [module]/          # Module detail page
│   │   │       └── page.tsx       # @creator/name
│   │   ├── search/
│   │   │   └── page.tsx           # Search modules
│   │   ├── creators/
│   │   │   └── [username]/        # Creator profile
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   └── [category]/        # Category browse
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── modules/           # Module metadata API
│   │       └── install/           # Installation endpoint
│   └── components/
│       ├── module-card.tsx
│       ├── search-bar.tsx
│       └── creator-badge.tsx
├── package.json
├── next.config.js
└── README.md
```

---

## Package.json Names

### Current
```json
{
  "name": "@cot/dashboard",  // ✅
  "name": "@cot/docs"        // ❌ Rename
}
```

### Proposed
```json
{
  "name": "@cot/web",         // cot.industries
  "name": "@cot/dashboard",   // cot.dev ✅
  "name": "@cot/marketplace"  // cot.land
}
```

---

## Vercel Projects

### Current (2 projects)
1. **cot-dashboard** → apps/dashboard
2. **cot-docs** → apps/docs (port 3001)

### Proposed (3 projects)
1. **cot-web** → apps/web → `cot.industries`
2. **cot-dashboard** → apps/dashboard → `cot.dev`
3. **cot-marketplace** → apps/marketplace → `cot.land`

---

## Turbo Configuration

**Update `turbo.json` if needed:**
```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

**Update root `package.json` workspaces** (if using npm/pnpm):
```json
{
  "workspaces": [
    "apps/web",
    "apps/dashboard",
    "apps/marketplace",
    "packages/*"
  ]
}
```

---

## Development URLs

After restructure:
```
bun dev

apps/web:          http://localhost:3002  (marketing)
apps/dashboard:    http://localhost:3000  (platform)
apps/marketplace:  http://localhost:3001  (registry)
```

**Update dev ports:**
- `apps/web/package.json`: `"dev": "next dev --turbo --port 3002"`
- `apps/dashboard/package.json`: `"dev": "next dev --turbo"`  # Default 3000
- `apps/marketplace/package.json`: `"dev": "next dev --turbo --port 3001"`

---

## Content Strategy

### cot.industries (Marketing)
**Homepage:**
- Hero: "The AI-First Business Software Platform"
- Features grid
- "How it works" section
- Customer testimonials (future)
- CTA: "Start building on cot.dev"

**Docs:**
- Getting started
- Core concepts
- API reference
- Guides
- Video tutorials

**Blog:**
- Product updates
- Customer stories
- Technical deep-dives

---

### cot.dev (Platform)
**Dashboard:**
- Entities list
- Data browser
- API keys
- Settings
- Billing (future)
- AI agent interface (future)

**No marketing content** - pure application

---

### cot.land (Marketplace)
**Homepage:**
- Featured modules
- Search bar
- Categories
- Top creators

**Module pages:**
- README
- Install instructions
- Reviews
- Creator info
- Dependencies

**No marketing content** - pure registry

---

## Migration Checklist

### Phase 1: Rename docs → web ✅
- [ ] `mv apps/docs apps/web`
- [ ] Update `apps/web/package.json` name
- [ ] Update `apps/web/README.md`
- [ ] Test: `bun dev` (should still work)
- [ ] Update Vercel project settings
- [ ] Point custom domain `cot.industries` to Vercel project

### Phase 2: Create marketplace app
- [ ] `mkdir apps/marketplace`
- [ ] Copy Next.js structure from dashboard
- [ ] Create basic homepage
- [ ] Add to Turborepo config
- [ ] Test: `bun dev`
- [ ] Create new Vercel project
- [ ] Point custom domain `cot.land` to Vercel project

### Phase 3: Update documentation
- [ ] Update README.md with new structure
- [ ] Update LLM.md
- [ ] Update docs/STRUCTURE.md (or create)

### Phase 4: Git cleanup
- [ ] Commit changes
- [ ] Push to GitHub
- [ ] Verify all Vercel projects deploy

---

## Timeline

**Today (30 minutes):**
- Rename apps/docs → apps/web
- Update package.json
- Test locally
- Update Vercel project

**This week (2 hours):**
- Create apps/marketplace skeleton
- Set up Vercel project for cot.land
- Point domains

**Next week (ongoing):**
- Build out marketing content for cot.industries
- Build out marketplace for cot.land
- Dashboard stays as-is (already working)

---

## Benefits of This Structure

1. **Clear separation** - Each domain has one purpose
2. **Independent scaling** - Scale marketing separately from app
3. **Team structure** - Marketing team works on web, eng on dashboard/marketplace
4. **SEO** - cot.industries ranks for marketing terms
5. **Developer clarity** - "Go to cot.dev to use it, cot.land to extend it"
6. **Onboarding flow** - industries → dev → land (discover → use → extend)

---

## Alternative: Keep Current Structure

If you want to keep it simpler for now:

```
apps/
├── docs/       → cot.industries (just rename later)
├── dashboard/  → cot.dev ✅
```

**Then add marketplace later:**
```
apps/
├── docs/        → cot.industries
├── dashboard/   → cot.dev
└── marketplace/ → cot.land (Phase 3)
```

**Pros:** Less work now
**Cons:** "docs" name doesn't match purpose (marketing site)

---

## Recommendation

**Rename now, create marketplace later:**

```
apps/
├── web/        → cot.industries (rename docs → web today)
├── dashboard/  → cot.dev (keep as-is)
└── marketplace → cot.land (create in Phase 3)
```

**Why:**
- Low effort to rename docs → web
- Makes structure clear for future
- Sets up good habits (proper naming)
- Easy to add marketplace later

**Do this today (10 min):**
1. Rename apps/docs → apps/web
2. Update package.json name
3. Update Vercel project
4. Point cot.industries domain

**Do later (Phase 3):**
1. Create apps/marketplace
2. Point cot.land domain

---

**This structure scales to 100+ apps if needed, but keeps it simple for now.** ✅
