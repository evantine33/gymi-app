import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Dumbbell, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export default function JoinGym() {
  const { joinGym, currentUser } = useApp()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleJoin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await joinGym(code.trim().toUpperCase())
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Join Your Gym</h1>
          <p className="text-gray-400 text-sm mt-1">
            Hey {currentUser?.name.split(' ')[0]} — enter the join code from your coach.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Gym Join Code</label>
              <input
                className="input text-center text-2xl font-black tracking-[0.3em] uppercase"
                placeholder="ABC123"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                autoFocus
                required
              />
              <p className="text-xs text-gray-600 mt-1.5 text-center">
                Get this 6-character code from your coach
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Joining…</> : <>Join Gym <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Your account type:{' '}
          <span className="text-gray-400 font-medium capitalize">
            {currentUser?.role === 'nonmember' ? 'Non-Member' : 'Gym Member'}
          </span>
        </p>
      </div>
    </div>
  )
}
