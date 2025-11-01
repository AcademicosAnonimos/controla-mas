'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'

interface HistorialPrediccion {
  id_historial: number
  id_categoria: number
  mes: number
  año: number
  monto_predicho: string  // CAMBIADO: de number a string
  categoria: string
  nombre_mes: string
}

export default function HistorialPrediccionPage() {
  const [historial, setHistorial] = useState<HistorialPrediccion[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroAño, setFiltroAño] = useState('')

  useEffect(() => {
    cargarHistorial()
  }, [filtroMes, filtroAño])

  const cargarHistorial = async () => {
    try {
      const usuarioId = localStorage.getItem('usuarioActual')
      let url = `/api/historial-prediccion?id_usuario=${usuarioId}`
      
      if (filtroMes) url += `&mes=${filtroMes}`
      if (filtroAño) url += `&año=${filtroAño}`

      const response = await fetch(url)
      const data = await response.json()
      //console.log('🔍 Datos recibidos del API:', data) // Para debug
      setHistorial(data)
    } catch (error) {
      console.error('Error cargando historial de predicción:', error)
    } finally {
      setLoading(false)
    }
  }

  // FUNCIÓN CORREGIDA: Convertir string a número de forma segura
  const parseMontoPredicho = (monto: string): number => {
    if (!monto) return 0
    const parsed = parseFloat(monto)
    return isNaN(parsed) ? 0 : parsed
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  // Obtener años y meses únicos para los filtros
  const añosUnicos = Array.from(new Set(historial.map(h => h.año))).sort((a, b) => b - a)
  const mesesUnicos = Array.from(new Set(historial.map(h => h.mes))).sort((a, b) => a - b)

  // CORREGIDO: Agrupar datos por mes y año para resumen
  const datosAgrupados = historial.reduce((acc, item) => {
    const key = `${item.año}-${item.mes}`
    if (!acc[key]) {
      acc[key] = {
        año: item.año,
        mes: item.mes,
        nombre_mes: item.nombre_mes,
        total_predicho: 0,
        categorias: []
      }
    }
    // CORRECCIÓN: Convertir string a número antes de sumar
    const montoNumerico = parseMontoPredicho(item.monto_predicho)
    acc[key].total_predicho += montoNumerico
    acc[key].categorias.push(item)
    return acc
  }, {} as any)

  const resumenMensual = Object.values(datosAgrupados).sort((a: any, b: any) => {
    if (a.año !== b.año) return b.año - a.año
    return b.mes - a.mes
  })

  // Debug temporal para verificar los cálculos
  /*
  useEffect(() => {
    if (historial.length > 0) {
      console.log('🔍 DEBUG - Primer registro:', historial[0])
      console.log('🔍 DEBUG - Tipo de monto_predicho:', typeof historial[0].monto_predicho)
      console.log('🔍 DEBUG - Valor de monto_predicho:', historial[0].monto_predicho)
      console.log('🔍 DEBUG - Convertido a número:', parseMontoPredicho(historial[0].monto_predicho))
      console.log('🔍 DEBUG - Resumen mensual calculado:', resumenMensual)
    }
  }, [historial])
  */
  
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Historial de Predicciones</h1>
              <p className="text-muted">Análisis de tendencias de gastos por categoría</p>
            </div>
          </div>

          {/* Información para el usuario */}
          <div className="card bg-light border-0 mb-4">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-chart-line text-primary me-2"></i>
                ¿Qué es el Historial de Predicciones?
              </h5>
              <p className="card-text">
                Esta sección muestra <strong>patrones históricos de tus gastos</strong> organizados por categoría. 
                El sistema analiza automáticamente tus gastos pasados para predecir tendencias futuras.
              </p>
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-primary">📊 ¿Qué información encuentras aquí?</h6>
                  <ul className="small">
                    <li><strong>Montos predichos</strong> por categoría y mes</li>
                    <li><strong>Tendencias de gasto</strong> a lo largo del tiempo</li>
                    <li><strong>Patrones estacionales</strong> en tus finanzas</li>
                    <li><strong>Base para predicciones</strong> del próximo mes</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="text-success">🎯 ¿Cómo usar esta información?</h6>
                  <ul className="small">
                    <li><strong>Planifica tu presupuesto</strong> mensual</li>
                    <li><strong>Anticipa gastos</strong> recurrentes</li>
                    <li><strong>Identifica categorías</strong> con mayor variación</li>
                    <li><strong>Mejora tu control</strong> financiero</li>
                  </ul>
                </div>
              </div>
              <div className="alert alert-info mt-3 mb-0">
                <small>
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Nota:</strong> Los datos se actualizan automáticamente cada vez que registras un pago. 
                  El sistema utiliza un promedio móvil de los últimos 6 meses para las predicciones.
                </small>
              </div>
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
                        {new Date(2000, mes - 1).toLocaleString('es-AR', { month: 'long' })}
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

          {/* Resumen Mensual */}
          {resumenMensual.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Resumen Mensual de Predicciones
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {resumenMensual.slice(0, 6).map((resumen: any) => (
                    <div key={`${resumen.año}-${resumen.mes}`} className="col-md-4 col-lg-2 mb-3">
                      <div className="card bg-primary text-white text-center">
                        <div className="card-body p-3">
                          <h6 className="card-title mb-1 small">
                            {resumen.nombre_mes.trim()} {resumen.año}
                          </h6>
                          <p className="card-text h6 mb-0">
                            {/* CORREGIDO: Ya no será NaN */}
                            {formatCurrency(resumen.total_predicho)}
                          </p>
                          <small className="opacity-75">
                            {resumen.categorias.length} categorías
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tabla de Historial */}
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
                          <th>Mes/Año</th>
                          <th>Categoría</th>
                          <th>Monto Predicho</th>
                          <th>Variación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historial.map((item) => (
                          <tr key={item.id_historial}>
                            <td>
                              <strong>{item.nombre_mes.trim()} {item.año}</strong>
                            </td>
                            <td>
                              <span className="badge bg-info text-capitalize">
                                {item.categoria}
                              </span>
                            </td>
                            <td className="fw-bold text-primary">
                              {/* CORREGIDO: Convertir string a número para formatear */}
                              {formatCurrency(parseMontoPredicho(item.monto_predicho))}
                            </td>
                            <td>
                              <span className="badge bg-success">
                                <i className="fas fa-chart-line me-1"></i>
                                Tendencia
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {historial.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      <i className="fas fa-chart-line fa-3x mb-3"></i>
                      <p>
                        {filtroMes || filtroAño 
                          ? 'No hay datos de predicción para los filtros aplicados' 
                          : 'No hay historial de predicciones disponible'
                        }
                      </p>
                      <small>
                        El historial se generará automáticamente a medida que registres pagos en el sistema.
                      </small>
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