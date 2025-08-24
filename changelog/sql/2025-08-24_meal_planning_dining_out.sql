-- Migration: Dining-out support, multi-dish meals, restaurant management
-- Date: 2025-08-24
-- Notes:
-- - Assumes `meal_plans` table exists.
-- - Adjust UUID/text types to your project conventions if needed.
-- - Run in a transaction when possible; some DDL may auto-commit depending on environment.

begin;

-- 1) Enum for meal source (home vs dining out)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'meal_source') then
    create type meal_source as enum ('home', 'dining_out');
  end if;
end $$;

-- 2) Restaurants table
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(), -- change to text if your project uses text ids
  user_id uuid not null,                         -- adjust to text if needed
  name text not null,
  address text,
  phone text,
  tags text[] default '{}',
  cuisine text,
  rating numeric,
  last_visited date,
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Optional: index by user and name
create index if not exists idx_restaurants_user_name on public.restaurants (user_id, name);

-- 3) Add columns to meal_plans
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'meal_plans' and column_name = 'source'
  ) then
    alter table public.meal_plans add column source meal_source not null default 'home';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'meal_plans' and column_name = 'restaurant_id'
  ) then
    alter table public.meal_plans add column restaurant_id uuid null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'meal_plans' and column_name = 'dishes'
  ) then
    alter table public.meal_plans add column dishes jsonb not null default '[]'::jsonb;
  end if;
end $$;

-- 4) Foreign key for restaurant (nullable)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'meal_plans_restaurant_id_fkey'
  ) then
    alter table public.meal_plans
      add constraint meal_plans_restaurant_id_fkey
      foreign key (restaurant_id) references public.restaurants(id)
      on delete set null;
  end if;
end $$;

-- 5) Uniqueness (user_id, date, meal_type) to avoid duplicates
--    If you already have a similar constraint, this will be skipped.
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and indexname = 'meal_plans_user_date_meal_type_key'
  ) then
    create unique index meal_plans_user_date_meal_type_key
      on public.meal_plans (user_id, date, meal_type);
  end if;
end $$;

commit;

-- Rollback notes (manual):
--   drop index if exists meal_plans_user_date_meal_type_key;
--   alter table public.meal_plans drop constraint if exists meal_plans_restaurant_id_fkey;
--   alter table public.meal_plans drop column if exists dishes;
--   alter table public.meal_plans drop column if exists restaurant_id;
--   alter table public.meal_plans drop column if exists source;
--   drop table if exists public.restaurants;
--   drop type if exists meal_source;

