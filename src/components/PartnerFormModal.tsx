import { useState, type FormEvent } from 'react'
import { Modal } from './Modal'
import { ConfirmDialog } from './ConfirmDialog'
import { Icon } from './Icon'
import { STATUS_STYLE } from './StatusBadge'
import { useToast } from './Toast'
import { createPartner, deletePartner, updatePartner, STATUSES, type Partner, type PartnerStatus } from '../data/partners'
import { today } from '../lib/dates'

export function PartnerFormModal({ partner, onClose }: { partner?: Partner; onClose: () => void }) {
  const toast = useToast()
  const [name, setName] = useState(partner?.name ?? '')
  const [status, setStatus] = useState<PartnerStatus>(partner?.status ?? 'In communication')
  const [lastContactAt, setLast] = useState(partner?.lastContactAt ?? today())
  const [comment, setComment] = useState(partner?.comment ?? '')
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter a name.')
    if (!lastContactAt) return setError('Please choose the last contact date.')
    const input = { name: name.trim(), status, lastContactAt, comment: comment.trim() }
    if (partner) {
      await updatePartner(partner.id, input)
      toast({ message: 'Changes saved' })
    } else {
      await createPartner(input)
      toast({ message: `${input.name} added` })
    }
    onClose()
  }

  if (confirmDelete && partner) {
    return (
      <ConfirmDialog
        title="Delete partner?"
        message={`“${partner.name}” will be permanently deleted from this device.`}
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deletePartner(partner.id)
          toast({ message: `${partner.name} deleted` })
          onClose()
        }}
      />
    )
  }

  return (
    <Modal title={partner ? 'Edit partner' : 'New partner'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div>
          <label className="label" htmlFor="pf-name">Name</label>
          <input
            id="pf-name"
            className="field"
            placeholder="e.g. Northwind Logistics"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            autoFocus={!partner}
            autoComplete="off"
          />
        </div>

        <fieldset>
          <legend className="label">Status</legend>
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map((s) => (
              <label
                key={s}
                className={`flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 text-[15px] font-medium ${
                  status === s ? 'border-accent bg-accent-soft text-slate-900 ring-1 ring-accent' : 'border-slate-200 text-slate-700 active:bg-slate-50'
                }`}
              >
                <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="sr-only" />
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLE[s].dot}`} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="pf-date">Last contact</label>
          <div className="flex gap-2">
            <input id="pf-date" type="date" className="field flex-1" value={lastContactAt} max={today()} onChange={(e) => setLast(e.target.value)} />
            <button type="button" className="btn-soft shrink-0" onClick={() => setLast(today())} disabled={lastContactAt === today()}>
              Today
            </button>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="pf-comment">Comment</label>
          <textarea
            id="pf-comment"
            className="field min-h-[120px] resize-y py-3 leading-snug"
            placeholder="Notes, next steps, contact person…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[15px] font-medium text-red-700">
            <Icon name="alert" className="h-4 w-4" /> {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center">
          {partner && (
            <button type="button" className="btn-danger-soft sm:mr-auto" onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" className="h-[18px] w-[18px]" /> Delete
            </button>
          )}
          <button type="button" className="btn-secondary sm:ml-auto" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary sm:min-w-[120px]">{partner ? 'Save' : 'Add partner'}</button>
        </div>
      </form>
    </Modal>
  )
}
