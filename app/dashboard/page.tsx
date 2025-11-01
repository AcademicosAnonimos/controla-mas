'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import DashboardCards from '@/app/components/DashboardCards'
import CategoryChart from '@/app/components/Charts/CategoryChart'
import PredictionChart from '@/app/components/Charts/PredictionChart'
import Footer from '../components/Footer'

interface DashboardData {
  saldo_actual: number
  ingresos_mes: number
  gastos_mes: number
  proximas_cuotas: any[]
  gastos_por_categoria: any[]
  prediccion_proximo_mes: any[]
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDashboard()
  }, [])

  const cargarDashboard = async () => {
    try {
      setLoading(true)
      const usuarioId = localStorage.getItem('usuarioActual')
      
      if (!usuarioId) {
        throw new Error('No se encontró ID de usuario')
      }

      const response = await fetch(`/api/dashboard?id_usuario=${usuarioId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al cargar datos')
      }

      const data = await response.json()
      
      // Validar que los datos sean números válidos
      const validatedData = {
        ...data,
        saldo_actual: Number(data.saldo_actual) || 0,
        ingresos_mes: Number(data.ingresos_mes) || 0,
        gastos_mes: Number(data.gastos_mes) || 0
      }
      
      setDashboardData(validatedData)
    } catch (error) {
      console.error('Error cargando dashboard:', error)
      // Set datos por defecto en caso de error
      setDashboardData({
        saldo_actual: 0,
        ingresos_mes: 0,
        gastos_mes: 0,
        proximas_cuotas: [],
        gastos_por_categoria: [],
        prediccion_proximo_mes: []
      })
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid py-4">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="h3 mb-0">Dashboard</h1>
              <p className="text-muted">Resumen de tu situación financiera</p>
            </div>
          </div>

          {/* Tarjetas de Resumen */}
          <DashboardCards data={dashboardData} />

          <div className="row mt-4">
            {/* Gráfico de Gastos por Categoría */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-chart-pie me-2"></i>
                    Gastos por Categoría (Últimos 6 meses)
                  </h5>
                </div>
                <div className="card-body">
                  <CategoryChart data={dashboardData?.gastos_por_categoria || []} />
                </div>
              </div>
            </div>

            {/* Predicción Próximo Mes */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-chart-line me-2"></i>
                    Predicción Próximo Mes
                  </h5>
                </div>
                <div className="card-body">
                  <PredictionChart data={dashboardData?.prediccion_proximo_mes || []} />
                </div>
              </div>
            </div>
          </div>

          {/* Próximas Cuotas */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Próximas Cuotas a Vencer
                  </h5>
                </div>
                <div className="card-body">
                  {dashboardData?.proximas_cuotas?.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>Cuota</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.proximas_cuotas.map((cuota) => (
                            <tr key={cuota.id_cuota}>
                              <td>{cuota.descripcion_gasto}</td>
                              <td>{cuota.nro_cuota}/{cuota.total_cuotas}</td>
                              <td>{new Date(cuota.fecha_vencimiento_cuota).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${cuota.estado === 'Pagada' ? 'bg-success' : 'bg-warning'}`}>
                                  {cuota.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center py-3">
                      No hay cuotas pendientes próximas a vencer.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}