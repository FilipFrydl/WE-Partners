import { describe, expect, it } from 'vitest'
import { parseBackup } from './backup'

const file = (status: string) =>
  JSON.stringify({ partners: [{ id: 'a', name: 'Acme', status, lastContactAt: '2026-10-01', comment: '' }] })

describe('parseBackup statuses', () => {
  it('keeps current statuses', () => {
    expect(parseBackup(file('Never responded'))[0].status).toBe('Never responded')
  })

  it.each(['Finished', 'In EWO'])('accepts new status %s', (status) => {
    expect(parseBackup(file(status))[0].status).toBe(status)
  })

  it.each(['Active', 'In negotiation', 'Ended'])('rejects removed status %s', (legacy) => {
    expect(() => parseBackup(file(legacy))).toThrow(/invalid/)
  })

  it('rejects unknown statuses', () => {
    expect(() => parseBackup(file('Whatever'))).toThrow(/invalid/)
  })
})
