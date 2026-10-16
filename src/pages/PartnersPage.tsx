import { useMemo, useState } from 'react'
import { StatusBadge, STATUS_STYLE } from '../components/StatusBadge'
import { ContactDate } from '../components/ContactDate'
import { PartnerFormModal } from '../components/PartnerFormModal'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { useMarkContacted } from '../components/useMarkContacted'
import { STATUSES, usePartners, type Partner, type PartnerStatus } from '../data/partners'
import { byOldestContact } from '../lib/sort'
import { getContactAge } from '../lib/contactAge'

type SortKey = 'contact' | 'name'

function Chip({ active, onClick, dot, label, count }: { active: boolean; onClick: () => void; dot?: string; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 text-[15px] font-semibold transition-colors ${
        active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 active:bg-slate-50'
      }`}
    >
      {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
      {label}
      <span className={`tabular-nums ${active ? 'text-white/70' : 'text-slate-400'}`}>{count}</span>
    </button>
  )
}

function SortToggle({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const opt = (v: SortKey, label: string) => (
    <button
      onClick={() => onChange(v)}
      aria-pressed={value === v}
      className={`min-h-[40px] rounded-[10px] px-3.5 text-[15px] font-semibold ${value === v ? 'bg-white text-slate-900 shadow-card' : 'text-slate-500'}`}
    >
      {label}
    </button>
  )
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="eyebrow hidden lg:inline">Sort</span>
      <div role="group" aria-label="Sort by" className="flex rounded-xl bg-slate-200/70 p-1">
        {opt('contact', 'Last contact')}
        {opt('name', 'Name')}
      </div>
    </div>
  )
}

export function PartnersPage() {
  const partners = usePartners()
  const markContacted = useMarkContacted()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PartnerStatus | null>(null)
  const [sort, setSort] = useState<SortKey>('contact')
  const [editing, setEditing] = useState<Partner | 'new' | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (partners ?? [])
      .filter((p) => (!q || p.name.toLowerCase().includes(q)) && (!status || p.status === status))
      .sort(sort === 'name' ? (a, b) => a.name.localeCompare(b.name) : byOldestContact)
  }, [partners, query, status, sort])

  if (!partners) return null

  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold leading-tight tracking-tight">Partners</h1>
          <p className="mt-1 text-[17px] text-slate-500">
            {partners.length} partner{partners.length === 1 ? '' : 's'} · tap a partner to edit
          </p>
        </div>
        <button className="btn-primary" onClick={() => setEditing('new')}>
          <Icon name="plus" strokeWidth={2.5} /> <span>Add partner</span>
        </button>
      </div>

      {partners.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Icon name="users" className="h-8 w-8" strokeWidth={1.75} />
          </span>
          <h2 className="mt-5 text-xl font-bold">No partners yet</h2>
          <p className="mt-1 max-w-sm text-slate-500">Keep track of who you work with and when you last spoke.</p>
          <button className="btn-primary mt-6" onClick={() => setEditing('new')}>
            <Icon name="plus" strokeWidth={2.5} /> Add your first partner
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="field bg-white pl-11 shadow-card"
                  type="search"
                  placeholder="Search partners"
                  aria-label="Search by name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <SortToggle value={sort} onChange={setSort} />
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by status">
              <Chip active={status === null} onClick={() => setStatus(null)} label="All" count={partners.length} />
              {STATUSES.map((s) => (
                <Chip
                  key={s}
                  active={status === s}
                  onClick={() => setStatus(status === s ? null : s)}
                  dot={STATUS_STYLE[s].dot}
                  label={s}
                  count={partners.filter((p) => p.status === s).length}
                />
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            {rows.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <p className="font-semibold">No matching partners</p>
                <p className="mt-1 text-slate-500">Try a different name or status.</p>
                <button className="btn-ghost mt-3" onClick={() => { setQuery(''); setStatus(null) }}>Clear filters</button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {rows.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 pr-3 sm:pr-4">
                    <button
                      onClick={() => setEditing(p)}
                      aria-label={`Edit ${p.name}`}
                      className="flex min-w-0 flex-1 items-center gap-3.5 py-3.5 pl-4 text-left active:bg-slate-50 sm:pl-5"
                    >
                      <Avatar name={p.name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <span className="truncate text-[17px] font-semibold">{p.name}</span>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className={`mt-0.5 truncate text-[15px] ${p.comment ? 'text-slate-500' : 'text-slate-400'}`}>
                          {p.comment.replace(/\s*\n\s*/g, ' · ') || 'No comment'}
                        </p>
                        <div className="mt-1.5 sm:hidden"><ContactDate date={p.lastContactAt} stacked={false} /></div>
                      </div>
                      <div className="hidden w-40 shrink-0 sm:block"><ContactDate date={p.lastContactAt} /></div>
                    </button>
                    {getContactAge(p.lastContactAt).days > 0 ? (
                      <button className="btn-soft shrink-0 px-3.5" onClick={() => markContacted(p)} aria-label={`Mark ${p.name} as contacted today`}>
                        <Icon name="check" className="h-[18px] w-[18px]" strokeWidth={2.5} />
                        <span className="hidden md:inline">Contacted today</span>
                      </button>
                    ) : (
                      <span className="flex min-h-[44px] shrink-0 items-center gap-1.5 px-3.5 text-[15px] font-semibold text-emerald-700">
                        <Icon name="checkCircle" className="h-[18px] w-[18px]" />
                        <span className="hidden md:inline">Contacted today</span>
                        <span className="sr-only md:hidden">Contacted today</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {editing && <PartnerFormModal partner={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
    </>
  )
}
