import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase, type Database } from "@/lib/supabase"
import type { CosmeticsContext } from "@/types/query-context"

const COSMETICS_QUERY_KEY = ["cosmetics"] as const

const DATE_FORMAT_OPTIONS = { timeZone: "UTC" } satisfies Intl.DateTimeFormatOptions

type CosmeticRow = Database["public"]["Tables"]["cosmetics"]["Row"]
type CosmeticInsert = Database["public"]["Tables"]["cosmetics"]["Insert"]
type CosmeticUpdate = Database["public"]["Tables"]["cosmetics"]["Update"]
type CosmeticReminder = Database["public"]["Tables"]["cosmetic_reminders"]["Row"]
type CosmeticCategory = Database["public"]["Tables"]["categories"]["Row"]

export type Cosmetic = CosmeticRow & {
  category?: Pick<CosmeticCategory, "id" | "name" | "display_name"> | null
  reminders?: CosmeticReminder[]
}

type MutationContext = CosmeticsContext

function normalizeDateString(date: string | null | undefined) {
  if (!date) return null
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString().slice(0, 10)
}

function addMonths(date: Date, months: number) {
  const result = new Date(date)
  const currentMonth = result.getUTCMonth()
  result.setUTCMonth(currentMonth + months)
  return result
}

export function calculateCosmeticDisposeDate(openedAt: string | null, paoMonths: number | null, expiryDate: string | null) {
  const normalizedOpenedAt = normalizeDateString(openedAt)
  const normalizedExpiry = normalizeDateString(expiryDate)

  let paoDate: string | null = null
  if (normalizedOpenedAt && paoMonths && paoMonths > 0) {
    const base = new Date(`${normalizedOpenedAt}T00:00:00.000Z`)
    const disposalDate = addMonths(base, paoMonths)
    paoDate = disposalDate.toISOString().slice(0, 10)
  }

  if (normalizedExpiry && paoDate) {
    return new Date(`${paoDate}T00:00:00.000Z`) < new Date(`${normalizedExpiry}T00:00:00.000Z`)
      ? paoDate
      : normalizedExpiry
  }

  return paoDate ?? normalizedExpiry
}

export function deriveCosmeticStatus(
  disposeAt: string | null,
  expiryDate: string | null,
  currentStatus?: CosmeticRow["status"],
) {
  if (currentStatus && ["discarded", "archived"].includes(currentStatus)) {
    return currentStatus
  }

  const normalizedDisposeAt = normalizeDateString(disposeAt)
  const normalizedExpiry = normalizeDateString(expiryDate)
  const targetDate = normalizedDisposeAt && normalizedExpiry
    ? (new Date(`${normalizedDisposeAt}T00:00:00.000Z`) < new Date(`${normalizedExpiry}T00:00:00.000Z`)
        ? normalizedDisposeAt
        : normalizedExpiry)
    : normalizedDisposeAt ?? normalizedExpiry

  if (!targetDate) return "active"

  const today = new Date()
  const comparison = new Date(`${targetDate}T00:00:00.000Z`)
  const diffInMs = comparison.getTime() - today.setHours(0, 0, 0, 0)
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays < 0) return "expired"
  if (diffInDays <= 14) return "warning"
  return "active"
}

function enrichCosmetic(row: CosmeticRow, category: Cosmetic["category"], reminders?: CosmeticReminder[]): Cosmetic {
  const dispose_at = calculateCosmeticDisposeDate(row.opened_at, row.pao_months, row.expiry_date) ?? row.dispose_at ?? null
  const status = deriveCosmeticStatus(dispose_at, row.expiry_date, row.status)

  return {
    ...row,
    dispose_at,
    status,
    category,
    reminders: reminders || [],
  }
}

