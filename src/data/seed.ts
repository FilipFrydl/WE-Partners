import { db } from './db'
import type { Partner } from './db'
import { daysAgoString } from '../lib/dates'

const FLAG = 'partners-seeded-v1'

const SAMPLES: Array<[string, Partner['status'], number, string]> = [
  ['Northwind Logistics', 'In communication', 2, 'Quarterly review booked for next month.'],
  ['Bluebird Studio', 'In communication', 5, 'Waiting for their revised pricing proposal.\nCall on Thursday.'],
  ['Acme Components', 'Never responded', 9, 'Sent the proposal twice, no reply yet.'],
  ['Harbor & Co.', 'On hold', 16, 'Paused until their reorganisation is complete.'],
  ['Summit Consulting', 'No contact', 30, 'Former partner. Reach out about referrals.'],
]

/** Seeds sample partners once, on the very first launch. */
export async function seedIfFirstLaunch(): Promise<void> {
  try {
    if (localStorage.getItem(FLAG)) return
    localStorage.setItem(FLAG, '1')
  } catch {
    return
  }
  if ((await db.partners.count()) > 0) return
  const now = new Date().toISOString()
  await db.partners.bulkAdd(
    SAMPLES.map(([name, status, days, comment]) => ({
      id: crypto.randomUUID(),
      name,
      status,
      lastContactAt: daysAgoString(days),
      comment,
      sample: true,
      createdAt: now,
      updatedAt: now,
    })),
  )
}
