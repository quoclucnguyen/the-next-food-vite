import type { Database } from '@/lib/supabase';

type FoodItem = Database['public']['Tables']['food_items']['Row'] & {
  image_url?: string;
};

type Unit = Database['public']['Tables']['units']['Row'];

export interface QueryContext<T> {
  previousItems?: T[];
  previousUnits?: Unit[];
}

export type FoodItemsContext = QueryContext<FoodItem>;
export type UnitsContext = QueryContext<Unit>;
