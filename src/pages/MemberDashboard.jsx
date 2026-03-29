import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ExternalLink, CheckCircle2, Circle, ChevronDown, ChevronUp, Flame, Trophy, Play } from 'lucide-react'
import { groupExercises, GROUP_STYLES } from '../components/ExerciseBuilder'
import WorkoutSession from '../components/WorkoutSession'

function WarmupDisplay({ warmup }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-sm font-semibold text-orange-300">Warm Up</span>
          <span className="text-xs text-orange-400/70">{warmup.length} items</span>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
      </button>
      {open && (
        <ul className="px-4 pb-3 space-y-1.5 border-t border-orange-500/10">
          {warmup.map((item, i) => (
            <li key={item.id ?? i} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-gray-200">{item.name}</span>
              {item.detail && <span className="text-xs text-gray-500 flex-shrink-0">{item.detail}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const TODAY = new Date().toISOString().split('T')[0]

function formatDayLabel(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  })
}

function formatShortDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function getWeekRange() {
  const d = new Date()
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  }
}


function ExerciseRow({ exercise, myLogs }) {
  const log = myLogs.find(l => l.exerciseId === exercise.id)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`rounded-xl border transition-all ${log ? 'bg-green-900/10 border-green-800/40' : 'bg-gray-800 border-gray-700'} p-4`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {log ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-white">{exercise.name}</h4>
            <div className="flex items-center gap-2">
              {exercise.demoUrl && (
                <a href={exercise.demoUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-orange-400 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {exercise.notes && (
                <button onClick={() => setExpanded(!expanded)} className="text-gray-500 hover:text-white">
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Target */}
          {exercise.setsData?.length ? (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {exercise.setsData.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-gray-700/60 border border-gray-600/50 rounded px-1.5 py-0.5">
                  <span className="text-orange-400 font-semibold">S{i + 1}</span>
                  <span className="text-gray-200">{s.reps || '—'}{s.weight ? ` @ ${s.weight}` : ''}</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 text-sm mt-1">
              <span className="text-gray-400"><span className="text-white font-medium">{exercise.sets}</span> sets</span>
              <span className="text-gray-400">× <span className="text-white font-medium">{exercise.reps}</span> reps</span>
              {exercise.targetWeight && <span className="text-gray-400">@ <span className="text-white font-medium">{exercise.targetWeight}</span></span>}
            </div>
          )}

          {/* Logged results */}
          {log?.sets && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1.5">
                {log.sets.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-green-900/30 border border-green-800/40 rounded-md px-2 py-0.5 text-xs text-green-300">
                    <span className="text-green-500 font-medium">S{i + 1}</span> {s.reps} × {s.weight}
                  </span>
                ))}
              </div>
              {log.notes && <p className="text-xs text-gray-500 italic mt-1">"{log.notes}"</p>}
            </div>
          )}

          {expanded && exercise.notes && (
            <div className="mt-2 bg-gray-900 rounded-lg px-3 py-2 border border-gray-700">
              <p className="text-xs text-gray-400"><span className="text-orange-400 font-medium">Coach note:</span> {exercise.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DayWorkoutCard({ workout, myLogs }) {
  const [open, setOpen] = useState(false)
  const [sessionOpen, setSessionOpen] = useState(false)
  const loggedCount = workout.exercises.filter(ex => myLogs.some(l => l.exerciseId === ex.id)).length
  const total = workout.exercises.length
  const pct = total ? Math.round((loggedCount / total) * 100) : 0
  const isToday = workout.date === TODAY

  const startLabel = pct === 0 ? 'Start Workout' : pct === 100 ? 'Edit Workout' : `Continue Workout · ${pct}%`

  return (
    <div className={`card ${isToday ? 'border-orange-500/30' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {isToday && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">Today</span>}
            <p className="text-xs text-gray-400">{formatDayLabel(workout.date)}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">{workout.title}</p>
            <p className="text-xs text-gray-500">{loggedCount}/{total} exercises</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pct === 100 && <span className="text-xs text-green-400 font-medium">✓ Done</span>}
          <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-orange-500'}`}
            style={{ width: `${pct}%` }} />
        </div>
      )}

      {/* Start Workout CTA */}
      <button
        onClick={() => setSessionOpen(true)}
        className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
          pct === 100
            ? 'bg-green-900/30 text-green-400 border border-green-800/50 hover:bg-green-900/50'
            : 'btn-primary'
        }`}
      >
        <Play className="w-4 h-4" /> {startLabel}
      </button>

      {/* Expandable exercise preview */}
      {open && (
        <div className="mt-4 space-y-3">
          {workout.warmup?.length > 0 && <WarmupDisplay warmup={workout.warmup} />}
          {groupExercises(workout.exercises).map((item) => {
            if (item.kind === 'single') {
              return <ExerciseRow key={item.exercise.id} exercise={item.exercise} myLogs={myLogs} />
            }
            const style = GROUP_STYLES[item.kind] || GROUP_STYLES.superset
            const allLogged = item.exercises.every(ex => myLogs.some(l => l.exerciseId === ex.id))
            return (
              <div key={item.groupId} className={`rounded-xl border ${style.border} overflow-hidden`}>
                <div className={`flex items-center justify-between px-3 py-1.5 ${style.headerBg}`}>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.label} · {item.exercises.length} exercises
                  </span>
                  {allLogged && <span className="text-[10px] text-green-400 font-semibold">✓ Done</span>}
                </div>
                <div className="divide-y divide-gray-800 bg-gray-900/40">
                  {item.exercises.map((ex, i) => (
                    <div key={ex.id} className="relative">
                      <div className={`absolute left-3 top-3 w-5 h-5 rounded-full text-[10px] font-black text-white flex items-center justify-center flex-shrink-0 z-10 ${style.letterBg}`}>
                        {LETTERS[i]}
                      </div>
                      <div className="pl-10">
                        <ExerciseRow exercise={ex} myLogs={myLogs} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {sessionOpen && (
        <WorkoutSession workout={workout} myLogs={myLogs} onClose={() => setSessionOpen(false)} />
      )}
    </div>
  )
}

export default function MemberDashboard() {
  const { state, currentUser } = useApp()
  const myLogs = state.workoutLogs.filter(l => l.userId === currentUser.id)

  const { start, end } = getWeekRange()

  const isNonMember = currentUser.role === 'nonmember'
  const gymId = currentUser.gymId

  // Scope to this gym, then apply member/nonmember visibility rules
  const myWorkouts = state.workouts.filter(w => {
    if (w.gymId !== gymId) return false
    if (isNonMember) return w.assignedTo === currentUser.id
    return w.assignedTo === null || w.assignedTo === undefined || w.assignedTo === currentUser.id
  })

  const thisWeekWorkouts = myWorkouts
    .filter(w => w.date >= start && w.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date))

  const upcomingWorkouts = myWorkouts
    .filter(w => w.date > end)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  const pastWorkouts = myWorkouts
    .filter(w => w.date < start)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const totalExercises = thisWeekWorkouts.reduce((n, w) => n + w.exercises.length, 0)
  const loggedExercises = thisWeekWorkouts.reduce((n, w) =>
    n + w.exercises.filter(ex => myLogs.some(l => l.exerciseId === ex.id)).length, 0)
  const overallPct = totalExercises ? Math.round((loggedExercises / totalExercises) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="text-2xl font-bold">Hey, {currentUser.name.split(' ')[0]} 👊</h1>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isNonMember
              ? 'bg-gray-800 text-gray-400 border border-gray-700'
              : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
          }`}>
            {isNonMember ? 'Non-Member' : 'Gym Member'}
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          {isNonMember ? 'Your assigned programs will appear here.' : "Let's get to work."}
        </p>
      </div>

      {/* Weekly progress */}
      {thisWeekWorkouts.length > 0 && (
        <div className="card mb-6 bg-gradient-to-br from-orange-900/30 to-gray-900 border-orange-800/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-semibold">This Week's Progress</span>
            </div>
            {overallPct === 100 && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">
                <Trophy className="w-3 h-3" /> Complete!
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${overallPct === 100 ? 'bg-green-500' : 'bg-orange-500'}`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="text-sm font-bold text-white w-16 text-right">{loggedExercises}/{totalExercises}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {thisWeekWorkouts.map(w => {
              const wLogged = w.exercises.filter(ex => myLogs.some(l => l.exerciseId === ex.id)).length
              const wDone = wLogged === w.exercises.length
              const isToday = w.date === TODAY
              return (
                <span key={w.id} className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                  wDone ? 'bg-green-900/30 text-green-400 border-green-800/40'
                  : isToday ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
                }`}>
                  {new Date(w.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })} {wDone ? '✓' : `${wLogged}/${w.exercises.length}`}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* This week */}
      {thisWeekWorkouts.length > 0 ? (
        <div>
          <h2 className="font-bold text-gray-300 mb-3">This Week</h2>
          <div className="space-y-4">
            {thisWeekWorkouts.map(workout => (
              <DayWorkoutCard key={workout.id} workout={workout} myLogs={myLogs} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <Flame className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          {isNonMember ? (
            <>
              <p className="text-gray-400 font-medium">No programs assigned yet</p>
              <p className="text-gray-600 text-sm mt-1">Your coach will assign a program to your account</p>
            </>
          ) : (
            <>
              <p className="text-gray-400 font-medium">No workouts this week</p>
              <p className="text-gray-600 text-sm mt-1">Your coach hasn't posted this week's program yet</p>
            </>
          )}
        </div>
      )}

      {/* Coming up */}
      {upcomingWorkouts.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-gray-300 mb-3">Coming Up</h2>
          <div className="space-y-2">
            {upcomingWorkouts.map(w => (
              <div key={w.id} className="card flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">{w.title}</p>
                  <p className="text-xs text-gray-500">{formatShortDate(w.date)}</p>
                </div>
                <span className="text-xs text-gray-500">{w.exercises.length} exercises</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {pastWorkouts.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-gray-300 mb-3">Past Workouts</h2>
          <div className="space-y-2">
            {pastWorkouts.map(w => {
              const wLogs = myLogs.filter(l => l.workoutId === w.id).length
              return (
                <div key={w.id} className="card flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{w.title}</p>
                    <p className="text-xs text-gray-500">{formatShortDate(w.date)}</p>
                  </div>
                  <span className="text-xs text-gray-400">{wLogs}/{w.exercises.length} logged</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
