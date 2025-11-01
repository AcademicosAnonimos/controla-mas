'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'

interface ImpactaData {
  id_pago: number
  id_medio_pago: number
  mes: number
  año: number
  medio_pago: string
  descripcion_gasto: string
  importe_a_pagar: number
  fecha_pago: string
  usuario_nombre: string
}

export default function ImpactaPage() {
  const [impactos, setImpactos] = useState<ImpactaData[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroAño, setFiltroAño] = useState('')

  useEffect(() => {
    cargarImpactos()
  }, [])

  const cargarImpactos = async () => {
    try {
      const usuarioId = localStorage.getItem('usuarioActual')
      const response = await fetch(`/api/impacta?id_usuario=${usuarioId}`)
      const data = await response.json()
      setImpactos(data)
    } catch (error) {
      console.error('Error cargando impactos:', error)
    } finally {
      setLoading(false)
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

  const getNombreMes = (mes: number) => {
    return new Date(2000, mes - 1).toLocaleString('es-AR', { month: 'long' })
  }

  // Filtrar impactos
  const impactosFiltrados = impactos.filter(impacto => {
    const cumpleMes = !filtroMes || impacto.mes === parseInt(filtroMes)
    const cumpleAño = !filtroAño || impacto.año === parseInt(filtroAño)
    return cumpleMes && cumpleAño
  })

  // Obtener años y meses únicos para los filtros
  const añosUnicos = Array.from(new Set(impactos.map(i => i.año))).sort((a, b) => b - a)
  const mesesUnicos = Array.from(new Set(impactos.map(i => i.mes))).sort((a, b) => a - b)

  const getResumenPorMes = () => {
    const resumen: { [key: string]: number } = {}
    
    impactosFiltrados.forEach(impacto => {
      const key = `${impacto.mes}/${impacto.año}`
      resumen[key] = (resumen[key] || 0) + impacto.importe_a_pagar
    })
    
    return resumen
  }

  const resumen = getResumenPorMes()

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Impacto de Pagos</h1>
              <p className="text-muted">Pagos que impactan en meses diferentes al original</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="filtroMes" className="form-label">Filtrar por Mes</label>
                  <select
                    id="filtroMes"
                    className="form-select"
                    value={filtroMes}
                    onChange={(e) => setFiltroMes(e.target.value)}
                  >
                    <option value="">Todos los meses</option>
                    {mesesUnicos.map(mes => (
                      <option key={mes} value={mes}>
                        {getNombreMes(mes)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="filtroAño" className="form-label">Filtrar por Año</label>
                  <select
                    id="filtroAño"
                    className="form-select"
                    value={filtroAño}
                    onChange={(e) => setFiltroAño(e.target.value)}
                  >
                    <option value="">Todos los años</option>
                    {añosUnicos.map(año => (
                      <option key={año} value={año}>
                        {año}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setFiltroMes('')
                      setFiltroAño('')
                    }}
                  >
                    <i className="fas fa-times me-2"></i>
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen */}
          {Object.keys(resumen).length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Resumen por Mes de Impacto
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(resumen).map(([mesAño, total]) => {
                    const [mes, año] = mesAño.split('/')
                    return (
                      <div key={mesAño} className="col-md-3 col-sm-6 mb-3">
                        <div className="card bg-light">
                          <div className="card-body text-center p-3">
                            <h6 className="card-title mb-1">
                              {getNombreMes(parseInt(mes))} {año}
                            </h6>
                            <p className="card-text h5 text-danger mb-0">
                              {formatCurrency(total)}
                            </p>
                            <small className="text-muted">Total impactado</small>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tabla de Impactos */}
          <div className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Gasto</th>
                          <th>Medio de Pago</th>
                          <th>Fecha Pago Real</th>
                          <th>Mes/Año Impacto</th>
                          <th>Importe</th>
                          <th>Usuario</th>
                        </tr>
                      </thead>
                      <tbody>
                        {impactosFiltrados.map((impacto, index) => (
                          <tr key={`${impacto.id_pago}-${impacto.id_medio_pago}-${impacto.mes}-${impacto.año}-${index}`}>
                            <td>
                              <div>
                                <strong>{impacto.descripcion_gasto}</strong>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                <i className="fas fa-credit-card me-1"></i>
                                {impacto.medio_pago}
                              </span>
                            </td>
                            <td>{formatDate(impacto.fecha_pago)}</td>
                            <td>
                              <span className="badge bg-warning">
                                {getNombreMes(impacto.mes)} {impacto.año}
                              </span>
                            </td>
                            <td className="text-danger fw-bold">
                              {formatCurrency(impacto.importe_a_pagar)}
                            </td>
                            <td>{impacto.usuario_nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {impactosFiltrados.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      <i className="fas fa-calendar-alt fa-3x mb-3"></i>
                      <p>
                        {impactos.length === 0 
                          ? 'No hay pagos con impacto diferido registrados' 
                          : 'No hay resultados para los filtros aplicados'
                        }
                      </p>
                      {impactos.length === 0 && (
                        <small>
                          Los pagos con tarjeta de crédito aparecerán aquí cuando tengan impacto en meses diferentes
                        </small>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}