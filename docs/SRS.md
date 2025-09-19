# Software Requirements Specification (SRS) — The Next Food

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification defines the functional and non-functional requirements for The Next Food web application. It serves engineering, product, QA, and operations teams as the baseline for planning, implementation, testing, and deployment.

### 1.2 Scope
The Next Food is a React-based web platform that helps households manage household inventory (food items, date-tracked consumables, and durable assets), plan meals, discover AI-assisted recipes, and generate smart shopping lists. The scope includes user authentication, inventory tracking across the three modules, recipe management, meal planning, shopping list generation, AI-assisted features, and supporting configuration and analytics.

### 1.3 Definitions, Acronyms, and Abbreviations
- **AI**: Artificial Intelligence (Google Gemini integration).
- **DFD**: Data Flow Diagram.
- **ERD**: Entity Relationship Diagram.
- **RLS**: Row Level Security (Supabase database policy).
- **SPA**: Single Page Application.
- **SRS**: Software Requirements Specification.

### 1.4 References
- `docs/design/architecture.md`
- `docs/design/database.md`
- `docs/design/ui.md`
- `docs/testing/test-plan.md`
- `docs/deployment/deployment-guide.md`
- `memory-bank/*.md` files for living context

### 1.5 Overview
Sections 2–6 describe the product perspective, functional requirements, interface expectations, non-functional requirements, and appendices covering diagrams and supplementary information.

## 2. Overall Description

### 2.1 Product Perspective
The Next Food is a greenfield SPA running on modern browsers and backed by Supabase. It consumes Supabase REST/RPC endpoints for CRUD operations and integrates with the Gemini AI API. The app targets mobile-first users while remaining responsive across desktop screens.

### 2.2 Product Functions
- Authentication and household onboarding
- Inventory CRUD across food, date-tracked consumables, and durable assets with barcode scanning, media uploads, expiration/maintenance tracking
- Recipe cataloging with AI-assisted suggestions
- Meal planning calendar with inventory-aware recommendations
- Smart shopping lists derived from meal plans and inventory gaps
- Notifications and analytics (expiration alerts, consumption insights)

### 2.3 User Classes and Characteristics
- **Household Admin**: Creates account, manages inventory, configures preferences.
- **Household Member**: Views inventory, participates in planning, updates shopping lists.
- **Guest (Future)**: Limited read access to shared meal plans or lists.
All users expect mobile-first UX, Vietnamese localization, and intuitive flows.

### 2.4 Operating Environment
- Modern evergreen browsers (Chrome, Edge, Firefox, Safari).
- Mobile Safari and Chromium (responsive viewports ≥320px).
- Supabase (PostgreSQL + Auth) for backend services.
- Gemini AI API for recipe recommendations.

### 2.5 Design and Implementation Constraints
- Frontend built with React 19 + TypeScript.
- Backend interactions limited to Supabase APIs; no custom server at present.
- Tailwind CSS 4 with shadcn/ui component primitives.
- Strict TypeScript configuration (no implicit any, strict null checks).
- Environment variables must use `VITE_` prefix for Vite exposure.

### 2.6 User Documentation
User documentation will reside in `docs/user-guide/` with installation, usage, and troubleshooting guides.

### 2.7 Assumptions and Dependencies
- Users have stable internet access; offline-first is aspirational but not guaranteed.
- Supabase project maintains availability and enforces RLS policies correctly.
- Gemini AI quotas are sufficient for expected usage volume.
- Barcode scanning relies on device camera APIs compatible with modern browsers.

## 3. System Features

Each feature includes description, priority, triggers, preconditions, basic flow, alternate flows, postconditions, and non-functional requirements.

### 3.1 User Authentication
- **Priority**: High
- **Description**: Users register/login via Supabase Auth. Sessions persist using JWT stored securely.
- **Preconditions**: User accesses login page; backend operational.
- **Flow**: User enters credentials → Supabase Auth validates → session stored → user redirected to dashboard.
- **Alternate**: Password reset via email, social login (future).
- **Non-functional**: Response <2s, encryption in transit, lockout after repeated failures.

