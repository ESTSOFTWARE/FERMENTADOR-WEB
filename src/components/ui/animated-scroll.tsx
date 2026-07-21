import React, { useState, useEffect, useRef, useMemo } from 'react'

export interface ScrollPage {
  leftBgImage?: string | null
  rightBgImage?: string | null
  leftBgVideo?: string | null
  rightBgVideo?: string | null
  leftContent?: { heading: string; description: React.ReactNode } | null
  rightContent?: { heading: string; description: React.ReactNode } | null
  leftBg?: string
  rightBg?: string
}

interface Props {
  pages: ScrollPage[]
}

export default function AnimatedScroll({ pages }: Props) {
  const [currentPage, setCurrentPage] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const numOfPages = pages.length

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return
      const top = wrapperRef.current.offsetTop
      const scrolled = window.scrollY - top
      const vh = window.innerHeight
      const idx = Math.min(numOfPages - 1, Math.max(0, Math.floor(scrolled / vh)))
      setCurrentPage(idx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [numOfPages])

  const renderHalf = (
    side: 'left' | 'right',
    page: ScrollPage,
  ) => {
    const bgVideo = side === 'left' ? page.leftBgVideo : page.rightBgVideo
    const bgImage = side === 'left' ? page.leftBgImage : page.rightBgImage
    const bg      = side === 'left' ? page.leftBg : page.rightBg
    const content = side === 'left' ? page.leftContent : page.rightContent

    return (
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          background: bgVideo
            ? '#000'
            : bgImage
              ? `url(${bgImage}) center/cover no-repeat`
              : (bg ?? '#0A0A0B'),
        }}
      >
        {bgVideo && (
          <video
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {(bgImage || bgVideo) && (
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.52)' }} />
        )}
        <div className="relative flex flex-col items-center justify-center h-full text-white px-4 sm:px-12 py-6 sm:py-10">
          {content && (
            <>
              {content.heading && (
                <h2 className="text-base sm:text-2xl uppercase mb-3 sm:mb-5 text-center font-black tracking-wider">
                  {content.heading}
                </h2>
              )}
              <div className="text-xs sm:text-sm text-center text-white/70 leading-relaxed w-full">
                {content.description}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div ref={wrapperRef} style={{ height: `${(numOfPages + 1) * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-[95%] h-[90vh] overflow-hidden rounded-2xl">

            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!wrapperRef.current) return
                    const top = wrapperRef.current.offsetTop
                    window.scrollTo({ top: top + i * window.innerHeight, behavior: 'smooth' })
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentPage === i ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {pages.map((page, i) => {
              const isActive = currentPage === i

              const leftHasContent = !!(page.leftContent)
              const topSide    = leftHasContent ? 'left' as const : 'right' as const
              const bottomSide = leftHasContent ? 'right' as const : 'left' as const

              const topTrans    = isActive ? 'translateY(0)' : 'translateY(-100%)'
              const bottomTrans = isActive ? 'translateY(0)' : 'translateY(100%)'

              return (
                <div key={i} className={`absolute inset-0 ${isActive ? '' : 'pointer-events-none'}`}>
                  <div
                    className="absolute top-0 left-0 w-full h-1/2 transition-transform duration-[900ms] ease-in-out"
                    style={{ transform: topTrans }}
                  >
                    {renderHalf(topSide, page)}
                  </div>
                  <div
                    className="absolute top-1/2 left-0 w-full h-1/2 transition-transform duration-[900ms] ease-in-out"
                    style={{ transform: bottomTrans }}
                  >
                    {renderHalf(bottomSide, page)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} style={{ height: `${(numOfPages + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="relative w-[90%] h-[90vh] overflow-hidden rounded-2xl">

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!wrapperRef.current) return
                  const top = wrapperRef.current.offsetTop
                  window.scrollTo({ top: top + i * window.innerHeight, behavior: 'smooth' })
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPage === i ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {pages.map((page, i) => {
            const isActive = currentPage === i
            const leftTrans  = isActive ? 'translateY(0)' : 'translateY(100%)'
            const rightTrans = isActive ? 'translateY(0)' : 'translateY(-100%)'

            return (
              <div key={i} className={`absolute inset-0 ${isActive ? '' : 'pointer-events-none'}`}>
                <div
                  className="absolute top-0 left-0 w-1/2 h-full transition-transform duration-[900ms] ease-in-out"
                  style={{ transform: leftTrans }}
                >
                  {renderHalf('left', page)}
                </div>
                <div
                  className="absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-[900ms] ease-in-out"
                  style={{ transform: rightTrans }}
                >
                  {renderHalf('right', page)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
