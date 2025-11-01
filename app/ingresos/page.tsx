'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import IngresoForm from '@/app/components/Forms/IngresoForm'
import Footer from '@/app/components/Footer'

interface Ingreso {
  id_ingreso: number
  descripcion: string
  fecha_ingreso: string
  monto: number
  id_usuario: number
  usuario_nombre?: string
}

export default function IngresosPage() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [showForm, setShowForm] = useState(false)
  const [ingresoEdit, setIngresoEdit] = useState<Ingreso | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarIngresos()
  }, [])

  const cargarIngresos = async () => {
    try {
      const usuarioId = localStorage.getItem('usuarioActual')
      const response = await fetch(`/api/ingresos?id_usuario=${usuarioId}`)
      const data = await response.json()
      setIngresos(data)
    } catch (error) {
      console.error('Error cargando ingresos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ingreso: Ingreso) => {
    setIngresoEdit(ingreso)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este ingreso?')) return

    try {
      const response = await fetch(`/api/ingresos/${id}`, { method: 'DELETE' })
      if (response.ok) {
        cargarIngresos()
        alert('Ingreso eliminado correctamente')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al eliminar ingreso')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setIngresoEdit(null)
    cargarIngresos()
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

  return (
    <div className="d-flex">
      <Sidebar />
      
      <div className="flex-grow-1">
        <Header />
        
        <main className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Gestión de Ingresos</h1>
              <p className="text-muted">Administra tus ingresos personales</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Nuevo Ingreso
            </button>
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
                        <th>Fecha</th>
                        <th>Monto</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingresos.map((ingreso) => (
                        <tr key={ingreso.id_ingreso}>
                          <td>{ingreso.descripcion}</td>
                          <td>{formatDate(ingreso.fecha_ingreso)}</td>
                          <td className="text-success fw-bold">
                            +{formatCurrency(ingreso.monto)}
                          </td>
                          <td>{ingreso.usuario_nombre}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(ingreso)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(ingreso.id_ingreso)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {ingresos.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      <i className="fas fa-money-bill-wave fa-3x mb-3"></i>
                      <p>No hay ingresos registrados</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Registrar Primer Ingreso
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Modal de Formulario */}
          {showForm && (
            <div className="modal fade show d-block" tabIndex={-1}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {ingresoEdit ? 'Editar Ingreso' : 'Nuevo Ingreso'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowForm(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <IngresoForm
                      ingreso={ingresoEdit}
                      onSuccess={handleFormClose}
                      onCancel={() => setShowForm(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}