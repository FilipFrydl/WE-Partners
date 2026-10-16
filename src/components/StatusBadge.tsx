import type { PartnerStatus } from '../data/partners'

export const STATUS_STYLE: Record<PartnerStatus, { badge: string; dot: string }> = {
  'In communication': { badge: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20', dot: 'bg-emerald-500' },
  'Never responded': { badge: 'bg-rose-50 text-rose-800 ring-rose-600/20', dot: 'bg-rose-500' },
  'On hold': { badge: 'bg-violet-50 text-violet-800 ring-violet-600/20', dot: 'bg-violet-500' },
  'No contact': { badge: 'bg-slate-100 text-slate-600 ring-slate-500/20', dot: 'bg-slate-400' },
  Finished: { badge: 'bg-sky-50 text-sky-800 ring-sky-600/20', dot: 'bg-sky-500' },
  'In EWO': { badge: 'bg-amber-50 text-amber-800 ring-amber-600/20', dot: 'bg-amber-500' },
}

export function StatusBadge({ status }: { status: PartnerStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-semibold ring-1 ring-inset ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}
