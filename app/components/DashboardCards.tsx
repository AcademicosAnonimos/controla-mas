'use client'
import { useState, useEffect } from 'react'

interface DashboardCardsProps {
  data: {
    saldo_actual: number
    ingresos_mes: number
    gastos_mes: number
    proximas_cuotas: any[]
  } | null
}

export default function DashboardCards({ data }: DashboardCardsProps) {
  const [montoDisponible, setMontoDisponible] = useState(0)

  useEffect(() => {
    if (data) {
      // Asegurar que el saldo sea un número válido
      const saldo = Number(data.saldo_actual) || 0
      setMontoDisponible(saldo)
    }
  }, [data])

  const formatCurrency = (amount: number) => {
    // Validar que amount sea un número válido
    const validAmount = Number(amount) || 0
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(validAmount)
  }

  // Función para formatear números sin símbolo de moneda (para las cuotas)
  const formatNumber = (value: number) => {
    const validValue = Number(value) || 0
    return validValue.toLocaleString('es-AR')
  }

  const cards = [
    {
      title: 'SALDO ACTUAL',
      value: formatCurrency(montoDisponible),
      icon: 'fas fa-wallet',
      color: 'primary',
      description: 'Disponible para gastar',
      // Agregar validación para mostrar si hay datos
      hasData: data !== null
    },
    {
      title: 'INGRESOS DEL MES',
      value: formatCurrency(data?.ingresos_mes || 0),
      icon: 'fas fa-arrow-down',
      color: 'success',
      description: 'Total de ingresos',
      hasData: data !== null && Number(data?.ingresos_mes) > 0
    },
    {
      title: 'GASTOS DEL MES',
      value: formatCurrency(data?.gastos_mes || 0),
      icon: 'fas fa-arrow-up',
      color: 'danger',
      description: 'Total de gastos',
      hasData: data !== null && Number(data?.gastos_mes) > 0
    },
    {
      title: 'PRÓXIMAS CUOTAS',
      value: data?.proximas_cuotas?.length > 0 ? 
             formatNumber(data.proximas_cuotas.length) : '0',
      icon: 'fas fa-calendar',
      color: 'warning',
      description: 'Pendientes de pago',
      hasData: data !== null && data?.proximas_cuotas?.length > 0
    }
  ]

  // Si no hay datos, mostrar skeleton o mensaje
  if (!data) {
    return (
      <div className="row">
        {cards.map((_, index) => (
          <div key={index} className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-secondary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                      Cargando...
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      &nbsp;
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-spinner fa-2x text-secondary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="row">
      {cards.map((card, index) => (
        <div key={index} className="col-xl-3 col-md-6 mb-4">
          <div className={`card border-left-${card.color} shadow h-100 py-2 card-hover`}>
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className={`text-xs font-weight-bold text-${card.color} text-uppercase mb-1`}>
                    {card.title}
                  </div>
                  <div className={`h5 mb-0 font-weight-bold ${!card.hasData ? 'text-muted' : 'text-gray-800'}`}>
                    {card.value}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {card.description}
                    {!card.hasData && card.title !== 'SALDO ACTUAL' && (
                      <span className="text-warning ms-1">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        Sin datos
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-auto">
                  <i className={`${card.icon} fa-2x text-${card.color} ${!card.hasData ? 'opacity-50' : ''}`}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}