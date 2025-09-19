# Feature Implementation Checklist — The Next Food

## Legend
- [x] Completed
- [ ] Pending or Planned (status noted inline)

## 1. Foundation & Access Control
- [x] Application bootstrap with React + Vite + TypeScript
- [x] Supabase project integration (auth, database, storage)
- [x] Household-based data isolation via RLS policies
- [x] Email/password registration & login with Supabase Auth
- [ ] Password reset / magic link UX _(Planned)_
- [ ] Social login providers _(Planned)_

## 2. Inventory Management
### Food Inventory (Existing)
- [x] Manual item creation with validation (name, quantity, unit)
- [x] Edit & delete inventory items with optimistic UI updates
- [x] Expiration badges & status indicators on item cards
- [x] Image capture/upload to Supabase storage
- [x] Category & storage location tagging
- [ ] Quantity/unit consistency refinements _(In Progress)_
- [ ] Bulk actions (batch consume/restock) _(Planned)_
- [ ] Barcode scanning workflow _(Not Started)_
- [ ] Expiration alerts & notifications _(Not Started)_
- [ ] Inventory analytics dashboard _(Not Started)_

### Household Consumables (Date-tracked)
- [ ] Data model extension for non-food consumables with best-before dates _(Planned)_
- [ ] Consumables module UI scaffold (list, filters, detail) _(Not Started)_
- [ ] Shared alerting rules for filters, chemicals, safety gear _(Not Started)_
- [ ] AI-assisted intake for receipts/labels _(Planned)_
- [ ] Documentation of coverage (`docs/design/household-inventory.md`) _(Completed)_

### Household Assets (Non-date)
- [ ] Durable goods inventory module (appliances, tools, equipment) _(Planned)_
- [ ] Location/owner tagging and search facets _(Not Started)_
- [ ] Maintenance reminder hooks (battery swap, service logs) _(Planned)_
- [ ] Attachment support for manuals & receipts _(Planned)_
- [ ] Asset overview dashboard _(Not Started)_

## 3. Recipe Management & AI Assistance
- [x] Manual recipe entry (ingredients, steps, metadata)
- [x] Recipe browsing & detail views
- [x] Save AI-suggested recipes to Supabase
- [ ] Gemini prompt/response hardening _(In Progress)_
- [ ] Dietary preference filtering in prompts _(Planned)_
- [ ] Seasonal & leftover-based suggestions _(Planned)_
- [ ] Recipe ratings & feedback loop _(Not Started)_

## 4. Meal Planning
- [x] Create and persist meal plan entries linked to recipes
- [ ] Calendar-based planner UI with drag-and-drop _(Not Started)_
- [ ] AI "Plan for me" autoplan flow _(Planned)_
- [ ] Portion scaling & household size adjustments _(Planned)_
- [ ] Nutrition summaries & macro tracking _(Not Started)_

## 5. Shopping Lists
- [ ] Generate shopping list deltas from meal plans _(Not Started)_
- [ ] Manual list management (add/edit/remove items) _(Planned)_
- [ ] Purchased toggles with progress tracking _(Planned)_
- [ ] Collaborative realtime updates between members _(Not Started)_
- [ ] Export / share (CSV, link) _(Not Started)_

## 6. Notifications & Insights
- [ ] Expiration alerts (email/push/in-app) _(Not Started)_
- [ ] Low-stock and restock reminders _(Not Started)_
- [ ] Consumption analytics & trends _(Not Started)_

## 7. Localization & Accessibility
- [x] Responsive mobile-first layout
- [ ] Vietnamese translation coverage for UI strings _(In Progress)_
- [ ] Localization toggle & persistence _(Planned)_
- [ ] WCAG 2.1 AA audit pass _(Planned)_

## 8. Testing & Quality Automation
- [ ] Vitest unit coverage ≥70% on core hooks _(Planned)_
- [ ] Component tests for forms/dialogs _(Planned)_
- [ ] Integration tests with MSW for Supabase flows _(Planned)_
- [ ] Playwright/Cypress smoke suite _(Planned)_
- [ ] Automated accessibility checks (axe, Storybook) _(Planned)_

## 9. Deployment & Operations
- [x] Vite production build pipeline (`pnpm build`)
- [ ] CI setup enforcing lint/build/test _(Planned)_
- [ ] Hosting on Vercel/Netlify with environment config _(Planned)_
- [ ] Monitoring & error tracking (Sentry) _(Planned)_
- [ ] Supabase backup/restore drills _(Planned)_

## 10. Knowledge & Documentation
- [x] Memory Bank system (`memory-bank/`) maintained
- [x] Comprehensive documentation suite in `docs/`
- [ ] Contributor onboarding updates as features evolve _(Ongoing)_
