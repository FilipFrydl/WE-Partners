import { WidgetCard } from '../components/WidgetCard'
import { Icon, type IconName } from '../components/Icon'
import { STATUS_STYLE } from '../components/StatusBadge'
import { STATUSES, type Partner } from '../data/partners'
import { getContactAge } from '../lib/contactAge'

function Tile({ value, label, tone, icon }: { value: number; label: string; tone: string; icon?: IconName }) {
  return (
    <div className={`rounded-2xl p-4 ${tone}`}>
      <div className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight">
        {icon && <Icon name={icon} className="h-4 w-4" strokeWidth={2.25} />}
        {label}
      </div>
      <div className="mt-2 text-[40px] font-bold leading-none tracking-tight tabular-nums">{value}</div>
    </div>
  )
}

export function OverviewWidget({ partners }: { partners: Partner[] }) {
  const zones = partners.map((p) => getContactAge(p.lastContactAt).zone)
  const yellow = zones.filter((z) => z === 'yellow').length
  const red = zones.filter((z) => z === 'red').length

  return (
    <WidgetCard title="Overview" subtitle="Contact health at a glance">
      <div className="grid grid-cols-3 gap-3">
        <Tile value={partners.length} label="Partners" tone="bg-slate-50 text-slate-900 ring-1 ring-inset ring-slate-200/70" />
        <Tile value={yellow} label="7–13 days" icon="clock" tone="bg-amber-50 text-amber-950 ring-1 ring-inset ring-amber-200" />
        <Tile value={red} label="14+ days" icon="alert" tone="bg-red-50 text-red-950 ring-1 ring-inset ring-red-200" />
      </div>

      <h3 className="eyebrow mb-1 mt-6">By status</h3>
      <ul className="divide-y divide-slate-100">
        {STATUSES.map((s) => (
          <li key={s} className="flex min-h-[44px] items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${STATUS_STYLE[s].dot}`} />
            <span className="flex-1 text-slate-700">{s}</span>
            <span className="text-[17px] font-semibold tabular-nums">{partners.filter((p) => p.status === s).length}</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}
