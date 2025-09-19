import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase, type Database } from "@/lib/supabase"

const COSMETIC_REMINDERS_QUERY_KEY = (cosmeticId?: string | null) => [
  "cosmetic_reminders",
  cosmeticId ?? "all",
]

type ReminderRow = Database["public"]["Tables"]["cosmetic_reminders"]["Row"]
type ReminderInsert = Database["public"]["Tables"]["cosmetic_reminders"]["Insert"]
type ReminderUpdate = Database["public"]["Tables"]["cosmetic_reminders"]["Update"]

interface MutationContext {
  previousReminders?: ReminderRow[]
}

export function useCosmeticReminders(cosmeticId?: string | null) {
  const queryClient = useQueryClient()
  const cacheKey = COSMETIC_REMINDERS_QUERY_KEY(cosmeticId)

  const {
    data: reminders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ReminderRow[], Error>({
    queryKey: cacheKey,
    enabled: cosmeticId !== undefined,
    queryFn: async () => {
      const query = supabase.from("cosmetic_reminders").select("*")

      if (cosmeticId) {
        query.eq("cosmetic_id", cosmeticId)
      }

      const { data, error } = await query.order("remind_at", { ascending: true })
      if (error) throw error
      return data || []
    },
  })

  const stableReminders = useMemo(() => reminders || [], [reminders])

  const upsertReminderMutation = useMutation<ReminderRow, Error, Omit<ReminderInsert, "user_id">, MutationContext>({
    mutationFn: async (payload) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("cosmetic_reminders")
        .insert({
          ...payload,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: cacheKey })
      const previousReminders = queryClient.getQueryData<ReminderRow[]>(cacheKey)

      if (previousReminders) {
        const optimistic: ReminderRow = {
          id: `temp-${Date.now()}`,
          cosmetic_id: payload.cosmetic_id,
          user_id: "temp-user",
          remind_at: payload.remind_at,
          status: payload.status ?? "pending",
          snoozed_until: payload.snoozed_until ?? null,
          metadata: payload.metadata ?? {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        queryClient.setQueryData<ReminderRow[]>(cacheKey, [...previousReminders, optimistic])
      }

      return { previousReminders }
    },
    onError: (mutationError, _payload, context) => {
      console.error("Error creating cosmetic reminder:", mutationError)
      if (context?.previousReminders) {
        queryClient.setQueryData(cacheKey, context.previousReminders)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey })
    },
  })

  const updateReminderMutation = useMutation<ReminderRow, Error, { id: string; updates: ReminderUpdate }, MutationContext>({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("cosmetic_reminders")
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
      await queryClient.cancelQueries({ queryKey: cacheKey })
      const previousReminders = queryClient.getQueryData<ReminderRow[]>(cacheKey)

      if (previousReminders) {
        const updated = previousReminders.map((reminder) =>
          reminder.id === id
            ? {
                ...reminder,
                ...updates,
                updated_at: new Date().toISOString(),
              }
            : reminder,
        )
        queryClient.setQueryData<ReminderRow[]>(cacheKey, updated)
      }

      return { previousReminders }
    },
    onError: (mutationError, _variables, context) => {
      console.error("Error updating cosmetic reminder:", mutationError)
      if (context?.previousReminders) {
        queryClient.setQueryData(cacheKey, context.previousReminders)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey })
    },
  })

  const deleteReminderMutation = useMutation<void, Error, string, MutationContext>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("cosmetic_reminders").delete().eq("id", id)
      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cacheKey })
      const previousReminders = queryClient.getQueryData<ReminderRow[]>(cacheKey)

      if (previousReminders) {
        queryClient.setQueryData<ReminderRow[]>(
          cacheKey,
          previousReminders.filter((reminder) => reminder.id !== id),
        )
      }

      return { previousReminders }
    },
    onError: (mutationError, _id, context) => {
      console.error("Error deleting cosmetic reminder:", mutationError)
      if (context?.previousReminders) {
        queryClient.setQueryData(cacheKey, context.previousReminders)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey })
    },
  })

  return {
    reminders: stableReminders,
    isLoading,
    isError,
    error,
    refetch,
    createReminder: upsertReminderMutation.mutateAsync,
    updateReminder: updateReminderMutation.mutateAsync,
    deleteReminder: deleteReminderMutation.mutateAsync,
  }
}
