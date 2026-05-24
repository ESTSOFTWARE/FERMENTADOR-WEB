import type { Group }    from '../../domain/models/Group'
import type { AuthUser } from '../../../auth/domain/models/Auth'

export interface GroupsGridProps {
  groups:          Group[]
  user:            AuthUser | null
  onConfirmDelete: (id: number, name: string) => void
}
