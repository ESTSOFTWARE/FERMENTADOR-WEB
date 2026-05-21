const ease = [0.21, 0.47, 0.32, 0.98] as const

export const pageVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

export const sectionVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export const cardVariants = {
  hidden:   { opacity: 0, y: 16 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}

export const gridVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.07 } },
}
