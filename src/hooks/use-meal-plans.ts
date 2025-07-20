

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type MealPlan = Database["public"]["Tables"]["meal_plans"]["Row"] & {
  recipe?: {
    name: string
  }
}
type MealPlanInsert = Database["public"]["Tables"]["meal_plans"]["Insert"]

export function useMealPlans() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("meal_plans")
        .select(`
          *,
          recipe:recipes(name)
        `)
        .order("date", { ascending: true })

      if (error) throw error
      setMealPlans(data || [])
    } catch (error) {
      console.error("Error fetching meal plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const addMealPlan = async (mealPlan: Omit<MealPlanInsert, "user_id">) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("meal_plans")
        .insert({ ...mealPlan, user_id: user.id })
        .select(`
          *,
          recipe:recipes(name)
        `)
        .single()

      if (error) throw error
      setMealPlans((prev) => [...prev, data])
      return data
    } catch (error) {
      console.error("Error adding meal plan:", error)
      throw error
    }
  }

  const deleteMealPlan = async (id: string) => {
    try {
      const { error } = await supabase.from("meal_plans").delete().eq("id", id)

      if (error) throw error
      setMealPlans((prev) => prev.filter((plan) => plan.id !== id))
    } catch (error) {
      console.error("Error deleting meal plan:", error)
      throw error
    }
  }

  useEffect(() => {
    fetchMealPlans()

    // Set up real-time subscription
    const subscription = supabase
      .channel("meal_plans_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "meal_plans" }, () => {
        // Refetch to get updated data with recipe names
        fetchMealPlans()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    mealPlans,
    loading,
    addMealPlan,
    deleteMealPlan,
    refetch: fetchMealPlans,
  }
}
