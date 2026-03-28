import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: 'coach-1',
    name: 'Coach Mike',
    email: 'coach@ironhub.com',
    phone: '555-000-0001',
    password: 'coach123',
    role: 'coach',
    joinDate: '2024-01-01',
    initials: 'CM',
  },
  {
    id: 'member-1',
    name: 'Alex Rivera',
    email: 'alex@ironhub.com',
    phone: '555-100-0001',
    password: 'member123',
    role: 'member',
    joinDate: '2024-02-10',
    initials: 'AR',
  },
  {
    id: 'member-2',
    name: 'Sarah Kim',
    email: 'sarah@ironhub.com',
    phone: '555-100-0002',
    password: 'member123',
    role: 'member',
    joinDate: '2024-03-05',
    initials: 'SK',
  },
  {
    id: 'member-3',
    name: 'Jordan Hayes',
    email: 'jordan@ironhub.com',
    phone: '555-100-0003',
    password: 'member123',
    role: 'member',
    joinDate: '2024-03-20',
    initials: 'JH',
  },
]

// Returns YYYY-MM-DD for a date offset by `offset` days from Monday of the current week
const getWeekDate = (offset = 0) => {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff + offset)
  return d.toISOString().split('T')[0]
}

const SEED_WORKOUTS = [
  {
    id: 'workout-1',
    title: 'Strength Block',
    date: getWeekDate(0), // Monday
    createdBy: 'coach-1',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        id: 'ex-1',
        name: 'Back Squat',
        sets: 5,
        reps: '5',
        targetWeight: '225 lbs',
        demoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
        notes: 'Focus on depth — break parallel. Rest 3 min between sets.',
      },
      {
        id: 'ex-2',
        name: 'Romanian Deadlift',
        sets: 4,
        reps: '8',
        targetWeight: '185 lbs',
        demoUrl: 'https://www.youtube.com/watch?v=7j-2GmGMqQI',
        notes: 'Keep the bar close to your body. Slight knee bend.',
      },
      {
        id: 'ex-3',
        name: 'Bench Press',
        sets: 4,
        reps: '8',
        targetWeight: '155 lbs',
        demoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
        notes: 'Retract scapula before unracking. Control the descent.',
      },
      {
        id: 'ex-4',
        name: 'Pull-Ups',
        sets: 3,
        reps: '8-10',
        targetWeight: 'Bodyweight',
        demoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
        notes: 'Full range of motion — dead hang to chin over bar.',
      },
    ],
  },
  {
    id: 'workout-2',
    title: 'Conditioning',
    date: getWeekDate(2), // Wednesday
    createdBy: 'coach-1',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        id: 'ex-5',
        name: 'Overhead Press',
        sets: 4,
        reps: '6',
        targetWeight: '95 lbs',
        demoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
        notes: 'Brace your core. Drive the bar straight up.',
      },
      {
        id: 'ex-6',
        name: 'Barbell Row',
        sets: 4,
        reps: '8',
        targetWeight: '155 lbs',
        demoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
        notes: 'Keep your back flat. Pull to your lower chest.',
      },
    ],
  },
  {
    id: 'workout-3',
    title: 'Power Day',
    date: getWeekDate(4), // Friday
    createdBy: 'coach-1',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        id: 'ex-7',
        name: 'Deadlift',
        sets: 5,
        reps: '3',
        targetWeight: '275 lbs',
        demoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
        notes: 'Drive the floor away. Keep lats tight off the floor.',
      },
      {
        id: 'ex-8',
        name: 'Box Jump',
        sets: 4,
        reps: '5',
        targetWeight: 'Bodyweight',
        demoUrl: '',
        notes: 'Full hip extension at the top. Step down, never jump down.',
      },
    ],
  },
]

