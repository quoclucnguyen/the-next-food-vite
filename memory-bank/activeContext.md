# Active Context

## Current Work Focus

### Primary Development Areas

- Memory Bank refresh and maintenance (2025-08-20 20:27 UTC+7).
- Extending documentation to cover upcoming household consumables/assets modules (`docs/design/household-inventory.md`, `docs/SRS.md`, `docs/user-guide/user-manual.md`, `docs/checklists/feature-checklist.md`).
- Polishing inventory add/edit UX and quantity/unit handling (active files: src/views/inventory/add/page.tsx).
- Inventory listing improvements and expiration indicators (active file: src/views/inventory/page.tsx).
- Layout and navigation tweaks (active files: src/components/layouts/AppLayout.tsx, src/components/bottom-nav.tsx).
- Stabilize Gemini AI integration and response parsing for recipe suggestions.

### Open Files (focused work)

- src/views/inventory/add/page.tsx
- src/views/inventory/page.tsx
- docs/design/household-inventory.md
- docs/SRS.md
- docs/checklists/feature-checklist.md
- docs/user-guide/user-manual.md
- src/components/layouts/AppLayout.tsx
- src/components/bottom-nav.tsx

## Recent Changes

- Added household inventory module coverage to docs (new `docs/design/household-inventory.md`, expanded SRS, checklist, user manual).
- Consolidated and refreshed Memory Bank documentation (projectbrief.md, activeContext.md, productContext.md, progress.md, systemPatterns.md, techContext.md).
- Synchronized project metadata with current repository state (commit: 9c885c6031b7137163acaa1dd97d80f19f61b893).
- Noted active UX work in inventory add flow and layout components.

## Next Steps (Immediate)

1. Finish inventory add flow polish (form validation, units, loading/error states).
2. Harden Gemini response parsing and error handling.
3. Draft Supabase schema and hooks for consumables/assets modules; introduce feature flags before UI rollout.
4. Add barcode scanning plan and prototype.
5. Increase unit test coverage for inventory flows.

## Active Decisions and Considerations

- Continue using React Query for server state; consider small Zustand stores for complex client UI state if needed.
- Keep shadcn/ui component library as primary UI system.
- Prioritize user-facing UX polish before large architectural refactors.

## Technical Notes

- Repository commit reference: `9c885c6031b7137163acaa1dd97d80f19f61b893`
- Last refresh: 2025-08-20 20:27 (UTC+7)
- Memory Bank system is now part of the repository and will be updated alongside active development.
