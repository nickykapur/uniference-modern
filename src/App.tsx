import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Buscar from './pages/Buscar'
import Evaluar from './pages/Evaluar'
import Tutores from './pages/Tutores'
import PostularseTutor from './pages/PostularseTutor'
import Login from './pages/Login'
import Registro from './pages/Registro'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/evaluar" element={<Evaluar />} />
          <Route path="/tutores" element={<Tutores />} />
          <Route path="/tutores/postular" element={<PostularseTutor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
