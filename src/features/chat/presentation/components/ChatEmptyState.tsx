import { BOT_NAME, SUGGESTIONS } from '../constants/chat.constants'
import type { ChatEmptyStateProps } from '../types/chat-empty-state.types'

export const ChatEmptyState = ({ onSuggestion }: ChatEmptyStateProps) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center py-16">
    <div className="w-16 h-16 flex items-center justify-center">
      <img src="/assets/logo.svg" alt={BOT_NAME} className="w-16 h-16 object-contain" />
    </div>
    <div>
      <p className="text-white font-semibold text-xl">¿En qué te puedo ayudar?</p>
      <p className="text-neutral-500 text-sm mt-1.5 max-w-sm">
        Pregúntame sobre pH, temperatura, perfiles de sabor o el proceso de fermentación de café.
      </p>
    </div>
    <div className="flex flex-wrap gap-2 justify-center">
      {SUGGESTIONS.map(s => (
        <button
          key={s}
          onClick={() => onSuggestion(s)}
          className="px-3 py-2 rounded-lg text-xs text-neutral-400 border border-neutral-800 hover:border-green-500/40 hover:text-green-400 transition-all duration-200 bg-neutral-900/50 text-left"
        >
          {s}
        </button>
      ))}
    </div>
  </div>
)
