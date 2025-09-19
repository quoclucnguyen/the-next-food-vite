# Process & Workflow Design — The Next Food

## 1. Overview
This document summarizes key business processes, aligning them with supporting diagrams. Each flow is backed by Mermaid diagrams in `docs/diagrams/`.

## 2. Inventory Intake Flow
1. User taps "Add Item".
2. Optionally scans barcode → fetch metadata (future integration).
3. Enters item details (name, category, quantity, unit, storage location).
4. Defines expiration date; system suggests default durations per category.
5. Uploads optional photo via Supabase storage.
6. Confirms; item persisted via Supabase RPC.
7. React Query cache updates; UI shows success toast.

Sequence diagram: `docs/diagrams/sequence-inventory.md`

## 3. AI Recipe Suggestion Flow
1. User opens Recipes tab → Suggested section.
2. System fetches inventory snapshot and user preferences.
3. Prompt builder composes Gemini request.
4. Gemini returns structured suggestion (JSON-like text).
5. Parser converts to typed recipe objects; surfaces cards.
6. User saves recipe → stored in `recipes` + related tables.

See activity diagram: `docs/diagrams/activity-meal-planning.md`.

## 4. Meal Planning Flow
1. User selects week range in planner.
2. Chooses manual recipe placement or AI autoplan.
3. Planner cross-checks inventory for ingredient availability.
4. Generates shopping deltas and highlights shortages.
5. Saves plan entries; triggers shopping list creation prompt.

Related diagrams:
- DFD Level 1: `docs/diagrams/dfd.md`
- Sequence: `docs/diagrams/sequence-inventory.md`

## 5. Shopping List Generation
1. Triggered after meal plan save or manual request.
2. Worker compares required ingredients vs inventory quantities.
3. Items below threshold added to list with target quantity.
4. User reviews, adjusts, enriches with store/category data.
5. List shared with household members (future realtime sync).

## 6. Expiration Notifications (Future)
1. Nightly edge function queries `inventory_items` for upcoming expirations.
2. Prepares notification payloads per household.
3. Sends email/push notifications; records entry in notifications table.
4. Frontend displays in-app alerts.

## 7. Error Handling & Recovery
- API failures surface inline errors with retry options.
- AI parsing failures fallback to manual recipe capture.
- Network offline state caches user intent (React Query offline persistence roadmap).

## 8. Process Responsibilities
| Process | Owner | Supporting Modules |
|---------|-------|--------------------|
| Inventory Intake | Inventory feature team | `src/views/inventory`, `useInventoryItems` |
| AI Suggestion | AI team | `src/lib/gemini-*`, `useRecipes` |
| Meal Planning | Planner team | `src/views/meal-planning`, `useMealPlans` |
| Shopping Lists | Shopping team | `src/views/shopping-list`, `useShoppingLists` |
| Notifications | Platform team | Supabase Edge Functions (future) |

## 9. Metrics & KPIs
- Inventory accuracy (items updated within 24h of purchase).
- AI recipe satisfaction rating (user feedback module planned).
- Meal plan adherence (meals completed vs scheduled).
- Shopping list completion rate (percentage of items marked purchased).

## 10. References
- `docs/SRS.md`
- `docs/design/architecture.md`
- `docs/testing/test-plan.md`
