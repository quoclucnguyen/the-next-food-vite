# Test Cases — The Next Food

## Legend
- **ID Format**: `<Feature>-<Sequence>` (e.g., INV-01).
- **Priority**: H = High, M = Medium, L = Low.
- **Type**: UT (Unit), CT (Component), IT (Integration), E2E (End-to-End).

## Inventory Management
| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
|----|-------|---------------|-------|-----------------|----------|------|
| INV-01 | Create inventory item (manual) | Authenticated, inventory view loaded | 1. Click Add Item 2. Fill form 3. Submit | Item persists, appears in list with toast success | H | IT |
| INV-02 | Edit inventory item | Item exists | 1. Open item menu 2. Edit quantity 3. Save | Item updates, updated_at refreshed | H | IT |
| INV-03 | Expiration badge color | Item with expiration today | Render card | Badge shows "Today" warning color | M | CT |
| INV-04 | Quantity validation | Add item with negative quantity | Submit form | Validation error displayed, API not called | H | CT |
| INV-05 | Delete inventory item | Item exists | 1. Delete action 2. Confirm | Item removed, list refreshes, audit log entry created | M | IT |
| INV-06 | Barcode scan fallback (future) | Device lacks camera | Start scan | App shows fallback manual entry message | L | CT |

## Recipe Management & AI
| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
| REC-01 | AI suggestion success | Inventory populated, Gemini stub | 1. Open Suggested tab 2. Request recipes | Cards rendered with parsed data | H | IT |
| REC-02 | AI parsing error | Gemini returns malformed data | Trigger suggestion | Fallback UI prompt to save manually; error logged | H | IT |
| REC-03 | Save AI recipe | AI suggestion available | 1. Save recipe 2. Confirm details | Recipe stored in Supabase with `source='ai'` | H | IT |
| REC-04 | Filter recipes by tag | Recipes tagged | Apply filter | List shows matching recipes only | M | CT |
| REC-05 | Recipe search | Query input used | Type term | Results filtered with debounced search <500ms | M | CT |

## Meal Planning
| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
| MPL-01 | Create meal plan entry | Recipes exist | 1. Open planner 2. Add recipe to lunch slot | Entry saved, visible on calendar | H | IT |
| MPL-02 | Autoplan via AI | Inventory ready | 1. Click "Plan for me" 2. Accept plan | Multiple entries created, shortage summary generated | H | IT |
| MPL-03 | Drag-and-drop reorder | Desktop viewport | Drag entry to new slot | Entry updates date/slot | M | CT |
| MPL-04 | Nutrition summary (future) | Recipes with nutrition data | View plan summary | Macro totals displayed | L | CT |

## Shopping Lists
| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
| SHP-01 | Generate list from plan | Meal plan with shortages | Trigger generation | List created with items & quantities | H | IT |
| SHP-02 | Mark item purchased | Shopping list open | Toggle checkbox | Item marked purchased, progress updates | H | CT |
| SHP-03 | Realtime sync (future) | Two users same household | User A updates list | User B sees update in <2s | L | E2E |
| SHP-04 | Export list | List open | Click export (future) | File generated/download prompt | L | E2E |

## Authentication & Settings
| ID | Title | Preconditions | Steps | Expected Result | Priority | Type |
| AUTH-01 | Sign up new user | None | 1. Open signup 2. Enter credentials 3. Submit | Account created, redirected to onboarding | H | E2E |
| AUTH-02 | Login existing user | Account exists | 1. Login 2. Provide credentials | Authenticated session, dashboard visible | H | E2E |
| AUTH-03 | Password reset | Email known | Trigger reset | Email sent, confirmation message shown | M | IT |
| SET-01 | Change locale | Settings view loaded | Select new locale | UI updates to new language, stored in profile | M | IT |

## Non-functional
| ID | Title | Description | Priority | Type |
| NFR-01 | Performance budget | Lighthouse performance score >90 on PWA profile | M | E2E |
| NFR-02 | Accessibility audit | axe-core scan with zero critical issues | H | CT |
| NFR-03 | Security headers | Deployed app returns proper CSP, HSTS | H | E2E |
| NFR-04 | API rate limit handling | Simulate 429 from Gemini; app retries/backoff | M | UT |

## Defect Workflow
1. Log issue with reproduction steps, environment, screenshots.
2. Assign severity & priority.
3. Developer triages, adds fix, and submits PR with tests.
4. QA verifies fix on staging before release.

## Traceability
- Requirements traceability matrix maintained by linking IDs to `docs/SRS.md` sections (see Appendix A below).

### Appendix A — RTM Snapshot
| Requirement (SRS) | Test Cases |
|-------------------|------------|
| Inventory CRUD | INV-01, INV-02, INV-05 |
| Expiration Alerts | INV-03, NFR-01 |
| AI Suggestions | REC-01, REC-02, REC-03, NFR-04 |
| Meal Planning | MPL-01, MPL-02 |
| Shopping Lists | SHP-01, SHP-02 |
| Authentication | AUTH-01, AUTH-02, AUTH-03 |
| Localization | SET-01 |

## References
- `docs/testing/test-plan.md`
- `docs/SRS.md`
- `docs/design/process-flows.md`
