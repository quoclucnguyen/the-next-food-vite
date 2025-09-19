import { createClient } from '@supabase/supabase-js';

type Json = Record<string, unknown>;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      food_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          quantity: number;
          unit: string;
          expiration_date: string;
          category: string;
          created_at: string;
          updated_at: string;
          image_url?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          quantity: number;
          unit: string;
          expiration_date: string;
          category: string;
          created_at?: string;
          updated_at?: string;
          image_url?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          quantity?: number;
          unit?: string;
          expiration_date?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
          image_url?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          ingredients: string[];
          instructions: string[];
          prep_time: number;
          servings: number;
          created_at: string;
          updated_at: string;
          image_url?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          ingredients: string[];
          instructions: string[];
          prep_time: number;
          servings: number;
          created_at?: string;
          updated_at?: string;
          image_url?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          ingredients?: string[];
          instructions?: string[];
          prep_time?: number;
          servings?: number;
          created_at?: string;
          updated_at?: string;
          image_url?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner';
          recipe_id: string | null;
          source: 'home' | 'dining_out';
          restaurant_id: string | null;
          dishes: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          meal_type: 'breakfast' | 'lunch' | 'dinner';
          recipe_id?: string | null;
          source?: 'home' | 'dining_out';
          restaurant_id?: string | null;
          dishes?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          meal_type?: 'breakfast' | 'lunch' | 'dinner';
          recipe_id?: string | null;
          source?: 'home' | 'dining_out';
          restaurant_id?: string | null;
          dishes?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string | null;
          phone: string | null;
          tags: string[] | null;
          cuisine: string | null;
          rating: number | null;
          last_visited: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          tags?: string[] | null;
          cuisine?: string | null;
          rating?: number | null;
          last_visited?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          tags?: string[] | null;
          cuisine?: string | null;
          rating?: number | null;
          last_visited?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          quantity: number;
          unit: string;
          category: string;
          completed: boolean;
          source: 'manual' | 'meal-plan' | 'inventory';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          quantity: number;
          unit: string;
          category: string;
          completed?: boolean;
          source: 'manual' | 'meal-plan' | 'inventory';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          quantity?: number;
          unit?: string;
          category?: string;
          completed?: boolean;
          source?: 'manual' | 'meal-plan' | 'inventory';
          created_at?: string;
          updated_at?: string;
        };
      };
      cosmetics: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          brand: string | null;
          category_id: string | null;
          size: number | null;
          unit: string | null;
          batch_code: string | null;
          purchase_date: string | null;
          opened_at: string | null;
          expiry_date: string | null;
          pao_months: number | null;
          dispose_at: string | null;
          status: 'active' | 'warning' | 'expired' | 'discarded' | 'archived';
          notes: string | null;
          image_url: string | null;
          last_usage_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          brand?: string | null;
          category_id?: string | null;
          size?: number | null;
          unit?: string | null;
          batch_code?: string | null;
          purchase_date?: string | null;
          opened_at?: string | null;
          expiry_date?: string | null;
          pao_months?: number | null;
          dispose_at?: string | null;
          status?: 'active' | 'warning' | 'expired' | 'discarded' | 'archived';
          notes?: string | null;
          image_url?: string | null;
          last_usage_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          brand?: string | null;
          category_id?: string | null;
          size?: number | null;
          unit?: string | null;
          batch_code?: string | null;
          purchase_date?: string | null;
          opened_at?: string | null;
          expiry_date?: string | null;
          pao_months?: number | null;
          dispose_at?: string | null;
          status?: 'active' | 'warning' | 'expired' | 'discarded' | 'archived';
          notes?: string | null;
          image_url?: string | null;
          last_usage_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cosmetic_events: {
        Row: {
          id: string;
          cosmetic_id: string;
          user_id: string;
          event_type: 'opened' | 'usage' | 'discarded' | 'restocked' | 'note';
          payload: Json;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cosmetic_id: string;
          user_id: string;
          event_type: 'opened' | 'usage' | 'discarded' | 'restocked' | 'note';
          payload?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cosmetic_id?: string;
          user_id?: string;
          event_type?: 'opened' | 'usage' | 'discarded' | 'restocked' | 'note';
          payload?: Json;
          occurred_at?: string;
          created_at?: string;
        };
      };
      cosmetic_reminders: {
        Row: {
          id: string;
          cosmetic_id: string;
          user_id: string;
          remind_at: string;
          status: 'pending' | 'sent' | 'dismissed' | 'snoozed';
          snoozed_until: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cosmetic_id: string;
          user_id: string;
          remind_at: string;
          status?: 'pending' | 'sent' | 'dismissed' | 'snoozed';
          snoozed_until?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cosmetic_id?: string;
          user_id?: string;
          remind_at?: string;
          status?: 'pending' | 'sent' | 'dismissed' | 'snoozed';
          snoozed_until?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          display_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          display_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          display_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          display_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          display_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          display_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
