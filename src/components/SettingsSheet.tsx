import { useRef, useState, type ReactNode } from 'react'
import { Modal } from './Modal'
import { ConfirmDialog } from './ConfirmDialog'
import { Icon, type IconName } from './Icon'
import { useToast } from './Toast'
import { exportBackup, importBackup, lastExportAt, parseBackup } from '../data/backup'
import { deleteSamplePartners, usePartners, type Partner } from '../data/partners'
import { getContactAge } from '../lib/contactAge'
import { toDateString } from '../lib/dates'

function Row({ icon, title, detail, tone = 'text-accent bg-accent-soft', onClick }: {
  icon: IconName; title: string; detail: ReactNode; tone?: string; onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex min-h-[64px] w-full items-center gap-3.5 px-4 py-3 text-left active:bg-slate-50">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon name={icon} /></span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-[13px] text-slate-500">{detail}</span>
      </span>
      <Icon name="chevronRight" className="h-5 w-5 text-slate-300" />
    </button>
  )
}

function lastBackupLabel(iso: string | null) {
  if (!iso) return 'No backup yet'
  const { days, label } = getContactAge(toDateString(new Date(iso)))
  return days === 0 ? 'Last backup: today' : `Last backup: ${label}`
}

export function SettingsSheet({ onClose }: { onClose: () => void }) {
  const partners = usePartners()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<Partner[] | null>(null)
  const [confirmSamples, setConfirmSamples] = useState(false)
  const [error, setError] = useState('')
  const [lastExport, setLastExport] = useState(lastExportAt)
  const sampleCount = partners?.filter((p) => p.sample).length ?? 0

  async function onFile(file?: File) {
    if (fileRef.current) fileRef.current.value = ''
    if (!file) return
    try {
      setPending(parseBackup(await file.text()))
      setError('')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  if (pending) {
    return (
      <ConfirmDialog
        title="Replace all data?"
        message={`Your current ${partners?.length ?? 0} partners will be replaced with the ${pending.length} partner${pending.length === 1 ? '' : 's'} from the backup. This cannot be undone.`}
        confirmLabel="Replace"
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          await importBackup(pending)
          toast({ message: `Backup restored: ${pending.length} partners` })
          onClose()
        }}
      />
    )
  }
  if (confirmSamples) {
    return (
      <ConfirmDialog
        title="Delete sample data?"
        message={`The ${sampleCount} sample partners will be removed. Partners you added yourself are kept.`}
        confirmLabel="Delete"
        onCancel={() => setConfirmSamples(false)}
        onConfirm={async () => {
          await deleteSamplePartners()
          toast({ message: 'Sample data deleted' })
          setConfirmSamples(false)
        }}
      />
    )
  }

  const stale = !lastExport || getContactAge(toDateString(new Date(lastExport))).zone !== 'ok'

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="mb-5 flex gap-3 rounded-2xl bg-slate-50 p-4 text-[15px] text-slate-600">
        <Icon name="shield" className="mt-0.5 h-5 w-5 text-slate-400" />
        <p>Your partners are stored only on this device. Export a backup regularly so you never lose them.</p>
      </div>

      <h3 className="eyebrow mb-2 px-1">Backup</h3>
      <div className="mb-6 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
        <Row
          icon="download"
          title="Export backup"
          detail={<span className={stale ? 'font-medium text-amber-800' : ''}>{lastBackupLabel(lastExport)}</span>}
          onClick={async () => {
            await exportBackup()
            setLastExport(lastExportAt())
            toast({ message: 'Backup downloaded' })
          }}
        />
        <Row icon="upload" title="Import backup" detail="Restore partners from a .json file" onClick={() => fileRef.current?.click()} />
      </div>
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      {error && (
        <p role="alert" className="-mt-3 mb-6 flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-[15px] font-medium text-red-700">
          <Icon name="alert" className="h-4 w-4" /> {error}
        </p>
      )}

      {sampleCount > 0 && (
        <>
          <h3 className="eyebrow mb-2 px-1">Sample data</h3>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <Row
              icon="trash"
              tone="text-red-600 bg-red-50"
              title="Delete sample partners"
              detail={`${sampleCount} example partners created on first launch`}
              onClick={() => setConfirmSamples(true)}
            />
          </div>
        </>
      )}
    </Modal>
  )
}
