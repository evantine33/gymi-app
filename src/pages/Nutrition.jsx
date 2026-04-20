import { useState, useMemo, useRef } from 'react'
import { useApp } from '../context/AppContext'
import {
  ChevronLeft, ChevronRight, Plus, X, Trash2, Camera,
  Settings, Loader2, CheckCircle, AlertCircle, Edit2,
} from 'lucide-react'

const TODAY = new Date().toISOString().split('T')[0]

const MEALS = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { key: 'lunch',     label: 'Lunch',     emoji: '☀️' },
  { key: 'dinner',    label: 'Dinner',    emoji: '🌙' },
  { key: 'snack',     label: 'Snacks',    emoji: '🍎' },
]

const DEFAULT_GOALS = { calories: 2000, protein: 150, carbs: 200, fat: 65, fiber: 25 }

const GOAL_PRESETS = [
  { label: 'Weight Loss',   calories: 1600, protein: 140, carbs: 140, fat: 55,  fiber: 30 },
  { label: 'Maintenance',   calories: 2000, protein: 150, carbs: 200, fat: 65,  fiber: 25 },
  { label: 'Muscle Gain',   calories: 2600, protein: 200, carbs: 280, fat: 75,  fiber: 30 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const diff = Math.round((new Date(TODAY + 'T12:00:00') - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff === -1) return 'Tomorrow'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// compress image to base64, max 800px
async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const maxDim = 800
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round((height / width) * maxDim); width = maxDim }
        else { width = Math.round((width / height) * maxDim); height = maxDim }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const b64 = reader.result.split(',')[1]
          URL.revokeObjectURL(url)
          resolve({ base64: b64, mediaType: 'image/jpeg', dataUrl: reader.result })
        }
        reader.readAsDataURL(blob)
      }, 'image/jpeg', 0.75)
    }
    img.src = url
  })
}

// ─── Macro Ring ───────────────────────────────────────────────────────────────
function CalorieRing({ consumed, goal }) {
  const pct = Math.min(consumed / (goal || 1), 1)
  const R = 72, C = 2 * Math.PI * R
  const remaining = Math.max(goal - consumed, 0)
  const over = consumed > goal

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="176" height="176" viewBox="0 0 176 176">
          <circle cx="88" cy="88" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
          <circle
            cx="88" cy="88" r={R} fill="none"
            stroke={over ? '#ef4444' : '#f97316'}
            strokeWidth="12" strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C - pct * C}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="text-center z-10">
          <div className="text-3xl font-black tracking-tight">{consumed.toLocaleString()}</div>
          <div className="text-xs text-gray-500 font-medium mt-0.5">of {goal.toLocaleString()} cal</div>
          <div className={`text-xs font-bold mt-1 ${over ? 'text-red-400' : 'text-orange-400'}`}>
            {over ? `${(consumed - goal).toLocaleString()} over` : `${remaining.toLocaleString()} left`}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Macro Bar ────────────────────────────────────────────────────────────────
function MacroBar({ label, consumed, goal, color }) {
  const pct = Math.min((consumed / (goal || 1)) * 100, 100)
  const over = consumed > goal
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
        <span className="text-xs font-bold text-white">
          {consumed}g <span className="text-gray-600 font-normal">/ {goal}g</span>
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: over ? '#ef4444' : color }}
        />
      </div>
    </div>
  )
}