### 3.2 Inventory Management
- **Priority**: High
- **Description**: Manage household inventory across three modules—Food Inventory, Household Consumables (date-tracked), and Household Assets (non-date)—with shared UX patterns and module-specific fields.
- **Preconditions**: Authenticated user; inventory tables accessible per module via Supabase RLS.
- **Flow**: Add item manually or via barcode/AI intake → confirm details within the relevant module → persist to Supabase with optimistic cache updates.
- **Alternate**: Bulk import via CSV (future), offline caching (future).
- **Non-functional**: Validation for units/dates, consistent category taxonomies, sub-second mutations using React Query cache.

#### 3.2.1 Food Inventory (Existing)
- Scope: All edible items and beverages already supported by current implementation.
- Key fields: `name`, `quantity`, `unit`, `expiration_date`, `category`, `storage_location`, `image_url`.
- Status: Production-ready with AI-assisted intake and expiration surfacing.

#### 3.2.2 Household Consumables (Date-tracked)
- Scope: Non-food supplies that ship with manufacturer best-before, replacement, or inspection dates (cleaning chemicals, safety gear, filters, medications).
- Key fields: `name`, `quantity`, `unit`, `category`, `storage_location`, `replacement_date`, `reminder_lead_time`, optional receipt/label attachment.
- Status: Planned module; see `docs/design/household-inventory.md` for UX and data outline.

#### 3.2.3 Household Assets (Non-date)
- Scope: Durable goods without formal expiration (appliances, tools, electronics, furniture, hobby gear).
- Key fields: `name`, `category`, `location`, `owner`, `purchase_details`, `serial_number`, optional warranty/maintenance notes.
- Status: Planned module; prioritizes quick lookup, search facets, and attachment storage for manuals/receipts.

#### 3.2.4 Item Coverage Reference
The consumables and assets modules explicitly exclude cosmetics and clothing (and related accessories) per product decision.

**Items with lifecycle dates**
- Fresh produce, meat, seafood, deli items, and prepared meals
- Dairy, eggs, and refrigerated beverages
- Frozen foods and long-term pantry staples (canned goods, grains, sauces, baking ingredients)
- Baby food, infant formula, and toddler snacks
- Pet food, treats, and supplements
- Prescription medication, over-the-counter medicine, vitamins, and supplements
- First-aid supplies (antiseptics, ointments, bandages, sterile pads)
- Cleaning and laundry chemicals (disinfectant, bleach, descalers, detergents)
- Water, HVAC, and air purifier filters or cartridges
- Fire extinguishers, smoke/CO detector sensors, and emergency lighting batteries
- Single-use and rechargeable batteries with manufacturer shelf lives
- Pest control, garden chemicals, and pool maintenance supplies
- Propane tanks, fuel canisters, and camp stove gas with recertification dates
- Vehicle and household safety kits (flares, first-aid, emergency rations)
- Documents requiring renewal (passports, IDs, vehicle registration, insurance papers)

**Items without lifecycle dates**
- Major appliances (refrigerator, washer, dryer) and small kitchen appliances (blender, toaster, air fryer)
- Cookware, bakeware, tableware, and reusable storage containers
- Furniture (sofa, dining table, shelving) and home décor (lamps, mirrors, artwork)
- Consumer electronics (TV, laptop, tablets, smart speakers, gaming consoles)
- Home office equipment (printer, router, modem, UPS) and networking accessories
- Hand and power tools, hardware assortments, and tool storage systems
- Outdoor and garden equipment (lawn mower, hedge trimmer, grill, patio furniture)
- Sports, fitness, and recreational gear (bicycles, weights, yoga mats, board games)
- Musical instruments, audio equipment, and recording accessories
- Baby gear (crib, stroller, car seat, monitors) and pet accessories (carriers, leashes, feeders)
- Cleaning equipment (vacuum, steam mop, broom), storage bins, and organizers
- Books, reference binders, photo albums, and hobby/craft supplies

### 3.3 Recipe Management & AI Suggestions
- **Priority**: High
- **Description**: Store personal recipes and surface AI-generated suggestions using available inventory data.
- **Preconditions**: Authenticated; Gemini API credentials valid.
- **Flow**: User requests suggestions → system composes prompt with inventory snapshot → Gemini returns structured text → app parses and displays cards.
- **Alternate**: Manual recipe entry, editing, categorization.
- **Non-functional**: Graceful degradation if AI unavailable; parsing robust to inconsistent formats.

