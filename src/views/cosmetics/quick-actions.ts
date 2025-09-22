import type { Json } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { CalendarPlus, RefreshCw, Trash2, type LucideIcon } from 'lucide-react';
import type { CosmeticWithMutators } from './utils';

type EventType = 'opened' | 'usage' | 'discarded' | 'restocked' | 'note';

export type QuickAction = {
  label: string;
  icon: LucideIcon;
  handler: (cosmetic: CosmeticWithMutators) => Promise<void>;
  hidden?: (cosmetic: CosmeticWithMutators) => boolean;
  destructive?: boolean;
};

async function logCosmeticEvent(
  cosmeticId: string,
  eventType: EventType,
  payload: Record<string, unknown>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.from('cosmetic_events').insert({
    cosmetic_id: cosmeticId,
    event_type: eventType,
    payload: payload as unknown as Json,
    user_id: user.id,
  });

  if (error) throw error;
}

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Đánh dấu mở',
    icon: RefreshCw,
    handler: async (cosmetic) => {
      const today = new Date().toISOString().slice(0, 10);
      await cosmetic.update({ opened_at: today, status: 'active' });
      await logCosmeticEvent(cosmetic.id, 'opened', { opened_at: today });
    },
    hidden: (cosmetic) => Boolean(cosmetic.opened_at),
  },
  {
    label: 'Ghi sử dụng',
    icon: CalendarPlus,
    handler: async (cosmetic) => {
      const now = new Date().toISOString();
      await cosmetic.update({ last_usage_at: now });
      await logCosmeticEvent(cosmetic.id, 'usage', { used_at: now });
    },
  },
  {
    label: 'Bỏ đi',
    icon: Trash2,
    handler: async (cosmetic) => {
      const today = new Date().toISOString().slice(0, 10);
      await cosmetic.update({ status: 'discarded', dispose_at: today });
      await logCosmeticEvent(cosmetic.id, 'discarded', { discarded_at: today });
    },
    destructive: true,
  },
];
