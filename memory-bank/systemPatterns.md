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

- **Atomic Design Principles**: Components organized from atoms to organisms
- **Compound Components**: Complex components built from smaller, focused pieces
- **Render Props Pattern**: For flexible component composition
- **Higher-Order Components**: For cross-cutting concerns like authentication

## Key Technical Decisions

### Frontend Framework Choices

- **React 18**: Chosen for its mature ecosystem and concurrent features
- **TypeScript**: Provides type safety and better developer experience
- **Vite**: Fast build tool with excellent development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development

### State Management Strategy

- **React Query**: Server state management with caching and synchronization
- **React Context**: Global client state for user preferences and UI state
- **Local State**: Component-level state with useState and useReducer
- **URL State**: Navigation and filter state managed through React Router

### Data Flow Architecture

```
User Action → Custom Hook → React Query → Supabase → Database
     ↓              ↓            ↓           ↓          ↓
UI Update ← Component ← Cache ← Response ← API ← Query Result
```

### Authentication & Authorization

- **Supabase Auth**: Handles user authentication and session management
- **Row Level Security (RLS)**: Database-level authorization
- **Protected Routes**: Client-side route protection
- **JWT Tokens**: Secure API communication

## Design Patterns in Use

### Custom Hooks Pattern

Encapsulating business logic in reusable hooks:

```typescript
// Example pattern
const useInventoryItems = () => {
  const query = useQuery(['inventory'], fetchInventoryItems);
  const addMutation = useMutation(addInventoryItem);

  return {
    items: query.data,
    isLoading: query.isLoading,
    addItem: addMutation.mutate,
    // ... other operations
  };
};
```

### Repository Pattern

Abstracting data access through service layers:

```typescript
// Example pattern
class InventoryRepository {
  async getItems(userId: string) {
    /* ... */
  }
  async addItem(item: InventoryItem) {
    /* ... */
  }
  async updateItem(id: string, updates: Partial<InventoryItem>) {
    /* ... */
  }
}
```

### Provider Pattern

Sharing context across component trees:

```typescript
// Example pattern
const AppProvider = ({ children }) => (
  <QueryProvider>
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  </QueryProvider>
);
```

### Command Pattern

For complex operations with undo/redo capabilities:

```typescript
// Example pattern
interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

class AddInventoryItemCommand implements Command {
  // Implementation
}
```

## Component Relationships

### Core Component Hierarchy

```
App
├── AuthWrapper
│   ├── AppLayout
│   │   ├── Navigation (BottomNav)
│   │   ├── UserMenu
│   │   └── PageContent
│   │       ├── HomePage
│   │       ├── InventoryPage
│   │       │   ├── FoodItemCard[]
│   │       │   └── AddItemDialog
│   │       ├── RecipesPage
│   │       │   ├── RecipeCard[]
│   │       │   └── RecipeSuggestions
│   │       ├── MealPlanningPage
│   │       └── ShoppingListPage
│   └── QueryProvider
└── Toaster (Global notifications)
```

### Shared Component Library

- **UI Components**: Button, Input, Dialog, Card, etc. (shadcn/ui based)
- **Form Components**: FormField, FormWrapper, ValidationMessage
- **Layout Components**: Container, Grid, Stack, Spacer
- **Feedback Components**: Loading, Error, Empty states

### Data Flow Between Components

- **Props Down**: Data flows down through props
- **Events Up**: User interactions bubble up through callbacks
- **Context Across**: Shared state accessed through context
- **Queries Everywhere**: Server data accessed through React Query hooks

## Critical Implementation Paths

### Authentication Flow

1. User visits protected route
2. AuthWrapper checks authentication status
3. If not authenticated, redirect to login
4. Login component handles Supabase authentication
5. On success, user data stored in context
6. Protected content renders with user context

### Inventory Management Flow

1. User scans barcode or searches manually
2. ImageUpload component handles photo capture
3. AddItemDialog validates and submits data
4. useInventoryItems hook manages API call
5. React Query updates cache and UI
6. FoodItemCard components re-render with new data

### Recipe Suggestion Flow

1. User requests recipe suggestions
2. useRecipes hook calls Gemini API
3. Current inventory data sent as context
4. AI returns personalized suggestions
5. RecipeSuggestions component displays results
6. User can save recipes to personal collection

### Meal Planning Flow

1. User accesses meal planning interface
2. useMealPlans hook loads existing plans
3. AI suggests meals based on inventory
4. User selects and customizes meal plan
5. Shopping list automatically generated
6. Calendar integration shows planned meals

## Dependencies and Tool Configurations

### Core Dependencies

```json
{
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "vite": "^4.4.0",
  "@tanstack/react-query": "^4.32.0",
  "@supabase/supabase-js": "^2.33.0",
  "react-router-dom": "^6.15.0",
  "tailwindcss": "^3.3.0"
}
```

### Development Tools

- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting with consistent style
- **Vitest**: Unit testing framework
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling

### Build Configuration

- **Vite Config**: Optimized for React with TypeScript
- **Path Aliases**: Clean imports with @ prefix
- **Environment Variables**: Secure API key management
- **Bundle Splitting**: Optimized loading with code splitting

### Database Schema Patterns

```sql
-- Example table structure
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER,
  expiration_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own items"
  ON inventory_items FOR ALL
  USING (auth.uid() = user_id);
```

### API Integration Patterns

- **Supabase Client**: Centralized database operations
- **React Query**: Caching and synchronization
- **Error Boundaries**: Graceful error handling
- **Loading States**: Consistent loading indicators
- **Optimistic Updates**: Immediate UI feedback

### Performance Optimization Patterns

- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Responsive images with proper formats
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: For large lists of items
- **Debouncing**: For search and filter operations

### Security Patterns

- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries through Supabase
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure token handling
- **Environment Variables**: Secure API key storage
