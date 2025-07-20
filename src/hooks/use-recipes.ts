

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type Recipe = Database["public"]["Tables"]["recipes"]["Row"] & {
  image_url?: string
}
type RecipeInsert = Database["public"]["Tables"]["recipes"]["Insert"]
type RecipeUpdate = Database["public"]["Tables"]["recipes"]["Update"]

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase.from("recipes").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const addRecipe = async (recipe: Omit<RecipeInsert, "user_id">) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("recipes")
        .insert({ ...recipe, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      setRecipes((prev) => [data, ...prev])
      return data
    } catch (error) {
      console.error("Error adding recipe:", error)
      throw error
    }
  }

  const updateRecipe = async (id: string, updates: RecipeUpdate) => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setRecipes((prev) => prev.map((recipe) => (recipe.id === id ? data : recipe)))
      return data
    } catch (error) {
      console.error("Error updating recipe:", error)
      throw error
    }
  }

  const deleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase.from("recipes").delete().eq("id", id)

      if (error) throw error
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
    } catch (error) {
      console.error("Error deleting recipe:", error)
      throw error
    }
  }

  useEffect(() => {
    fetchRecipes()

    // Set up real-time subscription
    const subscription = supabase
      .channel("recipes_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "recipes" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setRecipes((prev) => [payload.new as Recipe, ...prev])
        } else if (payload.eventType === "UPDATE") {
          setRecipes((prev) => prev.map((recipe) => (recipe.id === payload.new.id ? (payload.new as Recipe) : recipe)))
        } else if (payload.eventType === "DELETE") {
          setRecipes((prev) => prev.filter((recipe) => recipe.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    recipes,
    loading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: fetchRecipes,
  }
}
