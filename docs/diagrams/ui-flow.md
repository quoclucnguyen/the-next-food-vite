# UI Flow & Screen Map

```mermaid
flowchart TD
    Splash[Launch / Splash]
    Splash --> Auth{Authenticated?}
    Auth -->|No| Login[Login / Sign Up]
    Login --> Dashboard
    Auth -->|Yes| Dashboard[Home Dashboard]

    Dashboard --> Inventory
    Dashboard --> Recipes
    Dashboard --> MealPlan
    Dashboard --> Shopping
    Dashboard --> Settings

    Inventory --> AddItem[Add/Edit Item Dialog]
    Inventory --> ItemDetail[Item Detail Sheet]

    Recipes --> Suggested[AI Suggestions]
    Recipes --> RecipeDetail[Recipe Detail]
    RecipeDetail --> SaveRecipe[Save / Edit]

    MealPlan --> PlanCalendar[Weekly Planner]
    PlanCalendar --> AIPlanner[AI Plan Modal]
    PlanCalendar --> PlanSummary[Plan Summary]
    PlanSummary --> ShoppingPrompt[Generate Shopping List]

    Shopping --> ListView[Shopping List]
    ListView --> ShareModal[Share/Export (future)]

    Settings --> Profile
    Settings --> Household
    Settings --> Preferences
    Settings --> Integrations
```

## Layout Notes
- Mobile devices use bottom navigation linking Inventory, Recipes, Meal Plan, Shopping, Settings.
- Desktop view introduces sidebar while keeping quick actions accessible.
- Dialogs (Add Item, AI Plan) use Radix Dialog/Sheet for native feel.
