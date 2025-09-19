# Troubleshooting Guide — The Next Food

## 1. Login Issues
- **Symptom**: Unable to sign in; "Invalid credentials".
  - Verify email/password case sensitivity.
  - If using social login (future), ensure provider authorized.
  - Use `Forgot Password` to reset via email.
- **Symptom**: Verification email not received.
  - Check spam folder.
  - Confirm Supabase SMTP settings configured correctly.
  - Resend email after 5 minutes.

## 2. Inventory Problems
- **Symptom**: Item not visible after adding.
  - Refresh inventory view; React Query may still be fetching.
  - Confirm filters/search cleared.
  - Check network tab for Supabase errors (401 indicates expired session).
- **Symptom**: Incorrect expiration badge color.
  - Ensure device timezone matches household setting.
  - Edit item to refresh expiration date.

## 3. Recipe & AI Issues
- **Symptom**: AI suggestions unavailable.
  - Confirm Gemini API key in `.env.local`.
  - Monitor network console for 4xx/5xx errors; check quota usage.
  - Use manual recipe entry as fallback.
- **Symptom**: AI output malformed.
  - Update to latest app version (parser improvements).
  - Report sample output via feedback form for analysis.

## 4. Meal Planning & Shopping Lists
- **Symptom**: Drag-and-drop not working on desktop.
  - Ensure browser supports HTML5 drag API.
  - Check console for script errors; run `pnpm build` to catch TypeScript issues.
- **Symptom**: Shopping list missing items.
  - Regenerate list after verifying meal plan entries.
  - Check inventory quantities; items with sufficient stock are excluded by design.

## 5. Performance & Loading
- **Symptom**: Slow initial load.
  - Confirm network speed; prefetch critical data.
  - Run Lighthouse to diagnose bundle size; enable code splitting if disabled.
- **Symptom**: Images load slowly.
  - Optimize uploads (<1MB). Use Supabase image transformations.
  - Ensure CDN caching enabled in hosting platform.

## 6. Deployment Issues
- **Symptom**: 404 after deploy.
  - Ensure hosting platform rewrites SPA routes to `index.html`.
- **Symptom**: Environment variables missing in production.
  - Set `VITE_*` variables in hosting dashboard build configuration.
- **Symptom**: Supabase connection refused.
  - Validate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` match project.

## 7. Data & Sync
- **Symptom**: Household members see stale data.
  - Trigger manual refresh; React Query caches for configurable intervals.
  - Inspect Supabase RLS policies to ensure members share household ID.
- **Symptom**: Conflicts when editing same item.
  - Current system uses last-write-wins. Consider implementing conflict resolution (roadmap).

## 8. Reporting Issues
When self-service steps fail:
1. Collect browser console logs, network traces, and reproduction steps.
2. Open issue via in-app feedback or project issue tracker.
3. Include environment info (browser, OS, app version commit SHA).

## 9. References
- `docs/user-guide/user-manual.md`
- `docs/testing/bug-process.md`
- `docs/deployment/deployment-guide.md`
