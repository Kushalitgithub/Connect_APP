import { useState, useEffect } from 'react'
import { LogOut, CheckCircle, XCircle, FileText } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import StatusChip from '@/components/StatusChip'
import Button from '@/components/Button'

interface GuideSubmission {
  id: number
  email: string
  guide_profile_id: number
  bio: string | null
  verification_status: string
  id_document_url: string | null
  license_document_url: string | null
  created_at: string
  updated_at: string
}

export default function VerificationQueue() {
  const [submissions, setSubmissions] = useState<GuideSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedGuide, setSelectedGuide] = useState<GuideSubmission | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const { clearAuth } = useAuthStore()

  const fetchQueue = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/admin/verification/queue')
      setSubmissions(data)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const handleApprove = async (guideId: number) => {
    if (!confirm('Approve this guide verification?')) return

    try {
      setActionLoading(true)
      await api.put(`/admin/verification/${guideId}/approve`)
      await fetchQueue()
      setSelectedGuide(null)
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to approve')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (guideId: number) => {
    if (!rejectReason.trim()) {
      alert('Rejection reason is required')
      return
    }

    try {
      setActionLoading(true)
      await api.put(`/admin/verification/${guideId}/reject`, null, {
        params: { reason: rejectReason }
      })
      await fetchQueue()
      setSelectedGuide(null)
      setRejectReason('')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to reject')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[--color-background]">
      {/* Header */}
      <header className="bg-[--color-surface] border-b border-[--color-border] px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold font-[--font-serif]">Guide Verification Queue</h1>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2 inline" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 border border-[--color-error] text-[--color-error] p-4 rounded-[--radius-md] mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[--color-primary] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[--color-text-secondary]">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 bg-[--color-surface] rounded-[--radius-lg]">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <p className="text-xl font-medium">All caught up!</p>
            <p className="text-[--color-text-secondary] mt-2">No pending guide verifications</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-[--color-surface] p-6 rounded-[--radius-lg] shadow-sm border border-[--color-border] hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{submission.email}</h3>
                    <p className="text-sm text-[--color-text-secondary]">
                      Submitted: {new Date(submission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusChip status={submission.verification_status as any} />
                </div>

                {submission.bio && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[--color-text-secondary] mb-1">Bio:</p>
                    <p className="text-sm">{submission.bio}</p>
                  </div>
                )}

                <div className="flex gap-3 mb-4">
                  {submission.id_document_url && (
                    <a
                      href={submission.id_document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[--color-primary] hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      ID Document
                    </a>
                  )}
                  {submission.license_document_url && (
                    <a
                      href={submission.license_document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[--color-primary] hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      License Document
                    </a>
                  )}
                </div>

                {selectedGuide?.id === submission.id ? (
                  <div className="space-y-3 pt-4 border-t border-[--color-border]">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Rejection Reason (required for reject)
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full px-3 py-2 border border-[--color-border] rounded-[--radius-md] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                        rows={3}
                        placeholder="Enter reason for rejection..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(submission.id)}
                        isLoading={actionLoading}
                      >
                        <CheckCircle className="w-4 h-4 mr-2 inline" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleReject(submission.id)}
                        isLoading={actionLoading}
                        disabled={!rejectReason.trim()}
                      >
                        <XCircle className="w-4 h-4 mr-2 inline" />
                        Reject
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedGuide(null)
                          setRejectReason('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedGuide(submission)}
                    className="w-full"
                  >
                    Review Application
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
