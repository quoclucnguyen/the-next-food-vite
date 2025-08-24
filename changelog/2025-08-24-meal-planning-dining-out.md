# Meal planning — dining out, multi‑dish meals, restaurant management

- Date: 2025-08-24
- Area: feature, schema
- Owner: team
- Related: meal planning enhancements

## Summary

Adds support for:
- Planning dining‑out meals (non‑cooking) and tracking restaurants.
- Multi‑dish meals (both at home and dining out).
- UI badges and flows to add/edit these meals.

This requires additive schema changes to `meal_plans` and a new `restaurants` table.

## User Impact

- Users can schedule dining‑out meals, pick a restaurant, and list dishes.
- Home meals can include multiple recipes with servings.
- No breaking changes expected; existing meal plans remain valid.

## App Changes

- UI/UX: Update weekly grid to show dining‑out badge + restaurant name; edit dialog supports switching source and managing dishes.
- Hooks/API: Extend `useMealPlans` to handle `source`, `restaurantId`, and `dishes`.
- Routing: Optional `/restaurants` view for CRUD + history.

## Data Model Changes

- SQL: see `./sql/2025-08-24_meal_planning_dining_out.sql`.
- Backfill: Not required (new columns have defaults and are nullable when appropriate).
- Rollback: Drop added columns and the `restaurants` table (see notes in SQL file).

## Apply Instructions

- Preferred: Use Supabase MCP per `USING_SUPABASE_MCP.md` with the prompt referencing this entry and SQL file.
- Fallback: Use Supabase CLI/psql to apply the SQL.

### Ready‑to‑Use MCP Prompt

"""
You are the Supabase MCP operator.

Goal: Apply the migration for dining‑out + multi‑dish meals.
- Entry: changelog/2025-08-24-meal-planning-dining-out.md
- SQL: changelog/sql/2025-08-24_meal_planning_dining_out.sql

Execute the SQL safely (transaction where possible), then verify objects exist as expected and report findings. Stop on first error and output the failing statement.
"""

## Verification

- App: `pnpm build` and smoke‑test meal planning add/edit flows.
- DB: Run verification queries in `USING_SUPABASE_MCP.md`.

## Notes

- Types: update `src/lib/supabase.ts` and `src/types/*` after DB migration is applied (follow‑up PR).
- Shopping list: dining‑out meals are excluded from auto‑generated shopping items.

