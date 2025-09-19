# Product Context

## Why This Project Exists

### Problem Statement

Modern households face significant challenges in household inventory management:

- **Food Waste**: Average households waste a significant portion of purchased food due to poor tracking and planning
- **Consumable Misses**: Filters, medication, and safety gear often lapse because replacement dates are unclear
- **Item Retrieval**: Durable goods get misplaced or lack ownership/location context
- **Inefficient Shopping**: Multiple grocery or hardware trips due to unclear inventory status
- **Meal Planning Struggles**: Difficulty planning meals based on available ingredients
- **Recipe Discovery**: Hard to find recipes that match available ingredients and dietary preferences
- **Inventory Chaos**: No clear system for tracking expiration dates, quantities, locations, or warranties

### Market Gap

Existing solutions are fragmented:

- Inventory apps lack meal planning integration
- Recipe apps don't consider available ingredients
- Shopping list apps aren't connected to meal plans
- No comprehensive solution with AI assistance tailored for household workflows

## Problems Being Solved

### Primary Problems

1. **Food Waste Reduction**: Track expiration dates and suggest recipes before items spoil
2. **Consumable Compliance**: Surface upcoming replacement dates for filters, medication, safety gear, and other dated supplies
3. **Asset Visibility**: Keep durable goods organized with location, ownership, and warranty context
4. **Smart Meal Planning**: Plan meals based on available inventory and dietary preferences
5. **Intelligent Shopping**: Generate shopping lists that complement existing inventory
6. **Recipe Discovery**: Find recipes that maximize use of available ingredients
7. **Inventory Visibility**: Always know what's available, where it's stored, and its lifecycle status

### Secondary Problems

1. **Time Management**: Reduce time spent on meal planning and grocery shopping
2. **Budget Optimization**: Minimize food waste to reduce grocery expenses
3. **Nutritional Balance**: Ensure meal plans meet dietary requirements
4. **Family Coordination**: Share inventory and meal plans across household members

## How the Product Should Work

### Core User Journey

1. Inventory entry via barcode scanning or manual entry (food, consumables, assets)
2. AI-assisted categorization, replacement suggestions, and recipe ideas
3. Expiration/replacement tracking with timely alerts
4. Meal planning using current food inventory and preferences
5. Smart shopping lists for missing ingredients and consumables
6. Guided recipe execution with images and steps
7. Household asset lookup with warranty/service context

### Key Workflows

- Food Inventory: Scan or add item → auto-fill details → confirm quantity & location → monitor expiration
- Consumables Management: Add consumable → set replacement date/reminder → track attention status
- Asset Management: Register asset → assign location/owner → attach receipts/manuals → schedule maintenance reminders
- Meal Planning: Set preferences → AI suggests plans using inventory → user selects and schedules
- Shopping: Generate optimized shopping lists from plans and inventory gaps → post-shopping quick inventory update

## User Experience Goals

- Simple entry (one-tap scanning)
- Clear expiration indicators and suggestions
- Intelligent, personalized recommendations from Gemini AI
- Fast, mobile-first interactions with offline-first considerations

## Integration Notes

- Gemini AI used for recipe suggestions and, in future, intake assistance for consumables and assets.
- Supabase handles auth and storage; RLS ensures user data isolation across all inventory tables.
- Barcode scanning is high priority for food and consumables and planned but not fully implemented.
- Documentation for multi-module inventory lives in `docs/design/household-inventory.md` (2025-08-20).

## Success Indicators

- Increased on-time use of inventory (daily/weekly checks)
- Reduced food spoilage for active users
- Fewer missed replacement dates for consumables and safety gear
- Frequent meal plan creation and shopping-list generation
- Positive user feedback on recipe relevance and household item organization

## Current Status

- Product context refreshed to reflect repository state at commit `9c885c6031b7137163acaa1dd97d80f19f61b893` (2025-08-20).
- AI features present but require prompt and response parsing improvements.
- Barcode scanning prioritized for upcoming sprints.
