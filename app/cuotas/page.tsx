'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'

export default function CuotasPage() {
  const [cuotas, setCuotas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarCuotas()
  }, [])

  const cargarCuotas = async () => {
    try {
      const usuarioId = localStorage.getItem('usuarioActual')
      const response = await fetch(`/api/cuotas?id_usuario=${usuarioId}`)
      const data = await response.json()
      setCuotas(data)
    } catch (error) {
      console.error('Error cargando cuotas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePagarCuota = async (idCuota: number) => {
    if (!confirm('¿Marcar esta cuota como pagada?')) return

    try {
      const response = await fetch('/api/cuotas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cuota: idCuota, accion: 'pagar' })
      })

      if (response.ok) {
        cargarCuotas()
        alert('Cuota marcada como pagada correctamente')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al procesar pago de cuota')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-AR')
  }

  const getEstadoBadge = (estado: string) => {
    const estados: { [key: string]: string } = {
      'Pagada': 'bg-success',
      'Pendiente': 'bg-warning',
      'Vencida': 'bg-danger'
    }
    return estados[estado] || 'bg-secondary'
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Gestión de Cuotas</h1>
              <p className="text-muted">Administra las cuotas de tus gastos temporales</p>
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
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Tipo</th>
                        <th>Cuota</th>
                        <th>Monto Cuota</th>
                        <th>Vencimiento</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cuotas.map((cuota: any) => (
                        <tr key={cuota.id_cuota}>
                          <td>{cuota.descripcion_gasto}</td>
                          <td>
                            <span className="badge bg-info">{cuota.tipo_gasto}</span>
                          </td>
                          <td>{cuota.nro_cuota}/{cuota.total_cuotas}</td>
                          <td>{formatCurrency(cuota.monto_total / cuota.total_cuotas)}</td>
                          <td>{formatDate(cuota.fecha_vencimiento_cuota)}</td>
                          <td>
                            <span className={`badge ${getEstadoBadge(cuota.estado)}`}>
                              {cuota.estado}
                            </span>
                          </td>
                          <td>
                            {cuota.estado === 'Pendiente' && (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handlePagarCuota(cuota.id_cuota)}
                              >
                                <i className="fas fa-check me-1"></i>
                                Pagar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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