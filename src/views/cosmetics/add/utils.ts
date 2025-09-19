export function parseNumber(value: string) {
  if (!value) return null
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return null
  return parsed
}

export function computeReminderTimestamp(disposeAt: string | null, leadDays: number) {
  if (!disposeAt) return null
  const base = new Date(`${disposeAt}T00:00:00.000Z`)
  base.setUTCDate(base.getUTCDate() - leadDays)
  const now = new Date()
  if (base.getTime() < now.getTime()) {
    return now.toISOString()
  }
  return base.toISOString()
}
