import { ANNOUNCEMENT_LABEL_COLORS } from '../constants/announcement-label-colors.constants'

export const labelColor = (l: string): string =>
  ANNOUNCEMENT_LABEL_COLORS[l.toUpperCase()] ?? '#A855F7'