const SEED_COMMUNITY = [
  {
    id: 'msg-1',
    userId: 'coach-1',
    userName: 'Coach Mike',
    initials: 'CM',
    text: 'Welcome to IronHub! Big week ahead — let\'s get after it 💪',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'msg-2',
    userId: 'member-1',
    userName: 'Alex Rivera',
    initials: 'AR',
    text: 'Let\'s go! Hit a new PR on squats yesterday. Feeling strong this week.',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'msg-3',
    userId: 'member-2',
    userName: 'Sarah Kim',
    initials: 'SK',
    text: 'Same! Those RDLs are humbling me though 😅 Any tips on hip hinge?',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'msg-4',
    userId: 'coach-1',
    userName: 'Coach Mike',
    initials: 'CM',
    text: 'Sarah — think about pushing your hips back to the wall behind you. I\'ll demo before class tomorrow!',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
]

const SEED_LOGS = [
  {
    id: 'log-1',
    userId: 'member-1',
    workoutId: 'workout-1',
    exerciseId: 'ex-1',
    sets: [
      { reps: '5', weight: '225 lbs' },
      { reps: '5', weight: '225 lbs' },
      { reps: '5', weight: '225 lbs' },
      { reps: '5', weight: '215 lbs' },
      { reps: '4', weight: '215 lbs' },
    ],
    notes: 'Felt solid. Last set was tough.',
    date: new Date().toISOString(),
  },
]

// ─── Initial State ────────────────────────────────────────────────────────────
const loadState = () => {
  try {
    const raw = localStorage.getItem('ironhub_state')
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

const getInitialState = () => {
  const saved = loadState()
  if (saved) return saved
  return {
    currentUserId: null,
    users: SEED_USERS,
    workouts: SEED_WORKOUTS,
    workoutLogs: SEED_LOGS,
    communityMessages: SEED_COMMUNITY,
    directMessages: [],
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUserId: action.userId }

    case 'LOGOUT':
      return { ...state, currentUserId: null }

    case 'REGISTER': {
      const newUser = {
        ...action.user,
        id: 'member-' + Date.now(),
        role: 'member',
        joinDate: new Date().toISOString().split('T')[0],
        initials: action.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      }
      return { ...state, users: [...state.users, newUser] }
    }

    case 'UPDATE_PROFILE': {
      const updated = state.users.map(u =>
        u.id === action.userId ? { ...u, ...action.data } : u
      )
      return { ...state, users: updated }
    }

    case 'ADD_WORKOUT': {
      const workout = {
        ...action.workout,
        id: 'workout-' + Date.now(),
        createdBy: state.currentUserId,
        createdAt: new Date().toISOString(),
      }
      return { ...state, workouts: [workout, ...state.workouts] }
    }

    case 'DELETE_WORKOUT':
      return { ...state, workouts: state.workouts.filter(w => w.id !== action.workoutId) }

    case 'LOG_EXERCISE': {
      const existing = state.workoutLogs.find(
        l => l.userId === state.currentUserId &&
             l.workoutId === action.log.workoutId &&
             l.exerciseId === action.log.exerciseId
      )
      if (existing) {
        return {
          ...state,
          workoutLogs: state.workoutLogs.map(l =>
            l.id === existing.id
              ? { ...l, sets: action.log.sets, notes: action.log.notes, date: new Date().toISOString() }
              : l
          ),
        }
      }
      const newLog = {
        id: 'log-' + Date.now(),
        userId: state.currentUserId,
        workoutId: action.log.workoutId,
        exerciseId: action.log.exerciseId,
        sets: action.log.sets,
        notes: action.log.notes,
        date: new Date().toISOString(),
      }
      return { ...state, workoutLogs: [...state.workoutLogs, newLog] }
    }

    case 'SEND_COMMUNITY_MSG': {
      const user = state.users.find(u => u.id === state.currentUserId)
      const msg = {
        id: 'cmsg-' + Date.now(),
        userId: state.currentUserId,
        userName: user.name,
        initials: user.initials,
        text: action.text,
        timestamp: new Date().toISOString(),
      }
      return { ...state, communityMessages: [...state.communityMessages, msg] }
    }

    case 'SEND_DM': {
      const dm = {
        id: 'dm-' + Date.now(),
        fromId: state.currentUserId,
        toId: action.toId,
        text: action.text,
        timestamp: new Date().toISOString(),
        read: false,
      }
      return { ...state, directMessages: [...state.directMessages, dm] }
    }

    case 'MARK_DMS_READ': {
      return {
        ...state,
        directMessages: state.directMessages.map(dm =>
          dm.toId === state.currentUserId && dm.fromId === action.fromId
            ? { ...dm, read: true }
            : dm
        ),
      }
    }

    default:
      return state
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)

  useEffect(() => {
    try {
      localStorage.setItem('ironhub_state', JSON.stringify(state))
    } catch {}
  }, [state])

  const currentUser = state.users.find(u => u.id === state.currentUserId) || null

  return (
    <AppContext.Provider value={{ state, dispatch, currentUser }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
