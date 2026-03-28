import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { TrendingUp, Dumbbell, Trophy, Flame, ChevronDown, ChevronUp, Users } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseWeight = (str) => {
  if (!str || typeof str !== 'string') return 0
  if (/bodyweight/i.test(str)) return 0
  const m = str.match(/[\d.]+/)
  return m ? parseFloat(m[0]) : 0
}

const parseReps = (str) => {
  if (!str) return 0
  const m = String(str).match(/\d+/)
  return m ? parseInt(m[0]) : 0
}

const getSetVolume = (set) => parseWeight(set.weight) * parseReps(set.reps)

const getLogVolume = (log) =>
  (log.sets || []).reduce((total, s) => total + getSetVolume(s), 0)

const formatVolume = (lbs) => {
  if (lbs >= 1000000) return `${(lbs / 1000000).toFixed(1)}M`
  if (lbs >= 1000) return `${(lbs / 1000).toFixed(1)}k`
  return lbs.toLocaleString()
}

// Returns the Monday YYYY-MM-DD for any date string/object
const getWeekKey = (dateStr) => {
  const d = new Date(dateStr)
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  return monday.toISOString().split('T')[0]
}

// Returns last N week-start dates (Monday), oldest first
const getLastNWeeks = (n = 8) => {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - day + (day === 0 ? -6 : 1))
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() - (n - 1 - i) * 7)
    return d.toISOString().split('T')[0]
  })
}

