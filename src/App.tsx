import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Buscar from './pages/Buscar'
import Evaluar from './pages/Evaluar'
import Tutores from './pages/Tutores'
import PostularseTutor from './pages/PostularseTutor'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        {/* Bottom padding clears the mobile tab bar */}
        <div className="pb-14 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/evaluar" element={<Evaluar />} />
            <Route path="/tutores" element={<Tutores />} />
            <Route path="/tutores/postular" element={<PostularseTutor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
