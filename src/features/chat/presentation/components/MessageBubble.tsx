import { BOT_NAME } from '../constants/chat.constants'
import type { MessageBubbleProps } from '../types/message-bubble.types'

export const MessageBubble = ({ message }: MessageBubbleProps) => (
  <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    {message.role === 'model' && (
      <div className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
        <img src="/assets/logo.svg" alt={BOT_NAME} className="w-7 h-7 object-contain" />
      </div>
    )}
    <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
      message.role === 'user'
        ? 'bg-green-500/10 border border-green-500/20 text-white rounded-tr-sm'
        : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-sm'
    }`}>
      {message.text}
    </div>
  </div>
)
