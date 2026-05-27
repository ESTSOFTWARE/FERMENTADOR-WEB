import React, { useState } from 'react'

interface AccordionItemData {
  id: number
  title: string
  imageUrl: string
}

interface AccordionItemProps {
  item: AccordionItemData
  isActive: boolean
  onMouseEnter: () => void
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isActive, onMouseEnter }) => (
  <div
    className={`relative flex-shrink-0 h-[450px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${
      isActive ? 'w-[400px]' : 'w-[60px]'
    }`}
    onMouseEnter={onMouseEnter}
  >
    <img
      src={item.imageUrl}
      alt={item.title}
      className="absolute inset-0 w-full h-full object-cover"
      onError={(e) => {
        const t = e.target as HTMLImageElement
        t.onerror = null
        t.src = 'https://placehold.co/400x450/0a2a15/ffffff?text=Imagen'
      }}
    />
    <div className="absolute inset-0 bg-black/50" />
    <span
      className={`absolute text-white text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${
        isActive
          ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
          : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90'
      }`}
    >
      {item.title}
    </span>
  </div>
)

interface ImageAccordionProps {
  items: AccordionItemData[]
  defaultIndex?: number
}

export const ImageAccordion: React.FC<ImageAccordionProps> = ({ items, defaultIndex = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  return (
    <div className="flex flex-row items-center justify-center gap-3 overflow-x-auto p-2">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  )
}
