import { getContactAge } from '../lib/contactAge'
import { formatDate } from '../lib/dates'
import { Icon } from './Icon'

const ZONE = {
  ok: { pill: 'text-slate-700 px-0', note: '' },
  yellow: { pill: 'bg-amber-100 text-amber-950 ring-1 ring-inset ring-amber-300/80 px-2', note: 'text-amber-800' },
  red: { pill: 'bg-red-100 text-red-950 ring-1 ring-inset ring-red-300/80 px-2', note: 'text-red-700' },
} as const

/**
 * Last-contact date, highlighted per the contact-age rule, with a relative label.
 * Yellow/red also get an icon and a text cue so color is never the only signal.
 */
export function ContactDate({ date, stacked = true }: { date: string; stacked?: boolean }) {
  const { zone, label } = getContactAge(date)
  const z = ZONE[zone]
  return (
    <div className={`flex ${stacked ? 'flex-col items-start gap-1' : 'flex-wrap items-center gap-x-2 gap-y-1'}`}>
      <span className={`inline-flex items-center gap-1.5 rounded-lg py-0.5 text-[15px] font-semibold tabular-nums ${z.pill}`}>
        {zone !== 'ok' && <Icon name={zone === 'red' ? 'alert' : 'clock'} className="h-4 w-4" strokeWidth={2.25} />}
        {formatDate(date)}
      </span>
      <span className="text-[13px] text-slate-500">
        {label}
        {zone !== 'ok' && (
          <span className={`font-semibold ${z.note}`}> · {zone === 'red' ? 'Overdue' : 'Follow up'}</span>
        )}
      </span>
    </div>
  )
}
