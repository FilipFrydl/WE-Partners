import { markContactedToday, updatePartner, type Partner } from '../data/partners'
import { useToast } from './Toast'

/** "Contacted today" with an Undo toast. */
export function useMarkContacted() {
  const toast = useToast()
  return async (p: Partner) => {
    const previous = p.lastContactAt
    await markContactedToday(p.id)
    toast({
      message: `${p.name} marked as contacted today`,
      action: { label: 'Undo', onClick: () => updatePartner(p.id, { lastContactAt: previous }) },
    })
  }
}
