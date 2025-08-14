# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with alias `@` → `src` (see `vite.config.ts`).
- Views (routes): `src/views/<feature>/page.tsx` (e.g., `src/views/recipes/page.tsx`).
- Components: `src/components/` and design system in `src/components/ui/`.
- State/hooks: `src/hooks/` (`use-*.ts`), utilities/API: `src/lib/`, types: `src/types/`.
- Static assets: `public/` and `src/assets/`. Entry: `src/main.tsx`, router in `src/router.tsx`.

## Build, Test, and Development Commands
- `pnpm dev`: Start Vite dev server with HMR.
- `pnpm build`: Type-check (`tsc -b`) then build production bundle.
- `pnpm preview`: Serve the built app locally.
- `pnpm lint`: Run ESLint per `eslint.config.js`.

## Coding Style & Naming Conventions
- Language: TypeScript + React. Strict mode enabled in `tsconfig.app.json`.
- Imports: prefer alias `@/...` (e.g., `import { Button } from '@/components/ui/button'`).
- Components: PascalCase filenames (`MyWidget.tsx`), hooks `use-*.ts`, route files `page.tsx`.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`; use utility classes, avoid inline styles when possible.
- Linting: ESLint with React Hooks/Refresh plugins; fix issues before pushing (`pnpm lint`).

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Suggested patterns: colocate as `*.test.tsx` next to source or under `src/__tests__/`.
- Keep units focused (pure utils in `src/lib/*`), mock network/storage.

## Commit & Pull Request Guidelines
- Use Conventional Commits when possible: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
  - Examples: `feat(recipes): add recipe detail view`, `fix(inventory): correct unit conversion`.
- PRs should include: concise description, scope, linked issues, screenshots/GIFs for UI, and notes on env/config changes.
- Ensure CI basics locally: `pnpm lint` and `pnpm build` pass before requesting review.

## Security & Configuration Tips
- Environment: place secrets in `.env.local` (not committed). Vite exposes variables prefixed with `VITE_`.
  - Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `src/lib/supabase.ts`).
  - Gemini API key is set in-app via Settings; do not hardcode.
- Avoid committing real keys; rotate if leaked and update `.gitignore` as needed.
