# Architecture Design — The Next Food

## 1. Overview
The Next Food is a single-page application composed of a React + TypeScript frontend communicating directly with Supabase services (Auth, REST/RPC, Storage) and the Google Gemini AI API. The system is optimized for mobile-first usage while supporting desktop layouts.

```
┌───────────────────────────────────────────────┐
│                 Client (SPA)                 │
│  React 19 • TypeScript • Vite • Tailwind CSS │
├───────────────────────────────────────────────┤
│ Presentation Layer: UI Components (shadcn/ui) │
│ State & Data Layer: React Query, Context,     │
│   custom hooks, Supabase & Gemini clients     │
└───────────────────────────────────────────────┘
        │ HTTP/HTTPS (REST, RPC, GraphQL TBA)
        ▼
┌───────────────────────────────┐   ┌────────────────────────┐
│        Supabase Backend       │   │      Google Gemini     │
│ - Auth (JWT Sessions)         │   │ - Text Generation API  │
│ - Database (PostgreSQL + RLS) │   │ - AI Recipe Suggestions│
│ - Storage (Images)            │   └────────────────────────┘
│ - Edge Functions (future)     │
└───────────────────────────────┘
```

## 2. Component View

### 2.1 Presentation Components
- **Layouts** (`src/components/layouts/AppLayout.tsx`): Shell with navigation and responsive scaffolding.
- **Navigation** (`src/components/bottom-nav.tsx`): Mobile-first tab navigation between major views.
- **Feature Views** (`src/views/*/page.tsx`): Route-level components (inventory, recipes, meal planning, shopping lists, settings).
- **UI Kit** (`src/components/ui/*`): Design system components sourced from shadcn/ui and tailored to the brand.

### 2.2 State Management
- **React Query Providers**: Manage server state, caching, optimistic updates.
- **Context Providers**: Theme, localization, user profile snapshots.
- **Custom Hooks** (`src/hooks/use-*.ts`): Encapsulate feature logic (inventory CRUD, recipe queries, Gemini prompts).

### 2.3 Data Access
- **Supabase Client** (`src/lib/supabase.ts`): Configures Supabase connection using environment variables.
- **Gemini Client** (`src/lib/gemini-*.ts`): Wraps AI prompt generation and parsing.
- **Utility Modules** (`src/lib/*`): Shared helpers (date/quantity formatting, schema parsing with Zod).

## 3. Module Responsibilities

| Layer | Modules | Responsibilities |
|-------|---------|------------------|
| Presentation | Views, components/ui | Render responsive UI, handle user interactions, route transitions |
| Domain | hooks, lib/gemini, lib/inventory | Encapsulate business logic, orchestrate API calls, parse AI responses |
| Data | lib/supabase, React Query | Communicate with backend, caching, optimistic updates |
| Cross-cutting | lib/logger (future), analytics, error boundary | Observability, feedback, resilience |

## 4. Data Flow
- User action triggers view handler → view delegates to custom hook.
- Hook performs validation (Zod schemas) and triggers React Query mutation/query.
- Supabase client issues request; responses cached and normalized by React Query.
- UI updates optimistically; background refetch ensures consistency.
- AI flows: hook shapes prompt → Gemini API response → parser transforms to typed objects → UI renders suggestions.

Detailed DFD available in `docs/diagrams/dfd.md`.

## 5. Security Architecture
- Supabase Auth secures access, providing JWT for API calls.
- Row Level Security policies restrict data to owning user/household.
- Environment variables stored in `.env.local`; secrets never committed.
- Future: integrate Supabase Edge Functions for server-side validation (e.g., barcode lookups).
- Client sanitizes and validates inputs before persistence.

## 6. Scalability & Performance
- Vite code splitting and lazy loading per route.
- React Query caching reduces redundant network requests.
- Potential CDN caching for static assets via Vite build output.
- Horizontal scalability handled by Supabase infrastructure.
- AI usage throttled with exponential backoff and fallback UI.

## 7. Observability & Logging (Roadmap)
- Integrate client-side logging (e.g., Sentry) for error capture.
- Supabase logs for database operations and edge functions.
- Add analytics events for key flows (inventory updates, meal plan creation).

## 8. Technology Stack Summary
- **Frontend**: React 19, TypeScript 5.8, Vite 7, Tailwind CSS 4, shadcn/ui.
- **State/Data**: React Query 5, React Context, Zustand (optional), React Hook Form, Zod.
- **Backend Services**: Supabase (Auth + Postgres + Storage), Gemini AI.
- **Tooling**: ESLint, Prettier (editor config), Vitest, Testing Library.
- **Deployment**: Static hosting (Vercel/Netlify) backed by Supabase project.

## 9. Risks and Mitigations
- **Gemini API Instability**: Implement retries, caching, and fallback manual workflows.
- **Supabase Vendor Lock-in**: Abstract data access, ensure schema export for migration.
- **Offline Support**: Not fully supported; consider service worker caching in future iteration.
- **Barcode Scanning**: Browser compatibility issues; fallback manual entry.

## 10. Future Extensions
- Microservice backend for complex analytics.
- Integration with grocery APIs for price comparisons.
- Real-time collaboration using Supabase Realtime channels.
- Native mobile wrapper (Capacitor/React Native) leveraging existing API layer.

## 11. References
- `docs/diagrams/architecture.md`
- `memory-bank/systemPatterns.md`
- `docs/SRS.md`
