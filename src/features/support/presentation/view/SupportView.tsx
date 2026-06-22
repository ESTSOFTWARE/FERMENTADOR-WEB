import { Routes, Route, Navigate } from 'react-router-dom'
import SupportSidebar         from '../components/SupportSidebar'
import TicketsPanel           from '../components/TicketsPanel'
import ClientsPanel           from '../components/ClientsPanel'
import FermentadoresPanel     from '../components/FermentadoresPanel'
import ComponentsPanel        from '../components/ComponentsPanel'
import NotificacionesPanel    from '../components/NotificacionesPanel'
import AnunciosPanel          from '../components/AnunciosPanel'
import ProfilePanel           from '../components/ProfilePanel'

// Layout del dashboard de soporte: sidebar fijo + una ruta por vista bajo /support/*.
const SupportView = () => (
  <div className="flex h-screen bg-[#0A0A0B] overflow-hidden">
    <SupportSidebar />
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Routes>
        <Route index                  element={<Navigate to="chats" replace />} />
        <Route path="chats"           element={<TicketsPanel />} />
        <Route path="usuarios"        element={<ClientsPanel />} />
        <Route path="fermentadores"   element={<FermentadoresPanel />} />
        <Route path="componentes"     element={<ComponentsPanel />} />
        <Route path="notificaciones"  element={<NotificacionesPanel />} />
        <Route path="comunicados"     element={<AnunciosPanel />} />
        <Route path="perfil"          element={<ProfilePanel />} />
        <Route path="*"               element={<Navigate to="chats" replace />} />
      </Routes>
    </main>
  </div>
)

export default SupportView
