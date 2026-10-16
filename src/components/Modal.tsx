import { useEffect, type ReactNode } from 'react'
import { Icon } from './Icon'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md'
}

/** Bottom sheet on phones, centered dialog on iPad/desktop. */
export function Modal({ title, onClose, children, size = 'md' }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 backdrop-blur-[2px] sm:items-center sm:p-6"
      style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`flex max-h-full w-full flex-col overflow-hidden rounded-t-[24px] bg-white shadow-pop sm:rounded-[24px] ${size === 'sm' ? 'sm:max-w-sm' : 'sm:max-w-lg'}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 pl-6 pr-2">
          <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
          <button className="btn-icon rounded-full" aria-label="Close" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pt-5" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
