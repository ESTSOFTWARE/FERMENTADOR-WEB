import type { SupportSection } from './support-section.types'

export interface SupportSidebarProps {
  active:   SupportSection
  onChange: (s: SupportSection) => void
}
