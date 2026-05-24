import { useState }           from 'react'
import SupportSidebar         from '../components/SupportSidebar'
import TicketsPanel           from '../components/TicketsPanel'
import ClientsPanel           from '../components/ClientsPanel'
import FermentadoresPanel     from '../components/FermentadoresPanel'
import NotificacionesPanel    from '../components/NotificacionesPanel'
import AnunciosPanel          from '../components/AnunciosPanel'
import ProfilePanel           from '../components/ProfilePanel'
import type { SupportSection } from '../types/support-section.types'

export type { SupportSection }

const SupportView = () => {
  const [section, setSection] = useState<SupportSection>('tickets')

  return (
    <div className="flex h-screen bg-[#0A0A0B] overflow-hidden">
      <SupportSidebar active={section} onChange={setSection} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {section === 'tickets'        && <TicketsPanel />}
        {section === 'clients'        && <ClientsPanel />}
        {section === 'fermentadores'  && <FermentadoresPanel />}
        {section === 'notificaciones' && <NotificacionesPanel />}
        {section === 'anuncios'       && <AnunciosPanel />}
        {section === 'perfil'         && <ProfilePanel />}
      </main>
    </div>
  )
}

export default SupportView
