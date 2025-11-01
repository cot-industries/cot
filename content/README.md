# Cot User Documentation

This folder contains user-facing documentation that appears on the documentation site (cot.dev).

## Structure

```
content/
├── quickstart.mdx              # 5-minute getting started
├── core-concepts/              # Fundamental concepts
│   ├── entities.mdx
│   ├── relationships.mdx
│   └── workflows.mdx
├── guides/                     # Step-by-step tutorials
│   ├── build-a-crm.mdx
│   └── build-inventory.mdx
└── api-reference/              # API documentation
    └── (auto-generated)
```

## Writing Guidelines

### Format
- Use MDX for all documentation
- Include code examples
- Add practical use cases

### Style
- **Concise** - Get to the point quickly
- **Code-first** - Show working code, then explain
- **Practical** - Real-world examples
- **Progressive** - Basic concepts first, then advanced

### Structure per page
1. **Title** - Clear, descriptive
2. **Brief intro** - What this page covers
3. **Code example** - Working code immediately
4. **Explanation** - Brief description
5. **Use cases** - When to use this
6. **Next steps** - Links to related topics

### Example Template

```mdx
# Feature Name

Brief one-sentence description.

## Quick Example

\`\`\`typescript
// Working code that demonstrates the feature
const example = await cot.feature.use();
\`\`\`

## How it works

Clear explanation of what's happening.

## Use cases

- When to use this feature
- Common scenarios

## Next steps

- [Related Feature](/link)
- [Advanced Guide](/link)
```

## Adding New Documentation

1. Create `.mdx` file in appropriate folder
2. Follow the structure above
3. Keep it under 500 words if possible
4. Test all code examples
5. Link from related pages

## Testing

Preview documentation site:
```bash
cd apps/docs
bun dev
```

Visit http://localhost:3001

---

**For internal documentation**, see [`/docs`](../docs/)
