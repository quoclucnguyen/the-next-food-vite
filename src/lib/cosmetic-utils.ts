import type {
  Cosmetic,
  CosmeticReminder,
  CosmeticRow,
} from '@/types/cosmetics';

export function normalizeDateString(date: string | null | undefined) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function addMonths(date: Date, months: number) {
  const result = new Date(date);
  const currentMonth = result.getUTCMonth();
  result.setUTCMonth(currentMonth + months);
  return result;
}

export function calculateCosmeticDisposeDate(
  openedAt: string | null,
  paoMonths: number | null,
  expiryDate: string | null
) {
  const normalizedOpenedAt = normalizeDateString(openedAt);
  const normalizedExpiry = normalizeDateString(expiryDate);

  let paoDate: string | null = null;
  if (normalizedOpenedAt && paoMonths && paoMonths > 0) {
    const base = new Date(`${normalizedOpenedAt}T00:00:00.000Z`);
    const disposalDate = addMonths(base, paoMonths);
    paoDate = disposalDate.toISOString().slice(0, 10);
  }

  if (normalizedExpiry && paoDate) {
    return new Date(`${paoDate}T00:00:00.000Z`) <
      new Date(`${normalizedExpiry}T00:00:00.000Z`)
      ? paoDate
      : normalizedExpiry;
  }

  return paoDate ?? normalizedExpiry;
}

export function deriveCosmeticStatus(
  disposeAt: string | null,
  expiryDate: string | null,
  currentStatus?: CosmeticRow['status']
): 'active' | 'warning' | 'expired' | 'discarded' | 'archived' {
  if (currentStatus === 'discarded' || currentStatus === 'archived') {
    return currentStatus;
  }

  const normalizedDisposeAt = normalizeDateString(disposeAt);
  const normalizedExpiry = normalizeDateString(expiryDate);
  const targetDate =
    normalizedDisposeAt && normalizedExpiry
      ? new Date(`${normalizedDisposeAt}T00:00:00.000Z`) <
        new Date(`${normalizedExpiry}T00:00:00.000Z`)
        ? normalizedDisposeAt
        : normalizedExpiry
      : normalizedDisposeAt ?? normalizedExpiry;

  if (!targetDate) return 'active';

  const today = new Date();
  const comparison = new Date(`${targetDate}T00:00:00.000Z`);
  const diffInMs = comparison.getTime() - today.setHours(0, 0, 0, 0);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return 'expired';
  if (diffInDays <= 14) return 'warning';
  return 'active';
}

export function enrichCosmetic(
  row: CosmeticRow,
  category: Cosmetic['category'],
  reminders?: CosmeticReminder[]
): Cosmetic {
  const dispose_at =
    calculateCosmeticDisposeDate(
      row.opened_at,
      row.pao_months,
      row.expiry_date
    ) ??
    row.dispose_at ??
    null;
  const status = deriveCosmeticStatus(dispose_at, row.expiry_date, row.status);

  return {
    ...row,
    dispose_at,
    status,
    category,
    reminders: reminders || [],
  };
}

export function formatCosmeticDate(
  value: string | null | undefined,
  locale = 'vi-VN'
) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(parsed);
}
