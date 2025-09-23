# Tech Context

## Technologies and Frameworks Used (synced to package.json)

### Frontend Stack

- React: ^19.1.0
- TypeScript: ~5.8.3
- Vite: ^7.0.4
- React Router: ^7.7.0
- React DOM: ^19.1.0

### UI and Styling

- Tailwind CSS: ^4.1.11
- shadcn/ui (Radix + custom components)
- Radix UI packages (various @radix-ui/\* versions in dependencies)
- Lucide React: ^0.525.0
- class-variance-authority: ^0.7.1
- tailwind-merge: ^3.3.1
- tw-animate-css: ^1.3.5
- sonner: ^2.0.6

### State Management

- @tanstack/react-query: ^5.83.0
- React Context API for global UI/prefs
- react-hook-form: ^7.60.0
- zod (used in project patterns) — ensure installed if used in code

### Backend and Database

- @supabase/supabase-js: ^2.52.0 (Supabase for auth, DB, realtime)
- PostgreSQL (via Supabase)
- Row Level Security (RLS) enforced on tables

### AI Integration

- @google/genai: ^1.10.0 (Gemini/GenAI client wrapper in dependencies)
- Custom Gemini client wrappers live under `src/lib/gemini/*`; cosmetics image analysis is wired end-to-end, while recipe generation currently surfaces a stubbed error until the Gemini client implements `generateCompleteRecipe`.

### Core Dependencies (from package.json)

- @google/genai: ^1.10.0
- @radix-ui/\*: various (accordion, dialog, dropdown-menu, etc.)
- @supabase/supabase-js: ^2.52.0
- @tailwindcss/vite: ^4.1.11
- @tanstack/react-query: ^5.83.0
- class-variance-authority: ^0.7.1
- clsx: ^2.1.1
- cmdk: ^1.1.1
- embla-carousel-react: ^8.6.0
- input-otp: ^1.4.2
- lucide-react: ^0.525.0
- react: ^19.1.0
- react-day-picker: ^9.8.0
- react-dom: ^19.1.0
- react-hook-form: ^7.60.0
- react-resizable-panels: ^3.0.3
- react-router: ^7.7.0
- recharts: ^3.1.0
- sonner: ^2.0.6
- tailwind-merge: ^3.3.1
- tailwindcss: ^4.1.11
- vaul: ^1.1.2
- zustand: ^5.0.6

### Dev Dependencies (from package.json)

- @testing-library/jest-dom: ^6.6.3
- @testing-library/react: ^16.0.1
- @testing-library/user-event: ^14.6.1
- @eslint/js: ^9.30.1
- @types/node: ^24.0.15
- @types/react: ^19.1.8
- @types/react-dom: ^19.1.6
- @types/react-router: ^5.1.20
- @vitejs/plugin-react-swc: ^3.10.2
- jsdom: ^24.1.3
- eslint: ^9.30.1
- eslint-plugin-react-hooks: ^5.2.0
- eslint-plugin-react-refresh: ^0.4.20
- globals: ^16.3.0
- typescript: ~5.8.3
- typescript-eslint: ^8.35.1
- vite: ^7.0.4
- vitest: ^2.1.4

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm or npm (packageManager: pnpm@9.12.3 in repository)
- Git
- VS Code or equivalent editor

### Environment Variables

Required environment variables (used by the app):

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_GEMINI_API_KEY

### Development Commands

```bash
# Install dependencies (pnpm recommended)
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run tests
pnpm run test

# Run linting
pnpm run lint

# Format code
# (project uses configured formatter; run project-specific script or editor formatting)
```

## Project Structure (short)

- src/components — UI and shared components
- src/components/layouts — AppLayout, navigation, bottom-nav
- src/hooks — custom hooks (`useFoodItems`, `useCosmetics`, `useCosmeticEvents`, `useCosmeticReminders`, etc.)
- src/lib — clients (gemini, supabase) and utils
- src/views — page-level components (inventory, cosmetics, recipes, meal-planning, shopping-list)
- src/test — test setup and utilities

## Technical Constraints & Notes

- Bundle target and Vite config require modern browsers (ES2020 target).
- Image uploads limited by Supabase storage limits; keep images optimized.
- Gemini API usage has rate and quota limits — implement retry/backoff; recipe flows currently block on API client enhancements.
- Supabase rate limits depend on plan; implement caching and debounce where appropriate.
- Cosmetics tables (`cosmetics`, `cosmetic_events`, `cosmetic_reminders`, `cosmetic_category_types`) ship via migration; keep schema updates in migrations and reflect typings in `src/lib/supabase.ts`.
- Keep secrets out of source; use environment variables and CI secrets.

## Repository Metadata

- Synced to commit: `812f7281c0ed8b0add7bde18b1dbfb1c20c964c1`
- Last refreshed: 2025-09-23 11:35 (UTC+7)
