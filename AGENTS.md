# AGENTS.md

## Project

Rangel Guitar — Next.js 16 app (React 19, TypeScript) for guitarists to browse songs, chords, scales, and artists. Spanish-first i18n via `next-intl`. Backend is Supabase (auth + Postgres).

## Commands

```bash
bun install            # install deps
bun run dev            # dev server → localhost:3000
bun run lint           # biome check (format + lint)
bun run lint:fix       # biome check --write
bun run type-check     # tsc --noEmit
bun run build          # next build
bun run test           # vitest (unit)
bun run prw:test       # playwright (E2E, needs dev server)
bun run doctor         # react-doctor scan
```

Pre-commit hook runs: `type-check → lint-staged (biome) → react-doctor → build`. All must pass.

## Verification order

`lint → type-check → test → build`

## Branch & release

Default branch is **master**. Semantic-release runs on push to master via GitHub Actions (`.releaserc`).

## Toolchain specifics

- **Linter/formatter**: Biome (NOT ESLint). Config in `biome.json`.
  - Single quotes, no trailing commas, semicolons only as needed, 2-space indent, LF endings.
  - `src/components/ui/*` is excluded from lint checks (shadcn-managed).
- **Path alias**: `@/` → `src/` (configured in `tsconfig.json` and `vitest.config.ts`).
- **Testing**: Vitest with jsdom + `@testing-library/react`. E2E via Playwright (chromium only). Tests live in `src/__tests__` (gitignored).
- **UI components**: shadcn/ui. Run `bunx shadcn@latest add <component>` to add. Config in `components.json`.
- **`next.config.ts` has `typescript.ignoreBuildErrors: true`** — `tsc` catches issues that build won't. Always run `type-check` explicitly.

## Architecture

Domain-based structure under `src/`. Each domain owns its components, services, and types.

```
src/
├── app/[locale]/     # Next.js routes (only routing, no business logic)
├── auth/             # Auth providers, hooks, stores, services
├── components/       # Domain components (flat, not nested by domain)
├── context/          # React context providers
├── hooks/            # Shared hooks
├── i18n/             # next-intl config (routing, locales: en/es)
├── lib/              # Utilities (utils, supabase client)
├── proxy.ts          # Middleware: i18n routing + Supabase session refresh
├── services/         # Data access layer (Supabase queries)
└── types/            # Shared TypeScript types
```

- `src/components/ui/` — shadcn primitives (don't lint/doctor these).
- `src/proxy.ts` — middleware that handles i18n locale detection and Supabase auth session refresh. Not named `middleware.ts` by convention; check the Next.js config for how it's wired.

## Key conventions

- Server Components by default; `'use client'` only when state/effects are needed.
- No `React.FC` — define props as `interface` or `type`.
- Validate external data with `zod`.
- Use semantic HTML elements. Add `aria-label` to interactive elements.
- All styling via Tailwind CSS — no custom CSS unless strictly necessary.
- Locale default is `es`. URL pathnames are localized (e.g., `/entrar` for `/login` in Spanish).

## Environment

Required env vars (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Never commit `.env` files.
