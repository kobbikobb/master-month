# Master Month - Project Context

## Architecture

**Monorepo Structure:**
- `core`: Shared business logic
- `functions`: Hono API handlers (Lambda)
- `scripts`: CLI tools
- `web`: React Router v7 frontend

**Key Decisions:**
- SST v3 for infrastructure and resource linking
- Biome for linting/formatting (not ESLint/Prettier)
- Hono for lightweight API routing
- TypeScript with `noEmit: true` (no JS file generation)
- Vitest for testing all packages

## Critical Patterns

**SST Resource Mocking:**
```typescript
vi.mock("sst", () => ({
    Resource: {
        MasterBucket: { name: "test-bucket" },
    },
}));

const { app } = await import("../api.js");
```
Mock SST Resources before importing modules. This allows testing without deployment.

**Quality Gates Order:**
1. Lint (fastest)
2. TypeCheck
3. Tests
4. Build (slowest)

## Constraints

- Keep it lean - minimal boilerplate demonstrating SST patterns
- No extra JS files from TypeScript compilation
- One test per module minimum
- Focus on infrastructure patterns, not features

## Common Gotchas

- Vite 7 requires explicit `rolldown` dependency in web package
- SST types require `sst dev` or type generation, but tests mock Resources
- Biome ignores: `.claude`, `dist`, CSS files (see biome.json)
