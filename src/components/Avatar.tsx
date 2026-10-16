const TONES = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-orange-100 text-orange-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
]

function initials(name: string) {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  return (words[0][0] + (words[1]?.[0] ?? '')).toUpperCase()
}

function tone(name: string) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) | 0
  return TONES[Math.abs(h) % TONES.length]
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'h-9 w-9 text-[13px]' : 'h-11 w-11 text-[15px]'
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${dims} ${tone(name)}`}>
      {initials(name)}
    </span>
  )
}
