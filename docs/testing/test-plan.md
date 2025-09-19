# Test Plan — The Next Food

## 1. Introduction
This test plan outlines quality assurance strategies for The Next Food, covering scope, approach, resources, schedule, and entry/exit criteria. Testing aligns with agile iterations and emphasizes automation where possible using Vitest + React Testing Library.

## 2. Test Objectives
- Validate functional requirements defined in `docs/SRS.md`.
- Ensure regressions are prevented through automated suites.
- Verify non-functional requirements (performance, accessibility, security basics).
- Provide reproducible defect reporting and triage process.

## 3. Scope
### In-Scope
- Inventory CRUD flows
- Recipe management and AI suggestion parsing
- Meal planning calendar interactions
- Shopping list generation and editing
- Authentication workflows and guarded routes
- Supabase integration (mocked/stubbed for unit tests, integration tests in staging)

### Out-of-Scope (Current Phase)
- Offline/PWA behaviors (future enhancement)
- Native mobile packaging
- Third-party grocery API integrations (not yet implemented)

## 4. Test Types & Approach
| Test Type | Purpose | Tooling | Notes |
|-----------|---------|---------|-------|
| Unit Tests | Validate individual functions/hooks | Vitest, RTL, MSW | Aim for 70%+ coverage on hooks/utils |
| Component Tests | Ensure UI components render/behave correctly | RTL, Storybook (future) | Focus on forms, cards, dialogs |
| Integration Tests | Verify feature flows across modules | Vitest + MSW, Supabase test project | Key flows: inventory add, recipe save, plan creation |
| E2E Tests | Simulate user journeys in browser | Playwright/Cypress (future) | Prioritize smoke suite for CI |
| Accessibility Tests | Check WCAG compliance | axe-core, manual | Integrate into Storybook or Playwright |
| Performance Benchmarks | Measure load times, bundle size | Lighthouse CI, WebPageTest | Run on preview builds |

## 5. Test Environment
- **Local**: pnpm-based dev environment with mocked services (MSW for API, Gemini stub).
- **Staging**: Deployed preview connected to staging Supabase project and Gemini sandbox keys.
- **Production**: Monitoring only; no tests executed directly.

Environment configuration stored in `.env.local` (not committed) and staging secrets in deployment platform.

## 6. Test Data Management
- Seed scripts create baseline households, inventory items, recipes.
- Use deterministic fixtures for repeatability.
- Anonymize any production-derived data before reuse.

## 7. Entry & Exit Criteria
### Entry Criteria
- Feature requirements approved and documented.
- Test environment stable and seeded.
- Dependencies resolved and code merged into feature branch.

### Exit Criteria
- Unit/component tests ≥95% pass rate.
- Critical/high-severity defects resolved or deferred with approval.
- Accessibility audit shows no critical issues.
- Test summary report delivered to stakeholders.

## 8. Test Schedule & Milestones
| Sprint | Focus | Deliverables |
|--------|-------|--------------|
| Sprint 1 | Inventory polish | Unit tests for inventory hooks/components, integration test for add/edit flow |
| Sprint 2 | AI improvements | Parser unit tests, resilience tests for Gemini fallbacks |
| Sprint 3 | Meal planner | Calendar component tests, integration tests for plan-saving |
| Sprint 4 | Shopping lists | Generation algorithm tests, collaboration readiness tests |

## 9. Roles & Responsibilities
- **QA Lead**: Owns test planning, reporting, and release sign-off.
- **Feature Engineers**: Write unit/component tests with features.
- **Automation Engineer**: Maintains E2E suite and CI pipelines.
- **Product Owner**: Confirms acceptance criteria, prioritizes defects.

## 10. Risk Analysis
- Limited automated E2E coverage may allow regressions → mitigate via smoke suite.
- AI API rate limits could block testing → use recorded responses via MSW fixtures.
- Supabase schema changes can break tests → enforce migrations review process.

## 11. Tools & Infrastructure
- Vitest configured via `vitest.config.ts`.
- Testing Library for DOM assertions.
- Mock Service Worker (MSW) for API stubbing (add as dependency if not present).
- GitHub Actions/CI pipeline running `pnpm lint`, `pnpm build`, `pnpm test`.
- Issue tracker (e.g., Linear/Jira) for defect management.

## 12. Reporting
- Automated test reports stored in CI artifacts.
- Manual test runs logged in shared QA spreadsheet or tracking tool.
- Defects labeled by severity (`S1` blocker → `S4` low).

## 13. References
- `docs/testing/test-cases.md`
- `docs/SRS.md`
- `memory-bank/progress.md`
