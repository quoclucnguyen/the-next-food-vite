# Active Context

## Current Work Focus

### Primary Development Areas (2025-09-23)

- Cosmetics module polish: elevate reminders beyond intake (dashboard surfacing, snooze flows) and build timeline/detail views leveraging `cosmetic_events`.
- Harden cosmetics taxonomy management and rollout controls (feature flags, seeded category types).
- Plan consumables module schema/hooks using cosmetics patterns; begin scaffolding shared reminder utilities.
- Stabilize Gemini recipe generation path so AI extends beyond cosmetics image analysis.
- Keep Memory Bank + docs in sync with the expanding inventory feature set.

### Open Files (focused work)

- src/views/cosmetics/add/page.tsx
- src/views/cosmetics/add/components/
- src/views/cosmetics/add/useCosmeticImageAnalysis.ts
- src/views/cosmetics/page.tsx
- src/views/cosmetics/quick-actions.ts
- src/hooks/use-cosmetics.ts
- src/hooks/use-cosmetic-events.ts
- src/hooks/use-cosmetic-reminders.ts
- todo.md

## Recent Changes
- Implemented AI-assisted cosmetics intake (`useCosmeticImageAnalysis` + `GeminiCosmeticService`) with automatic category/unit seeding when Gemini suggests new values.
- Added cosmetics quick actions that log Supabase events, update status/opened timestamps, and provide duplication via session storage snapshotting.
- Introduced `cosmetic_category_types` management hook + UI filters so cosmetics list groups by typed taxonomy.
- Wired reminder scheduling into cosmetics mutations and exposed settings card on the add/edit page.
- Hardened Supabase type definitions (`src/lib/supabase.ts`) to include cosmetics tables, reminders, category types, and restaurant/shopping schemas.
- Refined cosmetics list UI with overview cards, filters, skeletons, and reminder callouts.

## Next Steps (Immediate)

1. Surface cosmetics reminders in dashboard widgets + notifications and implement automated reminder state transitions (snooze, dismiss).
2. Deliver cosmetics detail/timeline views with `cosmetic_events` history and inline note capture.
3. Seed + gate cosmetics taxonomy/feature flags for controlled rollout across households.
4. Backfill Vitest coverage around cosmetic dispose date helpers, reminder scheduling, and Gemini parsing utilities.
5. Start consumables module (schema draft, React Query hooks, basic list/intake UI) leveraging cosmetics patterns.

## Active Decisions and Considerations

- Cosmetics module mirrors food inventory patterns (React Query hooks + Supabase) with dedicated reminder tables; reuse as blueprint for consumables/assets.
- Favor composition over monolithic views—new cosmetics components demonstrate desired structure for future feature work.
- Maintain strict TypeScript coverage; all new hooks/components typed against generated Supabase schema definitions.

## Technical Notes

- Repository commit reference: `812f7281c0ed8b0add7bde18b1dbfb1c20c964c1` (latest recorded).
- Last refresh: 2025-09-23 11:35 (UTC+7).
- Cosmetics module artifacts live under `src/views/cosmetics/` with hooks/utilities in `src/hooks` and `src/lib/gemini/*`.
