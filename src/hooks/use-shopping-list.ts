

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type ShoppingItem = Database["public"]["Tables"]["shopping_items"]["Row"]
type ShoppingItemInsert = Database["public"]["Tables"]["shopping_items"]["Insert"]
type ShoppingItemUpdate = Database["public"]["Tables"]["shopping_items"]["Update"]

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("shopping_items")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error fetching shopping items:", error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (item: Omit<ShoppingItemInsert, "user_id">) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("shopping_items")
        .insert({ ...item, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      setItems((prev) => [data, ...prev])
      return data
    } catch (error) {
      console.error("Error adding shopping item:", error)
      throw error
    }
  }

  const updateItem = async (id: string, updates: ShoppingItemUpdate) => {
    try {
      const { data, error } = await supabase
        .from("shopping_items")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setItems((prev) => prev.map((item) => (item.id === id ? data : item)))
      return data
    } catch (error) {
      console.error("Error updating shopping item:", error)
      throw error
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from("shopping_items").delete().eq("id", id)

      if (error) throw error
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting shopping item:", error)
      throw error
    }
  }

  const clearCompleted = async () => {
    try {
      const { error } = await supabase.from("shopping_items").delete().eq("completed", true)

      if (error) throw error
      setItems((prev) => prev.filter((item) => !item.completed))
    } catch (error) {
      console.error("Error clearing completed items:", error)
      throw error
    }
  }

  useEffect(() => {
    fetchItems()

    // Set up real-time subscription
    const subscription = supabase
      .channel("shopping_items_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "shopping_items" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setItems((prev) => [payload.new as ShoppingItem, ...prev])
        } else if (payload.eventType === "UPDATE") {
          setItems((prev) => prev.map((item) => (item.id === payload.new.id ? (payload.new as ShoppingItem) : item)))
        } else if (payload.eventType === "DELETE") {
          setItems((prev) => prev.filter((item) => item.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    clearCompleted,
    refetch: fetchItems,
  }
}
