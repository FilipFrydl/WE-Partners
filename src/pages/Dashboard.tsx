import { useState } from 'react'
import { deleteSamplePartners, usePartners } from '../data/partners'
import { getContactAge } from '../lib/contactAge'
import { formatLongToday, greeting } from '../lib/dates'
import { Icon } from '../components/Icon'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useToast } from '../components/Toast'
import { OverviewWidget } from '../widgets/OverviewWidget'
import { FollowUpWidget } from '../widgets/FollowUpWidget'
import { PartnersWidget } from '../widgets/PartnersWidget'

/** Add a widget: create a component taking `partners` and list it here. */
const WIDGETS = [OverviewWidget, FollowUpWidget, PartnersWidget]

export function Dashboard() {
  const partners = usePartners()
  const toast = useToast()
  const [confirmSamples, setConfirmSamples] = useState(false)
  if (!partners) return null

  const due = partners.filter((p) => getContactAge(p.lastContactAt).zone !== 'ok').length
  const samples = partners.filter((p) => p.sample).length

  return (
    <>
      <div className="mb-6">
        <p className="eyebrow">{formatLongToday()}</p>
        <h1 className="mt-1 text-[32px] font-bold leading-tight tracking-tight">{greeting()}</h1>
        <p className="mt-1 text-[17px] text-slate-500">
          {partners.length === 0
            ? 'Add your first partner to get started.'
            : due === 0
              ? 'You’re up to date with all your partners.'
              : `${due} partner${due === 1 ? '' : 's'} could use a follow-up.`}
        </p>
      </div>

      {samples > 0 && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-accent-ring bg-accent-soft px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 text-[15px] text-slate-700">
            <Icon name="info" className="h-5 w-5 text-accent" />
            You’re looking at {samples} sample partners. Delete them when you’re ready to add your own.
          </div>
          <button className="btn-secondary self-end sm:self-auto" onClick={() => setConfirmSamples(true)}>Delete samples</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 landscape:grid-cols-2">
        {WIDGETS.map((W, i) => <W key={i} partners={partners} />)}
      </div>

      {confirmSamples && (
        <ConfirmDialog
          title="Delete sample data?"
          message={`The ${samples} sample partners will be removed. Partners you added yourself are kept.`}
          confirmLabel="Delete"
          onCancel={() => setConfirmSamples(false)}
          onConfirm={async () => {
            await deleteSamplePartners()
            setConfirmSamples(false)
            toast({ message: 'Sample data deleted' })
          }}
        />
      )}
    </>
  )
}
