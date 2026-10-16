import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WidgetCard } from '../components/WidgetCard'
import { StatusBadge } from '../components/StatusBadge'
import { ContactDate } from '../components/ContactDate'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { useToast } from '../components/Toast'
import { updatePartner, type Partner } from '../data/partners'
import { byOldestContact } from '../lib/sort'

const COLS = 'md:grid md:grid-cols-[minmax(0,1.1fr)_10rem_minmax(0,1.5fr)] md:items-center md:gap-5'

function InlineComment({ partner }: { partner: Partner }) {
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(partner.comment)

  if (!editing) {
    return (
      <button
        className="group flex min-h-[44px] w-full items-center gap-2 rounded-xl px-2.5 text-left active:bg-slate-100 md:-ml-2.5"
        aria-label={partner.comment ? `Comment: ${partner.comment}. Tap to edit.` : `Add a comment for ${partner.name}`}
        onClick={() => { setText(partner.comment); setEditing(true) }}
      >
        <span className={`min-w-0 flex-1 truncate text-[15px] ${partner.comment ? 'text-slate-600' : 'text-slate-400'}`}>
          {partner.comment.replace(/\s*\n\s*/g, ' · ') || 'Add a comment…'}
        </span>
        <Icon name="pencil" className="h-4 w-4 text-slate-300" />
      </button>
    )
  }

  async function save() {
    await updatePartner(partner.id, { comment: text.trim() })
    setEditing(false)
    toast({ message: 'Comment saved' })
  }

  return (
    <div className="space-y-2 py-1">
      <textarea
        className="field min-h-[100px] resize-y py-2.5 text-[16px] leading-snug"
        value={text}
        autoFocus
        aria-label={`Comment for ${partner.name}`}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save()
          if (e.key === 'Escape') setEditing(false)
        }}
      />
      <div className="flex justify-end gap-2">
        <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
        <button className="btn-primary" onClick={save}>Save</button>
      </div>
    </div>
  )
}

export function PartnersWidget({ partners }: { partners: Partner[] }) {
  const sorted = [...partners].sort(byOldestContact)
  return (
    <WidgetCard
      title="Partners"
      subtitle="Longest without contact first · tap a comment to edit"
      wide
      action={
        <Link to="/partners" className="btn-ghost -mr-2">
          Manage partners <Icon name="arrowRight" className="h-[18px] w-[18px]" />
        </Link>
      }
    >
      {sorted.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 px-6 py-10 text-center">
          <p className="font-semibold">No partners yet</p>
          <Link to="/partners" className="btn-primary mt-4"><Icon name="plus" /> Add your first partner</Link>
        </div>
      ) : (
        <div className="-mx-2">
          <div className={`hidden border-b border-slate-100 px-2 pb-2 ${COLS}`}>
            {['Partner', 'Last contact', 'Comment'].map((h) => <span key={h} className="eyebrow">{h}</span>)}
          </div>
          <ul className="divide-y divide-slate-100">
            {sorted.map((p) => (
              <li key={p.id} className={`px-2 py-3 ${COLS}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={p.name} />
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2 md:flex-col md:items-start md:gap-1">
                    <span className="truncate font-semibold">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="mt-2 pl-14 md:mt-0 md:pl-0"><ContactDate date={p.lastContactAt} /></div>
                <div className="mt-1 pl-12 md:mt-0 md:pl-0"><InlineComment partner={p} /></div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </WidgetCard>
  )
}
