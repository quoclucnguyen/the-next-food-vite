# <Title: short and specific>

- Date: YYYY-MM-DD
- Area: <feature | infra | schema>
- Owner: <name/alias>
- Related: <issue/PR links>

## Summary

<Brief description of what changed and why.>

## User Impact

- <What users can do now>
- <Any migration or breaking behavior>

## App Changes

- UI/UX: <screens/components updated>
- Hooks/API: <functions added/changed>
- Routing: <routes added/changed>

## Data Model Changes (if any)

- SQL: see `./sql/<file>.sql`
- Backfill: <steps/tools if required>
- Rollback: <how to revert safely>

## Apply Instructions

- Preferred: Supabase MCP — see `USING_SUPABASE_MCP.md` with the prompt snippet below.
- Fallback: Supabase CLI — `supabase db push` or `psql` direct.

### Ready‑to‑Use MCP Prompt

Copy, adjust paths, and paste into your MCP runner:

"""
You are the Supabase MCP operator. Apply the migration described in changelog/<ENTRY_FILE>.md.

1) Open and execute the SQL at changelog/sql/<SQL_FILE>.sql on the connected Supabase project.
2) Wrap DDL in a transaction where possible; ignore statements that cannot be transactional.
3) After applying, verify new columns/tables exist and constraints match.
4) Return a brief report including row counts/constraints presence.
5) If any statement fails, stop and report the error with context.
"""

## Verification

- Local app: run `pnpm build` and smoke test the feature.
- DB: verify new columns/tables with a quick SELECT.

## Notes

<Anything notable for reviewers/ops>

