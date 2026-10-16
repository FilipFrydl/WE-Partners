export type ContactZone = 'ok' | 'yellow' | 'red'

export interface ContactAge {
  days: number
  zone: ContactZone
  label: string
}

export const YELLOW_FROM_DAYS = 7
export const RED_FROM_DAYS = 14

function parseLocal(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Whole calendar days from a YYYY-MM-DD date to `now` (never negative). */
export function daysSince(lastContactAt: string, now: Date = new Date()): number {
  const from = parseLocal(lastContactAt)
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // Math.round absorbs the 23/25-hour days around DST changes.
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / 86_400_000))
}

export function zoneForDays(days: number): ContactZone {
  if (days >= RED_FROM_DAYS) return 'red'
  if (days >= YELLOW_FROM_DAYS) return 'yellow'
  return 'ok'
}

export function relativeLabel(days: number): string {
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

/** Single source of truth for the contact-age rule. */
export function getContactAge(lastContactAt: string, now: Date = new Date()): ContactAge {
  const days = daysSince(lastContactAt, now)
  return { days, zone: zoneForDays(days), label: relativeLabel(days) }
}
