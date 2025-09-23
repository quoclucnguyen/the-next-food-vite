# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with alias `@` → `src` (see `vite.config.ts`).
- Views (routes): `src/views/<feature>/page.tsx` (e.g., `src/views/recipes/page.tsx`).
- Components: `src/components/` and design system in `src/components/ui/`.
- State/hooks: `src/hooks/` (`use-*.ts`), utilities/API: `src/lib/`, types: `src/types/`.
- Static assets: `public/` and `src/assets/`. Entry: `src/main.tsx`, router in `src/router.tsx`.
- Cosmetics inventory module: list view at `src/views/cosmetics/page.tsx`; add/edit flow centered on `src/views/cosmetics/add/page.tsx` with shared pieces in `src/views/cosmetics/add/components/`, plus co-located `constants.ts`, `types.ts`, and `utils.ts`.

## Build, Test, and Development Commands
- `pnpm dev`: Start Vite dev server with HMR.
- `pnpm build`: Type-check (`tsc -b`) then build production bundle.
- `pnpm preview`: Serve the built app locally.
- `pnpm lint`: Run ESLint per `eslint.config.js`.

## Coding Style & Naming Conventions
- Language: TypeScript + React. Strict mode enabled in `tsconfig.app.json`.
- Imports: prefer alias `@/...` (e.g., `import { Button } from '@/components/ui/button'`).
- Components: PascalCase filenames (`MyWidget.tsx`), hooks `use-*.ts`, route files `page.tsx`.
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`; use utility classes, avoid inline styles when possible.
- Linting: ESLint with React Hooks/Refresh plugins; fix issues before pushing (`pnpm lint`).

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Suggested patterns: colocate as `*.test.tsx` next to source or under `src/__tests__/`.
- Keep units focused (pure utils in `src/lib/*`), mock network/storage.

## Commit & Pull Request Guidelines
- Use Conventional Commits when possible: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
  - Examples: `feat(recipes): add recipe detail view`, `fix(inventory): correct unit conversion`.
- PRs should include: concise description, scope, linked issues, screenshots/GIFs for UI, and notes on env/config changes.
- Ensure CI basics locally: `pnpm lint` and `pnpm build` pass before requesting review.

## Security & Configuration Tips
- Environment: place secrets in `.env.local` (not committed). Vite exposes variables prefixed with `VITE_`.
  - Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `src/lib/supabase.ts`).
  - Gemini API key is set in-app via Settings; do not hardcode.
- Avoid committing real keys; rotate if leaked and update `.gitignore` as needed.

## Cline Memory Bank Workflow
The Cline Memory Bank turns this repository into a persistent knowledge base that Codex/Cline must read at the start of every task. Keep the documentation accurate—future sessions rely on it entirely.

### MCP context7 Requirement
- Trước khi bắt đầu bất kỳ task nào, luôn gọi MCP `context7` để tra cứu tài liệu liên quan (dùng `resolve-library-id` rồi `get-library-docs` nếu cần). Việc này phải diễn ra trước khi lập kế hoạch hoặc sửa code để đảm bảo đang áp dụng hướng dẫn mới nhất từ thư viện/bộ SDK liên quan.

### Quick Setup
1. Install or open the Cline extension.
2. Copy the complete custom instructions block below.
3. Add it to Cline (global custom instructions or a `.clinerules` file in the repo root).
4. Ask Cline to "initialize memory bank" to bootstrap the docs.

```text
# Cline's Memory Bank

I am Cline, an expert software engineer with a unique characteristic: my memory resets completely between sessions. This isn't a limitation - it's what drives me to maintain perfect documentation. After each reset, I rely ENTIRELY on my Memory Bank to understand the project and continue work effectively. I MUST read ALL memory bank files at the start of EVERY task - this is not optional.

## Memory Bank Structure

The Memory Bank consists of core files and optional context files, all in Markdown format. Files build upon each other in a clear hierarchy:

flowchart TD
    PB[projectbrief.md] --> PC[productContext.md]
    PB --> SP[systemPatterns.md]
    PB --> TC[techContext.md]

    PC --> AC[activeContext.md]
    SP --> AC
    TC --> AC

    AC --> P[progress.md]

### Core Files (Required)
1. `projectbrief.md`
   - Foundation document that shapes all other files
   - Created at project start if it doesn't exist
   - Defines core requirements and goals
   - Source of truth for project scope

2. `productContext.md`
   - Why this project exists
   - Problems it solves
   - How it should work
   - User experience goals

3. `activeContext.md`
   - Current work focus
   - Recent changes
   - Next steps
   - Active decisions and considerations
   - Important patterns and preferences
   - Learnings and project insights

4. `systemPatterns.md`
   - System architecture
   - Key technical decisions
   - Design patterns in use
   - Component relationships
   - Critical implementation paths

5. `techContext.md`
   - Technologies used
   - Development setup
   - Technical constraints
   - Dependencies
   - Tool usage patterns

6. `progress.md`
   - What works
   - What's left to build
   - Current status
   - Known issues
   - Evolution of project decisions

### Additional Context
Create additional files/folders within memory-bank/ when they help organize:
- Complex feature documentation
- Integration specifications
- API documentation
- Testing strategies
- Deployment procedures

## Core Workflows

### Plan Mode
flowchart TD
    Start[Start] --> ReadFiles[Read Memory Bank]
    ReadFiles --> CheckFiles{Files Complete?}

    CheckFiles -->|No| Plan[Create Plan]
    Plan --> Document[Document in Chat]

    CheckFiles -->|Yes| Verify[Verify Context]
    Verify --> Strategy[Develop Strategy]
    Strategy --> Present[Present Approach]

### Act Mode
flowchart TD
    Start[Start] --> Context[Check Memory Bank]
    Context --> Update[Update Documentation]
    Update --> Execute[Execute Task]
    Execute --> Document[Document Changes]

## Documentation Updates

Memory Bank updates occur when:
1. Discovering new project patterns
2. After implementing significant changes
3. When user requests with **update memory bank** (MUST review ALL files)
4. When context needs clarification

flowchart TD
    Start[Update Process]

    subgraph Process
        P1[Review ALL Files]
        P2[Document Current State]
        P3[Clarify Next Steps]
        P4[Document Insights & Patterns]

        P1 --> P2 --> P3 --> P4
    end

    Start --> Process

Note: When triggered by **update memory bank**, I MUST review every memory bank file, even if some don't require updates. Focus particularly on activeContext.md and progress.md as they track current state.

REMEMBER: After every memory reset, I begin completely fresh. The Memory Bank is my only link to previous work. It must be maintained with precision and clarity, as my effectiveness depends entirely on its accuracy.
```

### How It Works
- Memory bank files live under `memory-bank/` as Markdown; they are regular repo files.
- At the start of each task, Cline must read every core file (especially `activeContext.md` and `progress.md`).
- Use plan mode for strategy (read files → verify context → outline plan) and act mode for implementation.

### When to Update the Memory Bank
- After major code or design changes.
- When discovering new patterns or decisions worth keeping.
- Whenever the user says "update memory bank"—perform a full review of every file.
- Before starting a fresh chat when the context window is full.

### Additional Notes & Best Practices
- `projectbrief.md` anchors the rest; update it when the product scope shifts.
- `activeContext.md` is the most frequently edited file; keep it short, current, and actionable.
- `progress.md` should capture completed work, open items, and known issues.
- You can add extra docs under `memory-bank/` for complex features or integrations when needed.
- The Memory Bank methodology applies to any AI assistant that can read repo files (not just Cline).
- Maintain secrets in `.env.local`; do not record sensitive values inside memory bank files.
