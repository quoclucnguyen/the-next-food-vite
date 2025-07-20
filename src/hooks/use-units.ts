

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"
import type { UnitsContext } from "@/types/query-context"

type Unit = Database["public"]["Tables"]["units"]["Row"]
type UnitInsert = Database["public"]["Tables"]["units"]["Insert"]
type UnitUpdate = Database["public"]["Tables"]["units"]["Update"]

const UNITS_QUERY_KEY = ["units"]

export function useUnits() {
  const queryClient = useQueryClient()

  // Query for fetching units
  const {
    data: units,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Unit[], Error>({
    queryKey: UNITS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .order("display_name", { ascending: true })
      if (error) throw error
      return data || []
    },
  })

  // Mutation for adding a unit
  const addUnitMutation = useMutation<Unit, Error, Omit<UnitInsert, "user_id">>({
    mutationFn: async (newUnit) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("units")
        .insert({
          ...newUnit,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (newUnit) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: UNITS_QUERY_KEY })

      // Snapshot the previous value
      const previousUnits = queryClient.getQueryData<Unit[]>(UNITS_QUERY_KEY)

      // Optimistically update to the new value
      if (previousUnits) {
        const optimisticUnit: Unit = {
          id: `temp-${Date.now()}`,
          user_id: "temp",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...newUnit,
        }
        queryClient.setQueryData<Unit[]>(UNITS_QUERY_KEY, [...previousUnits, optimisticUnit])
      }

      // Return a context object with the snapshotted value
      return { previousUnits }
    },
    onError: (error, _newUnit, context) => {
      console.error("Error adding unit:", error)
      // Rollback to the previous cached value
      const typedContext = context as UnitsContext | undefined
      if (typedContext?.previousUnits) {
        queryClient.setQueryData(UNITS_QUERY_KEY, typedContext.previousUnits)
      }
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY })
    },
  })

  // Mutation for updating a unit
  const updateUnitMutation = useMutation<Unit, Error, { id: string; updates: UnitUpdate }>({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("units")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: UNITS_QUERY_KEY })
      const previousUnits = queryClient.getQueryData<Unit[]>(UNITS_QUERY_KEY)

      if (previousUnits) {
        const updatedUnits = previousUnits.map((unit) =>
          unit.id === id ? { ...unit, ...updates, updated_at: new Date().toISOString() } : unit
        )
        queryClient.setQueryData<Unit[]>(UNITS_QUERY_KEY, updatedUnits)
      }

      return { previousUnits }
    },
    onError: (error, _variables, context) => {
      console.error("Error updating unit:", error)
      const typedContext = context as UnitsContext | undefined
      if (typedContext?.previousUnits) {
        queryClient.setQueryData(UNITS_QUERY_KEY, typedContext.previousUnits)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY })
    },
  })

  // Mutation for deleting a unit
  const deleteUnitMutation = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("units").delete().eq("id", id)
      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: UNITS_QUERY_KEY })
      const previousUnits = queryClient.getQueryData<Unit[]>(UNITS_QUERY_KEY)

      if (previousUnits) {
        const filteredUnits = previousUnits.filter((unit) => unit.id !== id)
        queryClient.setQueryData<Unit[]>(UNITS_QUERY_KEY, filteredUnits)
      }

      return { previousUnits }
    },
    onError: (error, _id, context) => {
      console.error("Error deleting unit:", error)
      const typedContext = context as UnitsContext | undefined
      if (typedContext?.previousUnits) {
        queryClient.setQueryData(UNITS_QUERY_KEY, typedContext.previousUnits)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY })
    },
  })

  return {
    units: units || [],
    isLoading,
    isError,
    error,
    addUnit: addUnitMutation.mutateAsync,
    updateUnit: updateUnitMutation.mutateAsync,
    deleteUnit: deleteUnitMutation.mutateAsync,
    refetch,
  }
}
