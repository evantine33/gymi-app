// Pre-built exercise library with YouTube demo links
// Demo URLs point to YouTube search results so they never go stale

export const CATEGORY_COLORS = {
  Legs:         'bg-green-900/50 text-green-400',
  Back:         'bg-blue-900/50 text-blue-400',
  Chest:        'bg-orange-900/50 text-orange-300',
  Shoulders:    'bg-yellow-900/50 text-yellow-400',
  Arms:         'bg-purple-900/50 text-purple-400',
  Core:         'bg-red-900/50 text-red-400',
  Conditioning: 'bg-cyan-900/50 text-cyan-400',
  Olympic:      'bg-amber-900/50 text-amber-400',
}

export const EXERCISE_LIBRARY = [
  // ── Legs ─────────────────────────────────────────────────────────────────────
  { name: 'Back Squat',           category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=back+squat+proper+form' },
  { name: 'Front Squat',          category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=front+squat+proper+form' },
  { name: 'Goblet Squat',         category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=goblet+squat+proper+form' },
  { name: 'Hack Squat',           category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=hack+squat+proper+form' },
  { name: 'Leg Press',            category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=leg+press+proper+form' },
  { name: 'Romanian Deadlift',    category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=romanian+deadlift+proper+form' },
  { name: 'Sumo Deadlift',        category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=sumo+deadlift+proper+form' },
  { name: 'Bulgarian Split Squat',category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=bulgarian+split+squat+proper+form' },
  { name: 'Walking Lunges',       category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=walking+lunges+proper+form' },
  { name: 'Reverse Lunge',        category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=reverse+lunge+proper+form' },
  { name: 'Leg Curl',             category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=leg+curl+machine+proper+form' },
  { name: 'Leg Extension',        category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=leg+extension+proper+form' },
  { name: 'Hip Thrust',           category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=barbell+hip+thrust+proper+form' },
  { name: 'Glute Bridge',         category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=glute+bridge+proper+form' },
  { name: 'Calf Raise',           category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=calf+raise+proper+form' },
  { name: 'Step Up',              category: 'Legs',         demoUrl: 'https://www.youtube.com/results?search_query=step+up+exercise+proper+form' },

  // ── Back ──────────────────────────────────────────────────────────────────────
  { name: 'Deadlift',             category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=conventional+deadlift+proper+form' },
  { name: 'Pull-Up',              category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=pull+up+proper+form' },
  { name: 'Chin-Up',              category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=chin+up+proper+form' },
  { name: 'Barbell Row',          category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=barbell+row+proper+form' },
  { name: 'Pendlay Row',          category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=pendlay+row+proper+form' },
  { name: 'Lat Pulldown',         category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=lat+pulldown+proper+form' },
  { name: 'Seated Cable Row',     category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=seated+cable+row+proper+form' },
  { name: 'Single Arm Dumbbell Row', category: 'Back',      demoUrl: 'https://www.youtube.com/results?search_query=single+arm+dumbbell+row+proper+form' },
  { name: 'T-Bar Row',            category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=t+bar+row+proper+form' },
  { name: 'Face Pull',            category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=face+pull+proper+form' },
  { name: 'Rack Pull',            category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=rack+pull+proper+form' },
  { name: 'Straight Arm Pulldown',category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=straight+arm+pulldown+proper+form' },
  { name: 'Inverted Row',         category: 'Back',         demoUrl: 'https://www.youtube.com/results?search_query=inverted+row+proper+form' },

  // ── Chest ─────────────────────────────────────────────────────────────────────
  { name: 'Bench Press',          category: 'Chest',        demoUrl: 'https://www.youtube.com/results?search_query=bench+press+proper+form' },
  { name: 'Incline Bench Press',  category: 'Chest',        demoUrl: 'https://www.youtube.com/results?search_query=incline+bench+press+proper+form' },
  { name: 'Decline Bench Press',  category: 'Chest',        demoUrl: 'https://www.youtube.com/results?search_query=decline+bench+press+proper+form' },
  { name: 'Dumbbell Bench Press', category: 'Chest',        demoUrl: 'https://www.youtube.com/results?search_query=dumbbell+bench+press+proper+form' },
  { name: 'Incline Dumbbell Press',category: 'Chest',       demoUrl: 'https://www.youtube.com/results?search_query=incline+dumbbell+press+proper+form' },
  { name: 'Dumbbell Fly',         category: 'Chest',        demoUrl: 'https://www.youtube.com/results?search_query=dumbbell+fly+proper+form' },
  { name: 'Cable Fly',            category: 'Chest',        demoUrl: 'https://www.youtube.com/results?search_query=cable+fly+proper+form' },
  { name: 'Push-Up',              category: 'Chest',        demoUrl: 'https://www.youtube.com/results?search_query=push+up+proper+form' },
  { name: 'Chest Dip',            category: 'Chest',        demoUrl: 'https://www.youtube.com/results?search_query=chest+dip+proper+form' },

  // ── Shoulders ─────────────────────────────────────────────────────────────────
  { name: 'Overhead Press',       category: 'Shoulders',    demoUrl: 'https://www.youtube.com/results?search_query=barbell+overhead+press+proper+form' },
  { name: 'Dumbbell Shoulder Press', category: 'Shoulders', demoUrl: 'https://www.youtube.com/results?search_query=dumbbell+shoulder+press+proper+form' },
  { name: 'Arnold Press',         category: 'Shoulders',    demoUrl: 'https://www.youtube.com/results?search_query=arnold+press+proper+form' },
  { name: 'Lateral Raise',        category: 'Shoulders',    demoUrl: 'https://www.youtube.com/results?search_query=lateral+raise+proper+form' },
  { name: 'Cable Lateral Raise',  category: 'Shoulders',    demoUrl: 'https://www.youtube.com/results?search_query=cable+lateral+raise+proper+form' },
  { name: 'Front Raise',          category: 'Shoulders',    demoUrl: 'https://www.youtube.com/results?search_query=front+raise+proper+form' },
  { name: 'Rear Delt Fly',        category: 'Shoulders',    demoUrl: 'https://www.youtube.com/results?search_query=rear+delt+fly+proper+form' },
  { name: 'Upright Row',          category: 'Shoulders',    demoUrl: 'https://www.youtube.com/results?search_query=upright+row+proper+form' },
  { name: 'Shrug',                category: 'Shoulders',    demoUrl: 'https://www.youtube.com/results?search_query=barbell+shrug+proper+form' },

  // ── Arms ──────────────────────────────────────────────────────────────────────
  { name: 'Barbell Curl',         category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=barbell+curl+proper+form' },
  { name: 'Dumbbell Curl',        category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=dumbbell+bicep+curl+proper+form' },
  { name: 'Hammer Curl',          category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=hammer+curl+proper+form' },
  { name: 'Preacher Curl',        category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=preacher+curl+proper+form' },
  { name: 'Incline Dumbbell Curl',category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=incline+dumbbell+curl+proper+form' },
  { name: 'Cable Curl',           category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=cable+curl+proper+form' },
  { name: 'Tricep Pushdown',      category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=tricep+pushdown+proper+form' },
  { name: 'Skull Crusher',        category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=skull+crusher+proper+form' },
  { name: 'Overhead Tricep Extension', category: 'Arms',    demoUrl: 'https://www.youtube.com/results?search_query=overhead+tricep+extension+proper+form' },
  { name: 'Close Grip Bench Press',category: 'Arms',        demoUrl: 'https://www.youtube.com/results?search_query=close+grip+bench+press+proper+form' },
  { name: 'Tricep Dip',           category: 'Arms',         demoUrl: 'https://www.youtube.com/results?search_query=tricep+dip+proper+form' },

  // ── Core ──────────────────────────────────────────────────────────────────────
  { name: 'Plank',                category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=plank+proper+form' },
  { name: 'Side Plank',           category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=side+plank+proper+form' },
  { name: 'Crunch',               category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=crunch+proper+form' },
  { name: 'Hanging Leg Raise',    category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=hanging+leg+raise+proper+form' },
  { name: 'Cable Crunch',         category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=cable+crunch+proper+form' },
  { name: 'Russian Twist',        category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=russian+twist+proper+form' },
  { name: 'Dead Bug',             category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=dead+bug+exercise+proper+form' },
  { name: 'Ab Rollout',           category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=ab+wheel+rollout+proper+form' },
  { name: 'Pallof Press',         category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=pallof+press+proper+form' },
  { name: 'Toe Touch',            category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=toe+touch+crunch+proper+form' },
  { name: 'Mountain Climber',     category: 'Core',         demoUrl: 'https://www.youtube.com/results?search_query=mountain+climber+exercise+proper+form' },

  // ── Conditioning ──────────────────────────────────────────────────────────────
  { name: 'Box Jump',             category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=box+jump+proper+form' },
  { name: 'Burpee',               category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=burpee+proper+form' },
  { name: 'Kettlebell Swing',     category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=kettlebell+swing+proper+form' },
  { name: 'Battle Ropes',         category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=battle+ropes+workout' },
  { name: 'Sled Push',            category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=sled+push+proper+form' },
  { name: 'Sled Pull',            category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=sled+pull+exercise' },
  { name: 'Assault Bike',         category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=assault+bike+workout' },
  { name: 'Jump Rope',            category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=jump+rope+exercise+form' },
  { name: 'Rowing Machine',       category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=rowing+machine+proper+form' },
  { name: 'Farmer Carry',         category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=farmer+carry+proper+form' },
  { name: 'Medicine Ball Slam',   category: 'Conditioning', demoUrl: 'https://www.youtube.com/results?search_query=medicine+ball+slam+proper+form' },

  // ── Olympic ───────────────────────────────────────────────────────────────────
  { name: 'Power Clean',          category: 'Olympic',      demoUrl: 'https://www.youtube.com/results?search_query=power+clean+proper+form' },
  { name: 'Hang Clean',           category: 'Olympic',      demoUrl: 'https://www.youtube.com/results?search_query=hang+clean+proper+form' },
  { name: 'Clean and Jerk',       category: 'Olympic',      demoUrl: 'https://www.youtube.com/results?search_query=clean+and+jerk+proper+form' },
  { name: 'Snatch',               category: 'Olympic',      demoUrl: 'https://www.youtube.com/results?search_query=snatch+olympic+lift+proper+form' },
  { name: 'Power Snatch',         category: 'Olympic',      demoUrl: 'https://www.youtube.com/results?search_query=power+snatch+proper+form' },
  { name: 'Push Press',           category: 'Olympic',      demoUrl: 'https://www.youtube.com/results?search_query=push+press+proper+form' },
  { name: 'Push Jerk',            category: 'Olympic',      demoUrl: 'https://www.youtube.com/results?search_query=push+jerk+proper+form' },
]
