import { useState } from 'react'
import { Plus, X, Flame } from 'lucide-react'

// ─── Common warm-up items with suggested detail ───────────────────────────────
const WARMUP_LIBRARY = [
  // Light Cardio
  { name: 'Treadmill Jog',        detail: '5 min' },
  { name: 'Rowing Machine',        detail: '5 min' },
  { name: 'Assault Bike',          detail: '5 min' },
  { name: 'Jump Rope',             detail: '3 min' },
  { name: 'Jumping Jacks',         detail: '30 reps' },
  { name: 'High Knees',            detail: '30 sec' },
  { name: 'Butt Kicks',            detail: '30 sec' },
  // Mobility
  { name: 'Hip Circles',           detail: '10 each side' },
  { name: 'Arm Circles',           detail: '10 each direction' },
  { name: 'Leg Swings',            detail: '10 each leg' },
  { name: 'Ankle Rotations',       detail: '10 each' },
  { name: 'Thoracic Rotation',     detail: '10 each side' },
  { name: "World's Greatest Stretch", detail: '5 each side' },
  { name: 'Cat-Cow',               detail: '10 reps' },
  { name: 'Hip Flexor Stretch',    detail: '30 sec each side' },
  { name: 'Pigeon Pose',           detail: '30 sec each side' },
  { name: 'Couch Stretch',         detail: '30 sec each side' },
  { name: 'Band Pull-Apart',       detail: '15 reps' },
  // Activation
  { name: 'Glute Bridge',          detail: '15 reps' },
  { name: 'Banded Walk',           detail: '10 steps each way' },
  { name: 'Clamshell',             detail: '15 each side' },
  { name: 'Bird Dog',              detail: '10 each side' },
  { name: 'Dead Bug',              detail: '10 reps' },
  { name: 'Shoulder W / Y / T',   detail: '10 reps each' },
  // Movement Prep
  { name: 'Bodyweight Squat',      detail: '15 reps' },
  { name: 'Goblet Squat',          detail: '10 reps' },
  { name: 'Inch Worm',             detail: '8 reps' },
  { name: 'Spiderman Lunge',       detail: '8 each side' },
  { name: 'Walking Lunge',         detail: '10 each leg' },
  { name: 'Romanian Deadlift',     detail: '10 reps (light)' },
]

// ─── New blank warm-up item ───────────────────────────────────────────────────
export const newWarmupItem = () => ({ id: Math.random(), name: '', detail: '' })

// ─── Highlight matching text ──────────────────────────────────────────────────
function Highlight({ text, query }) {
  if (!query) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <span className="text-orange-400 font-bold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </span>
  )
}

// ─── Single warm-up item row ──────────────────────────────────────────────────
function WarmupRow({ item, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false)

  const matches = item.name.trim().length >= 1
    ? WARMUP_LIBRARY.filter(w => w.name.toLowerCase().includes(item.name.toLowerCase())).slice(0, 6)
    : []

  const handleSelect = (lib) => {
    onUpdate({ ...item, name: lib.name, detail: lib.detail })
    setOpen(false)
  }

  return (
    <div className="flex gap-2 items-start">
      {/* Name with autocomplete */}
      <div className="flex-1 relative">
        <input
          className="input text-sm"
          placeholder="Exercise or stretch name"
          value={item.name}
          onChange={e => { onUpdate({ ...item, name: e.target.value }); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
        />
        {open && matches.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 border border-gray-700 rounded-xl overflow-hidden shadow-2xl"
            style={{ background: '#181818' }}>
            {matches.map(lib => (
              <button
                key={lib.name}
                type="button"
                onMouseDown={() => handleSelect(lib)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700/70 text-left transition-colors border-b border-gray-800 last:border-0 gap-2"
              >
                <span className="text-sm text-white">
                  <Highlight text={lib.name} query={item.name} />
                </span>
                <span className="text-[10px] text-gray-500 flex-shrink-0">{lib.detail}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Duration / reps */}
      <input
        className="input text-sm w-28 flex-shrink-0"
        placeholder="e.g. 5 min"
        value={item.detail}
        onChange={e => onUpdate({ ...item, detail: e.target.value })}
      />

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="text-gray-600 hover:text-red-400 transition-colors mt-2.5 flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── Main WarmupSection ───────────────────────────────────────────────────────
export default function WarmupSection({ warmup, setWarmup }) {
  const [expanded, setExpanded] = useState(false)

  const addItem = () => {
    setWarmup(prev => [...prev, newWarmupItem()])
    setExpanded(true)
  }

  const updateItem = (id, updated) =>
    setWarmup(prev => prev.map(item => item.id === id ? updated : item))

  const removeItem = (id) =>
    setWarmup(prev => prev.filter(item => item.id !== id))

  return (
    <div className="rounded-xl border border-gray-700 overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => {
          if (!expanded && warmup.length === 0) addItem()
          else setExpanded(e => !e)
        }}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/60 hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-gray-200">Warm Up</span>
          {warmup.length > 0 && (
            <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded-full">
              {warmup.length} {warmup.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {expanded ? '▲ Collapse' : warmup.length === 0 ? '+ Add' : '▼ Expand'}
        </span>
      </button>

      {/* Body */}
      {expanded && (
        <div className="p-4 space-y-3 border-t border-gray-700">
          {/* Column labels */}
          {warmup.length > 0 && (
            <div className="flex gap-2 px-0.5">
              <span className="flex-1 text-[10px] text-gray-600 uppercase tracking-wider font-medium">Exercise / Stretch</span>
              <span className="w-28 text-[10px] text-gray-600 uppercase tracking-wider font-medium">Duration / Reps</span>
              <span className="w-3.5" />
            </div>
          )}

          {warmup.map(item => (
            <WarmupRow
              key={item.id}
              item={item}
              onUpdate={(updated) => updateItem(item.id, updated)}
              onRemove={() => removeItem(item.id)}
            />
          ))}

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-400 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add warm-up item
          </button>
        </div>
      )}
    </div>
  )
}
