import { Plus, Trash2, Link2, GitMerge, X } from 'lucide-react'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const GROUP_STYLES = {
  superset: {
    label: 'Superset',
    border: 'border-blue-500/40',
    headerBg: 'bg-blue-500/10',
    badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    letterBg: 'bg-blue-500',
    divider: 'divide-blue-500/20',
    addText: 'text-blue-400 hover:bg-blue-500/10',
  },
  circuit: {
    label: 'Circuit',
    border: 'border-purple-500/40',
    headerBg: 'bg-purple-500/10',
    badge: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    letterBg: 'bg-purple-500',
    divider: 'divide-purple-500/20',
    addText: 'text-purple-400 hover:bg-purple-500/10',
  },
}

// ─── Utility: group a flat exercises array for display ────────────────────────
export const groupExercises = (exercises = []) => {
  const seen = new Set()
  const result = []
  for (const ex of exercises) {
    if (!ex.groupId) {
      result.push({ kind: 'single', exercise: ex })
    } else if (!seen.has(ex.groupId)) {
      seen.add(ex.groupId)
      result.push({
        kind: ex.groupType || 'superset',
        groupId: ex.groupId,
        exercises: exercises.filter(e => e.groupId === ex.groupId),
      })
    }
  }
  return result
}

// ─── New blank exercise ───────────────────────────────────────────────────────
export const newEx = (extra = {}) => ({
  id: Date.now() + Math.random(),
  name: '',
  sets: '',
  reps: '',
  targetWeight: '',
  setsData: [],       // per-set breakdown: [{ id, reps, weight }]
  demoUrl: '',
  notes: '',
  groupId: null,
  groupType: null,
  ...extra,
})

// ─── New blank set row ────────────────────────────────────────────────────────
const newSetRow = (prev = {}) => ({
  id: Date.now() + Math.random(),
  reps: prev.reps || '',
  weight: prev.weight || '',
})

