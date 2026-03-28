// Filter any collection to items belonging to a specific gym
export const forGym = (collection, gymId) =>
  (collection || []).filter(item => item.gymId === gymId)

// Generate a unique 6-character gym join code (no ambiguous chars 0/O/1/I)
export const generateJoinCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