export function useCosmetics() {
  const queryClient = useQueryClient()

  const {
    data: cosmetics,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Cosmetic[], Error>({
    queryKey: COSMETICS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cosmetics")
        .select(
          `*,
           category:category_id (id, name, display_name),
           reminders:cosmetic_reminders (id, remind_at, status, snoozed_until, metadata, created_at, updated_at, cosmetic_id, user_id)
          `,
        )
        .order("created_at", { ascending: false })

      if (error) throw error

      return (data || []).map((row) =>
        enrichCosmetic(
          row,
          row.category ?? null,
          // Supabase returns null instead of empty array sometimes when no relation rows exist
          Array.isArray(row.reminders) ? row.reminders : [],
        ),
      )
    },
  })

  const stableCosmetics = useMemo(() => cosmetics || [], [cosmetics])

  const addCosmeticMutation = useMutation<CosmeticRow, Error, Omit<CosmeticInsert, "user_id">, MutationContext>({
    mutationFn: async (payload) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const disposalDate = calculateCosmeticDisposeDate(payload.opened_at ?? null, payload.pao_months ?? null, payload.expiry_date ?? null)
      const status = deriveCosmeticStatus(disposalDate, payload.expiry_date ?? null, payload.status)

      const { data, error } = await supabase
        .from("cosmetics")
        .insert({
          ...payload,
          dispose_at: disposalDate ?? payload.dispose_at ?? null,
          status,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async (newCosmetic) => {
      await queryClient.cancelQueries({ queryKey: COSMETICS_QUERY_KEY })
      const previousItems = queryClient.getQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY)

      if (previousItems) {
        const optimistic = enrichCosmetic(
          {
            ...newCosmetic,
            id: `temp-${Date.now()}`,
            user_id: "temp-user",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            brand: newCosmetic.brand ?? null,
            category_id: newCosmetic.category_id ?? null,
            size: newCosmetic.size ?? null,
            unit: newCosmetic.unit ?? null,
            batch_code: newCosmetic.batch_code ?? null,
            purchase_date: newCosmetic.purchase_date ?? null,
            opened_at: newCosmetic.opened_at ?? null,
            expiry_date: newCosmetic.expiry_date ?? null,
            pao_months: newCosmetic.pao_months ?? null,
            dispose_at: newCosmetic.dispose_at ?? null,
            status: "active",
            notes: newCosmetic.notes ?? null,
            image_url: newCosmetic.image_url ?? null,
            last_usage_at: null,
          },
          null,
        )

        queryClient.setQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY, [optimistic, ...previousItems])
      }

      return { previousItems } satisfies MutationContext
    },
    onError: (mutationError, _newCosmetic, context) => {
      console.error("Error adding cosmetic:", mutationError)
      if (context?.previousItems) {
        queryClient.setQueryData(COSMETICS_QUERY_KEY, context.previousItems)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETICS_QUERY_KEY })
    },
  })

  const updateCosmeticMutation = useMutation<CosmeticRow, Error, { id: string; updates: CosmeticUpdate }, MutationContext>({
    mutationFn: async ({ id, updates }) => {
      const disposalDate = calculateCosmeticDisposeDate(updates.opened_at ?? null, updates.pao_months ?? null, updates.expiry_date ?? null)
      const status = deriveCosmeticStatus(
        disposalDate ?? updates.dispose_at ?? null,
        updates.expiry_date ?? null,
        updates.status,
      )

      const { data, error } = await supabase
        .from("cosmetics")
        .update({
          ...updates,
          dispose_at: disposalDate ?? updates.dispose_at ?? null,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: COSMETICS_QUERY_KEY })
      const previousItems = queryClient.getQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY)

      if (previousItems) {
        const updatedItems = previousItems.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                dispose_at:
                  calculateCosmeticDisposeDate(updates.opened_at ?? item.opened_at, updates.pao_months ?? item.pao_months, updates.expiry_date ?? item.expiry_date) ??
                  updates.dispose_at ??
                  item.dispose_at,
                status: deriveCosmeticStatus(
                  calculateCosmeticDisposeDate(updates.opened_at ?? item.opened_at, updates.pao_months ?? item.pao_months, updates.expiry_date ?? item.expiry_date) ??
                    updates.dispose_at ??
                    item.dispose_at,
                  updates.expiry_date ?? item.expiry_date,
                  updates.status ?? item.status,
                ),
                updated_at: new Date().toISOString(),
              }
            : item,
        )

        queryClient.setQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY, updatedItems)
      }

      return { previousItems } satisfies MutationContext
    },
    onError: (mutationError, _variables, context) => {
      console.error("Error updating cosmetic:", mutationError)
      if (context?.previousItems) {
        queryClient.setQueryData(COSMETICS_QUERY_KEY, context.previousItems)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETICS_QUERY_KEY })
    },
  })

  const deleteCosmeticMutation = useMutation<void, Error, string, MutationContext>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("cosmetics").delete().eq("id", id)
      if (error) throw error
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: COSMETICS_QUERY_KEY })
      const previousItems = queryClient.getQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY)

      if (previousItems) {
        queryClient.setQueryData<Cosmetic[]>(
          COSMETICS_QUERY_KEY,
          previousItems.filter((item) => item.id !== id),
        )
      }

      return { previousItems } satisfies MutationContext
    },
    onError: (mutationError, _id, context) => {
      console.error("Error deleting cosmetic:", mutationError)
      if (context?.previousItems) {
        queryClient.setQueryData(COSMETICS_QUERY_KEY, context.previousItems)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETICS_QUERY_KEY })
    },
  })

  return {
    items: stableCosmetics,
    isLoading,
    isError,
    error,
    refetch,
    addItem: addCosmeticMutation.mutateAsync,
    updateItem: updateCosmeticMutation.mutateAsync,
    deleteItem: deleteCosmeticMutation.mutateAsync,
  }
}

export function formatCosmeticDate(value: string | null | undefined, locale = "vi-VN") {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return new Intl.DateTimeFormat(locale, DATE_FORMAT_OPTIONS).format(parsed)
}
