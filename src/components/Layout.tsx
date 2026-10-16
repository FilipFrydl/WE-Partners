import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import { SettingsSheet } from './SettingsSheet'

function Tab({ to, icon, label }: { to: string; icon: IconName; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `inline-flex min-h-[40px] items-center gap-2 rounded-[10px] px-4 text-[15px] font-semibold transition-colors ${
          isActive ? 'bg-white text-slate-900 shadow-card' : 'text-slate-500 active:text-slate-700'
        }`
      }
    >
      <Icon name={icon} className="h-[18px] w-[18px]" />
      {label}
    </NavLink>
  )
}

export function Layout() {
  const [settings, setSettings] = useState(false)
  return (
    <div
      className="min-h-screen"
      style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}
    >
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-canvas/85 backdrop-blur-xl" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <div className="flex flex-1 items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-accent text-white shadow-sm">
              <Icon name="users" className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="hidden text-[17px] font-bold tracking-tight sm:inline">Partners</span>
          </div>
          <nav aria-label="Main" className="flex rounded-xl bg-slate-200/70 p-1">
            <Tab to="/" icon="grid" label="Dashboard" />
            <Tab to="/partners" icon="users" label="Partners" />
          </nav>
          <div className="flex flex-1 justify-end">
            <button className="btn-icon rounded-full" aria-label="Settings and backup" onClick={() => setSettings(true)}>
              <Icon name="settings" className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8"><Outlet /></main>
      {settings && <SettingsSheet onClose={() => setSettings(false)} />}
    </div>
  )
}
