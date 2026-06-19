import React, { useState, useEffect, useRef } from 'react'

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

  return (
    <div ref={wrapperRef} style={{ height: `${(numOfPages + 1) * 100}vh` }}>
      {/* inner pegado, centrado al 90% con rounded */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
      <div className="relative w-[90%] h-[90vh] overflow-hidden rounded-2xl">

        {/* pagination dots — dentro del contenedor 90% */}
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
              {/* Left Half */}
              <div
                className="absolute top-0 left-0 w-1/2 h-full transition-transform duration-[900ms] ease-in-out"
                style={{ transform: leftTrans }}
              >
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    background: page.leftBgVideo
                      ? '#000'
                      : page.leftBgImage
                        ? `url(${page.leftBgImage}) center/cover no-repeat`
                        : (page.leftBg ?? '#0A0A0B'),
                  }}
                >
                  {page.leftBgVideo && (
                    <video
                      src={page.leftBgVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {(page.leftBgImage || page.leftBgVideo) && (
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.52)' }} />
                  )}
                  <div className="relative flex flex-col items-center justify-center h-full text-white px-12 py-10">
                    {page.leftContent && (
                      <>
                        {page.leftContent.heading && (
                          <h2 className="text-2xl uppercase mb-5 text-center font-black tracking-wider">
                            {page.leftContent.heading}
                          </h2>
                        )}
                        <div className="text-sm text-center text-white/70 leading-relaxed w-full">
                          {page.leftContent.description}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Half */}
              <div
                className="absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-[900ms] ease-in-out"
                style={{ transform: rightTrans }}
              >
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    background: page.rightBgVideo
                      ? '#000'
                      : page.rightBgImage
                        ? `url(${page.rightBgImage}) center/cover no-repeat`
                        : (page.rightBg ?? '#0A0A0B'),
                  }}
                >
                  {page.rightBgVideo && (
                    <video
                      src={page.rightBgVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {(page.rightBgImage || page.rightBgVideo) && (
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.52)' }} />
                  )}
                  <div className="relative flex flex-col items-center justify-center h-full text-white px-12 py-10">
                    {page.rightContent && (
                      <>
                        {page.rightContent.heading && (
                          <h2 className="text-2xl uppercase mb-5 text-center font-black tracking-wider">
                            {page.rightContent.heading}
                          </h2>
                        )}
                        <div className="text-sm text-center text-white/70 leading-relaxed w-full">
                          {page.rightContent.description}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
