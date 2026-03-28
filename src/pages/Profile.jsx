import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Shield, LogOut, Check, Pencil } from 'lucide-react'

export default function Profile() {
  const { currentUser, state, dispatch } = useApp()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
  })
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PROFILE', userId: currentUser.id, data: form })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  const myLogs = state.workoutLogs.filter(l => l.userId === currentUser.id)
  const joinDate = new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-2xl font-bold text-white mb-3">
          {currentUser.initials}
        </div>
        <h1 className="text-xl font-bold">{currentUser.name}</h1>
        <span className={`mt-1.5 text-xs font-medium px-3 py-0.5 rounded-full ${currentUser.role === 'coach' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
          {currentUser.role === 'coach' ? 'Coach' : 'Member'}
        </span>
        <p className="text-gray-500 text-sm mt-1">Member since {joinDate}</p>
      </div>

      {/* Stats */}
      {currentUser.role === 'member' && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card text-center py-4">
            <p className="text-2xl font-bold text-orange-400">{myLogs.length}</p>
            <p className="text-xs text-gray-500 mt-1">Exercises Logged</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-bold text-orange-400">{state.workouts.length}</p>
            <p className="text-xs text-gray-500 mt-1">Weeks of Training</p>
          </div>
        </div>
      )}

      {/* Profile info */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Profile Info</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone }) }} className="text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 font-medium">
                <Check className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {[
            { icon: User, label: 'Full Name', key: 'name', type: 'text' },
            { icon: Mail, label: 'Email', key: 'email', type: 'email' },
            { icon: Phone, label: 'Phone', key: 'phone', type: 'tel' },
          ].map(({ icon: Icon, label, key, type }) => (
            <div key={key} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                {editing ? (
                  <input type={type} className="input" value={form[key]} onChange={set(key)} />
                ) : (
                  <p className="text-sm text-white">{currentUser[key]}</p>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mt-0.5">
              <Shield className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Role</p>
              <p className="text-sm text-white capitalize">{currentUser.role}</p>
            </div>
          </div>
        </div>

        {saved && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-400 bg-green-900/20 border border-green-800/40 rounded-lg px-3 py-2">
            <Check className="w-4 h-4" /> Profile updated!
          </div>
        )}
      </div>

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 bg-red-900/10 hover:bg-red-900/20 border border-red-800/30 rounded-xl py-3 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  )
}
