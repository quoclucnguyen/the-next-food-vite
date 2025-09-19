# The Next Food

A React + TypeScript application that helps households track food inventory, plan meals, discover AI-assisted recipes, and generate smart shopping lists. The project is optimized for mobile-first usage while remaining responsive across devices, and integrates Supabase and Google Gemini AI for data storage and intelligent suggestions.

## Key Capabilities
- Inventory management with quantities, expiration tracking, and photo uploads
- Gemini-powered recipe discovery tailored to on-hand ingredients
- Meal planning calendar with AI autoplan and shortage highlights
- Smart shopping lists generated from meal plans and inventory gaps
- Multi-member household support with Supabase authentication and RLS
- Tailwind + shadcn/ui design system for consistent, accessible UI

## Technology Stack
- **Frontend**: React 19, TypeScript 5.8, Vite 7
- **UI**: Tailwind CSS 4, shadcn/ui, Radix primitives, Lucide icons
- **State & Data**: React Query 5, React Hook Form, Zod (planned), Zustand (optional)
- **Backend Services**: Supabase (Auth, Postgres, Storage), Google Gemini AI via `@google/genai`
- **Tooling**: pnpm, ESLint, Vitest + Testing Library, Mock Service Worker (planned), Sonner toasts

## Getting Started
1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd the-next-food-vite
   pnpm install
   ```
2. **Environment Variables** — create `.env.local` (never commit) with:
   ```env
   VITE_SUPABASE_URL="..."
   VITE_SUPABASE_ANON_KEY="..."
   VITE_GEMINI_API_KEY="..."
   ```
3. **Development Server**
   ```bash
   pnpm dev
   ```
   App runs at http://localhost:5173.
4. **Supabase Setup** — apply schema from `docs/design/database.md` and configure RLS policies, storage buckets, and auth redirects.
5. **Gemini Setup** — provision API key in Google AI Studio and review quota alerts.

See `docs/user-guide/installation.md` for detailed onboarding (tooling, optional setup).

## Available Scripts
- `pnpm dev` – run Vite dev server with HMR
- `pnpm build` – type-check then emit production bundle to `dist/`
- `pnpm preview` – serve the built bundle locally
- `pnpm lint` – run ESLint per `eslint.config.js`
- `pnpm test` – execute Vitest suite (add tests under `src/__tests__/` or alongside files)

## Project Structure
```
src/
  components/        # Shared components, design system wrappers
  components/ui/     # shadcn/ui primitives
  hooks/             # Custom hooks (useInventoryItems, useRecipes...)
  lib/               # Supabase/Gemini clients, utilities
  views/             # Route-level pages (inventory, recipes, meal-planning, shopping)
  router.tsx         # Application routing
public/              # Static assets
memory-bank/         # Living project context for Cline/Codex workflows
docs/                # Formal documentation suite (SRS, design, testing, user guides)
```

## Documentation Map
- Requirements: `docs/SRS.md`
- Design: `docs/design/architecture.md`, `docs/design/database.md`, `docs/design/ui.md`, `docs/design/process-flows.md`
- Testing: `docs/testing/test-plan.md`, `docs/testing/test-cases.md`, `docs/testing/bug-process.md`
- User Guides: `docs/user-guide/installation.md`, `docs/user-guide/user-manual.md`, `docs/user-guide/troubleshooting.md`
- Deployment & Ops: `docs/deployment/deployment-guide.md`, `docs/deployment/maintenance-guide.md`
- Diagrams (Mermaid): `docs/diagrams/*.md`

## Quality & Testing
- Follow the test strategy in `docs/testing/test-plan.md`
- Prioritize unit/component tests with Vitest + Testing Library; mock Supabase/Gemini via MSW fixtures.
- Run `pnpm lint` and `pnpm build` before committing to ensure type safety and bundle health.

## Deployment Overview
- Recommended hosting: Vercel/Netlify for static SPA + Supabase backend. Steps and configuration checklists in `docs/deployment/deployment-guide.md`.
- Monitor Supabase and Gemini usage; integrate Sentry/analytics per `docs/deployment/maintenance-guide.md`.

## Memory Bank Workflow
The project ships with a Memory Bank (`memory-bank/`) that Codex/Cline reads before tasks. Keep those files current and follow the workflow described in `AGENTS.md` to preserve long-term project knowledge.

## Contributing
1. Create feature branch using Conventional Commit naming (`feat/`, `fix/`, etc.).
2. Update relevant docs and Memory Bank entries for significant changes.
3. Ensure scripts (`pnpm lint`, `pnpm build`, `pnpm test`) pass before opening PR.
4. Include screenshots or clips for UI changes and note env impacts in the PR template.

## License
TBD — update this section once licensing decision is made.
