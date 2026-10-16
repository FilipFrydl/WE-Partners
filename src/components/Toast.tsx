import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

interface ToastInput {
  message: string
  action?: { label: string; onClick: () => void }
}

const ToastContext = createContext<(t: ToastInput) => void>(() => {})

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(ToastInput & { id: number }) | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((t: ToastInput) => {
    window.clearTimeout(timer.current)
    setToast({ ...t, id: Date.now() })
    timer.current = window.setTimeout(() => setToast(null), 5000)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
      >
        {toast && (
          <div key={toast.id} className="pointer-events-auto flex min-h-[52px] max-w-md items-center gap-3 rounded-2xl bg-slate-900 py-1.5 pl-4 pr-1.5 text-[15px] text-white shadow-pop">
            <Icon name="checkCircle" className="h-5 w-5 text-emerald-400" />
            <span className="flex-1">{toast.message}</span>
            {toast.action && (
              <button
                className="btn px-3 text-blue-300 active:bg-white/10"
                onClick={() => { toast.action!.onClick(); setToast(null) }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
