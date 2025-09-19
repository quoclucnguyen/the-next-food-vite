# Active Context

## Current Work Focus

### Primary Development Areas (2025-08-22)

- Cosmetics inventory rollout: Supabase schema, hooks, and React views are now live. Focus is shifting to UX polish and feature gating.
- Refactor cosmetics add page into modular components (`src/views/cosmetics/add/components/*` plus supporting `types.ts`, `constants.ts`, `utils.ts`).
- Enable AI-powered image analysis for cosmetics intake (auto-fills name/brand/category/PAO via Gemini).
- Extend cosmetics dashboard with quick actions/reminders (`src/views/cosmetics/page.tsx`).
- Track follow-up tasks via `todo.md` (cosmetics module backlog).
- Maintain documentation consistency across Memory Bank, checklist, and user guide entries.

### Open Files (focused work)

- src/views/cosmetics/add/page.tsx
- src/views/cosmetics/add/components/
- src/views/cosmetics/page.tsx
- src/hooks/use-cosmetics.ts
- src/hooks/use-cosmetic-events.ts
- src/hooks/use-cosmetic-reminders.ts
- todo.md

## Recent Changes
- Created Supabase tables (`cosmetics`, `cosmetic_events`, `cosmetic_reminders`) with RLS and indexes via migration.
- Added typed hooks for cosmetics data, events, and reminders (`src/hooks/use-cosmetics.ts`, etc.).
- Implemented cosmetics list UI, quick actions, and duplicate helper (`src/views/cosmetics/page.tsx` + supporting modules).
- Refactored cosmetics add editor into reusable subcomponents and shared utilities to reduce page complexity.
- Updated `todo.md` checklist to reflect completed backend/UI tasks and outstanding follow-ups.

## Next Steps (Immediate)

1. Wire cosmetics reminders into global dashboard/notifications and shared analytics.
2. Implement PAO presets and enhanced duplication UX for cosmetics intake.
3. Introduce feature flags/settings toggle for cosmetics module rollout per household.
4. Backfill tests for `useCosmetics` helpers and reminder scheduling.
5. Continue documentation sync (Memory Bank, user manual, checklist) as cosmetics features evolve.

## Active Decisions and Considerations

- Cosmetics module mirrors food inventory patterns (React Query hooks + Supabase) with dedicated reminder tables; reuse as blueprint for consumables/assets.
- Favor composition over monolithic views—new cosmetics components demonstrate desired structure for future feature work.
- Maintain strict TypeScript coverage; all new hooks/components typed against generated Supabase schema definitions.

## Technical Notes

- Repository commit reference: `9c885c6031b7137163acaa1dd97d80f19f61b893` (latest recorded). Update as new commits land.
- Last refresh: 2025-08-22 11:10 (UTC+7).
- Cosmetics module artifacts live under `src/views/cosmetics/` with shared helpers in co-located subdirectories.
