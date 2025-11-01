'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'

interface TipoGasto {
  id_tipo_gasto: number
  descripcion: string
}

export default function TiposGastoPage() {
  const [tiposGasto, setTiposGasto] = useState<TipoGasto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarTiposGasto()
  }, [])

  const cargarTiposGasto = async () => {
    try {
      const response = await fetch('/api/tipos-gasto')
      const data = await response.json()
      setTiposGasto(data)
    } catch (error) {
      console.error('Error cargando tipos de gasto:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Tipos de Gasto</h1>
              <p className="text-muted">Tipos predefinidos del sistema</p>
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
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tiposGasto.map((tipo) => (
                        <tr key={tipo.id_tipo_gasto}>
                          <td>{tipo.id_tipo_gasto}</td>
                          <td>
                            <span className={`badge ${
                              tipo.descripcion === 'Fijo' ? 'bg-primary' :
                              tipo.descripcion === 'Temporal' ? 'bg-warning' :
                              tipo.descripcion === 'Anual' ? 'bg-info' : 'bg-secondary'
                            }`}>
                              {tipo.descripcion}
                            </span>
                          </td>
                          <td>
                            {tipo.descripcion === 'Fijo' && 'Gastos mensuales con fecha fija (ej: alquiler)'}
                            {tipo.descripcion === 'Temporal' && 'Gastos en cuotas (ej: compras a plazos)'}
                            {tipo.descripcion === 'Ocasional' && 'Gastos puntuales sin repetición'}
                            {tipo.descripcion === 'Anual' && 'Gastos que ocurren una vez al año'}
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