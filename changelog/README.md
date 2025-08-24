# Changelog

This folder tracks product and schema changes for the app. Each change should include:

- A human-readable entry describing the rationale and scope.
- Migration assets (SQL drafts, data backfills) when applicable.
- Notes for applying changes via Supabase MCP (preferred) or Supabase CLI fallback.

## Structure

- `CHANGELOG.md`: Index of entries with links.
- `YYYY-MM-DD-<slug>.md`: Human-readable change notes.
- `sql/`: One or more SQL files referenced by the change notes.
- `TEMPLATE.md`: Use this template for new entries.
- `USING_SUPABASE_MCP.md`: How to apply migrations using Supabase MCP.

## Workflow

1. Create a dated markdown entry from `TEMPLATE.md`.
2. Add SQL under `changelog/sql/` and link it from the entry.
3. Apply the migration via Supabase MCP (or CLI) as documented.
4. Update `CHANGELOG.md` index.

Keep entries small, focused, and reversible. Prefer additive, non-breaking changes; gate UI changes until DB migrations are safely applied.

