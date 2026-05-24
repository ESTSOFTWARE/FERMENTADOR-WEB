import type { Group }    from '../../domain/models/Group'
import type { AuthUser } from '../../../auth/domain/models/Auth'

export interface GroupsSliderProps {
  groups:          Group[]
  user:            AuthUser | null
  selected:        Group | null
  onSelect:        (group: Group) => void
  onShowQr:        (group: Group) => void
  onConfirmDelete: (id: number, name: string) => void
}
