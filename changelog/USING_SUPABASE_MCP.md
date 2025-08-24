# Using Supabase MCP to Apply Migrations

This guide shows how to apply the SQL in `changelog/sql/*.sql` using a Supabase MCP tool/runner. If you don't use MCP, see the CLI fallback below.

## Prerequisites

- Supabase project URL and anon/service role key configured in your MCP tool.
- The MCP tool must support running SQL against the target database.
- Backups are recommended for production before applying migrations.

## Steps

- Pick the corresponding changelog entry and SQL file.
- Use the prompt template below in your MCP runner.
- Review MCP output for success, constraints, and any warnings.

### Prompt Template

Copy, customize paths, and paste into MCP:

"""
You are the Supabase MCP operator.

Goal: Apply and verify the database migration for the feature:
- Entry: changelog/2025-08-24-meal-planning-dining-out.md
- SQL: changelog/sql/2025-08-24_meal_planning_dining_out.sql

Instructions:
1) Execute the SQL file contents on the connected Supabase Postgres database.
2) Run statements in a transaction when possible; skip transaction for statements that cannot be transactional.
3) After applying, verify:
   - Table restaurants exists with expected columns.
   - Columns source, restaurant_id, dishes exist on meal_plans.
   - Unique index on (user_id, date, meal_type) if defined.
4) Return a short report with success/failures and basic `SELECT` checks.
5) If an error occurs, stop and report the failing statement and error.
"""

## Verification Queries

Run these quick checks (MCP can execute them or you can use the SQL editor):

```sql
-- Inspect new columns
select column_name, data_type
from information_schema.columns
where table_name = 'meal_plans' and column_name in ('source','restaurant_id','dishes')
order by column_name;

-- Inspect restaurants table
select column_name, data_type
from information_schema.columns
where table_name = 'restaurants'
order by column_name;
```

## Fallback: Supabase CLI

If MCP isn't available:

- Place SQL into a migration file in your Supabase project or run directly:
  - `supabase db push` (with migrations) or
  - `psql $SUPABASE_DB_URL -f changelog/sql/2025-08-24_meal_planning_dining_out.sql`
- Validate with the verification queries above.

## Rollback

- Use the rollback notes inside the corresponding changelog entry. For simple additive changes, drop the created objects if safe.

