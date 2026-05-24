import type { ChatInputProps } from '../types/chat-input.types'

export const ChatInput = ({ input, loading, textareaRef, onChange, onAdjust, onKeyDown, onSend }: ChatInputProps) => (
  <div className="shrink-0 px-8 pb-6 pt-3 border-t border-neutral-900">
    <div className="flex gap-3 items-end rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 focus-within:border-green-500/40 transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={e => { onChange(e.target.value); onAdjust() }}
        onKeyDown={onKeyDown}
        placeholder="Escribe tu pregunta... (Enter para enviar)"
        rows={1}
        className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none resize-none leading-relaxed"
        style={{ minHeight: '24px', maxHeight: '160px' }}
      />
      <button
        onClick={onSend}
        disabled={!input.trim() || loading}
        className="shrink-0 w-8 h-8 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </div>
    <p className="text-neutral-700 text-[10px] mt-2 text-center">
      Shift+Enter para salto de línea · Solo responde temas de fermentación de café
    </p>
  </div>
)
