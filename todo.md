# Cosmetics Management TODO

> Goal: deliver a production-ready cosmetics inventory module with PAO (Period After Opening) tracking, reminders, and UI parity with existing inventory flows.

## 1. Data Modeling & Supabase Setup
- [x] Design ERD updates including `cosmetics`, `cosmetic_events`, optional `cosmetic_categories` (if not reusing global taxonomy), and `cosmetic_reminders` tables.
- [x] Draft SQL migration(s) for `cosmetics` table with fields: `id`, `household_id`, `name`, `brand`, `category_id`, `size`, `unit`, `batch_code`, `purchase_date`, `opened_at`, `expiry_date`, `pao_months`, `dispose_at`, `status`, `notes`, `image_url`, `last_usage_at`, timestamps.
- [x] Add `cosmetic_events` table capturing `event_type` (`opened`, `usage`, `discarded`, `restocked`, `note`), `payload`, timestamps, and FK to `cosmetics`.
- [ ] Extend category taxonomy (seed data) with cosmetics-specific tags (skincare, makeup, haircare, fragrance, tools) if required.
- [x] Implement Supabase RLS policies mirroring food inventory (`household_id` isolation; insert/update/delete limited to members).
- [ ] Seed sample cosmetics data for preview environments (feature flags, demo household).

## 2. Backend Services & Hooks
- [ ] Create server-side functions or REST endpoints (if needed) for cosmetics CRUD and event logging; ensure type-safe responses.
- [x] Extend shared data access layer (`src/lib/` or `src/hooks/`) with `useCosmetics`, `useCosmetic`, `useCosmeticMutations`, and `useCosmeticEvents` hooks using React Query patterns.
- [x] Implement reminder generation logic calculating `dispose_at = min(expiry_date, opened_at + pao_months)` with graceful handling of missing fields.
- [ ] Add background worker/cron (or Supabase function) to materialize reminder rows when `dispose_at` is approaching (e.g., within 14 days) and mark as sent/dismissed.
- [ ] Wire reminders into shared notification storage/table (`reminders`), tagging with `type = 'cosmetic_disposal'`.

## 3. Frontend UI Flows
### 3.1 Navigation & Routing
- [x] Add `/inventory/cosmetics` route and register in router + navigation tabs with feature flag toggle.
- [ ] Update layout to remember filters per module (food, consumables, cosmetics, assets).

### 3.2 List & Filters
- [x] Build cosmetics list view leveraging existing table/grid component; show key columns (product, brand, status badge, dispose/expiry date, PAO countdown).
- [x] Implement filters: category, status (`active`, `warning`, `expired`, `discarded`), brand, opened/unopened, reminder state.
- [x] Add quick stats cards (total items, items due ≤14 days, expired, unopened backlog).

### 3.3 Intake / Edit Flow
- [x] Create drawer/modal form for creating or editing cosmetics with validation for dates, PAO months, unit/size combos.
- [ ] Support quick presets for PAO (3/6/9/12/24 months) and ability to duplicate an existing product.
- [ ] Allow photo upload (Supabase storage) and auto-scan placeholder for future AI parsing (capture metadata for integration later).

### 3.4 Detail & Activity Timeline
- [ ] Implement detail drawer showing product metadata, PAO countdown, upcoming reminder, and last usage.
- [ ] Render timeline from `cosmetic_events` (open, usage notes, discard, replenishment) with ability to add note events inline.
- [ ] Provide quick actions: mark opened, log usage, mark discarded, restock/duplicate.

### 3.5 Reminder Surfacing
- [ ] Display reminder chips/banners in list rows and detail view when `dispose_at` within lead window or overdue.
- [ ] Add snooze/dismiss handlers tied to reminder table updates.
- [ ] Integrate with home dashboard widget (Expiring Soon) to include cosmetics counts.

## 4. Cross-Module Integrations
- [ ] Ensure global search includes cosmetics results with type labeling.
- [ ] Update household dashboard stats to include cosmetics metrics (due soon, expired, recently added).
- [ ] Expose cosmetics data to AI prompts (inventory context) while respecting opt-in flags.
- [ ] Add analytics hooks for usage patterns (average lifetime, discard reasons) for future reporting.

## 5. Feature Flagging & Settings
- [ ] Introduce config flag (`enableCosmeticsModule`) per household; expose toggle in admin settings for rollout.
- [ ] Add settings for reminder lead time default and snooze duration.

## 6. Testing & QA
- [ ] Write Vitest unit tests for PAO calculation helper and reminder scheduling logic.
- [ ] Create integration tests (MSW) covering CRUD flows and reminder API interactions.
- [ ] Manual QA checklist: intake, mark opened, reminder creation, snooze/dismiss, discard, restock, list filters.
- [ ] Accessibility pass on new forms, list controls, reminder chips (keyboard navigation, ARIA labels).

## 7. Documentation & Enablement
- [ ] Update Memory Bank (`progress.md`, `activeContext.md`) with cosmetics module status once implemented.
- [ ] Expand user manual, onboarding tooltips, and marketing copy to highlight cosmetics tracking benefits.
- [ ] Capture release notes + internal rollout plan (beta households, feedback loop).

## 8. Future Enhancements (Backlog)
- [ ] AI-powered intake via receipt/label OCR to prefill PAO and expiry fields.
- [ ] Purchase history import from retailers to auto-create cosmetics entries.
- [ ] Push/email notifications once messaging infrastructure ready.
- [ ] Cross-link cosmetics recommendations with recipe/meal planner (self-care reminders).
- [ ] Add charts for monthly spend, average usage duration per category.
