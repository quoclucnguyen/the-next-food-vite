import { createClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      categories: {
        Row: {
          cosmetic_category_type_id: string | null;
          created_at: string | null;
          display_name: string;
          id: string;
          name: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          cosmetic_category_type_id?: string | null;
          created_at?: string | null;
          display_name: string;
          id?: string;
          name: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          cosmetic_category_type_id?: string | null;
          created_at?: string | null;
          display_name?: string;
          id?: string;
          name?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_cosmetic_category_type_id_fkey';
            columns: ['cosmetic_category_type_id'];
            isOneToOne: false;
            referencedRelation: 'cosmetic_category_types';
            referencedColumns: ['id'];
          },
        ];
      };
      cosmetic_category_types: {
        Row: {
          created_at: string;
          description: string | null;
          display_name: string;
          id: string;
          name: string;
          rank: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          display_name: string;
          id?: string;
          name: string;
          rank?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_name?: string;
          id?: string;
          name?: string;
          rank?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      cosmetic_events: {
        Row: {
          cosmetic_id: string;
          created_at: string | null;
          event_type: string;
          id: string;
          occurred_at: string;
          payload: Json;
          user_id: string;
        };
        Insert: {
          cosmetic_id: string;
          created_at?: string | null;
          event_type: string;
          id?: string;
          occurred_at?: string;
          payload?: Json;
          user_id: string;
        };
        Update: {
          cosmetic_id?: string;
          created_at?: string | null;
          event_type?: string;
          id?: string;
          occurred_at?: string;
          payload?: Json;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cosmetic_events_cosmetic_id_fkey';
            columns: ['cosmetic_id'];
            isOneToOne: false;
            referencedRelation: 'cosmetics';
            referencedColumns: ['id'];
          },
        ];
      };
      cosmetic_reminders: {
        Row: {
          cosmetic_id: string;
          created_at: string | null;
          id: string;
          metadata: Json;
          remind_at: string;
          snoozed_until: string | null;
          status: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          cosmetic_id: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json;
          remind_at: string;
          snoozed_until?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          cosmetic_id?: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json;
          remind_at?: string;
          snoozed_until?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cosmetic_reminders_cosmetic_id_fkey';
            columns: ['cosmetic_id'];
            isOneToOne: false;
            referencedRelation: 'cosmetics';
            referencedColumns: ['id'];
          },
        ];
      };
      cosmetics: {
        Row: {
          batch_code: string | null;
          brand: string | null;
          category_id: string | null;
          created_at: string | null;
          dispose_at: string | null;
          expiry_date: string | null;
          id: string;
          image_url: string | null;
          last_usage_at: string | null;
          name: string;
          notes: string | null;
          opened_at: string | null;
          pao_months: number | null;
          purchase_date: string | null;
          size: number | null;
          status: string;
          unit: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          batch_code?: string | null;
          brand?: string | null;
          category_id?: string | null;
          created_at?: string | null;
          dispose_at?: string | null;
          expiry_date?: string | null;
          id?: string;
          image_url?: string | null;
          last_usage_at?: string | null;
          name: string;
          notes?: string | null;
          opened_at?: string | null;
          pao_months?: number | null;
          purchase_date?: string | null;
          size?: number | null;
          status?: string;
          unit?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          batch_code?: string | null;
          brand?: string | null;
          category_id?: string | null;
          created_at?: string | null;
          dispose_at?: string | null;
          expiry_date?: string | null;
          id?: string;
          image_url?: string | null;
          last_usage_at?: string | null;
          name?: string;
          notes?: string | null;
          opened_at?: string | null;
          pao_months?: number | null;
          purchase_date?: string | null;
          size?: number | null;
          status?: string;
          unit?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cosmetics_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      food_items: {
        Row: {
          category: string;
          created_at: string | null;
          expiration_date: string;
          id: string;
          image_url: string | null;
          name: string;
          quantity: number;
          unit: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          expiration_date: string;
          id?: string;
          image_url?: string | null;
          name: string;
          quantity: number;
          unit: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          expiration_date?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          quantity?: number;
          unit?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      meal_plans: {
        Row: {
          created_at: string | null;
          date: string;
          dishes: Json;
          id: string;
          meal_type: string;
          recipe_id: string | null;
          restaurant_id: string | null;
          source: Database['public']['Enums']['meal_source'];
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          dishes?: Json;
          id?: string;
          meal_type: string;
          recipe_id?: string | null;
          restaurant_id?: string | null;
          source?: Database['public']['Enums']['meal_source'];
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          dishes?: Json;
          id?: string;
          meal_type?: string;
          recipe_id?: string | null;
          restaurant_id?: string | null;
          source?: Database['public']['Enums']['meal_source'];
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'meal_plans_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'meal_plans_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['id'];
          },
        ];
      };
      recipes: {
        Row: {
          created_at: string | null;
          id: string;
          image_url: string | null;
          ingredients: string[];
          instructions: string[];
          name: string;
          prep_time: number;
          servings: number;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          ingredients: string[];
          instructions: string[];
          name: string;
          prep_time: number;
          servings: number;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          image_url?: string | null;
          ingredients?: string[];
          instructions?: string[];
          name?: string;
          prep_time?: number;
          servings?: number;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      restaurants: {
        Row: {
          address: string | null;
          created_at: string;
          cuisine: string | null;
          id: string;
          last_visited: string | null;
          name: string;
          notes: string | null;
          phone: string | null;
          rating: number | null;
          tags: string[] | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          cuisine?: string | null;
          id?: string;
          last_visited?: string | null;
          name: string;
          notes?: string | null;
          phone?: string | null;
          rating?: number | null;
          tags?: string[] | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          cuisine?: string | null;
          id?: string;
          last_visited?: string | null;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          rating?: number | null;
          tags?: string[] | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      shopping_items: {
        Row: {
          category: string;
          completed: boolean | null;
          created_at: string | null;
          id: string;
          name: string;
          quantity: number;
          source: string;
          unit: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          category: string;
          completed?: boolean | null;
          created_at?: string | null;
          id?: string;
          name: string;
          quantity: number;
          source: string;
          unit: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          completed?: boolean | null;
          created_at?: string | null;
          id?: string;
          name?: string;
          quantity?: number;
          source?: string;
          unit?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      units: {
        Row: {
          created_at: string | null;
          display_name: string;
          id: string;
          name: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          display_name: string;
          id?: string;
          name: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          display_name?: string;
          id?: string;
          name?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          created_at: string | null;
          gemini_api_key: string | null;
          id: string;
          preferences: Json | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          gemini_api_key?: string | null;
          id?: string;
          preferences?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          gemini_api_key?: string | null;
          id?: string;
          preferences?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_food_items_expiring_soon: {
        Args: { days_ahead?: number };
        Returns: {
          category: string;
          created_at: string | null;
          expiration_date: string;
          id: string;
          image_url: string | null;
          name: string;
          quantity: number;
          unit: string;
          updated_at: string | null;
          user_id: string | null;
        }[];
      };
      get_queue_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          count: number;
          status: string;
        }[];
      };
      is_same_group: {
        Args: { user_a: string; user_b: string };
        Returns: boolean;
      };
      populate_expiring_items_queue_manual: {
        Args: { days_ahead?: number };
        Returns: Json;
      };
      process_expiring_items_queue_manual: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: {
      meal_source: 'home' | 'dining_out';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      meal_source: ['home', 'dining_out'],
    },
  },
} as const;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
