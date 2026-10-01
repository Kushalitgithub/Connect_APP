import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setTokens } = useAuthStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/admin/login', { email, password })
      setTokens(data.access_token, data.refresh_token)
      navigate('/verification')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-background]">
      <div className="bg-[--color-surface] p-8 rounded-[--radius-xl] shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center font-[--font-serif]">
          Connect Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[--color-border] rounded-[--radius-md] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[--color-border] rounded-[--radius-md] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
              required
            />
          </div>

          {error && (
            <div className="text-[--color-error] text-sm bg-red-50 p-3 rounded-[--radius-md]">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={loading} className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
