import { COSMETICS_QUERY_KEY } from '@/lib/cosmetic-constants';
import {
  calculateCosmeticDisposeDate,
  deriveCosmeticStatus,
  enrichCosmetic,
} from '@/lib/cosmetic-utils';
import { supabase } from '@/lib/supabase';
import type {
  Cosmetic,
  CosmeticInsert,
  CosmeticRow,
  CosmeticUpdate,
  MutationContext,
} from '@/types/cosmetics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
export function useCosmetics() {
  const queryClient = useQueryClient();

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
        .from('cosmetics')
        .select(
          `*,
           category:category_id (id, name, display_name),
           reminders:cosmetic_reminders (id, remind_at, status, snoozed_until, metadata, created_at, updated_at, cosmetic_id, user_id)
          `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((row) =>
        enrichCosmetic(
          row,
          row.category ?? null,
          // Supabase returns null instead of empty array sometimes when no relation rows exist
          Array.isArray(row.reminders) ? row.reminders : []
        )
      );
    },
  });

  const stableCosmetics = useMemo(() => cosmetics || [], [cosmetics]);

  const addCosmeticMutation = useMutation<
    CosmeticRow,
    Error,
    Omit<CosmeticInsert, 'user_id'>,
    MutationContext
  >({
    mutationFn: async (payload) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const disposalDate = calculateCosmeticDisposeDate(
        payload.opened_at ?? null,
        payload.pao_months ?? null,
        payload.expiry_date ?? null
      );
      const status = deriveCosmeticStatus(
        disposalDate,
        payload.expiry_date ?? null,
        payload.status
      );

      const { data, error } = await supabase
        .from('cosmetics')
        .insert({
          ...payload,
          dispose_at: disposalDate ?? payload.dispose_at ?? null,
          status,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newCosmetic) => {
      await queryClient.cancelQueries({ queryKey: COSMETICS_QUERY_KEY });
      const previousItems =
        queryClient.getQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY);

      if (previousItems) {
        const optimistic = enrichCosmetic(
          {
            ...newCosmetic,
            id: `temp-${Date.now()}`,
            user_id: 'temp-user',
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
            status: 'active',
            notes: newCosmetic.notes ?? null,
            image_url: newCosmetic.image_url ?? null,
            last_usage_at: null,
          },
          null
        );

        queryClient.setQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY, [
          optimistic,
          ...previousItems,
        ]);
      }
      return { previousItems } satisfies MutationContext;
    },
    onError: (mutationError, _newCosmetic, context) => {
      console.error('Error adding cosmetic:', mutationError);
      if (context?.previousItems) {
        queryClient.setQueryData(COSMETICS_QUERY_KEY, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETICS_QUERY_KEY });
    },
  });

  const updateCosmeticMutation = useMutation<
    CosmeticRow,
    Error,
    { id: string; updates: CosmeticUpdate },
    MutationContext
  >({
    mutationFn: async ({ id, updates }) => {
      const disposalDate = calculateCosmeticDisposeDate(
        updates.opened_at ?? null,
        updates.pao_months ?? null,
        updates.expiry_date ?? null
      );
      const status = deriveCosmeticStatus(
        disposalDate ?? updates.dispose_at ?? null,
        updates.expiry_date ?? null,
        updates.status
      );

      const { data, error } = await supabase
        .from('cosmetics')
        .update({
          ...updates,
          dispose_at: disposalDate ?? updates.dispose_at ?? null,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: COSMETICS_QUERY_KEY });
      const previousItems =
        queryClient.getQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY);

      if (previousItems) {
        const updatedItems = previousItems.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                dispose_at:
                  calculateCosmeticDisposeDate(
                    updates.opened_at ?? item.opened_at,
                    updates.pao_months ?? item.pao_months,
                    updates.expiry_date ?? item.expiry_date
                  ) ??
                  updates.dispose_at ??
                  item.dispose_at,
                status: deriveCosmeticStatus(
                  calculateCosmeticDisposeDate(
                    updates.opened_at ?? item.opened_at,
                    updates.pao_months ?? item.pao_months,
                    updates.expiry_date ?? item.expiry_date
                  ) ??
                    updates.dispose_at ??
                    item.dispose_at,
                  updates.expiry_date ?? item.expiry_date,
                  updates.status ?? item.status
                ),
                updated_at: new Date().toISOString(),
              }
            : item
        );

        queryClient.setQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY, updatedItems);
      }

      return { previousItems } satisfies MutationContext;
    },
    onError: (mutationError, _variables, context) => {
      console.error('Error updating cosmetic:', mutationError);
      if (context?.previousItems) {
        queryClient.setQueryData(COSMETICS_QUERY_KEY, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETICS_QUERY_KEY });
    },
  });

  const deleteCosmeticMutation = useMutation<
    void,
    Error,
    string,
    MutationContext
  >({
    mutationFn: async (id) => {
      const { error } = await supabase.from('cosmetics').delete().eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: COSMETICS_QUERY_KEY });
      const previousItems =
        queryClient.getQueryData<Cosmetic[]>(COSMETICS_QUERY_KEY);

      if (previousItems) {
        queryClient.setQueryData<Cosmetic[]>(
          COSMETICS_QUERY_KEY,
          previousItems.filter((item) => item.id !== id)
        );
      }

      return { previousItems } satisfies MutationContext;
    },
    onError: (mutationError, _id, context) => {
      console.error('Error deleting cosmetic:', mutationError);
      if (context?.previousItems) {
        queryClient.setQueryData(COSMETICS_QUERY_KEY, context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COSMETICS_QUERY_KEY });
    },
  });

  return {
    items: stableCosmetics,
    isLoading,
    isError,
    error,
    refetch,
    addItem: addCosmeticMutation.mutateAsync,
    updateItem: updateCosmeticMutation.mutateAsync,
    deleteItem: deleteCosmeticMutation.mutateAsync,
  };
}

export {
  calculateCosmeticDisposeDate,
  deriveCosmeticStatus,
} from '@/lib/cosmetic-utils';
export type { Cosmetic } from '@/types/cosmetics';
