const pad = (n: number) => String(n).padStart(2, '0')

/** Local date as YYYY-MM-DD (date only, no time zone shifts). */
export function toDateString(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function today(): string {
  return toDateString()
}

export function daysAgoString(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return toDateString(d)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "7 Oct", or "7 Oct 2025" when not in the current year. */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  const base = `${d} ${MONTHS[m - 1]}`
  return y === new Date().getFullYear() ? base : `${base} ${y}`
}

export function formatLongToday(): string {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
