// Cosmetic-related type definitions

import type { Database } from '@/lib/supabase';
import type { CosmeticsContext } from '@/types/query-context';

export type CosmeticRow = Database['public']['Tables']['cosmetics']['Row'];
export type CosmeticInsert =
  Database['public']['Tables']['cosmetics']['Insert'];
export type CosmeticUpdate =
  Database['public']['Tables']['cosmetics']['Update'];
export type CosmeticReminder =
  Database['public']['Tables']['cosmetic_reminders']['Row'];
export type CosmeticCategory =
  Database['public']['Tables']['categories']['Row'];

export type Cosmetic = CosmeticRow & {
  category?: Pick<CosmeticCategory, 'id' | 'name' | 'display_name'> | null;
  reminders?: CosmeticReminder[];
};

export type MutationContext = CosmeticsContext;
