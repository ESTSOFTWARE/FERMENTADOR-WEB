export interface ChatInputProps {
  input:        string
  loading:      boolean
  textareaRef:  React.RefObject<HTMLTextAreaElement | null>
  onChange:     (val: string) => void
  onAdjust:     () => void
  onKeyDown:    (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSend:       () => void
}
