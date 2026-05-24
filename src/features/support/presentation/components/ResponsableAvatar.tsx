import { RESPONSABLE_COLOR }    from '../constants/responsable-color.constants'
import { RESPONSABLE_INITIALS } from '../constants/responsable-initials.constants'
import type { Responsable }     from '../types/responsable.types'

interface Props { name: Responsable }

export const ResponsableAvatar = ({ name }: Props) => {
  const color    = RESPONSABLE_COLOR[name]
  const initials = RESPONSABLE_INITIALS[name]
  return (
    <div className="relative group/av flex-shrink-0">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40`, color }}
      >
        {initials}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-white text-[11px] whitespace-nowrap opacity-0 group-hover/av:opacity-100 transition-opacity pointer-events-none z-50">
        {name}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
      </div>
    </div>
  )
}
