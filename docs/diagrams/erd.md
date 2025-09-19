# Entity Relationship Diagram — The Next Food

```mermaid
erDiagram
    households ||--o{ household_members : contains
    households ||--o{ inventory_items : owns
    households ||--o{ recipes : owns
    households ||--o{ meal_plans : owns
    households ||--o{ shopping_lists : owns

    household_members }o--|| profiles : includes
    profiles ||--|| auth_users : maps_to

    recipes ||--o{ recipe_ingredients : has
    recipes ||--o{ recipe_steps : orders

    meal_plans ||--o{ meal_plan_entries : includes
    shopping_lists ||--o{ shopping_list_items : contains

    inventory_items ||--o{ inventory_audit_log : tracked_by
    inventory_items ||--o{ recipe_ingredients : referenced_by
    inventory_items ||--o{ shopping_list_items : referenced_by
```

## Key Notes
- `auth_users` represents Supabase auth schema table.
- Optional relationships (dashed) indicate lookup references used to link recipes/shopping items back to inventory.
- Additional future entities (notifications, nutrition_profiles) described in `docs/design/database.md`.
