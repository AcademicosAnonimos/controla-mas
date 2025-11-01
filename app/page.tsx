'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [usuarios, setUsuarios] = useState([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('')
  const router = useRouter()

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('/api/usuarios')
      const data = await response.json()
      setUsuarios(data)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
    }
  }

  const iniciarSesion = () => {
    if (usuarioSeleccionado) {
      localStorage.setItem('usuarioActual', usuarioSeleccionado)
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body p-5 text-center">
          <div className="mb-4">
            <i className="fas fa-chart-line text-primary fa-3x mb-3"></i>
            <h1 className="h3 fw-bold text-primary">Controla Más</h1>
            <p className="text-muted">Gestión Financiera Personal</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="usuario" className="form-label text-start w-100">
              Selecciona tu usuario:
            </label>
            <select
              id="usuario"
              className="form-select"
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un usuario</option>
              {usuarios.map((usuario: any) => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <button
            className="btn btn-primary w-100 py-2"
            onClick={iniciarSesion}
            disabled={!usuarioSeleccionado}
          >
            <i className="fas fa-sign-in-alt me-2"></i>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}