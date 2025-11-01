'use client'
import { useState, useEffect } from 'react'

interface PagoFormProps {
  pago?: any
  onSuccess: () => void
  onCancel: () => void
}

export default function PagoForm({ pago, onSuccess, onCancel }: PagoFormProps) {
  const [formData, setFormData] = useState({
    importe_a_pagar: 0,
    fecha_pago: new Date().toISOString().split('T')[0],
    id_gasto: '',
    medios_pago: [{ id_medio_pago: '', importe_pagado: 0 }],
    mes_impacto: new Date().getMonth() + 1,
    año_impacto: new Date().getFullYear()
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [mediosPago, setMediosPago] = useState([])
  const [gastos, setGastos] = useState([])
  const [totalMedios, setTotalMedios] = useState(0)

  useEffect(() => {
    cargarDatosIniciales()
    if (pago) {
      setFormData({
        ...pago,
        medios_pago: pago.medios_pago || [{ id_medio_pago: '', importe_pagado: 0 }]
      })
    } else {
      const usuarioId = localStorage.getItem('usuarioActual')
      if (usuarioId) {
        cargarGastos(usuarioId)
      }
    }
  }, [pago])

  const cargarDatosIniciales = async () => {
    try {
      const mediosRes = await fetch('/api/medio-pago')
      const mediosData = await mediosRes.json()
      setMediosPago(mediosData)
    } catch (error) {
      console.error('Error cargando medios de pago:', error)
    }
  }

  const cargarGastos = async (usuarioId: string) => {
    try {
      const gastosRes = await fetch(`/api/gastos?id_usuario=${usuarioId}`)
      const gastosData = await gastosRes.json()
      setGastos(gastosData)
    } catch (error) {
      console.error('Error cargando gastos:', error)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (formData.importe_a_pagar <= 0) {
      newErrors.importe_a_pagar = 'Importe debe ser mayor a 0'
    }

    if (!formData.id_gasto) {
      newErrors.id_gasto = 'Gasto es requerido'
    }

    if (!formData.fecha_pago) {
      newErrors.fecha_pago = 'Fecha de pago es requerida'
    }

    // Validar medios de pago
    const totalMediosCalc = formData.medios_pago.reduce((sum, medio) => 
      sum + (medio.importe_pagado || 0), 0
    )

    if (totalMediosCalc !== formData.importe_a_pagar) {
      newErrors.medios_pago = `La suma de medios de pago (${totalMediosCalc}) no coincide con el importe total (${formData.importe_a_pagar})`
    }

    setTotalMedios(totalMediosCalc)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      const url = '/api/pagos' // Solo creación por ahora
      const method = 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
        alert('Pago registrado correctamente')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al registrar pago')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('importe') || name.includes('mes') || name.includes('año') ? 
              (value === '' ? '' : Number(value)) : value
    }))
  }

  const handleMedioChange = (index: number, field: string, value: any) => {
    const updatedMedios = [...formData.medios_pago]
    updatedMedios[index] = {
      ...updatedMedios[index],
      [field]: field === 'importe_pagado' ? Number(value) : value
    }
    setFormData(prev => ({ ...prev, medios_pago: updatedMedios }))
  }

  const addMedioPago = () => {
    setFormData(prev => ({
      ...prev,
      medios_pago: [...prev.medios_pago, { id_medio_pago: '', importe_pagado: 0 }]
    }))
  }

  const removeMedioPago = (index: number) => {
    if (formData.medios_pago.length > 1) {
      const updatedMedios = formData.medios_pago.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, medios_pago: updatedMedios }))
    }
  }

  const tieneCredito = formData.medios_pago.some(medio => medio.id_medio_pago === '3')

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="id_gasto" className="form-label">
            Gasto <span className="text-danger">*</span>
          </label>
          <select
            className={`form-control ${errors.id_gasto ? 'is-invalid' : ''}`}
            id="id_gasto"
            name="id_gasto"
            value={formData.id_gasto}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar gasto</option>
            {gastos.map((gasto: any) => (
              <option key={gasto.id_gasto} value={gasto.id_gasto}>
                {gasto.descripcion} - {gasto.monto_total} ({gasto.tipo_gasto})
              </option>
            ))}
          </select>
          {errors.id_gasto && (
            <div className="invalid-feedback">{errors.id_gasto}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="fecha_pago" className="form-label">
            Fecha de Pago <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.fecha_pago ? 'is-invalid' : ''}`}
            id="fecha_pago"
            name="fecha_pago"
            value={formData.fecha_pago}
            onChange={handleChange}
            required
          />
          {errors.fecha_pago && (
            <div className="invalid-feedback">{errors.fecha_pago}</div>
          )}
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="importe_a_pagar" className="form-label">
            Importe a Pagar <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.importe_a_pagar ? 'is-invalid' : ''}`}
            id="importe_a_pagar"
            name="importe_a_pagar"
            value={formData.importe_a_pagar}
            onChange={handleChange}
            min="0.01"
            required
          />
          {errors.importe_a_pagar && (
            <div className="invalid-feedback">{errors.importe_a_pagar}</div>
          )}
        </div>

        {/* Medios de Pago */}
        <div className="col-12 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="form-label">Medios de Pago</label>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addMedioPago}>
              <i className="fas fa-plus me-1"></i>Agregar Medio
            </button>
          </div>

          {formData.medios_pago.map((medio, index) => (
            <div key={index} className="row mb-2 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Medio</label>
                <select
                  className="form-control"
                  value={medio.id_medio_pago}
                  onChange={(e) => handleMedioChange(index, 'id_medio_pago', e.target.value)}
                  required
                >
                  <option value="">Seleccionar medio</option>
                  {mediosPago.map((mp: any) => (
                    <option key={mp.id_medio_pago} value={mp.id_medio_pago}>
                      {mp.medio_pago}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Importe</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={medio.importe_pagado}
                  onChange={(e) => handleMedioChange(index, 'importe_pagado', e.target.value)}
                  min="0.01"
                  required
                />
              </div>
              <div className="col-md-2">
                {formData.medios_pago.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={() => removeMedioPago(index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
          ))}

          {errors.medios_pago && (
            <div className="text-danger small mt-2">{errors.medios_pago}</div>
          )}

          <div className="mt-2">
            <small className="text-muted">
              Total medios: {totalMedios.toFixed(2)} | 
              Importe total: {formData.importe_a_pagar.toFixed(2)} | 
              Diferencia: {(formData.importe_a_pagar - totalMedios).toFixed(2)}
            </small>
          </div>
        </div>

        {/* Impacto para crédito */}
        {tieneCredito && (
          <div className="col-12 mb-3 p-3 border rounded bg-light">
            <h6 className="mb-3">
              <i className="fas fa-calendar-alt me-2"></i>
              Impacto para Tarjeta de Crédito
            </h6>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="mes_impacto" className="form-label">
                  Mes de Impacto
                </label>
                <select
                  className="form-control"
                  id="mes_impacto"
                  name="mes_impacto"
                  value={formData.mes_impacto}
                  onChange={handleChange}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString('es-AR', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="año_impacto" className="form-label">
                  Año de Impacto
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="año_impacto"
                  name="año_impacto"
                  value={formData.año_impacto}
                  onChange={handleChange}
                  min="2020"
                  max="2030"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="fas fa-credit-card me-2"></i>
              Registrar Pago
            </>
          )}
        </button>
      </div>
    </form>
  )
}