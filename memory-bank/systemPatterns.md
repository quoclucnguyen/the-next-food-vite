# System Patterns

## System Architecture

### Overall Architecture

The Next Food follows a modern React-based single-page application (SPA) architecture with the following layers:

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│     (React Components + UI)         │
├─────────────────────────────────────┤
│          Business Logic Layer       │
│        (Custom Hooks + Utils)       │
├─────────────────────────────────────┤
│           Data Access Layer         │
│      (React Query + Supabase)       │
├─────────────────────────────────────┤
│          External Services          │
│    (Supabase DB + Gemini AI)        │
└─────────────────────────────────────┘
```

### Component Architecture

- Atomic Design Principles: Components organized from atoms to organisms
- Compound Components: Complex components built from smaller, focused pieces
- Render Props Pattern: For flexible component composition where useful
- Higher-Order Components: For cross-cutting concerns like authentication

## Key Technical Decisions

### Frontend Framework Choices

- React 19.x: Chosen for its ecosystem and concurrent features
- TypeScript (>=5.x): Strict typing for developer experience
- Vite: Fast build tool with HMR
- Tailwind CSS: Utility-first CSS framework

### State Management Strategy

- React Query (v5.x): Server state management with caching and background sync
- React Context: Global client state for preferences/UI
- Local State: Component-level state with useState/useReducer
- URL State: Navigation and filter state via React Router

### Data Flow Architecture

User Action → Custom Hook → React Query → Supabase → Database
↓ ↓ ↓ ↓ ↓
UI Update ← Component ← Cache ← Response ← API ← Query Result

### Authentication & Authorization

- Supabase Auth for authentication and session management
- Row Level Security (RLS) enforced on core tables
- Protected client-side routes and JWT usage for secure API calls

## Design Patterns in Use

- Custom Hooks Pattern: Encapsulating business logic in reusable hooks
- Repository Pattern: Abstracting data access through service layers
- Provider Pattern: Sharing context across component trees
- Command Pattern: Used in complex operations where undo/redo may be needed

## Component Relationships

Current component hierarchy (high level):

App
├── AuthWrapper
│ ├── AppLayout
│ │ ├── Navigation (BottomNav)
│ │ ├── UserMenu
│ │ └── PageContent
│ │ ├── HomePage
│ │ ├── InventoryPage (Food module)
│ │ │ ├── FoodItemCard[]
│ │ │ └── AddItemDialog / AddItemPage
│ │ ├── InventoryConsumablesPage (planned, date-tracked)
│ │ ├── InventoryAssetsPage (planned, non-date)
│ │ ├── RecipesPage
│ │ │ ├── RecipeCard[]
│ │ │ └── RecipeSuggestions
│ │ ├── MealPlanningPage
│ │ └── ShoppingListPage
│ └── QueryProvider
└── Toaster (Global notifications)

Currently-open files (active focus)

- src/views/inventory/add/page.tsx
- src/views/inventory/page.tsx
- src/components/layouts/AppLayout.tsx
- src/components/bottom-nav.tsx

## Critical Implementation Paths

### Authentication Flow

1. Protected route check via AuthWrapper
2. Supabase login/registration
3. User data stored in context; protected content renders

### Inventory Management Flow

1. Add item (manual or barcode) → AddItemDialog / AddItemPage (food)
2. ImageUpload handles media
3. useFoodItems hook manages API calls and cache updates
4. FoodItemCard displays item with expiration status
5. Planned: parallel flows for consumables (`useConsumables`, replacement alerts) and assets (`useAssets`, maintenance logs) following the same pattern (see `docs/design/household-inventory.md`).

### Recipe Suggestion Flow

1. useRecipes calls Gemini API with inventory context
2. AI returns suggestions; RecipeSuggestions displays parsed results
3. User can save suggestions to recipes table

## Dependencies and Tool Configurations

- Core dependencies: see memory-bank/techContext.md for precise versions synced to package.json
- Dev tools: ESLint, Prettier, Vitest, Testing Library

## Database Schema Patterns

- inventory_items, recipes, recipe_ingredients, meal_plans, shopping_lists, shopping_list_items
- Planned tables: consumable_items (date-tracked) and household_assets (non-date) with shared category/location tables
- RLS policies applied to ensure user isolation

## Performance & Security Patterns

- Lazy loading, memoization, virtual lists for performance
- Input validation, parameterized queries and sanitization for security
- Environment variables for secrets (never committed)

## Notes

- File refreshed to reflect repository state at commit `9c885c6031b7137163acaa1dd97d80f19f61b893` (2025-08-20 20:27 UTC+7).
- System patterns documented to guide development and onboarding; see `docs/design/household-inventory.md` for multi-module inventory blueprint (added 2025-08-20).
