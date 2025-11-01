'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [usuario, setUsuario] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const cargarUsuario = async () => {
      const usuarioId = localStorage.getItem('usuarioActual')
      if (usuarioId) {
        try {
          const response = await fetch(`/api/usuarios/${usuarioId}`)
          const data = await response.json()
          setUsuario(data)
        } catch (error) {
          console.error('Error cargando usuario:', error)
        }
      }
    }
    cargarUsuario()
  }, [])

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActual')
    router.push('/')
  }

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <a
          href="/dashboard"
          
          className="navbar-brand fw-bold text-primary d-flex align-items-center"
        >
          <i className="fas fa-chart-line me-2"></i>
          <img
            src="https://i.postimg.cc/D8JMkPxb/Adobe-Express-file.png"
            alt="Controla-Más"
            style={{ height: "28px" }}
          />
        </a>

        <div className="d-flex align-items-center">
          {usuario && (
            <span className="me-3 text-dark">
              <i className="fas fa-user me-1"></i>
              {usuario.nombre}
            </span>
          )}
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={cerrarSesion}
          >
            <i className="fas fa-sign-out-alt me-1"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  )
}