# Installation & Setup Guide — The Next Food

## 1. Prerequisites
- Node.js 18 LTS or newer (`node -v` to verify).
- pnpm 9.x (preferred) or npm (project uses pnpm lockfile).
- Git for source control.
- Supabase project with URL and anon key.
- Google Gemini API key (for AI features).

## 2. Clone Repository
```bash
git clone <repository-url>
cd the-next-food-vite
```

## 3. Configure Environment Variables
Create `.env.local` in project root:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
```
Never commit `.env.local` to version control.

## 4. Install Dependencies
```bash
pnpm install
```

## 5. Run Development Server
```bash
pnpm dev
```
Access the app at http://localhost:5173 by default.

## 6. Build for Production
```bash
pnpm build
```
Artifacts output to `dist/`.

## 7. Preview Production Build
```bash
pnpm preview
```
Serves the `dist/` bundle locally for sanity checks.

## 8. Optional Tooling Setup
- VS Code extensions: ESLint, Tailwind CSS IntelliSense, TypeScript.
- Configure editor format-on-save (Prettier or built-in).
- Install Supabase CLI for database migrations (`npm install -g supabase`).

## 9. Supabase Configuration Checklist
1. Create tables per `docs/design/database.md` (or import SQL migrations).
2. Enable Row Level Security and policies per table.
3. Set up storage bucket `inventory-images` with read/write policies.
4. Configure authentication email templates and redirect URLs.

## 10. Gemini Configuration Checklist
1. Obtain API key from Google AI Studio.
2. Enable relevant models (e.g., `gemini-1.5-pro`).
3. Monitor usage quotas; set alerts where possible.

## 11. Testing & Quality Gates
- Run `pnpm test` and `pnpm lint` before commits.
- Integrate with CI (GitHub Actions) to enforce checks.

## 12. Next Steps
After verifying local setup:
1. Follow `docs/user-guide/user-manual.md` to explore features.
2. Review `docs/testing/test-plan.md` if contributing tests.
3. Consult `docs/deployment/deployment-guide.md` for hosting.
