'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import GastoForm from '@/app/components/Forms/GastoForm'
import Footer from '@/app/components/Footer'

export default function GastosPage() {
  const [gastos, setGastos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [gastoEdit, setGastoEdit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarGastos()
  }, [])

  const cargarGastos = async () => {
    try {
      const usuarioId = localStorage.getItem('usuarioActual')
      const response = await fetch(`/api/gastos?id_usuario=${usuarioId}`)
      const data = await response.json()
      setGastos(data)
    } catch (error) {
      console.error('Error cargando gastos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (gasto: any) => {
    setGastoEdit(gasto)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return

    try {
      const response = await fetch(`/api/gastos/${id}`, { method: 'DELETE' })
      if (response.ok) {
        cargarGastos()
        alert('Gasto eliminado correctamente')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al eliminar gasto')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setGastoEdit(null)
    cargarGastos()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <Header />
          <main className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">Gestión de Gastos</h1>
                <p className="text-muted">Administra tus gastos personales</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <i className="fas fa-plus me-2"></i>Nuevo Gasto
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
                          <th>Tipo</th>
                          <th>Categoría</th>
                          <th>Monto</th>
                          <th>Mes/Año</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gastos.map((gasto: any) => (
                          <tr key={gasto.id_gasto}>
                            <td>{gasto.descripcion}</td>
                            <td>
                              <span className={`badge ${
                                gasto.tipo_gasto === 'Fijo' ? 'bg-primary' :
                                gasto.tipo_gasto === 'Temporal' ? 'bg-warning' :
                                gasto.tipo_gasto === 'Anual' ? 'bg-info' : 'bg-secondary'
                              }`}>
                                {gasto.tipo_gasto}
                              </span>
                            </td>
                            <td>{gasto.categoria}</td>
                            <td>{formatCurrency(gasto.monto_total)}</td>
                            <td>{gasto.mes}/{gasto.año}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" onClick={() => handleEdit(gasto)}>
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-outline-danger" onClick={() => handleDelete(gasto.id_gasto)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {showForm && (
              <div className="modal fade show d-block" tabIndex={-1}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {gastoEdit ? 'Editar Gasto' : 'Nuevo Gasto'}
                      </h5>
                      <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                    </div>
                    <div className="modal-body">
                      <GastoForm
                        gasto={gastoEdit}
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