// ─── Log Entry Row ────────────────────────────────────────────────────────────
function LogRow({ log, onDelete }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{log.foodName}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          P {log.protein}g &nbsp;·&nbsp; C {log.carbs}g &nbsp;·&nbsp; F {log.fat}g
          {log.fiber > 0 ? ` · Fi ${log.fiber}g` : ''}
        </p>
      </div>
      <div className="flex items-center gap-3 ml-3 flex-shrink-0">
        <span className="text-sm font-bold text-orange-400">{log.calories} cal</span>
        <button
          onClick={() => onDelete(log.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Add Food Modal ───────────────────────────────────────────────────────────
function AddFoodModal({ meal, date, onClose, onSave }) {
  const [tab, setTab] = useState('manual')
  const [form, setForm] = useState({ foodName: '', calories: '', protein: '', carbs: '', fat: '', fiber: '' })
  const [photoState, setPhotoState] = useState('idle') // idle | loading | done | error
  const [photoError, setPhotoError] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileRef = useRef()

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoState('loading')
    setPhotoError('')
    try {
      const { base64, mediaType, dataUrl } = await compressImage(file)
      setPhotoPreview(dataUrl)

      const res = await fetch('/.netlify/functions/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setForm({
        foodName: data.foodName || 'Meal from photo',
        calories: String(Math.round(data.calories || 0)),
        protein:  String(Math.round(data.protein  || 0)),
        carbs:    String(Math.round(data.carbs    || 0)),
        fat:      String(Math.round(data.fat      || 0)),
        fiber:    String(Math.round(data.fiber    || 0)),
      })
      setPhotoState('done')
      setTab('manual') // switch to manual tab to let them review/edit
    } catch (err) {
      setPhotoError(err.message || 'Could not analyze photo. Please fill in manually.')
      setPhotoState('error')
    }
  }

  const canSave = form.foodName.trim() && form.calories && !isNaN(Number(form.calories))

  const handleSave = () => {
    onSave({
      meal,
      foodName: form.foodName.trim(),
      calories: Number(form.calories) || 0,
      protein:  Number(form.protein)  || 0,
      carbs:    Number(form.carbs)    || 0,
      fat:      Number(form.fat)      || 0,
      fiber:    Number(form.fiber)    || 0,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-gray-900 border border-gray-800 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h3 className="font-black text-white text-base">
            Add Food — {MEALS.find(m => m.key === meal)?.label}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {['manual', 'photo'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors capitalize ${
                tab === t ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500'
              }`}
            >
              {t === 'photo' ? '📸 Scan Food' : '✏️ Manual Entry'}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* PHOTO TAB */}
          {tab === 'photo' && (
            <div className="space-y-4">
              {photoPreview && (
                <img src={photoPreview} alt="Food preview" className="w-full h-48 object-cover rounded-xl" />
              )}
              {photoState === 'loading' && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                  <p className="text-sm text-gray-400">Analyzing your meal with AI…</p>
                </div>
              )}
              {photoState === 'done' && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-400 font-medium">Macros estimated! Review and save below.</p>
                </div>
              )}
              {photoState === 'error' && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{photoError}</p>
                </div>
              )}
              {(photoState === 'idle' || photoState === 'error') && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-dashed border-gray-700 hover:border-orange-500/50 rounded-xl py-10 transition-all"
                >
                  <Camera className="w-8 h-8 text-gray-500" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-300">Take a photo of your plate</p>
                    <p className="text-xs text-gray-500 mt-1">AI will estimate your macros automatically</p>
                  </div>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
            </div>
          )}

          {/* MANUAL TAB */}
          {tab === 'manual' && (
            <div className="space-y-3">
              {photoState === 'done' && (
                <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-xl px-3 py-2">
                  <Edit2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <p className="text-xs text-orange-400 font-medium">AI estimates pre-filled — edit if needed</p>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Food Name</label>
                <input
                  className="input"
                  placeholder="e.g. Grilled chicken with rice"
                  value={form.foodName}
                  onChange={e => setF('foodName', e.target.value)}
                  autoFocus={tab === 'manual' && photoState === 'idle'}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Calories</label>
                  <input className="input" type="number" placeholder="0" value={form.calories} onChange={e => setF('calories', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Protein (g)</label>
                  <input className="input" type="number" placeholder="0" value={form.protein} onChange={e => setF('protein', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Carbs (g)</label>
                  <input className="input" type="number" placeholder="0" value={form.carbs} onChange={e => setF('carbs', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Fat (g)</label>
                  <input className="input" type="number" placeholder="0" value={form.fat} onChange={e => setF('fat', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Fiber (g)</label>
                  <input className="input" type="number" placeholder="0" value={form.fiber} onChange={e => setF('fiber', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="btn-primary w-full mt-2"
          >
            Add to {MEALS.find(m => m.key === meal)?.label}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Goals Modal ──────────────────────────────────────────────────────────────
function GoalsModal({ goals, onClose, onSave }) {
  const [form, setForm] = useState({ ...goals })
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-gray-900 border border-gray-800 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h3 className="font-black text-white text-base">Daily Goals</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* Presets */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Presets</p>
            <div className="grid grid-cols-3 gap-2">
              {GOAL_PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => setForm({ calories: p.calories, protein: p.protein, carbs: p.carbs, fat: p.fat, fiber: p.fiber })}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500/50 rounded-xl py-3 text-xs font-semibold text-gray-300 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual inputs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: 'calories', label: 'Calories',  unit: 'cal' },
              { k: 'protein',  label: 'Protein',   unit: 'g' },
              { k: 'carbs',    label: 'Carbs',     unit: 'g' },
              { k: 'fat',      label: 'Fat',       unit: 'g' },
              { k: 'fiber',    label: 'Fiber',     unit: 'g' },
            ].map(({ k, label, unit }) => (
              <div key={k}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
                  {label} ({unit})
                </label>
                <input
                  className="input"
                  type="number"
                  value={form[k]}
                  onChange={e => setF(k, Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => { onSave(form); onClose() }}
            className="btn-primary w-full"
          >
            Save Goals
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Nutrition() {
  const { state, dispatch } = useApp()
  const [date, setDate] = useState(TODAY)
  const [addModal, setAddModal] = useState(null)   // meal key or null
  const [goalsOpen, setGoalsOpen] = useState(false)

  const currentUser = state.users.find(u => u.id === state.currentUserId)
  const goals = state.nutritionGoals || DEFAULT_GOALS

  // Logs for the selected date belonging to this user
  const dayLogs = useMemo(() =>
    (state.nutritionLogs || []).filter(l => l.userId === state.currentUserId && l.date === date),
    [state.nutritionLogs, state.currentUserId, date]
  )

  // Totals
  const totals = useMemo(() => dayLogs.reduce(
    (acc, l) => ({
      calories: acc.calories + (l.calories || 0),
      protein:  acc.protein  + (l.protein  || 0),
      carbs:    acc.carbs    + (l.carbs    || 0),
      fat:      acc.fat      + (l.fat      || 0),
      fiber:    acc.fiber    + (l.fiber    || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  ), [dayLogs])

  const handleAdd = (data) => {
    dispatch({ type: 'ADD_NUTRITION_LOG', log: { ...data, date } })
  }

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_NUTRITION_LOG', logId: id })
  }

  const handleSaveGoals = (g) => {
    dispatch({ type: 'SET_NUTRITION_GOALS', goals: g })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black tracking-tight">Nutrition</h1>
          <button
            onClick={() => setGoalsOpen(true)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5"
          >
            <Settings className="w-4 h-4" />
            Goals
          </button>
        </div>

        {/* Date nav */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setDate(d => addDays(d, -1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-base font-bold min-w-[120px] text-center">{fmtDate(date)}</span>
          <button
            onClick={() => setDate(d => addDays(d, 1))}
            disabled={date >= TODAY}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-600 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5 max-w-lg mx-auto">
        {/* Summary Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-center mb-5">
            <CalorieRing consumed={totals.calories} goal={goals.calories} />
          </div>
          <div className="space-y-3">
            <MacroBar label="Protein" consumed={totals.protein} goal={goals.protein} color="#3b82f6" />
            <MacroBar label="Carbs"   consumed={totals.carbs}   goal={goals.carbs}   color="#f59e0b" />
            <MacroBar label="Fat"     consumed={totals.fat}     goal={goals.fat}     color="#a855f7" />
            <MacroBar label="Fiber"   consumed={totals.fiber}   goal={goals.fiber}   color="#22c55e" />
          </div>
        </div>

        {/* Meal sections */}
        {MEALS.map(meal => {
          const mealLogs = dayLogs.filter(l => l.meal === meal.key)
          const mealCals = mealLogs.reduce((s, l) => s + (l.calories || 0), 0)
          return (
            <div key={meal.key} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Meal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meal.emoji}</span>
                  <span className="font-bold text-sm">{meal.label}</span>
                  {mealCals > 0 && (
                    <span className="text-xs text-gray-500 font-medium">{mealCals} cal</span>
                  )}
                </div>
                <button
                  onClick={() => setAddModal(meal.key)}
                  className="flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg px-2.5 py-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Log entries */}
              <div className="px-4">
                {mealLogs.length === 0 ? (
                  <p className="text-xs text-gray-600 py-4 text-center">Nothing logged yet</p>
                ) : (
                  mealLogs.map(log => (
                    <LogRow key={log.id} log={log} onDelete={handleDelete} />
                  ))
                )}
              </div>
            </div>
          )
        })}

        {/* Scan Food floating shortcut */}
        <button
          onClick={() => setAddModal('snack')}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-2xl py-4 transition-colors"
        >
          <Camera className="w-5 h-5" />
          Scan Food with AI
        </button>

        {/* Daily summary totals row */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Protein', val: totals.protein, unit: 'g', color: '#3b82f6' },
            { label: 'Carbs',   val: totals.carbs,   unit: 'g', color: '#f59e0b' },
            { label: 'Fat',     val: totals.fat,     unit: 'g', color: '#a855f7' },
            { label: 'Fiber',   val: totals.fiber,   unit: 'g', color: '#22c55e' },
          ].map(({ label, val, unit, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-3 text-center">
              <div className="text-base font-black" style={{ color }}>{val}{unit}</div>
              <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {addModal && (
        <AddFoodModal
          meal={addModal}
          date={date}
          onClose={() => setAddModal(null)}
          onSave={handleAdd}
        />
      )}
      {goalsOpen && (
        <GoalsModal
          goals={goals}
          onClose={() => setGoalsOpen(false)}
          onSave={handleSaveGoals}
        />
      )}
    </div>
  )
}
