# Maintenance & Operations Guide — The Next Food

## 1. Purpose
Provides ongoing maintenance procedures, upgrade paths, and operational checklists to keep The Next Food healthy post-deployment.

## 2. Operational Roles
- **Site Reliability Engineer (SRE)**: Monitors uptime, handles incidents.
- **Database Administrator (DBA)**: Oversees Supabase schema, backups, performance.
- **Feature Team Engineers**: Handle bug fixes and enhancements.
- **Product Support**: Responds to user inquiries, collects feedback.

## 3. Routine Maintenance Schedule
| Frequency | Tasks |
|-----------|-------|
| Daily | Review monitoring dashboards, address critical alerts, check error logs |
| Weekly | Audit Supabase logs, triage support tickets, verify backups |
| Monthly | Update dependencies, review AI usage quotas, conduct security scans |
| Quarterly | Load test critical flows, revisit RLS policies, update documentation |

## 4. Dependency Management
- Use Renovate or dependabot to automate dependency PRs.
- Run `pnpm lint` and `pnpm build` on dependency updates.
- For major upgrades (React, Vite), create feature branch with release notes and regression tests.

## 5. Database Maintenance
- Ensure Supabase automated backups enabled; test restore quarterly.
- Monitor query performance; add indexes as needed (inventory search, meal plan queries).
- Run migration scripts via Supabase CLI and log results.
- Archive old audit log entries beyond retention window (180 days) to cold storage if required.

## 6. AI Service Maintenance
- Track Gemini quota usage; set alert thresholds.
- Update prompts and parsing logic based on user feedback.
- Maintain fallback data for when AI unreachable.
- Review Google policy changes periodically.

## 7. Incident Response
1. Detect via monitoring alert or user report.
2. Assemble incident team (SRE + relevant engineers).
3. Triage severity and impact (S1–S4).
4. Mitigate (rollback, feature flag, hotfix).
5. Communicate status to stakeholders.
6. Post-incident review within 48 hours (document cause, fix, prevention).

## 8. Backup & Disaster Recovery
- Supabase automated backups stored per plan; ensure ability to trigger point-in-time recovery.
- Export critical tables monthly for offline archive.
- Maintain infrastructure-as-code (Supabase config) for rapid recreation.

## 9. Scaling Considerations
- Enable Supabase connection pooling for higher throughput.
- Use CDN caching for static assets.
- Consider separating analytics workload into dedicated reporting database if queries impact OLTP.
- Introduce queue/worker for heavy tasks (e.g., AI batch processing) via Supabase Edge Functions or external services.

## 10. Compliance & Auditing
- Document data retention policies.
- Review access logs for unauthorized access attempts.
- Update privacy policy to reflect data usage and AI features.
- Provide export/delete functionality for user data (GDPR compliance).

## 11. Upgrade Checklist
When preparing a new release:
1. Review change log and ensure documentation updated.
2. Verify migrations applied in staging.
3. Run regression suite (unit/integration/E2E).
4. Update `memory-bank/` context if architecture or processes changed.
5. Tag release and publish release notes.

## 12. Decommissioning
- Communicate timeline to users.
- Export user data, provide downloads.
- Disable new sign-ups; switch app to read-only mode.
- Archive Supabase project and revoke Gemini keys.

## 13. References
- `docs/deployment/deployment-guide.md`
- `docs/testing/bug-process.md`
- `docs/SRS.md`
