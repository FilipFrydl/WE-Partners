// The only module the UI uses to read/write partner data.
// To add server sync later, swap the implementations here.
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Partner } from './db'
import { today } from '../lib/dates'

export type { Partner, PartnerStatus } from './db'
export { STATUSES } from './db'

export type PartnerInput = Pick<Partner, 'name' | 'status' | 'lastContactAt' | 'comment'>

export const listPartners = (): Promise<Partner[]> => db.partners.toArray()

export const getPartner = (id: string): Promise<Partner | undefined> => db.partners.get(id)

export async function createPartner(input: Partial<PartnerInput> & { name: string }): Promise<Partner> {
  const now = new Date().toISOString()
  const partner: Partner = {
    id: crypto.randomUUID(),
    status: 'In communication',
    lastContactAt: today(),
    comment: '',
    ...input,
    createdAt: now,
    updatedAt: now,
  }
  await db.partners.add(partner)
  return partner
}

export async function updatePartner(id: string, changes: Partial<PartnerInput>): Promise<void> {
  await db.partners.update(id, { ...changes, updatedAt: new Date().toISOString() })
}

export const deletePartner = (id: string): Promise<void> => db.partners.delete(id)

export const markContactedToday = (id: string) => updatePartner(id, { lastContactAt: today() })

export const clearPartners = (): Promise<void> => db.partners.clear()

export const replaceAllPartners = (partners: Partner[]) =>
  db.transaction('rw', db.partners, async () => {
    await db.partners.clear()
    await db.partners.bulkAdd(partners)
  })

export const countPartners = (): Promise<number> => db.partners.count()

/** React hook: live list of partners (undefined while loading). */
export function usePartners(): Partner[] | undefined {
  return useLiveQuery(() => listPartners(), [])
}

export const deleteSamplePartners = (): Promise<number> =>
  db.partners.filter((p) => p.sample === true).delete()
