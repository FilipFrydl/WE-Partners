import { describe, expect, it } from 'vitest'
import { getContactAge } from './contactAge'

const NOW = new Date(2026, 5, 20, 15, 30) // 20 Jun 2026, afternoon

function ago(days: number) {
  const d = new Date(2026, 5, 20 - days)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

describe('getContactAge', () => {
  it.each([
    [0, 'ok'],
    [1, 'ok'],
    [6, 'ok'],
    [7, 'yellow'],
    [9, 'yellow'],
    [13, 'yellow'],
    [14, 'red'],
    [60, 'red'],
  ])('%i days -> %s', (days, zone) => {
    const r = getContactAge(ago(days), NOW)
    expect(r.days).toBe(days)
    expect(r.zone).toBe(zone)
  })

  it('builds relative labels', () => {
    expect(getContactAge(ago(0), NOW).label).toBe('Today')
    expect(getContactAge(ago(1), NOW).label).toBe('1 day ago')
    expect(getContactAge(ago(9), NOW).label).toBe('9 days ago')
  })

  it('ignores time of day and treats future dates as today', () => {
    expect(getContactAge(ago(7), new Date(2026, 5, 20, 0, 1)).zone).toBe('yellow')
    expect(getContactAge(ago(7), new Date(2026, 5, 20, 23, 59)).zone).toBe('yellow')
    expect(getContactAge('2026-06-25', NOW).days).toBe(0)
  })

  it('is stable across a DST change', () => {
    // Europe/US DST dates differ; use a range spanning both March and October.
    const r = getContactAge('2026-03-01', new Date(2026, 3, 1))
    expect(r.days).toBe(31)
  })
})
