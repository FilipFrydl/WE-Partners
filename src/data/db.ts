import Dexie, { type Table } from 'dexie'

export const STATUSES = ['In communication', 'Never responded', 'On hold', 'No contact', 'Finished', 'In EWO'] as const
export type PartnerStatus = (typeof STATUSES)[number]

export interface Partner {
  id: string
  name: string
  status: PartnerStatus
  /** YYYY-MM-DD */
  lastContactAt: string
  comment: string
  /** true for demo data created on first launch */
  sample?: boolean
  createdAt: string
  updatedAt: string
}

class PartnersDB extends Dexie {
  partners!: Table<Partner, string>
  constructor() {
    super('partners-app')
    this.version(1).stores({ partners: 'id, name, status, lastContactAt' })
    this.version(2)
      .stores({ partners: 'id, name, status, lastContactAt' })
      .upgrade((tx) =>
        tx.table('partners').toCollection().modify((p: Partner) => {
          if (!STATUSES.includes(p.status)) p.status = 'In communication'
        }),
      )
  }
}

export const db = new PartnersDB()
