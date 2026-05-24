import { LABEL_COLORS } from '../constants/label-colors.constants'

export const labelColor = (label: string): string =>
  LABEL_COLORS[label.toUpperCase()] ?? '#A855F7'
