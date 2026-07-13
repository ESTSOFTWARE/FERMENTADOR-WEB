import { useState } from 'react'
import { STICKER_PACKS } from '../../data/stickerPacksData'

interface StickerPickerProps {
  onSelect: (assetUrl: string) => void
}

export const StickerPicker = ({ onSelect }: StickerPickerProps) => {
  const [activePackIdx, setActivePackIdx] = useState(0)
  const pack = STICKER_PACKS[activePackIdx]

  return (
    <div className="flex flex-col" style={{ width: 320, height: 320, background: '#111113', borderRadius: 16, border: '1px solid #2a2a2d', overflow: 'hidden' }}>
      {/* Pack tabs */}
      <div className="flex items-center gap-1 px-2 pt-2 pb-1 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
        {STICKER_PACKS.map((p, i) => (
          <button key={p.identifier}
            onClick={() => setActivePackIdx(i)}
            className="flex-shrink-0 rounded-lg transition-all"
            style={{
              padding: 4,
              background: i === activePackIdx ? 'rgba(34,197,94,0.15)' : 'transparent',
              border: `1px solid ${i === activePackIdx ? 'rgba(34,197,94,0.4)' : 'transparent'}`,
            }}>
            <img src={p.trayImage} alt={p.name} className="w-7 h-7 object-contain rounded" />
          </button>
        ))}
      </div>

      {/* Pack name */}
      <p className="text-[10px] font-semibold px-3 pb-1 flex-shrink-0" style={{ color: '#22c55e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {pack.name}
      </p>

      {/* Sticker grid */}
      <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a2d transparent' }}>
        <div className="grid grid-cols-4 gap-1.5">
          {pack.stickers.map((sticker, idx) => (
            <button key={idx}
              onClick={() => onSelect(sticker.assetUrl)}
              className="aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <img src={sticker.assetUrl} alt={sticker.emojis[0]} className="w-12 h-12 object-contain" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
