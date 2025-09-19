# UI & UX Design Guide — The Next Food

## 1. Design Principles
- **Mobile-first**: Optimize for handheld devices with responsive breakpoints (`sm`, `md`, `lg`).
- **Clarity over clutter**: Present only essential controls per screen; progressive disclosure for advanced actions.
- **Consistency**: Use shadcn/ui components with standardized spacing, typography, and color tokens defined in Tailwind config.
- **Actionable Feedback**: Provide clear success/error states with Toast (sonner) notifications and inline validation.
- **Accessibility**: Meet WCAG 2.1 AA—focus states, keyboard navigation, semantic markup, localized content.

## 2. Visual Identity
- **Color Palette**: Fresh food-inspired palette (primary green, accent orange, supportive neutrals).
- **Typography**: Inter (body) and custom heading variant; manage via Tailwind `font-sans`, `font-semibold`, etc.
- **Iconography**: Lucide icons for clarity; consistent stroke width.
- **Imagery**: High-quality food images optimized for web; handle via Supabase storage.

## 3. Layout Patterns
- **App Shell**: `AppLayout` provides header, main content, bottom navigation (mobile) or sidebar (desktop).
- **Card Grids**: Inventory and recipe lists use card components with responsive columns.
- **Dialogs/Sheets**: Use Radix Dialog/Sheet for adding/editing items on mobile to maximize space.
- **Forms**: Built with `react-hook-form` + shadcn form components; align labels left, error text below inputs.

## 4. Key Screens

### 4.1 Dashboard
- Quick stats (items expiring soon, planned meals, shopping list tasks).
- AI suggestion card for new recipe or meal plan.

### 4.2 Inventory
- Filter chips (category, location, expiration).
- Search bar with debounced input.
- Card layout showing name, quantity, expiration badge color-coded.
- CTA to add item (floating action button on mobile).

### 4.3 Add/Edit Inventory Item
- Steps: Details → Quantity & Units → Storage & Expiration → Notes & Photo.
- Barcode scan button (once implemented) in header.
- Inline AI auto-fill suggestion component.

### 4.4 Recipes
- Tabs for Saved, Suggested, Favorites.
- Recipe cards with hero image, difficulty, prep time.
- Detail view shows ingredients (link to inventory availability) and steps.

### 4.5 Meal Planner
- Week view with drag-and-drop meal slots.
- AI "Plan for me" action generating plan preview before apply.
- Nutrition summary panel (future enhancement).

### 4.6 Shopping Lists
- Collapsible categories (Produce, Dairy, etc.).
- Toggle purchased state; progress indicator at top.
- Share/export actions (future).

### 4.7 Settings
- Profile info, household members management, localization preferences, AI settings (Gemini prompt tone).

## 5. Interaction Models
- **Bottom Navigation**: Inventory • Recipes • Meal Plan • Shopping • Settings.
- **Global Search**: Command palette (cmd/ctrl+k) for quick navigation and actions.
- **Notifications**: Toast for transient feedback, in-app notification center for persistent alerts.
- **Pull-to-refresh**: On mobile PWA (future) for inventory refresh.

## 6. Localization
- Use i18n keys storing Vietnamese translations; fallback to English until full localization complete.
- Date/time formatting uses `Intl` with household timezone.
- Number/quantity formatting respects locale (decimal separators).

## 7. Accessibility Checklist
- All interactive elements have visible focus states.
- Keyboard trap avoidance in dialogs via Radix primitives.
- Use `aria-live` regions for toast notifications.
- Provide text alternatives for images (inventory item photos, recipe images).
- Color contrast validated (>=4.5:1 for text).

## 8. UI Assets & References
- See `docs/diagrams/ui-flow.md` for screen flow diagrams and layout wireframes (Mermaid notation).
- Tailwind theme tokens defined in `tailwind.config` (see repo once added).
- Icon inventory tracked in `docs/design/assets/icons.md` (TBD).

## 9. Future Enhancements
- Dark mode toggle with persisted preference.
- Drag-and-drop reordering on desktop for inventory categories.
- Offline indicators and skeleton states for poor connectivity.

## 10. References
- `docs/SRS.md`
- `docs/diagrams/ui-flow.md`
- `memory-bank/systemPatterns.md`