const weekLabel = (weekKey) => {
  const d = new Date(weekKey + 'T12:00:00')
  const now = new Date()
  const thisMonday = getWeekKey(now)
  if (weekKey === thisMonday) return 'This week'
  const lastMonday = new Date(thisMonday)
  lastMonday.setDate(lastMonday.getDate() - 7)
  if (weekKey === lastMonday.toISOString().split('T')[0]) return 'Last week'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function VolumeChart({ weeks, volumeByWeek, color = 'bg-orange-500' }) {
  const max = Math.max(...weeks.map(w => volumeByWeek[w] || 0), 1)
  const thisWeek = getWeekKey(new Date())

  return (
    <div className="mt-2">
      <div className="flex items-end gap-1.5 h-24">
        {weeks.map(week => {
          const vol = volumeByWeek[week] || 0
          const pct = (vol / max) * 100
          const isCurrent = week === thisWeek
          return (
            <div key={week} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                <div
                  className={`w-full rounded-t-md transition-all ${isCurrent ? 'bg-orange-500' : 'bg-gray-700'} ${pct === 0 ? 'h-1 opacity-30' : ''}`}
                  style={{ height: pct > 0 ? `${Math.max(pct, 4)}%` : '4px' }}
                  title={`${formatVolume(vol)} lbs`}
                />
              </div>
            </div>
          )
        })}
      </div>
      {/* Labels */}
      <div className="flex gap-1.5 mt-1">
        {weeks.map(week => {
          const isCurrent = week === thisWeek
          return (
            <div key={week} className="flex-1 text-center">
              <span className={`text-[9px] font-medium ${isCurrent ? 'text-orange-400' : 'text-gray-600'}`}>
                {new Date(week + 'T12:00:00').toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Member Stats View ────────────────────────────────────────────────────────
function MemberStats({ logs, workouts }) {
  const weeks = getLastNWeeks(8)
  const thisWeek = getWeekKey(new Date())

  // Volume by week
  const volumeByWeek = {}
  weeks.forEach(w => { volumeByWeek[w] = 0 })
  logs.forEach(log => {
    const wk = getWeekKey(log.date)
    if (volumeByWeek[wk] !== undefined) {
      volumeByWeek[wk] += getLogVolume(log)
    }
  })

  const thisWeekVolume = volumeByWeek[thisWeek] || 0
  const lastWeekKey = weeks[weeks.length - 2]
  const lastWeekVolume = volumeByWeek[lastWeekKey] || 0
  const totalAllTime = logs.reduce((n, l) => n + getLogVolume(l), 0)

  const weekChange = lastWeekVolume > 0
    ? Math.round(((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100)
    : null

  // Volume by exercise (all time)
  const exerciseVolume = {}
  logs.forEach(log => {
    const workout = workouts.find(w => w.id === log.workoutId)
    const exercise = workout?.exercises.find(e => e.id === log.exerciseId)
    const name = exercise?.name || 'Unknown'
    exerciseVolume[name] = (exerciseVolume[name] || 0) + getLogVolume(log)
  })
  const topExercises = Object.entries(exerciseVolume)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // PRs: heaviest single set per exercise
  const prs = {}
  logs.forEach(log => {
    const workout = workouts.find(w => w.id === log.workoutId)
    const exercise = workout?.exercises.find(e => e.id === log.exerciseId)
    const name = exercise?.name || 'Unknown'
    ;(log.sets || []).forEach(set => {
      const w = parseWeight(set.weight)
      if (w > 0 && w > (prs[name] || 0)) prs[name] = w
    })
  })
  const topPRs = Object.entries(prs).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div className="space-y-5">
      {/* Hero stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card bg-gradient-to-br from-orange-900/30 to-gray-900 border-orange-800/30 text-center py-5">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-3xl font-black text-white">{formatVolume(thisWeekVolume)}</p>
          <p className="text-xs text-gray-400 mt-0.5">lbs this week</p>
          {weekChange !== null && (
            <p className={`text-xs font-semibold mt-1 ${weekChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {weekChange >= 0 ? '▲' : '▼'} {Math.abs(weekChange)}% vs last week
            </p>
          )}
        </div>
        <div className="card text-center py-5">
          <TrendingUp className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <p className="text-3xl font-black text-white">{formatVolume(totalAllTime)}</p>
          <p className="text-xs text-gray-400 mt-0.5">lbs all time</p>
          <p className="text-xs text-gray-600 mt-1">{logs.length} sessions logged</p>
        </div>
      </div>

      {/* 8-week trend */}
      <div className="card">
        <h2 className="font-bold text-sm text-gray-300 mb-1">8-Week Volume Trend</h2>
        <p className="text-xs text-gray-500 mb-2">Total lbs lifted per week</p>
        {logs.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-6">Log workouts to see your trend</p>
        ) : (
          <VolumeChart weeks={weeks} volumeByWeek={volumeByWeek} />
        )}
        {/* Week detail */}
        <div className="mt-4 space-y-2">
          {[...weeks].reverse().map(week => {
            const vol = volumeByWeek[week] || 0
            const isCurrent = week === thisWeek
            if (vol === 0 && !isCurrent) return null
            return (
              <div key={week} className={`flex items-center justify-between rounded-lg px-3 py-2 ${isCurrent ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-gray-800'}`}>
                <span className={`text-sm font-medium ${isCurrent ? 'text-orange-400' : 'text-gray-400'}`}>
                  {weekLabel(week)}
                </span>
                <span className={`text-sm font-bold ${vol > 0 ? 'text-white' : 'text-gray-600'}`}>
                  {vol > 0 ? `${formatVolume(vol)} lbs` : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top exercises by volume */}
      {topExercises.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-sm text-gray-300 mb-3">Top Exercises by Volume</h2>
          <div className="space-y-3">
            {topExercises.map(([name, vol], i) => {
              const pct = (vol / topExercises[0][1]) * 100
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-orange-500 w-4">#{i + 1}</span>
                      <span className="text-sm text-white">{name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-300">{formatVolume(vol)} lbs</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* PRs */}
      {topPRs.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-orange-400" />
            <h2 className="font-bold text-sm text-gray-300">Heaviest Sets (PRs)</h2>
          </div>
          <div className="space-y-2">
            {topPRs.map(([name, weight]) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-sm text-gray-300">{name}</span>
                <span className="text-sm font-bold text-orange-400">{weight} lbs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Coach Stats View ─────────────────────────────────────────────────────────
function CoachStats({ members, logs, workouts }) {
  const [expanded, setExpanded] = useState(null)
  const weeks = getLastNWeeks(8)
  const thisWeek = getWeekKey(new Date())

  // Gym-wide volume by week
  const gymVolumeByWeek = {}
  weeks.forEach(w => { gymVolumeByWeek[w] = 0 })
  logs.forEach(log => {
    const wk = getWeekKey(log.date)
    if (gymVolumeByWeek[wk] !== undefined) {
      gymVolumeByWeek[wk] += getLogVolume(log)
    }
  })

  const thisWeekTotal = gymVolumeByWeek[thisWeek] || 0
  const totalAllTime = logs.reduce((n, l) => n + getLogVolume(l), 0)

  // Per-member this week
  const memberThisWeek = members.map(m => {
    const mLogs = logs.filter(l => l.userId === m.id && getWeekKey(l.date) === thisWeek)
    const vol = mLogs.reduce((n, l) => n + getLogVolume(l), 0)
    return { member: m, vol, sessions: new Set(mLogs.map(l => l.workoutId)).size }
  }).sort((a, b) => b.vol - a.vol)

  return (
    <div className="space-y-5">
      {/* Gym totals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card bg-gradient-to-br from-orange-900/30 to-gray-900 border-orange-800/30 text-center py-5">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-3xl font-black text-white">{formatVolume(thisWeekTotal)}</p>
          <p className="text-xs text-gray-400 mt-0.5">lbs gym-wide this week</p>
          <p className="text-xs text-gray-600 mt-1">{memberThisWeek.filter(m => m.vol > 0).length} active members</p>
        </div>
        <div className="card text-center py-5">
          <TrendingUp className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <p className="text-3xl font-black text-white">{formatVolume(totalAllTime)}</p>
          <p className="text-xs text-gray-400 mt-0.5">lbs all time</p>
          <p className="text-xs text-gray-600 mt-1">{logs.length} total sessions</p>
        </div>
      </div>

      {/* 8-week trend */}
      <div className="card">
        <h2 className="font-bold text-sm text-gray-300 mb-1">Gym Volume Trend</h2>
        <p className="text-xs text-gray-500 mb-2">Combined lbs lifted by all members per week</p>
        {logs.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-6">No workout logs yet</p>
        ) : (
          <VolumeChart weeks={weeks} volumeByWeek={gymVolumeByWeek} />
        )}
      </div>

      {/* Member leaderboard */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-orange-400" />
          <h2 className="font-bold text-sm text-gray-300">This Week's Leaderboard</h2>
        </div>
        {memberThisWeek.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-4">No logs this week yet</p>
        ) : (
          <div className="space-y-2">
            {memberThisWeek.map(({ member, vol, sessions }, i) => {
              const isExpanded = expanded === member.id
              const memberAllTimeLogs = logs.filter(l => l.userId === member.id)
              const allTimeVol = memberAllTimeLogs.reduce((n, l) => n + getLogVolume(l), 0)
              return (
                <div key={member.id} className={`rounded-xl border transition-all ${vol > 0 ? 'border-gray-700 bg-gray-800' : 'border-gray-800 bg-gray-900'}`}>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : member.id)}
                    className="w-full flex items-center gap-3 p-3 text-left"
                  >
                    {/* Rank */}
                    <span className={`text-sm font-black w-6 flex-shrink-0 ${i === 0 && vol > 0 ? 'text-orange-400' : 'text-gray-600'}`}>
                      {i === 0 && vol > 0 ? '🥇' : `#${i + 1}`}
                    </span>
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-orange-400 flex-shrink-0">
                      {member.initials}
                    </div>
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                      <p className="text-xs text-gray-500">{sessions} workout{sessions !== 1 ? 's' : ''} this week</p>
                    </div>
                    {/* Volume */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${vol > 0 ? 'text-white' : 'text-gray-600'}`}>
                        {vol > 0 ? `${formatVolume(vol)} lbs` : '—'}
                      </p>
                    </div>
                    {memberAllTimeLogs.length > 0 && (
                      isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && memberAllTimeLogs.length > 0 && (
                    <div className="px-3 pb-3 border-t border-gray-700 pt-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-base font-black text-orange-400">{formatVolume(vol)}</p>
                          <p className="text-[10px] text-gray-500">lbs this week</p>
                        </div>
                        <div>
                          <p className="text-base font-black text-white">{formatVolume(allTimeVol)}</p>
                          <p className="text-[10px] text-gray-500">lbs all time</p>
                        </div>
                        <div>
                          <p className="text-base font-black text-white">{memberAllTimeLogs.length}</p>
                          <p className="text-[10px] text-gray-500">total sessions</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Stats() {
  const { state, currentUser } = useApp()
  const gymId = currentUser?.gymId
  const isCoach = currentUser?.role === 'coach'

  const gymWorkouts = state.workouts.filter(w => w.gymId === gymId)
  const gymLogs = state.workoutLogs.filter(l => l.gymId === gymId)
  const myLogs = gymLogs.filter(l => l.userId === currentUser?.id)
  const gymMembers = state.users.filter(u => u.gymId === gymId && u.role !== 'coach')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-orange-400" /> Volume Stats
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {isCoach ? 'Total weight lifted across your gym' : 'Your total weight lifted per week'}
        </p>
      </div>

      {isCoach ? (
        <CoachStats members={gymMembers} logs={gymLogs} workouts={gymWorkouts} />
      ) : (
        <MemberStats logs={myLogs} workouts={gymWorkouts} />
      )}
    </div>
  )
}
