

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type CategoryRow = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']
type CosmeticCategoryType = Database['public']['Tables']['cosmetic_category_types']['Row']

export type CategoryWithType = CategoryRow & {
  cosmetic_category_type: CosmeticCategoryType | null
}

// Context types for optimistic updates
type MutationContext = {
  previousCategories?: CategoryWithType[]
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
  } = useQuery<CategoryWithType[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, cosmetic_category_type:cosmetic_category_type_id(*)')
        .order('display_name', { ascending: true })
      if (error) throw error
      return (data as CategoryWithType[]) || []
    },
  })

  // Mutation for adding a category
  const addCategoryMutation = useMutation<
    CategoryWithType,
    Error,
    Omit<CategoryInsert, 'user_id'>,
    MutationContext
  >({
    mutationFn: async (newCategory) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw new Error(`Authentication error: ${authError.message}`)
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from('categories')
        .insert({
          ...newCategory,
          user_id: user.id,
        })
        .select('*, cosmetic_category_type:cosmetic_category_type_id(*)')
        .single()

      if (error) {
        // Handle specific Supabase errors
        if (error.code === "23505") {
          throw new Error("A category with this name already exists")
        }
        throw new Error(`Failed to add category: ${error.message}`)
      }
      return data as CategoryWithType
    },
    onMutate: async (newCategory) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY })

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<CategoryWithType[]>(CATEGORIES_QUERY_KEY)

      // Optimistically update to the new value
      if (previousCategories) {
        // Create a more realistic optimistic category
        const optimisticCategory: CategoryWithType = {
          id: `temp-${Date.now()}`,
          user_id: 'temp-user-id',
          name: newCategory.name,
          display_name: newCategory.display_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          cosmetic_category_type_id: newCategory.cosmetic_category_type_id ?? null,
          cosmetic_category_type: null,
        }
        queryClient.setQueryData<CategoryWithType[]>(CATEGORIES_QUERY_KEY, [...previousCategories, optimisticCategory])
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
  const updateCategoryMutation = useMutation<
    CategoryWithType,
    Error,
    { id: string; updates: CategoryUpdate },
    MutationContext
  >({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select('*, cosmetic_category_type:cosmetic_category_type_id(*)')
        .single()

      if (error) {
        // Handle specific Supabase errors
        if (error.code === "23505") {
          throw new Error("A category with this name already exists")
        }
        throw new Error(`Failed to update category: ${error.message}`)
      }
      return data as CategoryWithType
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY })
      const previousCategories = queryClient.getQueryData<CategoryWithType[]>(CATEGORIES_QUERY_KEY)

      if (previousCategories) {
        const updatedCategories = previousCategories.map((category) =>
          category.id === id
            ? {
                ...category,
                ...updates,
                cosmetic_category_type:
                  'cosmetic_category_type_id' in updates
                    ? category.cosmetic_category_type?.id === updates.cosmetic_category_type_id
                      ? category.cosmetic_category_type
                      : null
                    : category.cosmetic_category_type,
              }
            : category,
        )
        queryClient.setQueryData<CategoryWithType[]>(CATEGORIES_QUERY_KEY, updatedCategories)
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
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) {
        throw new Error(`Failed to delete category: ${error.message}`)
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY })
      const previousCategories = queryClient.getQueryData<CategoryWithType[]>(CATEGORIES_QUERY_KEY)

      if (previousCategories) {
        const filteredCategories = previousCategories.filter((category) => category.id !== id)
        queryClient.setQueryData<CategoryWithType[]>(CATEGORIES_QUERY_KEY, filteredCategories)
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
