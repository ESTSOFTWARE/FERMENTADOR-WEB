import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

const AUTO_PLAY_DURATION = 5000

export interface TabItem {
  id: string
  title: string
  description: React.ReactNode
  image: string
}

interface Props {
  tabs: TabItem[]
  heading?: React.ReactNode
  subheading?: React.ReactNode
}

export function VerticalTabs({ tabs, heading, subheading }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection]     = useState(0)
  const [isPaused, setIsPaused]       = useState(false)

  const handleNext = useCallback(() => {
    setDirection(1)
    setActiveIndex(prev => (prev + 1) % tabs.length)
  }, [tabs.length])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex(prev => (prev - 1 + tabs.length) % tabs.length)
  }, [tabs.length])

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    setIsPaused(true)
  }

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(handleNext, AUTO_PLAY_DURATION)
    return () => clearInterval(interval)
  }, [activeIndex, isPaused, handleNext])

  const variants = {
    enter:  (d: number) => ({ y: d > 0 ? '-100%' : '100%', opacity: 0 }),
    center: { zIndex: 1, y: 0, opacity: 1 },
    exit:   (d: number) => ({ zIndex: 0, y: d > 0 ? '100%' : '-100%', opacity: 0 }),
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 xl:px-20 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left column */}
        <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4">
          {(heading || subheading) && (
            <motion.div
              className="space-y-1 mb-12"
              initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {heading && <div className="tracking-tighter text-balance text-3xl font-medium md:text-4xl lg:text-5xl text-white">{heading}</div>}
              {subheading && <span className="text-[10px] font-medium text-white/40 uppercase tracking-[0.3em] block ml-0.5">{subheading}</span>}
            </motion.div>
          )}

          <div className="flex flex-col space-y-0">
            {tabs.map((tab, index) => {
              const isActive = activeIndex === index
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(index)}
                  className={cn(
                    'group relative flex items-start gap-4 py-6 md:py-8 text-left transition-all duration-500 border-t first:border-0',
                    'border-white/10',
                    isActive ? 'text-white' : 'text-white/30 hover:text-white/70',
                  )}
                >
                  {/* progress bar */}
                  <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[2px]" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    {isActive && (
                      <motion.div
                        key={`progress-${index}-${isPaused}`}
                        className="absolute top-0 left-0 w-full origin-top"
                        style={{ background: '#0F8E4D' }}
                        initial={{ height: '0%' }}
                        animate={isPaused ? { height: '0%' } : { height: '100%' }}
                        transition={{ duration: AUTO_PLAY_DURATION / 1000, ease: 'linear' }}
                      />
                    )}
                  </div>

                  <span className="text-[9px] md:text-[10px] font-medium mt-1 tabular-nums opacity-40">/{tab.id}</span>

                  <div className="flex flex-col gap-2 flex-1">
                    <span className={cn(
                      'text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight transition-colors duration-500',
                      isActive ? 'text-white' : '',
                    )}>
                      {tab.title}
                    </span>

                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="text-white/50 text-sm md:text-base font-normal leading-relaxed max-w-sm pb-2">
                            {tab.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right column — image */}
        <div className="lg:col-span-7 flex flex-col justify-end h-full order-1 lg:order-2">
          <div
            className="relative group/gallery"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem]"
              style={{ aspectRatio: '16/11', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y:       { type: 'spring', stiffness: 260, damping: 32 },
                    opacity: { duration: 0.4 },
                  }}
                  className="absolute inset-0 w-full h-full cursor-pointer"
                  onClick={handleNext}
                >
                  <img
                    src={tabs[activeIndex].image}
                    alt={tabs[activeIndex].title}
                    className="w-full h-full object-cover block"
                    style={{ transition: 'transform 700ms', margin: 0, padding: 0 }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />
                </motion.div>
              </AnimatePresence>

              {/* nav buttons */}
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20">
                <button
                  onClick={e => { e.stopPropagation(); handlePrev() }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all active:scale-90"
                  style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', color: '#fff' }}
                  aria-label="Anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleNext() }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all active:scale-90"
                  style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', color: '#fff' }}
                  aria-label="Siguiente"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default VerticalTabs
