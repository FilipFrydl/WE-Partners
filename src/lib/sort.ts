import type { Partner } from '../data/partners'

/** Longest without contact first (oldest date first), name as tie-breaker. */
export const byOldestContact = (a: Partner, b: Partner) =>
  a.lastContactAt.localeCompare(b.lastContactAt) || a.name.localeCompare(b.name)
