# Defect Management & QA Sign-off — The Next Food

## 1. Purpose
Defines how defects are reported, triaged, fixed, and verified to ensure consistent quality across releases.

## 2. Workflow Summary
1. **Discovery**: Tester or stakeholder finds defect during test execution or production usage.
2. **Logging**: Record issue in tracker with template below.
3. **Triage**: QA Lead, Product Owner, and Engineering review severity/priority and assign owner.
4. **Remediation**: Developer branches, fixes, writes regression tests, submits PR.
5. **Verification**: QA retests in staging; confirms acceptance criteria.
6. **Closure**: Issue closed with release version noted. If deferred, document justification and mitigation.

## 3. Issue Template
```
Title: <Feature> - <Symptom>
Severity: S1 Blocker | S2 Major | S3 Minor | S4 Trivial
Priority: P0 Immediate | P1 High | P2 Normal | P3 Low
Environment: Local | Staging | Production (include build hash)
Steps to Reproduce:
1.
2.
3.
Expected Result:
Actual Result:
Attachments: (logs, screenshots, videos)
Related Requirements: (SRS refs, test case IDs)
```

## 4. Severity Definitions
- **S1 Blocker**: Prevents core flows (auth failures, data loss).
- **S2 Major**: Significant functionality broken without workaround.
- **S3 Minor**: Cosmetic issues or minor usability defects.
- **S4 Trivial**: Low-impact enhancements or typos.

## 5. QA Exit Checklist
- All S1/S2 issues closed or explicitly deferred with risk sign-off.
- Regression suite executed with ≥95% pass rate.
- Accessibility spot checks complete (no critical issues).
- Release notes documented, including known issues.
- Stakeholder approval (Product + Engineering leads).

## 6. Reporting
- Weekly QA status report summarizing open defects, coverage, risks.
- Post-release QA review capturing incidents and lessons learned.

## 7. References
- `docs/testing/test-plan.md`
- `docs/testing/test-cases.md`
- `docs/SRS.md`
