import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

const Buscar = lazy(() => import('./pages/Buscar'))
const Evaluar = lazy(() => import('./pages/Evaluar'))
const Tutores = lazy(() => import('./pages/Tutores'))
const Instructores = lazy(() => import('./pages/Instructores'))
const InstructorPerfil = lazy(() => import('./pages/InstructorPerfil'))
const Futuro = lazy(() => import('./pages/Futuro'))
const Estudiante = lazy(() => import('./pages/Estudiante'))
const Instructor = lazy(() => import('./pages/Instructor'))
const Perfil = lazy(() => import('./pages/Perfil'))
const Suscripciones = lazy(() => import('./pages/Suscripciones'))
const Chat = lazy(() => import('./pages/Chat'))
const InstructorPremium = lazy(() => import('./pages/InstructorPremium'))
const MisAnuncios = lazy(() => import('./pages/MisAnuncios'))
const InstructorTools = lazy(() => import('./pages/InstructorTools'))
const VidaUniversitaria = lazy(() => import('./pages/VidaUniversitaria'))
const PostularseTutor = lazy(() => import('./pages/PostularseTutor'))
const Login = lazy(() => import('./pages/Login'))
const Registro = lazy(() => import('./pages/Registro'))
const Admin = lazy(() => import('./pages/Admin'))
const RoleSelect = lazy(() => import('./pages/RoleSelect'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        {/* Bottom padding clears the mobile tab bar */}
        <div className="pb-14 md:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buscar" element={<Buscar />} />
              <Route path="/evaluar" element={<Evaluar />} />
              <Route path="/tutores" element={<Tutores />} />
              <Route path="/instructores" element={<Instructores />} />
              <Route path="/instructores/:id" element={<InstructorPerfil />} />
              <Route path="/futuro" element={<Futuro />} />
              <Route path="/estudiante" element={<Estudiante />} />
              <Route path="/instructor" element={<Instructor />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/suscripciones" element={<Suscripciones />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/instructor/premium" element={<InstructorPremium />} />
              <Route path="/instructor/anuncios" element={<MisAnuncios />} />
              <Route path="/instructor/herramientas" element={<InstructorTools />} />
              <Route path="/estudiante/vida-universitaria" element={<VidaUniversitaria />} />
              <Route path="/tutores/postular" element={<PostularseTutor />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/rol" element={<RoleSelect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
