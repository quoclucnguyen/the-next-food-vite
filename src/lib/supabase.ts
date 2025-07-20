import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      food_items: {
        Row: {
          id: string
          user_id: string
          name: string
          quantity: number
          unit: string
          expiration_date: string
          category: string
          created_at: string
          updated_at: string
          image_url?: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          quantity: number
          unit: string
          expiration_date: string
          category: string
          created_at?: string
          updated_at?: string
          image_url?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          quantity?: number
          unit?: string
          expiration_date?: string
          category?: string
          created_at?: string
          updated_at?: string
          image_url?: string
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string
          name: string
          ingredients: string[]
          instructions: string[]
          prep_time: number
          servings: number
          created_at: string
          updated_at: string
          image_url?: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          ingredients: string[]
          instructions: string[]
          prep_time: number
          servings: number
          created_at?: string
          updated_at?: string
          image_url?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          ingredients?: string[]
          instructions?: string[]
          prep_time?: number
          servings?: number
          created_at?: string
          updated_at?: string
          image_url?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          date: string
          meal_type: "breakfast" | "lunch" | "dinner"
          recipe_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          meal_type: "breakfast" | "lunch" | "dinner"
          recipe_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          meal_type?: "breakfast" | "lunch" | "dinner"
          recipe_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      shopping_items: {
        Row: {
          id: string
          user_id: string
          name: string
          quantity: number
          unit: string
          category: string
          completed: boolean
          source: "manual" | "meal-plan" | "inventory"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          quantity: number
          unit: string
          category: string
          completed?: boolean
          source: "manual" | "meal-plan" | "inventory"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          quantity?: number
          unit?: string
          category?: string
          completed?: boolean
          source?: "manual" | "meal-plan" | "inventory"
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          display_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          display_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          display_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          user_id: string
          name: string
          display_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          display_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          display_name?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