// ─── Single exercise field block ──────────────────────────────────────────────
function ExerciseFields({ ex, onUpdate, onBatch }) {
  const perSetMode = Array.isArray(ex.setsData) && ex.setsData.length > 0

  // Switch to per-set mode: seed rows from current sets/reps/weight values
  const enablePerSet = () => {
    const count = Math.max(parseInt(ex.sets) || 3, 1)
    const setsData = Array.from({ length: count }, (_, i) =>
      newSetRow({ reps: ex.reps, weight: ex.targetWeight, id: Date.now() + i })
    )
    onUpdate('setsData', setsData)
  }

  // Collapse back to simple mode: take length as sets count, first row as defaults
  const disablePerSet = () => {
    const first = ex.setsData?.[0] || {}
    onBatch({
      setsData: [],
      sets: String(ex.setsData?.length || ''),
      reps: first.reps || '',
      targetWeight: first.weight || '',
    })
  }

  const addSet = () => {
    const prev = ex.setsData || []
    const last = prev[prev.length - 1]
    onUpdate('setsData', [...prev, newSetRow(last)])
  }

  const removeSet = (setId) => {
    const next = (ex.setsData || []).filter(s => s.id !== setId)
    if (next.length === 0) {
      disablePerSet()
    } else {
      onUpdate('setsData', next)
    }
  }

  const updateSet = (setId, field, val) => {
    onUpdate('setsData', (ex.setsData || []).map(s =>
      s.id === setId ? { ...s, [field]: val } : s
    ))
  }

  return (
    <div className="grid grid-cols-2 gap-2">

      {/* Exercise name — always full width */}
      <div className="col-span-2">
        <input
          className="input text-sm"
          placeholder="Exercise Name *"
          value={ex.name}
          onChange={e => onUpdate('name', e.target.value)}
          required
        />
      </div>

      {perSetMode ? (
        /* ── Per-set mode ── */
        <div className="col-span-2 space-y-2">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300">
              {ex.setsData.length} {ex.setsData.length === 1 ? 'Set' : 'Sets'}
            </span>
            <button
              type="button"
              onClick={disablePerSet}
              className="text-[11px] text-gray-500 hover:text-orange-400 transition-colors"
            >
              Switch to simple
            </button>
          </div>

          {/* Column labels */}
          <div className="grid grid-cols-[2.5rem_1fr_1fr_1.5rem] gap-2">
            <div />
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Reps</span>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Weight</span>
            <div />
          </div>

          {/* Set rows */}
          {ex.setsData.map((set, i) => (
            <div key={set.id} className="grid grid-cols-[2.5rem_1fr_1fr_1.5rem] gap-2 items-center">
              <span className="text-xs font-bold text-orange-400 tabular-nums">S{i + 1}</span>
              <input
                className="input text-sm"
                placeholder="e.g. 8-10"
                value={set.reps}
                onChange={e => updateSet(set.id, 'reps', e.target.value)}
              />
              <input
                className="input text-sm"
                placeholder="e.g. 135"
                value={set.weight}
                onChange={e => updateSet(set.id, 'weight', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSet(set.id)}
                className="text-gray-600 hover:text-red-400 transition-colors flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add set */}
          <button
            type="button"
            onClick={addSet}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-400 transition-colors pt-0.5"
          >
            <Plus className="w-3 h-3" /> Add set
          </button>
        </div>
      ) : (
        /* ── Simple mode ── */
        <>
          <input
            className="input text-sm"
            placeholder="Sets"
            type="number"
            min="1"
            value={ex.sets}
            onChange={e => onUpdate('sets', e.target.value)}
          />
          <input
            className="input text-sm"
            placeholder="Reps (e.g. 8-10)"
            value={ex.reps}
            onChange={e => onUpdate('reps', e.target.value)}
          />
          <input
            className="input text-sm"
            placeholder="Target Weight"
            value={ex.targetWeight}
            onChange={e => onUpdate('targetWeight', e.target.value)}
          />
          {/* Set breakdown toggle */}
          <button
            type="button"
            onClick={enablePerSet}
            className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 hover:text-orange-400 border border-dashed border-gray-700 hover:border-orange-500/40 rounded-lg px-2 py-1.5 transition-colors"
          >
            <Plus className="w-3 h-3" /> Set breakdown
          </button>
        </>
      )}

      {/* Demo URL — always full width */}
      <div className="col-span-2">
        <input
          className="input text-sm"
          placeholder="Demo URL"
          value={ex.demoUrl}
          onChange={e => onUpdate('demoUrl', e.target.value)}
        />
      </div>

      {/* Notes — always full width */}
      <div className="col-span-2">
        <textarea
          className="input resize-none text-sm"
          rows={1}
          placeholder="Coach notes..."
          value={ex.notes}
          onChange={e => onUpdate('notes', e.target.value)}
        />
      </div>
    </div>
  )
}

// ─── Main ExerciseBuilder component ──────────────────────────────────────────
export default function ExerciseBuilder({ exercises, setExercises }) {
  const update = (id, field, val) =>
    setExercises(exs => exs.map(e => e.id === id ? { ...e, [field]: val } : e))

  const batch = (id, patch) =>
    setExercises(exs => exs.map(e => e.id === id ? { ...e, ...patch } : e))

  const remove = (id) =>
    setExercises(exs => exs.filter(e => e.id !== id))

  const ungroup = (groupId) =>
    setExercises(exs => exs.map(e =>
      e.groupId === groupId ? { ...e, groupId: null, groupType: null } : e
    ))

  const addToGroup = (groupId, groupType) =>
    setExercises(exs => [...exs, newEx({ groupId, groupType })])

  const addStandalone = () =>
    setExercises(exs => [...exs, newEx()])

  const addSuperset = () => {
    const groupId = 'grp-' + Date.now()
    setExercises(exs => [
      ...exs,
      newEx({ groupId, groupType: 'superset' }),
      newEx({ groupId, groupType: 'superset' }),
    ])
  }

  const addCircuit = () => {
    const groupId = 'grp-' + Date.now()
    setExercises(exs => [
      ...exs,
      newEx({ groupId, groupType: 'circuit' }),
      newEx({ groupId, groupType: 'circuit' }),
      newEx({ groupId, groupType: 'circuit' }),
    ])
  }

  const grouped = groupExercises(exercises)
  let standaloneIdx = 0

  return (
    <div>
      <div className="space-y-3">
        {grouped.map(item => {
          // ── Standalone ──
          if (item.kind === 'single') {
            standaloneIdx++
            const ex = item.exercise
            return (
              <div key={ex.id} className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-orange-400">Exercise {standaloneIdx}</span>
                  {exercises.length > 1 && (
                    <button type="button" onClick={() => remove(ex.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <ExerciseFields
                  ex={ex}
                  onUpdate={(field, val) => update(ex.id, field, val)}
                  onBatch={(patch) => batch(ex.id, patch)}
                />
              </div>
            )
          }

          // ── Superset / Circuit ──
          const style = GROUP_STYLES[item.kind] || GROUP_STYLES.superset
          return (
            <div key={item.groupId}
              className={`rounded-xl border ${style.border} overflow-hidden`}>
              {/* Group header */}
              <div className={`flex items-center justify-between px-3 py-2 ${style.headerBg}`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                  {style.label} · {item.exercises.length} exercises
                </span>
                <button type="button" onClick={() => ungroup(item.groupId)}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1">
                  <X className="w-3 h-3" /> Ungroup
                </button>
              </div>

              {/* Exercises */}
              <div className={`divide-y ${style.divider}`}>
                {item.exercises.map((ex, i) => (
                  <div key={ex.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-5 h-5 rounded-full text-[10px] font-black text-white flex items-center justify-center flex-shrink-0 ${style.letterBg}`}>
                        {LETTERS[i]}
                      </div>
                      {/* Only allow removal if more than min (2 for superset) */}
                      {item.exercises.length > 2 && (
                        <button type="button" onClick={() => remove(ex.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <ExerciseFields
                      ex={ex}
                      onUpdate={(field, val) => update(ex.id, field, val)}
                      onBatch={(patch) => batch(ex.id, patch)}
                    />
                  </div>
                ))}
              </div>

              {/* Add to group */}
              <button type="button" onClick={() => addToGroup(item.groupId, item.kind)}
                className={`w-full py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${style.addText}`}>
                <Plus className="w-3 h-3" />
                Add exercise to {style.label.toLowerCase()}
              </button>
            </div>
          )
        })}
      </div>

      {/* Add row */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <button type="button" onClick={addStandalone}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-400 border border-dashed border-gray-700 hover:border-orange-500/40 rounded-lg px-3 py-1.5 transition-colors">
          <Plus className="w-3 h-3" /> Exercise
        </button>
        <button type="button" onClick={addSuperset}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 border border-dashed border-gray-700 hover:border-blue-500/40 rounded-lg px-3 py-1.5 transition-colors">
          <Link2 className="w-3 h-3" /> Superset
        </button>
        <button type="button" onClick={addCircuit}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-400 border border-dashed border-gray-700 hover:border-purple-500/40 rounded-lg px-3 py-1.5 transition-colors">
          <GitMerge className="w-3 h-3" /> Circuit
        </button>
      </div>
    </div>
  )
}
