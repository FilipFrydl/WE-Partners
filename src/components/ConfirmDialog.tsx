import { Modal } from './Modal'

interface Props {
  title: string
  message: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, message, confirmLabel, danger = true, onConfirm, onCancel }: Props) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p className="mb-6 text-slate-600">{message}</p>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} autoFocus>{confirmLabel}</button>
      </div>
    </Modal>
  )
}
