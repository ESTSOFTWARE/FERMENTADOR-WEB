export const BUBBLES = Array.from({ length: 18 }, (_, i) => ({
  width:           `${Math.random() * 12 + 4}px`,
  height:          `${Math.random() * 12 + 4}px`,
  left:            `${Math.random() * 100}%`,
  opacity:         Math.random() * 0.4 + 0.1,
  animation:       `bubble ${Math.random() * 6 + 5}s ease-in ${Math.random() * 5}s infinite`,
  backgroundColor: i % 3 === 0 ? '#22C55E' : i % 3 === 1 ? '#16A34A' : '#15803D',
}))
