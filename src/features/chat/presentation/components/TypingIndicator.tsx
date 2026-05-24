import { BOT_NAME } from '../constants/chat.constants'

export const TypingIndicator = () => (
  <div className="flex gap-3 justify-start">
    <div className="w-7 h-7 flex items-center justify-center shrink-0 overflow-hidden">
      <img src="/assets/logo.svg" alt={BOT_NAME} className="w-7 h-7 object-contain" />
    </div>
    <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
)
