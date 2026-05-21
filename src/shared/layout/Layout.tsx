import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Lenis from 'lenis'
import Sidebar from './Sidebar'
import ProfileNav from '../components/ProfileNav'
import { useTour } from '../../core/hooks/useTour'

const Layout = () => {
  useTour()

  useEffect(() => {
    const lenis = new Lenis({
      duration:    1.2,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A0A0B' }}>
      <Sidebar />
      <ProfileNav />
      <main className="flex-1 ml-60">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout