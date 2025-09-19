# Class Diagram — Domain Models

```mermaid
classDiagram
    class InventoryItem {
      +uuid id
      +string name
      +string category
      +number quantity
      +string unit
      +string location
      +Date expirationDate
      +string barcode
      +string imageUrl
      +string notes
      +Date createdAt
      +Date updatedAt
      +boolean isExpired()
      +number daysUntilExpiration()
    }

    class Recipe {
      +uuid id
      +string title
      +string description
      +string source
      +int prepTimeMinutes
      +int cookTimeMinutes
      +int servings
      +string imageUrl
      +List~RecipeIngredient~ ingredients
      +List~RecipeStep~ steps
      +List~string~ tags
      +boolean isAIOrigin()
    }

    class RecipeIngredient {
      +uuid id
      +string name
      +number quantity
      +string unit
      +boolean optional
      +uuid inventoryItemId
    }

    class RecipeStep {
      +uuid id
      +int order
      +string instruction
    }

    class MealPlan {
      +uuid id
      +string title
      +Date startDate
      +Date endDate
      +List~MealEntry~ entries
      +Map~string,int~ servingsBySlot
      +List~InventoryDelta~ deltas
      +void generateDeltas()
    }

    class MealEntry {
      +uuid id
      +Date date
      +string mealSlot
      +Recipe recipe
      +int servings
    }

    class ShoppingList {
      +uuid id
      +string title
      +string source
      +List~ShoppingItem~ items
      +int completionPercentage()
    }

    class ShoppingItem {
      +uuid id
      +string name
      +number quantity
      +string unit
      +string category
      +boolean isPurchased
      +uuid inventoryItemId
    }

    class InventoryDelta {
      +uuid inventoryItemId
      +number requiredQuantity
      +number availableQuantity
      +number shortfall
    }

    InventoryItem <.. RecipeIngredient : optional
    Recipe "1" -- "*" RecipeIngredient
    Recipe "1" -- "*" RecipeStep
    MealPlan "1" -- "*" MealEntry
    MealEntry --> Recipe
    ShoppingList "1" -- "*" ShoppingItem
    MealPlan --> InventoryDelta
    InventoryDelta --> InventoryItem
```

## Notes
- Diagram focuses on domain-layer TypeScript models used in hooks/services.
- Methods reflect business logic (expiration calculations, delta generation).
- Actual implementation may use interfaces/types rather than classes; diagram abstracts structure.
