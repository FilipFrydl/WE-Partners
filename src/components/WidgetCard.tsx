import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
  /** Span both dashboard columns. */
  wide?: boolean
  children: ReactNode
}

export function WidgetCard({ title, subtitle, action, wide, children }: Props) {
  return (
    <section className={`card flex flex-col p-5 sm:p-6 ${wide ? 'landscape:col-span-2' : ''}`}>
      <header className="mb-4 flex min-h-[44px] items-start justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[15px] text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