### 3.4 Meal Planning
- **Priority**: Medium
- **Description**: Plan meals across calendar views, tie recipes to dates, and compute ingredient needs.
- **Preconditions**: Recipes exist; user authorized.
- **Flow**: Select date range → choose recipes or AI plan → system saves plan and updates ingredient requirements.
- **Alternate**: Drag-and-drop scheduling, template reuse.
- **Non-functional**: Calendar interactions <150ms, responsive layout for mobile.

### 3.5 Shopping Lists
- **Priority**: Medium
- **Description**: Generate and manage shopping lists derived from meal plans and inventory gaps.
- **Preconditions**: Meal plan exists or manual list creation requested.
- **Flow**: System compares inventory vs meal requirements → composes list with quantities → user can adjust and mark purchased items.
- **Alternate**: Collaborative sharing, export to CSV/print.
- **Non-functional**: Real-time syncing between members; offline queueing (stretch).

### 3.6 Notifications & Analytics
- **Priority**: Low (Phase 3)
- **Description**: Provide expiration alerts, usage analytics, consumption trends.
- **Preconditions**: Notification system configured; analytics data aggregated.
- **Flow**: Cron job (Supabase edge function) evaluates expirations → sends push/email/in-app alert.
- **Non-functional**: Notifications sent at configured cadences, accessible UX.

## 4. External Interface Requirements

### 4.1 User Interfaces
- Responsive SPA with bottom navigation for mobile and sidebar for desktop.
- Consistent typography and spacing via Tailwind design tokens.
- UI components sourced from shadcn/ui library.

### 4.2 Hardware Interfaces
- Camera access for barcode scanning and image capture.
- Device storage (temporary) for offline caching (future).

### 4.3 Software Interfaces
- Supabase REST endpoints (inventory_items, recipes, meal_plans, shopping_lists tables).
- Supabase Auth (sign-up, sign-in, session management APIs).
- Gemini AI (text generation endpoint) via `@google/genai` client.

### 4.4 Communications Interfaces
- HTTPS for all API calls.
- WebSockets (Supabase realtime) for inventory/list updates (future).
- Push notification service (future integration).

## 5. Non-functional Requirements

### 5.1 Performance
- Initial page load <3s on 4G mobile.
- Subsequent navigations <1s due to SPA caching and code splitting.
- Gemini response handling must timeout within 10s and provide retry/backoff.

### 5.2 Reliability and Availability
- Target uptime aligned with Supabase SLAs (≥99%).
- Critical flows configurable for graceful degradation.
- Local caches allow temporary read access during transient failures.

### 5.3 Security
- Enforce Supabase RLS policies; users access only their data.
- Encrypt data in transit (TLS) and at rest (Supabase default).
- Sanitize AI prompts to avoid sensitive data leakage.
- Role-based access for future admin features.

### 5.4 Maintainability
- Strict TypeScript types with reusable hooks.
- Modular file structure (`src/views`, `src/components`, `src/lib`, `src/hooks`).
- Documented patterns in `memory-bank/systemPatterns.md`.
- CI quality gates (`pnpm lint`, `pnpm build`).

### 5.5 Localization & Accessibility
- Vietnamese localization at minimum; plan for multi-language.
- WCAG 2.1 AA compliance targeted: keyboard navigation, color contrast, semantic HTML.

### 5.6 Legal & Compliance
- GDPR-style data handling: allow data export/delete upon request.
- Store minimal personal data.
- Comply with Google Gemini terms of service.

## 6. Appendices

### 6.1 Supporting Diagrams
See `docs/diagrams/*.md` for DFD, ERD, architecture, class, sequence, activity, UI flow, and deployment diagrams.

### 6.2 Glossary
- **Inventory Item**: Ingredient with quantity, unit, expiration.
- **Meal Plan**: Scheduled meals with recipes across time.
- **Shopping List**: Aggregated list of items to purchase.
- **Gemini Prompt**: Structured input to Google Gemini for AI suggestions.

### 6.3 Revision History
- v1.0 — 2025-08-20 — Initial SRS drafted from repository context.
