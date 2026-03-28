import { useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  Plus, Trash2, ExternalLink, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Users, ClipboardList, X, CalendarDays, Copy
} from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0]

function formatDateLabel(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function formatShortDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

// ─── Add Workout Modal ────────────────────────────────────────────────────────
function AddWorkoutModal({ date, onClose }) {
  const { dispatch } = useApp()
  const [title, setTitle] = useState('')
  const [exercises, setExercises] = useState([
    { id: Date.now(), name: '', sets: '', reps: '', targetWeight: '', demoUrl: '', notes: '' },
  ])

  const addExercise = () =>
    setExercises(ex => [...ex, { id: Date.now(), name: '', sets: '', reps: '', targetWeight: '', demoUrl: '', notes: '' }])

  const removeExercise = (id) => setExercises(ex => ex.filter(e => e.id !== id))

  const updateExercise = (id, field, value) =>
    setExercises(ex => ex.map(e => e.id === id ? { ...e, [field]: value } : e))

  const handleSubmit = (e) => {
    e.preventDefault()
    const validExercises = exercises
      .filter(ex => ex.name.trim())
      .map(ex => ({ ...ex, id: 'ex-' + ex.id, sets: Number(ex.sets) || 1 }))
    if (!validExercises.length) return
    dispatch({ type: 'ADD_WORKOUT', workout: { title, date, exercises: validExercises } })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl my-4">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-bold">Add Workout</h2>
            <p className="text-sm text-orange-400 mt-0.5">{formatDateLabel(date)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Workout Title</label>
            <input className="input" placeholder="e.g. Strength Block, Conditioning Day..." value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

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

// ─── Calendar ─────────────────────────────────────────────────────────────────
function Calendar({ workouts, selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(new Date())
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Monday-first: Sun=0 → 6 leading, Mon=1 → 0 leading
  const leadingBlanks = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1

  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const toDateStr = (day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const workoutsByDate = workouts.reduce((acc, w) => {
    if (!acc[w.date]) acc[w.date] = []
    acc[w.date].push(w)
    return acc
  }, {})

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-white">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <div key={d} className="text-center text-xs text-gray-600 font-semibold py-1 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = toDateStr(day)
          const dayWorkouts = workoutsByDate[dateStr] || []
          const isToday = dateStr === TODAY
          const isSelected = dateStr === selectedDate
          const isPast = dateStr < TODAY

          return (
            <button
              key={i}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={`relative flex flex-col items-center justify-start pt-1.5 pb-1 rounded-xl min-h-[52px] transition-all border ${
                isSelected
                  ? 'bg-orange-500 border-orange-400 text-white'
                  : isToday
                  ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                  : isPast
                  ? 'border-transparent hover:bg-gray-800 text-gray-600 hover:text-gray-400'
                  : 'border-transparent hover:bg-gray-800 text-gray-300'
              }`}
            >
              <span className={`text-sm font-semibold leading-none ${isToday && !isSelected ? 'text-orange-400' : ''}`}>
                {day}
              </span>

              {/* Workout dots */}
              {dayWorkouts.length > 0 && (
                <div className="flex gap-0.5 mt-1.5 flex-wrap justify-center px-1">
                  {dayWorkouts.slice(0, 3).map((w, wi) => (
                    <div
                      key={wi}
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-400'}`}
                    />
                  ))}
                  {dayWorkouts.length > 3 && (
                    <span className={`text-[9px] leading-none ${isSelected ? 'text-white/70' : 'text-orange-400/70'}`}>
                      +{dayWorkouts.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          Workout posted
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-4 h-4 rounded-md bg-orange-500/15 border border-orange-500/40" />
          Today
        </div>
      </div>
    </div>
  )
}

// ─── Day Detail Panel ─────────────────────────────────────────────────────────
function DayDetail({ date, workouts, members, logs, onDelete, onDuplicate, onAddWorkout }) {
  const [expandedId, setExpandedId] = useState(null)
  const [tab, setTab] = useState({})

  const dayWorkouts = workouts.filter(w => w.date === date)

  return (
    <div className="space-y-3">
      {/* Day header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">{formatDateLabel(date)}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {dayWorkouts.length === 0
              ? 'No workouts — rest day or add one below'
              : `${dayWorkouts.length} workout${dayWorkouts.length > 1 ? 's' : ''} scheduled`}
          </p>
        </div>
        <button onClick={onAddWorkout} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus className="w-4 h-4" /> Add Workout
        </button>
      </div>

      {/* Workouts for this day */}
      {dayWorkouts.length === 0 ? (
        <div className="card text-center py-8 border-dashed">
          <CalendarDays className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No workout for this day yet</p>
        </div>
      ) : (
        dayWorkouts.map(workout => {
          const currentTab = tab[workout.id] || 'program'
          const isOpen = expandedId !== workout.id + '-closed'

          return (
            <div key={workout.id} className="card">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white">{workout.title}</h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicate(workout.id)}
                    title="Duplicate to next week"
                    className="p-1.5 text-gray-600 hover:text-blue-400 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(workout.id)}
                    className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === workout.id + '-closed' ? null : workout.id + '-closed')}
                    className="p-1.5 text-gray-400 hover:text-white"
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <>
                  <div className="flex gap-1 mt-3 mb-3 bg-gray-800 rounded-lg p-1">
                    {['program', 'members'].map(t => (
                      <button
                        key={t}
                        onClick={() => setTab(prev => ({ ...prev, [workout.id]: t }))}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md transition ${
                          currentTab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {t === 'program' ? <ClipboardList className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {t === 'program' ? 'Program' : 'Member Logs'}
                      </button>
                    ))}
                  </div>

                  {currentTab === 'program' ? (
                    <div className="space-y-2">
                      {workout.exercises.map((ex, i) => (
                        <div key={ex.id} className="bg-gray-800 rounded-xl p-3 border border-gray-700">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full font-medium">#{i + 1}</span>
                                <span className="font-semibold text-sm text-white">{ex.name}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-1">
                                <span><span className="text-white font-medium">{ex.sets}</span> sets × <span className="text-white font-medium">{ex.reps}</span> reps</span>
                                {ex.targetWeight && <span>@ <span className="text-white font-medium">{ex.targetWeight}</span></span>}
                              </div>
                              {ex.notes && <p className="text-xs text-gray-500 italic">"{ex.notes}"</p>}
                            </div>
                            {ex.demoUrl && (
                              <a href={ex.demoUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 flex-shrink-0">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {members.filter(m => m.role === 'member').map(member => {
                        const loggedCount = workout.exercises.filter(ex =>
                          logs.some(l => l.userId === member.id && l.exerciseId === ex.id)
                        ).length
                        const total = workout.exercises.length
                        const pct = total ? Math.round((loggedCount / total) * 100) : 0
                        return (
                          <div key={member.id} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-orange-400">
                                {member.initials}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-gray-500">{loggedCount}/{total} logged</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-orange-500' : 'bg-gray-600'}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium w-8 text-right ${pct === 100 ? 'text-green-400' : pct > 0 ? 'text-orange-400' : 'text-gray-500'}`}>
                                {pct}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function CoachDashboard() {
  const { state, dispatch, currentUser, currentGym } = useApp()
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [showAdd, setShowAdd] = useState(false)

  // Scope all data to this coach's gym
  const gymId = currentUser?.gymId
  const gymWorkouts = state.workouts.filter(w => w.gymId === gymId)
  const gymUsers = state.users.filter(u => u.gymId === gymId)
  const gymLogs = state.workoutLogs.filter(l => l.gymId === gymId)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">{currentGym?.name ?? 'Dashboard'}</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {gymWorkouts.length} workout{gymWorkouts.length !== 1 ? 's' : ''} scheduled · {gymUsers.filter(u => u.role === 'member').length} members
        </p>
      </div>

      {/* Calendar */}
      <div className="mb-5">
        <Calendar
          workouts={gymWorkouts}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <DayDetail
          date={selectedDate}
          workouts={gymWorkouts}
          members={gymUsers}
          logs={gymLogs}
          onDelete={(id) => dispatch({ type: 'DELETE_WORKOUT', workoutId: id })}
          onDuplicate={(id) => dispatch({ type: 'DUPLICATE_WORKOUT', workoutId: id })}
          onAddWorkout={() => setShowAdd(true)}
        />
      )}

      {/* Add workout modal */}
      {showAdd && selectedDate && (
        <AddWorkoutModal date={selectedDate} onClose={() => setShowAdd(false)} />
      )}
    </div>
  )
}
