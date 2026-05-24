export const modalVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
  exit:    { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } },
}
