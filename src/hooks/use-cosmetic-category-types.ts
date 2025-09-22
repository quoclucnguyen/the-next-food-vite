import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

export type CosmeticCategoryTypeRow =
  Database['public']['Tables']['cosmetic_category_types']['Row']
type CosmeticCategoryTypeInsert = Database['public']['Tables']['cosmetic_category_types']['Insert']
type CosmeticCategoryTypeUpdate = Database['public']['Tables']['cosmetic_category_types']['Update']

type MutationContext = {
  previousTypes?: CosmeticCategoryTypeRow[]
}

const COSMETIC_CATEGORY_TYPES_QUERY_KEY = ['cosmetic-category-types'] as const

export function useCosmeticCategoryTypes() {
  const queryClient = useQueryClient()

  const {
    data: categoryTypes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CosmeticCategoryTypeRow[], Error>({
    queryKey: COSMETIC_CATEGORY_TYPES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cosmetic_category_types')
        .select('*')
        .order('rank', { ascending: true, nullsFirst: false })
        .order('display_name', { ascending: true })
      if (error) throw error
      return data || []
    },
  })

  const addTypeMutation = useMutation<
    CosmeticCategoryTypeRow,
    Error,
    Omit<CosmeticCategoryTypeInsert, 'user_id'>,
    MutationContext
  >({
    mutationFn: async (payload) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw new Error(`Authentication error: ${authError.message}`)
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('cosmetic_category_types')
        .insert({ ...payload, user_id: user.id })
        .select('*')
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Loại mỹ phẩm này đã tồn tại')
        }
        throw new Error(`Không thể thêm loại mỹ phẩm: ${error.message}`)
      }

      return data
    },
    onMutate: async (newType) => {
      await queryClient.cancelQueries({ queryKey: COSMETIC_CATEGORY_TYPES_QUERY_KEY })

      const previousTypes = queryClient.getQueryData<CosmeticCategoryTypeRow[]>(
        COSMETIC_CATEGORY_TYPES_QUERY_KEY,
      )

      if (previousTypes) {
        const optimistic: CosmeticCategoryTypeRow = {
          id: `temp-${Date.now()}`,
          user_id: 'temp-user-id',
          name: newType.name,
          display_name: newType.display_name,
          description: newType.description ?? null,
          rank: newType.rank ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        queryClient.setQueryData<CosmeticCategoryTypeRow[]>(COSMETIC_CATEGORY_TYPES_QUERY_KEY, [
          optimistic,
          ...previousTypes,
        ])
      }

      return { previousTypes }
    },
    onError: (mutationError, _variables, context) => {
      console.error('Failed to add cosmetic category type', mutationError)
      if (context?.previousTypes) {
        queryClient.setQueryData(COSMETIC_CATEGORY_TYPES_QUERY_KEY, context.previousTypes)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETIC_CATEGORY_TYPES_QUERY_KEY })
    },
  })

  const updateTypeMutation = useMutation<
    CosmeticCategoryTypeRow,
    Error,
    { id: string; updates: CosmeticCategoryTypeUpdate },
    MutationContext
  >({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('cosmetic_category_types')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Loại mỹ phẩm này đã tồn tại')
        }
        throw new Error(`Không thể cập nhật loại mỹ phẩm: ${error.message}`)
      }

      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: COSMETIC_CATEGORY_TYPES_QUERY_KEY })

      const previousTypes = queryClient.getQueryData<CosmeticCategoryTypeRow[]>(
        COSMETIC_CATEGORY_TYPES_QUERY_KEY,
      )

      if (previousTypes) {
        const updated = previousTypes.map((item) =>
          item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item,
        )
        queryClient.setQueryData<CosmeticCategoryTypeRow[]>(COSMETIC_CATEGORY_TYPES_QUERY_KEY, updated)
      }

      return { previousTypes }
    },
    onError: (mutationError, _vars, context) => {
      console.error('Failed to update cosmetic category type', mutationError)
      if (context?.previousTypes) {
        queryClient.setQueryData(COSMETIC_CATEGORY_TYPES_QUERY_KEY, context.previousTypes)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETIC_CATEGORY_TYPES_QUERY_KEY })
    },
  })

  const deleteTypeMutation = useMutation<void, Error, string, MutationContext>({
    mutationFn: async (id) => {
      const { error } = await supabase.from('cosmetic_category_types').delete().eq('id', id)
      if (error) {
        throw new Error(`Không thể xóa loại mỹ phẩm: ${error.message}`)
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: COSMETIC_CATEGORY_TYPES_QUERY_KEY })

      const previousTypes = queryClient.getQueryData<CosmeticCategoryTypeRow[]>(
        COSMETIC_CATEGORY_TYPES_QUERY_KEY,
      )

      if (previousTypes) {
        queryClient.setQueryData<CosmeticCategoryTypeRow[]>(
          COSMETIC_CATEGORY_TYPES_QUERY_KEY,
          previousTypes.filter((item) => item.id !== id),
        )
      }

      return { previousTypes }
    },
    onError: (mutationError, _id, context) => {
      console.error('Failed to delete cosmetic category type', mutationError)
      if (context?.previousTypes) {
        queryClient.setQueryData(COSMETIC_CATEGORY_TYPES_QUERY_KEY, context.previousTypes)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETIC_CATEGORY_TYPES_QUERY_KEY })
    },
  })

  return {
    categoryTypes: categoryTypes || [],
    isLoading,
    isError,
    error,
    addCategoryType: addTypeMutation.mutateAsync,
    updateCategoryType: updateTypeMutation.mutateAsync,
    deleteCategoryType: deleteTypeMutation.mutateAsync,
    refetch,
  }
}
