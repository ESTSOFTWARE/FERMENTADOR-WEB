import type { SupportSection } from './support-section.types'

export interface SidebarItem {
  id:    SupportSection
  path:  string   // segmento de ruta bajo /support (ej. 'chats', 'usuarios')
  label: string
  icon:  string
}
