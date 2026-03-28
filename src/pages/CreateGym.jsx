import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Dumbbell, ArrowRight } from 'lucide-react'

export default function CreateGym() {
  const { dispatch, currentUser } = useApp()
  const navigate = useNavigate()
  const [gymName, setGymName] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!gymName.trim()) return
    dispatch({ type: 'CREATE_GYM', name: gymName.trim() })
    navigate('/coach')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Set Up Your Gym</h1>
          <p className="text-gray-400 text-sm mt-1">
            Hey {currentUser?.name.split(' ')[0]} — name your gym to get started.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Gym Name</label>
              <input
                className="input text-lg font-semibold"
                placeholder="e.g. Iron Athletics"
                value={gymName}
                onChange={e => setGymName(e.target.value)}
                autoFocus
                required
              />
              <p className="text-xs text-gray-600 mt-1.5">
                This is what your members will see when they join.
              </p>
            </div>

            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              Create Gym <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* What happens next */}
        <div className="mt-4 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">What happens next</p>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5">1.</span>
              You'll get a unique join code to share with your members
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5">2.</span>
              Members sign up and enter your code to join your gym
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-0.5">3.</span>
              Start posting workouts and building programs
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
