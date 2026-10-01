interface StatusChipProps {
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'approved'
}

export default function StatusChip({ status }: StatusChipProps) {
  const normalized = status === 'approved' ? 'accepted' : status

  const styles = {
    pending: 'bg-[--color-status-pending-bg] text-[--color-status-pending-text]',
    accepted: 'bg-[--color-status-accepted-bg] text-[--color-status-accepted-text]',
    rejected: 'bg-[--color-status-rejected-bg] text-[--color-status-rejected-text]',
    completed: 'bg-[--color-status-completed-bg] text-[--color-status-completed-text]',
    cancelled: 'bg-[--color-status-cancelled-bg] text-[--color-status-cancelled-text]',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[normalized]}`}>
      {status}
    </span>
  )
}
