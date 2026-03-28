import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Trash2, ExternalLink, ChevronDown, ChevronUp, Users, ClipboardList, X } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' }
const DAY_COLORS = {
  Monday: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Tuesday: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Wednesday: 'bg-green-500/20 text-green-400 border-green-500/30',
  Thursday: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Friday: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Saturday: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Sunday: 'bg-red-500/20 text-red-400 border-red-500/30',
}

function AddWorkoutModal({ onClose }) {
  const { dispatch } = useApp()
  const [title, setTitle] = useState('')
  const [weekOf, setWeekOf] = useState(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
  })
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [exercises, setExercises] = useState([
    { id: Date.now(), name: '', sets: '', reps: '', targetWeight: '', demoUrl: '', notes: '' },
  ])

  const addExercise = () =>
    setExercises(ex => [...ex, { id: Date.now(), name: '', sets: '', reps: '', targetWeight: '', demoUrl: '', notes: '' }])

  const removeExercise = (id) =>
    setExercises(ex => ex.filter(e => e.id !== id))

  const updateExercise = (id, field, value) =>
    setExercises(ex => ex.map(e => e.id === id ? { ...e, [field]: value } : e))

  const handleSubmit = (e) => {
    e.preventDefault()
    const validExercises = exercises
      .filter(ex => ex.name.trim())
      .map(ex => ({ ...ex, id: 'ex-' + ex.id, sets: Number(ex.sets) || 1 }))
    if (!validExercises.length) return
    dispatch({ type: 'ADD_WORKOUT', workout: { title, weekOf, day: selectedDay, exercises: validExercises } })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl my-4">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-lg font-bold">Add Workout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* Day selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Day of Week</label>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                    selectedDay === d
                      ? DAY_COLORS[d] + ' border-current'
                      : 'bg-gray-800 text-gray-500 border-gray-700 hover:text-gray-300'
                  }`}
                >
                  {DAY_SHORT[d]}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1.5">Selected: <span className="text-white font-medium">{selectedDay}</span></p>
          </div>

          {/* Title + Week */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Workout Title</label>
              <input className="input" placeholder="e.g. Week 2 — Hypertrophy" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Week Of (Monday)</label>
              <input type="date" className="input" value={weekOf} onChange={e => setWeekOf(e.target.value)} required />
            </div>
          </div>

          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-300">Exercises</h3>
              <button type="button" onClick={addExercise} className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300">
                <Plus className="w-4 h-4" /> Add Exercise
              </button>
            </div>
            <div className="space-y-4">
              {exercises.map((ex, i) => (
                <div key={ex.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-orange-400">Exercise {i + 1}</span>
                    {exercises.length > 1 && (
                      <button type="button" onClick={() => removeExercise(ex.id)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Exercise Name *</label>
                      <input className="input" placeholder="e.g. Back Squat" value={ex.name} onChange={e => updateExercise(ex.id, 'name', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Sets</label>
                      <input type="number" min="1" className="input" placeholder="4" value={ex.sets} onChange={e => updateExercise(ex.id, 'sets', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Reps</label>
                      <input className="input" placeholder="8 or 8-10" value={ex.reps} onChange={e => updateExercise(ex.id, 'reps', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Target Weight</label>
                      <input className="input" placeholder="135 lbs" value={ex.targetWeight} onChange={e => updateExercise(ex.id, 'targetWeight', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Demo URL</label>
                      <input className="input" placeholder="YouTube link" value={ex.demoUrl} onChange={e => updateExercise(ex.id, 'demoUrl', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Coach Notes</label>
                      <textarea className="input resize-none" rows={2} placeholder="Technique cues, rest periods..." value={ex.notes} onChange={e => updateExercise(ex.id, 'notes', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Post Workout</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MemberLogRow({ member, logs, workout }) {
  const loggedCount = workout.exercises.filter(ex =>
    logs.some(l => l.userId === member.id && l.exerciseId === ex.id)
  ).length
  const total = workout.exercises.length
  const pct = total ? Math.round((loggedCount / total) * 100) : 0

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-orange-400">
          {member.initials}
        </div>
        <div>
          <p className="font-medium text-sm">{member.name}</p>
          <p className="text-xs text-gray-500">{loggedCount}/{total} exercises logged</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-orange-500' : 'bg-gray-600'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${pct === 100 ? 'text-green-400' : pct > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
          {pct}%
        </span>
      </div>
    </div>
  )
}

function WorkoutPanel({ workout, members, logs, onDelete }) {
  const [open, setOpen] = useState(true)
  const [tab, setTab] = useState('program')

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${DAY_COLORS[workout.day] || 'bg-gray-700 text-gray-400 border-gray-600'}`}>
              {workout.day}
            </span>
          </div>
          <h3 className="font-bold text-white">{workout.title}</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Week of {new Date(workout.weekOf + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onDelete} className="text-gray-600 hover:text-red-400 transition-colors p-1">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white p-1">
            {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4">
          <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1">
            {['program', 'members'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-1.5 rounded-md transition ${tab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t === 'program' ? <ClipboardList className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                {t === 'program' ? 'Program' : 'Member Logs'}
              </button>
            ))}
          </div>

          {tab === 'program' ? (
            <div className="space-y-3">
              {workout.exercises.map((ex, i) => (
                <div key={ex.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium">#{i + 1}</span>
                        <h4 className="font-semibold text-white">{ex.name}</h4>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-2">
                        <span><span className="text-white font-medium">{ex.sets}</span> sets</span>
                        <span>×</span>
                        <span><span className="text-white font-medium">{ex.reps}</span> reps</span>
                        {ex.targetWeight && <span>@ <span className="text-white font-medium">{ex.targetWeight}</span></span>}
                      </div>
                      {ex.notes && <p className="text-xs text-gray-500 italic">"{ex.notes}"</p>}
                    </div>
                    {ex.demoUrl && (
                      <a href={ex.demoUrl} target="_blank" rel="noreferrer" className="flex-shrink-0 text-orange-400 hover:text-orange-300">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {members.filter(m => m.role === 'member').map(member => (
                <MemberLogRow key={member.id} member={member} logs={logs} workout={workout} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CoachDashboard() {
  const { state, dispatch } = useApp()
  const [showAdd, setShowAdd] = useState(false)

  // Group workouts by weekOf, then sort days within each week
  const DAY_ORDER = Object.fromEntries(DAYS.map((d, i) => [d, i]))
  const byWeek = state.workouts.reduce((acc, w) => {
    if (!acc[w.weekOf]) acc[w.weekOf] = []
    acc[w.weekOf].push(w)
    return acc
  }, {})
  const sortedWeeks = Object.keys(byWeek).sort((a, b) => b.localeCompare(a))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Coach Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">{state.workouts.length} workout{state.workouts.length !== 1 ? 's' : ''} posted</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Workout
        </button>
      </div>

      {sortedWeeks.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No workouts posted yet</p>
          <p className="text-gray-600 text-sm mt-1">Click "New Workout" to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedWeeks.map(week => (
            <div key={week}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Week of {new Date(week + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <div className="space-y-3">
                {byWeek[week]
                  .slice()
                  .sort((a, b) => (DAY_ORDER[a.day] ?? 7) - (DAY_ORDER[b.day] ?? 7))
                  .map(workout => (
                    <WorkoutPanel
                      key={workout.id}
                      workout={workout}
                      members={state.users}
                      logs={state.workoutLogs}
                      onDelete={() => dispatch({ type: 'DELETE_WORKOUT', workoutId: workout.id })}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddWorkoutModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
