import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Dumbbell, Users, UserCheck } from 'lucide-react'

export default function Register() {
  const { dispatch } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [accountType, setAccountType] = useState('member') // 'member' or 'nonmember'
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    dispatch({
      type: 'REGISTER',
      user: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: accountType,
      },
    })
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-3">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gymi</h1>
          <p className="text-gray-400 text-sm mt-1">Create your account</p>
        </div>

        <div className="card">
          {/* Account type selector */}
          <div className="mb-5">
            <label className="block text-sm text-gray-400 mb-2">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('member')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  accountType === 'member'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <div className="text-center">
                  <p className="text-xs font-bold">Gym Member</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-0.5">WOD + programs</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('nonmember')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  accountType === 'nonmember'
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Users className="w-5 h-5" />
                <div className="text-center">
                  <p className="text-xs font-bold">Non-Member</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Assigned programs only</p>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input className="input" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" className="input" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <input type="tel" className="input" placeholder="555-000-0000" value={form.phone} onChange={set('phone')} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
              <input type="password" className="input" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full py-2.5">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
