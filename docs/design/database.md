# Database Design — The Next Food

## 1. Overview
The Next Food leverages Supabase (PostgreSQL) as the primary data store. Row Level Security (RLS) ensures that users can only access records owned by their household account. The ERD is described in `docs/diagrams/erd.md`.

## 2. Core Tables

### 2.1 users (Supabase auth schema)
- Managed by Supabase Auth; stores user id (`uuid`), email, metadata.
- Application extends profile data via `profiles` table.

### 2.2 profiles
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, references auth.users.id |
| display_name | text | Nullable, defaults to email prefix |
| household_id | uuid | FK to households |
| locale | text | Defaults to `vi-VN` |
| created_at | timestamptz | Default `now()` |

### 2.3 households
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | Household label |
| timezone | text | Defaults to `Asia/Ho_Chi_Minh` |
| created_at | timestamptz | |

### 2.4 household_members
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| household_id | uuid | FK households |
| user_id | uuid | FK profiles.id |
| role | text | `admin` or `member` |
| invited_email | text | For pending invitations |
| status | text | `active`, `pending`, `revoked` |

### 2.5 inventory_items
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| household_id | uuid | FK households |
| name | text | Ingredient name |
| category | text | Enum: produce, protein, pantry, dairy, frozen, other |
| quantity | numeric | Combined with unit |
| unit | text | `g`, `kg`, `ml`, `l`, `pcs`, etc. |
| location | text | Pantry, fridge, freezer |
| expiration_date | date | Nullable |
| barcode | text | Optional for scanning |
| image_url | text | Supabase storage reference |
| notes | text | Additional info |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 2.6 inventory_audit_log
Captures history of changes.
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| inventory_item_id | uuid | FK inventory_items |
| user_id | uuid | FK profiles |
| action | text | `create`, `update`, `delete`, `consume`, `restock` |
| before_state | jsonb | Snapshot |
| after_state | jsonb | Snapshot |
| created_at | timestamptz | |

### 2.7 recipes
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| household_id | uuid | FK households |
| title | text | |
| description | text | Markdown supported |
| source | text | `manual`, `ai`, `imported` |
| cuisine | text | Optional |
| prep_time_minutes | int | |
| cook_time_minutes | int | |
| servings | int | |
| image_url | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 2.8 recipe_ingredients
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| recipe_id | uuid | FK recipes |
| name | text | Ingredient label |
| quantity | numeric | |
| unit | text | |
| optional | boolean | |
| source_inventory_item_id | uuid | Optional link to inventory item |

### 2.9 recipe_steps
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| recipe_id | uuid | FK recipes |
| step_number | int | Order |
| instruction | text | Markdown supported |

### 2.10 meal_plans
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| household_id | uuid | FK households |
| title | text | e.g., "Week of Aug 25" |
| start_date | date | |
| end_date | date | |
| created_by | uuid | FK profiles |
| created_at | timestamptz | |

### 2.11 meal_plan_entries
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| meal_plan_id | uuid | FK meal_plans |
| date | date | |
| meal_slot | text | `breakfast`, `lunch`, `dinner`, `snack` |
| recipe_id | uuid | FK recipes |
| servings | int | |

### 2.12 shopping_lists
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| household_id | uuid | FK households |
| title | text | |
| generated_from | text | `manual`, `meal_plan`, `inventory_gap` |
| status | text | `open`, `in_progress`, `complete` |
| created_at | timestamptz | |

### 2.13 shopping_list_items
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| shopping_list_id | uuid | FK shopping_lists |
| name | text | |
| quantity | numeric | |
| unit | text | |
| category | text | Store section |
| is_purchased | boolean | |
| related_inventory_item_id | uuid | Optional link |

### 2.14 notifications (future)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| household_id | uuid | |
| type | text | `expiration`, `low_stock`, `plan_reminder` |
| payload | jsonb | |
| sent_at | timestamptz | |
| channel | text | `email`, `push`, `in_app` |

## 3. Relationships
- `households` 1—N `household_members`.
- `households` 1—N `inventory_items`, `recipes`, `meal_plans`, `shopping_lists`.
- `meal_plans` 1—N `meal_plan_entries`.
- `recipes` 1—N `recipe_ingredients`, `recipe_steps`.
- `shopping_lists` 1—N `shopping_list_items`.
- Optional linking from ingredients/list items to inventory items for smart tracking.

## 4. Security Policies
- Enable RLS on all user data tables; policies allow access only where `household_id` matches member's household.
- Audit log accessible to admins for diagnostics.
- Use Supabase storage policies to restrict image uploads to household directory.

## 5. Data Lifecycle & Retention
- Soft delete strategy (boolean flag) for key tables planned to preserve history.
- Audit tables keep change history for 180 days.
- Cron job (Edge Function) purges expired temporary AI responses after 7 days.

## 6. Migration Strategy
- Use Supabase migration scripts (`supabase/migrations`) with version control.
- Document schema changes in `changelog/` and update ERD.
- For destructive changes, provide data export fallback.

## 7. Future Enhancements
- Introduce `nutrition_profiles` table for dietary tracking.
- Add `supplier_prices` to support price comparison.
- Integrate `barcode_catalog` fetched from third-party APIs with caching layer.

## 8. References
- `docs/diagrams/erd.md`
- Supabase SQL migration scripts (once added)
- `docs/SRS.md`
