import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../../shared/layout/Layout'
import DashboardView from '../../features/dashboard/presentation/view/DashboardView'
import ExperimentView from '../../features/dashboard/presentation/view/ExperimentView'
import BestPerGenerationView from '../../features/dashboard/presentation/view/BestPerGenerationView'
import SimulationView from '../../features/dashboard/presentation/view/SimulationView'
import ResultsView from '../../features/dashboard/presentation/view/ResultsView'
import ChartsView from '../../features/dashboard/presentation/view/ChartsView'
import LandingView from '../../features/landing/presentation/views/LandingScreen'
import JoinRedirectView from '../../features/landing/presentation/views/JoinRedirectView'
import PrivacyView from '../../features/landing/presentation/views/PrivacyView'
import TermsView from '../../features/landing/presentation/views/TermsView'
import CookiesView from '../../features/landing/presentation/views/CookiesView'
import HardwareView from '../../features/landing/presentation/views/HardwareView'
import PlanesView from '../../features/landing/presentation/views/PlanesView'
import ConsultoriaView from '../../features/landing/presentation/views/ConsultoriaView'
import MantenimientoView from '../../features/landing/presentation/views/MantenimientoView'
import Login from '../../features/auth/presentation/views/Login'
import ForgotPassword from '../../features/auth/presentation/views/ForgotPassword'
import FermentationView from '../../features/fermentation/presentation/view/FermentationView'
import SensorsView from '../../features/sensors/presentation/view/SensorsView'
import Register from '../../features/auth/presentation/views/Register'
import AuthCallbackView from '../../features/auth/presentation/views/AuthCallbackView'
import ChatView from '../../features/chat/presentation/view/ChatView'
import MessagesView from '../../features/messages/presentation/view/MessagesView'
import OverviewView from '../../features/home/presentation/view/OverviewView'
import EfficiencyCalculatorView from '../../features/efficiency/presentation/view/EfficiencyCalculatorView'
import FermentationReportsView from '../../features/fermentation-reports/presentation/view/FermentationReportsView'
import AddUserView from '../../features/users/presentation/view/AddUserView'
import ManageUsersView from '../../features/users/presentation/view/ManageUsersView'
import ProfileView from '../../features/profile/presentation/view/ProfileView'
import AnnouncementsView from '../../features/announcements/presentation/view/AnnouncementsView'
import GroupsView from '../../features/groups/presentation/view/GroupsView'
import GroupDetailView from '../../features/groups/presentation/view/GroupDetailView'
import AdminGroupsView from '../../features/groups/presentation/view/AdminGroupsView'
import SupportView from '../../features/support/presentation/view/SupportView'
import ProductsView from '../../features/products/presentation/view/ProductsView'
import ComponentsView from '../../features/components/presentation/view/ComponentsView'
import ProductDetailView from '../../features/products/presentation/view/ProductDetailView'
import BillingSuccessView from '../../features/billing/presentation/views/BillingSuccessView'
import { FermentationProvider } from '../../features/fermentation/presentation/context/FermentationProvider'
import PrivateRoute from './PrivateRoute'
import ScrollToTop from './ScrollToTop'
import SessionWatcher from './SessionWatcher'
import PageTitle from './PageTitle'
import NotFoundView from '../../shared/presentation/NotFoundView'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SessionWatcher />
      <PageTitle />
      <Routes>
        <Route path="/"              element={<LandingView />} />
        <Route path="/join"          element={<JoinRedirectView />} />
        <Route path="/privacy"       element={<PrivacyView />} />
        <Route path="/terms"         element={<TermsView />} />
        <Route path="/cookies"       element={<CookiesView />} />
        <Route path="/hardware"      element={<HardwareView />} />
        <Route path="/planes"        element={<PlanesView />} />
        <Route path="/consultoria"   element={<ConsultoriaView />} />
        <Route path="/mantenimiento" element={<MantenimientoView />} />
        <Route path="/products"        element={<ProductsView />} />
        <Route path="/products/:id"    element={<ProductDetailView />} />
        <Route path="/billing/success" element={<BillingSuccessView />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/callback"   element={<AuthCallbackView />} />

        <Route element={<PrivateRoute allowedRoles={['soporte']} />}>
          <Route path="/support" element={<SupportView />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<FermentationProvider><Layout /></FermentationProvider>}>
            <Route path="/overview"              element={<OverviewView />} />
            <Route path="/grafics"               element={<SensorsView />} />
            <Route path="/efficiency-calculator" element={<EfficiencyCalculatorView />} />
            <Route path="/fermentation-reports"  element={<FermentationReportsView />} />
            <Route path="/chat"                  element={<ChatView />} />
            <Route path="/messages"             element={<MessagesView />} />
            <Route path="/announcements"         element={<AnnouncementsView />} />
            <Route path="/profile"               element={<ProfileView />} />

            <Route element={<PrivateRoute allowedRoles={['admin', 'profesor']} />}>
              <Route path="/dashboard"             element={<DashboardView />} />
              <Route path="/experiment/:id"        element={<ExperimentView />} />
              <Route path="/experiment/:id/best-per-generation" element={<BestPerGenerationView />} />
              <Route path="/simulation/:id"        element={<SimulationView />} />
              <Route path="/experiment/:id/charts" element={<ChartsView />} />
              <Route path="/results/:id"           element={<ResultsView />} />
              <Route path="/fermentation"          element={<FermentationView />} />
              <Route path="/users/add"             element={<AddUserView />} />
              <Route path="/users/manage"          element={<ManageUsersView />} />
              <Route path="/groups"                element={<GroupsView />} />
              <Route path="/groups/:id"            element={<GroupDetailView />} />
              <Route path="/admin/groups"          element={<AdminGroupsView />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/components"            element={<ComponentsView />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
