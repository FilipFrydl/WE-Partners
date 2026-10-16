import { STATUSES, type Partner, type PartnerStatus } from './db'
import { listPartners, replaceAllPartners } from './partners'

interface BackupFile {
  app: 'partners'
  version: 1
  exportedAt: string
  partners: Partner[]
}

export async function exportBackup(): Promise<void> {
  const data: BackupFile = {
    app: 'partners',
    version: 1,
    exportedAt: new Date().toISOString(),
    partners: await listPartners(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `partners-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
  try {
    localStorage.setItem(LAST_EXPORT_KEY, new Date().toISOString())
  } catch {
    /* storage unavailable: the reminder just stays */
  }
}

const LAST_EXPORT_KEY = 'partners-last-export'

/** ISO timestamp of the last export on this device, or null. */
export function lastExportAt(): string | null {
  try {
    return localStorage.getItem(LAST_EXPORT_KEY)
  } catch {
    return null
  }
}

const isDate = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

/** Parses and validates a backup file; throws an Error with a readable message. */
export function parseBackup(text: string): Partner[] {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('This file is not valid JSON.')
  }
  const list = (raw as BackupFile | null)?.partners
  if (!Array.isArray(list)) throw new Error('This file is not a Partners backup.')
  const now = new Date().toISOString()
  return list.map((p, i) => {
    const status = STATUSES.includes(p?.status) ? (p.status as PartnerStatus) : undefined
    if (!p || typeof p.name !== 'string' || !p.name.trim() || !status || !isDate(p.lastContactAt)) {
      throw new Error(`Partner #${i + 1} in the backup is invalid.`)
    }
    return {
      id: typeof p.id === 'string' && p.id ? p.id : crypto.randomUUID(),
      name: p.name,
      status,
      lastContactAt: p.lastContactAt,
      comment: typeof p.comment === 'string' ? p.comment : '',
      sample: p.sample === true ? true : undefined,
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : now,
      updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : now,
    }
  })
}

export async function importBackup(partners: Partner[]): Promise<void> {
  await replaceAllPartners(partners)
}
