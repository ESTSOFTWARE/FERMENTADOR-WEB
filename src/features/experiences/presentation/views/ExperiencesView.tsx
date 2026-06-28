import { ReactLenis } from 'lenis/react'
import Header from '../../../landing/presentation/components/Header'
import Footer from '../../../landing/presentation/components/Footer'
import ExperiencesHero from '../components/ExperiencesHero'
import InnovaSection from '../components/InnovaSection'
import CongresoSection from '../components/CongresoSection'
import CienciasSection from '../components/CienciasSection'

const ExperiencesView = () => {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <Header />

      {/* ── Hero (galería) ── */}
      <ExperiencesHero />

      {/* ── Innova ── */}
      <InnovaSection />

      {/* ── Feria Juventud Chiapaneca ── */}
      <CongresoSection />

      {/* ── Congreso de Ciencias de la Ingeniería y Tecnología ── */}
      <CienciasSection />

      <Footer />
    </ReactLenis>
  )
}

export default ExperiencesView
