import { BOT_NAME } from '../constants/chat.constants'

export const ChatHeader = () => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 flex items-center justify-center overflow-hidden">
      <img src="/assets/logo.svg" alt={BOT_NAME} className="w-9 h-9 object-contain" />
    </div>
    <div>
      <h1 className="text-white font-bold text-base">{BOT_NAME}</h1>
      <p className="text-neutral-500 text-xs">Asistente de fermentación de café · Nich-ká</p>
    </div>
    <div className="ml-auto flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      <span className="text-green-400/70 text-xs">En línea</span>
    </div>
  </div>
)
