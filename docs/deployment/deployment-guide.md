# Deployment Guide — The Next Food

## 1. Overview
This guide describes how to deploy The Next Food to a production-ready environment (e.g., Vercel, Netlify) with Supabase backend services.

## 2. Architecture Summary
- Static frontend hosted on CDN-backed platform.
- Supabase project provides auth, database, storage, and (optionally) edge functions.
- Gemini AI API accessed server-side from client using secure key exposure (limit to required scope).

## 3. Prerequisites
- Production Supabase project with migrations applied.
- Hosting account (Vercel, Netlify, Render Static, etc.).
- Configured environment variables.
- Domain and SSL certificate (managed by hosting provider).

## 4. Build Pipeline
1. Configure CI (GitHub Actions) to run on main branch pushes.
2. Steps:
   - `pnpm install --frozen-lockfile`
   - `pnpm lint`
   - `pnpm build`
   - Upload `dist/` as artifact (optional) or deploy automatically.

## 5. Environment Variables
Set on hosting platform (build & runtime):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`
Optionally configure staging equivalents (suffix `_STAGING`).

## 6. Supabase Configuration
- Apply SQL migrations before deploy.
- Configure storage bucket policies.
- Set auth redirect URLs (login, password reset) to your production domain.
- Enable email templates and domain verification.
- Define access roles for household admin/member if using policies.

## 7. Deployment Steps (Vercel Example)
1. Import GitHub repository into Vercel.
2. Select framework preset "Vite"; set root directory if necessary.
3. Configure environment variables under Project Settings.
4. Trigger deployment; Vercel builds using `pnpm build` and hosts `dist/`.
5. After deploy, verify routes (SPA fallback to `index.html`).

## 8. Post-Deployment Checklist
- Smoke test authentication, inventory CRUD, AI suggestions, meal planning, shopping lists.
- Check browser console for runtime errors.
- Confirm Supabase logs show expected traffic.
- Run Lighthouse audit for performance & accessibility.
- Verify analytics/monitoring hooks (if configured).

## 9. Monitoring & Observability
- Enable Supabase logs & alerts (query performance, auth anomalies).
- Integrate Sentry or similar for client error tracking.
- Set up uptime monitoring (Pingdom, StatusCake) targeting production domain.
- Track Gemini usage via Google Cloud console.

## 10. Rollback Strategy
- Maintain previous build artifacts; Vercel/Netlify support instant rollback.
- Keep database backups (Supabase automated daily). For schema changes, ensure backward compatibility or plan manual rollback scripts.

## 11. Staging Environment
- Deploy `develop` branch to staging environment.
- Use separate Supabase project and Gemini key.
- Protect staging site with password or authentication rules.

## 12. Compliance & Security
- Keep secrets out of client logs.
- Enforce HTTPS; enable HSTS header via hosting config.
- Configure Content Security Policy (CSP) to whitelist Supabase, Gemini, asset domains.
- Review Supabase RLS policies after each schema change.

## 13. References
- `docs/deployment/maintenance-guide.md`
- `docs/SRS.md`
- `docs/design/architecture.md`
