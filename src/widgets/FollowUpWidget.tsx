import { WidgetCard } from '../components/WidgetCard'
import { ContactDate } from '../components/ContactDate'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { useMarkContacted } from '../components/useMarkContacted'
import type { Partner } from '../data/partners'
import { getContactAge } from '../lib/contactAge'
import { byOldestContact } from '../lib/sort'

export function FollowUpWidget({ partners }: { partners: Partner[] }) {
  const markContacted = useMarkContacted()
  const due = partners.filter((p) => getContactAge(p.lastContactAt).zone !== 'ok').sort(byOldestContact)

  return (
    <WidgetCard
      title="Follow up"
      subtitle={due.length ? `${due.length} partner${due.length === 1 ? '' : 's'} not contacted for 7+ days` : 'Partners not contacted for 7+ days'}
    >
      {due.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-emerald-50/60 px-6 py-10 text-center">
          <Icon name="checkCircle" className="h-10 w-10 text-emerald-500" strokeWidth={1.75} />
          <p className="mt-3 font-semibold">All caught up</p>
          <p className="text-[15px] text-slate-500">Everyone has been contacted within the last week.</p>
        </div>
      ) : (
        <ul className="-mx-2 divide-y divide-slate-100">
          {due.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-2 py-3">
              <Avatar name={p.name} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{p.name}</div>
                <ContactDate date={p.lastContactAt} stacked={false} />
              </div>
              <button className="btn-soft shrink-0 px-3.5" onClick={() => markContacted(p)}>
                <Icon name="check" className="h-[18px] w-[18px]" strokeWidth={2.5} />
                <span className="hidden min-[420px]:inline">Contacted today</span>
                <span className="sr-only min-[420px]:hidden">Contacted today</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  )
}
