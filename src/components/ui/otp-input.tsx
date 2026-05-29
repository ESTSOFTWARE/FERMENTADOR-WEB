import { cn } from '../../lib/utils'
import { OTPInput, type SlotProps } from 'input-otp'

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'flex size-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 font-mono text-lg font-semibold text-white shadow-sm transition-all duration-150',
        props.isActive && 'border-green-500/60 ring-[3px] ring-green-500/20 z-10',
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.char === null && props.isActive && (
        <div className="w-px h-5 bg-white animate-pulse" />
      )}
    </div>
  )
}

interface OtpInputProps {
  value: string
  onChange: (val: string) => void
  length?: number
  disabled?: boolean
}

export function OtpInput({ value, onChange, length = 6, disabled }: OtpInputProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={length}
      disabled={disabled}
      containerClassName="flex items-center gap-2 has-[:disabled]:opacity-50"
      render={({ slots }) => (
        <div className="flex gap-2">
          {slots.map((slot, idx) => (
            <Slot key={idx} {...slot} />
          ))}
        </div>
      )}
    />
  )
}
