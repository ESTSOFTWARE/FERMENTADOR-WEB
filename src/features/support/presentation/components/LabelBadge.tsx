import { labelColor } from '../utils/label-color'

const LabelBadge = ({ label }: { label: string }) => {
  const color = labelColor(label)
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
    >
      {label}
    </span>
  )
}

export default LabelBadge
