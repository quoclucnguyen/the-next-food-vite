

import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"
import type { FoodItemsContext } from "@/types/query-context"

type FoodItem = Database["public"]["Tables"]["food_items"]["Row"] & {
  image_url?: string
}
type FoodItemInsert = Database["public"]["Tables"]["food_items"]["Insert"]
type FoodItemUpdate = Database["public"]["Tables"]["food_items"]["Update"]

const FOOD_ITEMS_QUERY_KEY = ["food_items"]

export function useFoodItems() {
  const queryClient = useQueryClient()

  // Query for fetching food items
  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FoodItem[], Error>({
    queryKey: FOOD_ITEMS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("food_items").select("*").order("created_at", { ascending: false })
      if (error) throw error
      return data || []
    },
  })

  // Memoize the items array to prevent unnecessary re-renders
  const stableItems = useMemo(() => items || [], [items])

  // Mutation for adding a food item
  const addItemMutation = useMutation<FoodItem, Error, Omit<FoodItemInsert, "user_id">>({
    mutationFn: async (item) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("food_items")
        .insert({ ...item, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (newItem) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: FOOD_ITEMS_QUERY_KEY })

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<FoodItem[]>(FOOD_ITEMS_QUERY_KEY)

      // Optimistically update to the new value
      queryClient.setQueryData<FoodItem[]>(FOOD_ITEMS_QUERY_KEY, (old) => {
        const tempId = `temp-${Date.now()}` // Temporary ID for optimistic update
        const tempItem = {
          ...newItem,
          id: tempId,
          user_id: "temp", // Placeholder, will be replaced by actual user_id from DB
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as FoodItem
        return old ? [tempItem, ...old] : [tempItem]
      })

      return { previousItems }
    },
    onError: (error, _newItem, context) => {
      console.error("Error adding food item:", error)
      // Rollback to the previous cached value
      const typedContext = context as FoodItemsContext | undefined
      if (typedContext?.previousItems) {
        queryClient.setQueryData(FOOD_ITEMS_QUERY_KEY, typedContext.previousItems)
      }
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: FOOD_ITEMS_QUERY_KEY })
    },
  })

  // Mutation for updating a food item
  const updateItemMutation = useMutation<FoodItem, Error, { id: string; updates: FoodItemUpdate }>({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("food_items")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: FOOD_ITEMS_QUERY_KEY })
      const previousItems = queryClient.getQueryData<FoodItem[]>(FOOD_ITEMS_QUERY_KEY)

      queryClient.setQueryData<FoodItem[]>(FOOD_ITEMS_QUERY_KEY, (old) =>
        old ? old.map((item) => (item.id === id ? { ...item, ...updates } : item)) : [],
      )

      return { previousItems }
    },
    onError: (error, _variables, context) => {
      console.error("Error updating food item:", error)
      const typedContext = context as FoodItemsContext | undefined
      if (typedContext?.previousItems) {
        queryClient.setQueryData(FOOD_ITEMS_QUERY_KEY, typedContext.previousItems)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FOOD_ITEMS_QUERY_KEY })
    },
  })

  // Mutation for deleting a food item
  const deleteItemMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("food_items").delete().eq("id", id)
      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: FOOD_ITEMS_QUERY_KEY })
      const previousItems = queryClient.getQueryData<FoodItem[]>(FOOD_ITEMS_QUERY_KEY)

      queryClient.setQueryData<FoodItem[]>(FOOD_ITEMS_QUERY_KEY, (old) =>
        old ? old.filter((item) => item.id !== id) : [],
      )

      return { previousItems }
    },
    onError: (error, _id, context) => {
      console.error("Error deleting food item:", error)
      const typedContext = context as FoodItemsContext | undefined
      if (typedContext?.previousItems) {
        queryClient.setQueryData(FOOD_ITEMS_QUERY_KEY, typedContext.previousItems)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FOOD_ITEMS_QUERY_KEY })
    },
  })

  return {
    items: stableItems, // Use memoized array to prevent unnecessary re-renders
    isLoading,
    isError,
    error,
    addItem: addItemMutation.mutateAsync,
    updateItem: updateItemMutation.mutateAsync,
    deleteItem: deleteItemMutation.mutateAsync,
    refetch,
  }
}
