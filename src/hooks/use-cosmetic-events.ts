import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase, type Database } from "@/lib/supabase"

const COSMETIC_EVENTS_QUERY_KEY = (cosmeticId: string | null | undefined) => [
  "cosmetic_events",
  cosmeticId ?? "unknown",
]

type CosmeticEventRow = Database["public"]["Tables"]["cosmetic_events"]["Row"]
type CosmeticEventInsert = Database["public"]["Tables"]["cosmetic_events"]["Insert"]

type MutationContext = {
  previousEvents?: CosmeticEventRow[]
}

type UseCosmeticEventsOptions = {
  enabled?: boolean
}

export function useCosmeticEvents(
  cosmeticId: string | null | undefined,
  options?: UseCosmeticEventsOptions,
) {
  const queryClient = useQueryClient()
  const cacheKey = COSMETIC_EVENTS_QUERY_KEY(cosmeticId)

  const {
    data: events,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CosmeticEventRow[], Error>({
    queryKey: cacheKey,
    enabled: Boolean(cosmeticId) && (options?.enabled ?? true),
    queryFn: async () => {
      if (!cosmeticId) return []
      const { data, error } = await supabase
        .from("cosmetic_events")
        .select("*")
        .eq("cosmetic_id", cosmeticId)
        .order("occurred_at", { ascending: false })

      if (error) throw error
      return data || []
    },
  })

  const stableEvents = useMemo(() => events || [], [events])

  const addEventMutation = useMutation<CosmeticEventRow, Error, Omit<CosmeticEventInsert, "user_id">, MutationContext>({
    mutationFn: async (event) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("cosmetic_events")
        .insert({
          ...event,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (event) => {
      await queryClient.cancelQueries({ queryKey: cacheKey })
      const previousEvents = queryClient.getQueryData<CosmeticEventRow[]>(cacheKey)

      if (previousEvents) {
        const optimistic: CosmeticEventRow = {
          id: `temp-${Date.now()}`,
          cosmetic_id: event.cosmetic_id,
          user_id: "temp-user",
          event_type: event.event_type,
          payload: event.payload ?? {},
          occurred_at: event.occurred_at ?? new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
        queryClient.setQueryData<CosmeticEventRow[]>(cacheKey, [optimistic, ...previousEvents])
      }

      return { previousEvents }
    },
    onError: (mutationError, _variables, context) => {
      console.error("Error adding cosmetic event:", mutationError)
      if (context?.previousEvents) {
        queryClient.setQueryData(cacheKey, context.previousEvents)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey })
    },
  })

  const deleteEventMutation = useMutation<void, Error, string, MutationContext>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("cosmetic_events").delete().eq("id", id)
      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cacheKey })
      const previousEvents = queryClient.getQueryData<CosmeticEventRow[]>(cacheKey)

      if (previousEvents) {
        queryClient.setQueryData<CosmeticEventRow[]>(
          cacheKey,
          previousEvents.filter((event) => event.id !== id),
        )
      }

      return { previousEvents }
    },
    onError: (mutationError, _id, context) => {
      console.error("Error deleting cosmetic event:", mutationError)
      if (context?.previousEvents) {
        queryClient.setQueryData(cacheKey, context.previousEvents)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey })
    },
  })

  return {
    events: stableEvents,
    isLoading,
    isError,
    error,
    refetch,
    addEvent: addEventMutation.mutateAsync,
    deleteEvent: deleteEventMutation.mutateAsync,
  }
}
