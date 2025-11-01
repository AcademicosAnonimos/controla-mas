'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import MedioPagoForm from '@/app/components/Forms/MedioPagoForm'
import Footer from '@/app/components/Footer'

interface MedioPago {
  id_medio_pago: number
  medio_pago: string
}

export default function MedioPagoPage() {
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([])
  const [showForm, setShowForm] = useState(false)
  const [medioPagoEdit, setMedioPagoEdit] = useState<MedioPago | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarMediosPago()
  }, [])

  const cargarMediosPago = async () => {
    try {
      const response = await fetch('/api/medio-pago')
      const data = await response.json()
      setMediosPago(data)
    } catch (error) {
      console.error('Error cargando medios de pago:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (medioPago: MedioPago) => {
    setMedioPagoEdit(medioPago)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este medio de pago?')) return

    try {
      const response = await fetch(`/api/medio-pago/${id}`, { method: 'DELETE' })
      if (response.ok) {
        cargarMediosPago()
        alert('Medio de pago eliminado correctamente')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al eliminar medio de pago')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setMedioPagoEdit(null)
    cargarMediosPago()
  }

  // Función para asignar colores fijos basados en el nombre
  const getMedioColor = (medio: string): string => {
    const colores: { [key: string]: string } = {
      'efectivo': '#28a745',    // Verde
      'transferencia': '#17a2b8', // Azul claro
      'credito': '#ffc107',     // Amarillo
      'debito': '#20c997',      // Verde azulado
      'mercadopago': '#009ee3', // Azul MercadoPago
      'paypal': '#003087',      // Azul PayPal
      'bitcoin': '#f7931a',     // Naranja Bitcoin
      'débito': '#20c997',      // Alternativo para débito
      'crédito': '#ffc107',     // Alternativo para crédito
    }
    
    const medioLower = medio.toLowerCase().trim()
    return colores[medioLower] || '#6c757d' // Gris por defecto
  }

  const getMedioIcon = (medio: string) => {
    const iconos: { [key: string]: string } = {
      'efectivo': 'fas fa-money-bill-wave',
      'transferencia': 'fas fa-exchange-alt',
      'credito': 'fas fa-credit-card',
      'debito': 'fas fa-credit-card',
      'mercadopago': 'fas fa-mobile-alt',
      'paypal': 'fab fa-paypal',
      'bitcoin': 'fab fa-bitcoin',
      'débito': 'fas fa-credit-card',
      'crédito': 'fas fa-credit-card'
    }
    
    const medioLower = medio.toLowerCase().trim()
    return iconos[medioLower] || 'fas fa-wallet'
  }

  const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Medios de Pago</h1>
              <p className="text-muted">Gestiona los medios de pago disponibles</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Nuevo Medio de Pago
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
                <div className="row">
                  {mediosPago.map((medio) => {
                    const color = getMedioColor(medio.medio_pago)
                    const textColor = getContrastColor(color)
                    
                    return (
                      <div key={medio.id_medio_pago} className="col-md-6 col-lg-4 mb-3">
                        <div className="card card-hover h-100">
                          <div className="card-body text-center">
                            <i 
                              className={`${getMedioIcon(medio.medio_pago)} fa-3x mb-3`}
                              style={{ color }}
                            ></i>
                            <h5 className="card-title text-capitalize mb-2">
                              {medio.medio_pago}
                            </h5>
                            <div className="mb-3">
                              <span 
                                className="badge"
                                style={{ 
                                  backgroundColor: color,
                                  color: textColor
                                }}
                              >
                                {medio.medio_pago}
                              </span>
                            </div>
                            <p className="card-text text-muted small">
                              {medio.medio_pago.toLowerCase() === 'credito' && 'Pagos con tarjeta de crédito (impacto diferido)'}
                              {medio.medio_pago.toLowerCase() === 'debito' && 'Pagos con tarjeta de débito'}
                              {medio.medio_pago.toLowerCase() === 'efectivo' && 'Pagos en efectivo'}
                              {medio.medio_pago.toLowerCase() === 'transferencia' && 'Transferencias bancarias'}
                              {medio.medio_pago.toLowerCase() === 'mercadopago' && 'Pagos mediante Mercado Pago'}
                              {!['credito', 'debito', 'efectivo', 'transferencia', 'mercadopago'].includes(medio.medio_pago.toLowerCase()) && 
                                'Medio de pago personalizado'
                              }
                            </p>
                            <div className="mt-auto">
                              <small className="text-muted d-block mb-2">
                                ID: {medio.id_medio_pago}
                              </small>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleEdit(medio)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(medio.id_medio_pago)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {mediosPago.length === 0 && !loading && (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-credit-card fa-3x mb-3"></i>
                  <p>No hay medios de pago registrados</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Crear Primer Medio de Pago
                  </button>
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
                      {medioPagoEdit ? 'Editar Medio de Pago' : 'Nuevo Medio de Pago'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowForm(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <MedioPagoForm
                      medioPago={medioPagoEdit}
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