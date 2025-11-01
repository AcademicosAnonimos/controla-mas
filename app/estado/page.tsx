'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'

interface Estado {
  id_estado: number
  descripcion: string
}

export default function EstadoPage() {
  const [estados, setEstados] = useState<Estado[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarEstados()
  }, [])

  const cargarEstados = async () => {
    try {
      const response = await fetch('/api/estado')
      const data = await response.json()
      setEstados(data)
    } catch (error) {
      console.error('Error cargando estados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (descripcion: string) => {
    const colores: { [key: string]: string } = {
      'Pendiente': 'bg-warning',
      'Pagada': 'bg-success',
      'Vencida': 'bg-danger'
    }
    return colores[descripcion] || 'bg-secondary'
  }

  const getEstadoIcon = (descripcion: string) => {
    const iconos: { [key: string]: string } = {
      'Pendiente': 'fas fa-clock',
      'Pagada': 'fas fa-check-circle',
      'Vencida': 'fas fa-exclamation-triangle'
    }
    return iconos[descripcion] || 'fas fa-info-circle'
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Estados del Sistema</h1>
              <p className="text-muted">Estados predefinidos para cuotas y pagos</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {estados.map((estado) => (
                    <div key={estado.id_estado} className="col-md-6 col-lg-4 mb-3">
                      <div className="card card-hover">
                        <div className="card-body text-center">
                          <i className={`${getEstadoIcon(estado.descripcion)} fa-2x text-${estado.descripcion === 'Pagada' ? 'success' : estado.descripcion === 'Pendiente' ? 'warning' : 'danger'} mb-3`}></i>
                          <h5 className="card-title">
                            <span className={`badge ${getEstadoBadge(estado.descripcion)}`}>
                              {estado.descripcion}
                            </span>
                          </h5>
                          <p className="card-text text-muted small">
                            {estado.descripcion === 'Pendiente' && 'Cuota/pago pendiente de realizar'}
                            {estado.descripcion === 'Pagada' && 'Cuota/pago completado exitosamente'}
                            {estado.descripcion === 'Vencida' && 'Cuota/pago vencido sin realizar'}
                          </p>
                          <small className="text-muted">ID: {estado.id_estado}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}