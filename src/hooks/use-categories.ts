

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type Category = Database["public"]["Tables"]["categories"]["Row"]
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"]
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"]

// Context types for optimistic updates
type MutationContext = {
  previousCategories?: Category[]
}

const CATEGORIES_QUERY_KEY = ["categories"] as const

export function useCategories() {
  const queryClient = useQueryClient()

  // Query for fetching categories
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_name", { ascending: true })
      if (error) throw error
      return data || []
    },
  })

  // Mutation for adding a category
  const addCategoryMutation = useMutation<Category, Error, Omit<CategoryInsert, "user_id">, MutationContext>({
    mutationFn: async (newCategory) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw new Error(`Authentication error: ${authError.message}`)
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("categories")
        .insert({
          ...newCategory,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        // Handle specific Supabase errors
        if (error.code === "23505") {
          throw new Error("A category with this name already exists")
        }
        throw new Error(`Failed to add category: ${error.message}`)
      }
      return data
    },
    onMutate: async (newCategory) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY })

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<Category[]>(CATEGORIES_QUERY_KEY)

      // Optimistically update to the new value
      if (previousCategories) {
        // Create a more realistic optimistic category
        const optimisticCategory: Category = {
          id: `temp-${Date.now()}`,
          user_id: "temp-user-id",
          name: newCategory.name,
          display_name: newCategory.display_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        queryClient.setQueryData<Category[]>(CATEGORIES_QUERY_KEY, [...previousCategories, optimisticCategory])
      }

      // Return a context object with the snapshotted value
      return { previousCategories }
    },
    onError: (err, _newCategory, context) => {
      console.error("Error adding category:", err)
      // Rollback to the previous cached value
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories)
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
    },
  })

  // Mutation for updating a category
  const updateCategoryMutation = useMutation<Category, Error, { id: string; updates: CategoryUpdate }, MutationContext>({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        // Handle specific Supabase errors
        if (error.code === "23505") {
          throw new Error("A category with this name already exists")
        }
        throw new Error(`Failed to update category: ${error.message}`)
      }
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY })
      const previousCategories = queryClient.getQueryData<Category[]>(CATEGORIES_QUERY_KEY)

      if (previousCategories) {
        const updatedCategories = previousCategories.map((category) =>
          category.id === id ? { ...category, ...updates } : category
        )
        queryClient.setQueryData<Category[]>(CATEGORIES_QUERY_KEY, updatedCategories)
      }

      return { previousCategories }
    },
    onError: (err, _variables, context) => {
      console.error("Error updating category:", err)
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
    },
  })

  // Mutation for deleting a category
  const deleteCategoryMutation = useMutation<void, Error, string, MutationContext>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) {
        throw new Error(`Failed to delete category: ${error.message}`)
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY })
      const previousCategories = queryClient.getQueryData<Category[]>(CATEGORIES_QUERY_KEY)

      if (previousCategories) {
        const filteredCategories = previousCategories.filter((category) => category.id !== id)
        queryClient.setQueryData<Category[]>(CATEGORIES_QUERY_KEY, filteredCategories)
      }

      return { previousCategories }
    },
    onError: (err, _id, context) => {
      console.error("Error deleting category:", err)
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
    },
  })

  return {
    categories: categories || [],
    isLoading,
    isError,
    error,
    addCategory: addCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    refetch,
  }
}
