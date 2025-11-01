'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import PagoForm from '@/app/components/Forms/PagoForm'
import Footer from '@/app/components/Footer'

export default function PagosPage() {
  const [pagos, setPagos] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarPagos()
  }, [])

  const cargarPagos = async () => {
    try {
      const usuarioId = localStorage.getItem('usuarioActual')
      const response = await fetch(`/api/pagos?id_usuario=${usuarioId}`)
      const data = await response.json()
      setPagos(data)
    } catch (error) {
      console.error('Error cargando pagos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    cargarPagos()
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
              <h1 className="h3 mb-0">Gestión de Pagos</h1>
              <p className="text-muted">Registra y visualiza tus pagos</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <i className="fas fa-plus me-2"></i>Nuevo Pago
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
                        <th>Importe</th>
                        <th>Fecha Pago</th>
                        <th>Medios de Pago</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagos.map((pago: any) => (
                        <tr key={pago.id_pago}>
                          <td>{pago.descripcion_gasto}</td>
                          <td>{formatCurrency(pago.importe_a_pagar)}</td>
                          <td>{formatDate(pago.fecha_pago)}</td>
                          <td>
                            {pago.medios_pago && pago.medios_pago.length > 0 ? (
                              <div>
                                {pago.medios_pago.map((medio: any, index: number) => (
                                  <span key={index} className="badge bg-light text-dark me-1">
                                    {medio.medio_pago}: {formatCurrency(medio.importe_pagado)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">Sin medios registrados</span>
                            )}
                          </td>
                          <td>
                            <button className="btn btn-outline-primary btn-sm">
                              <i className="fas fa-eye"></i>
                            </button>
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
                    <h5 className="modal-title">Registrar Nuevo Pago</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowForm(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <PagoForm
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