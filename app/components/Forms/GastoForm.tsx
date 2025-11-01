'use client'
import { useState, useEffect } from 'react'

interface GastoFormProps {
  gasto?: any
  onSuccess: () => void
  onCancel: () => void
}

export default function GastoForm({ gasto, onSuccess, onCancel }: GastoFormProps) {
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    año: new Date().getFullYear(),
    monto_total: 0,
    descripcion: '',
    id_tipo_gasto: '',
    id_categoria: '',
    id_usuario: 0,
    dia_vencimiento: '',
    total_cuotas: 1,
    fecha_primera_cuota: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [tiposGasto, setTiposGasto] = useState([])
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    cargarDatosIniciales()
    if (gasto) {
      setFormData(gasto)
    } else {
      const usuarioId = localStorage.getItem('usuarioActual')
      if (usuarioId) {
        setFormData(prev => ({ ...prev, id_usuario: parseInt(usuarioId) }))
      }
    }
  }, [gasto])

  const cargarDatosIniciales = async () => {
    try {
      const [tiposRes, categoriasRes] = await Promise.all([
        fetch('/api/tipos-gasto'),
        fetch('/api/categorias')
      ])
      
      const tiposData = await tiposRes.json()
      const categoriasData = await categoriasRes.json()
      
      setTiposGasto(tiposData)
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.descripcion.trim()) newErrors.descripcion = 'Descripción requerida'
    if (formData.monto_total <= 0) newErrors.monto_total = 'Monto debe ser mayor a 0'
    if (!formData.id_tipo_gasto) newErrors.id_tipo_gasto = 'Tipo de gasto requerido'
    if (!formData.id_categoria) newErrors.id_categoria = 'Categoría requerida'
    if (formData.mes < 1 || formData.mes > 12) newErrors.mes = 'Mes inválido'
    if (formData.año < 2000) newErrors.año = 'Año inválido'

    // Validaciones específicas por tipo
    if (formData.id_tipo_gasto === '1') { // Fijo
        const diaVenc = Number(formData.dia_vencimiento)

    if (!diaVenc || diaVenc < 1 || diaVenc > 31) {
        newErrors.dia_vencimiento = 'Día de vencimiento inválido'
    }

    } else if (formData.id_tipo_gasto === '3') { // Temporal
        const totalCuotas = Number(formData.total_cuotas)

    if (!totalCuotas || totalCuotas < 1) {
        newErrors.total_cuotas = 'Número de cuotas inválido'
    }

    if (!formData.fecha_primera_cuota) {
        newErrors.fecha_primera_cuota = 'Fecha de primera cuota requerida'
    }
    }


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      const url = gasto ? `/api/gastos/${gasto.id_gasto}` : '/api/gastos'
      const method = gasto ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
        alert(gasto ? 'Gasto actualizado' : 'Gasto creado')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al guardar gasto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('monto') || name.includes('cuotas') || name.includes('dia') || 
              name.includes('mes') || name.includes('año') ? 
              (value === '' ? '' : Number(value)) : value
    }))
  }

  const renderCamposAdicionales = () => {
    switch (formData.id_tipo_gasto) {
      case '1': // Fijo
        return (
          <div className="col-md-6 mb-3">
            <label htmlFor="dia_vencimiento" className="form-label">
              Día de Vencimiento <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.dia_vencimiento ? 'is-invalid' : ''}`}
              id="dia_vencimiento"
              name="dia_vencimiento"
              value={formData.dia_vencimiento}
              onChange={handleChange}
              min="1"
              max="31"
              required
            />
            {errors.dia_vencimiento && (
              <div className="invalid-feedback">{errors.dia_vencimiento}</div>
            )}
          </div>
        )
      
      case '3': // Temporal
        return (
          <>
            <div className="col-md-6 mb-3">
              <label htmlFor="total_cuotas" className="form-label">
                Total de Cuotas <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-control ${errors.total_cuotas ? 'is-invalid' : ''}`}
                id="total_cuotas"
                name="total_cuotas"
                value={formData.total_cuotas}
                onChange={handleChange}
                min="1"
                required
              />
              {errors.total_cuotas && (
                <div className="invalid-feedback">{errors.total_cuotas}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="fecha_primera_cuota" className="form-label">
                Fecha Primera Cuota <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control ${errors.fecha_primera_cuota ? 'is-invalid' : ''}`}
                id="fecha_primera_cuota"
                name="fecha_primera_cuota"
                value={formData.fecha_primera_cuota}
                onChange={handleChange}
                required
              />
              {errors.fecha_primera_cuota && (
                <div className="invalid-feedback">{errors.fecha_primera_cuota}</div>
              )}
            </div>
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-12 mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            required
          />
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="id_tipo_gasto" className="form-label">
            Tipo de Gasto <span className="text-danger">*</span>
          </label>
          <select
            className={`form-control ${errors.id_tipo_gasto ? 'is-invalid' : ''}`}
            id="id_tipo_gasto"
            name="id_tipo_gasto"
            value={formData.id_tipo_gasto}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar tipo</option>
            {tiposGasto.map((tipo: any) => (
              <option key={tipo.id_tipo_gasto} value={tipo.id_tipo_gasto}>
                {tipo.descripcion}
              </option>
            ))}
          </select>
          {errors.id_tipo_gasto && (
            <div className="invalid-feedback">{errors.id_tipo_gasto}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="id_categoria" className="form-label">
            Categoría <span className="text-danger">*</span>
          </label>
          <select
            className={`form-control ${errors.id_categoria ? 'is-invalid' : ''}`}
            id="id_categoria"
            name="id_categoria"
            value={formData.id_categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat: any) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.categoria}
              </option>
            ))}
          </select>
          {errors.id_categoria && (
            <div className="invalid-feedback">{errors.id_categoria}</div>
          )}
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="monto_total" className="form-label">
            Monto Total <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.monto_total ? 'is-invalid' : ''}`}
            id="monto_total"
            name="monto_total"
            value={formData.monto_total}
            onChange={handleChange}
            min="0.01"
            required
          />
          {errors.monto_total && (
            <div className="invalid-feedback">{errors.monto_total}</div>
          )}
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="mes" className="form-label">
            Mes <span className="text-danger">*</span>
          </label>
          <select
            className={`form-control ${errors.mes ? 'is-invalid' : ''}`}
            id="mes"
            name="mes"
            value={formData.mes}
            onChange={handleChange}
            required
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('es-AR', { month: 'long' })}
              </option>
            ))}
          </select>
          {errors.mes && <div className="invalid-feedback">{errors.mes}</div>}
        </div>

        <div className="col-md-4 mb-3">
          <label htmlFor="año" className="form-label">
            Año <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={`form-control ${errors.año ? 'is-invalid' : ''}`}
            id="año"
            name="año"
            value={formData.año}
            onChange={handleChange}
            min="2000"
            max="2100"
            required
          />
          {errors.año && <div className="invalid-feedback">{errors.año}</div>}
        </div>

        {renderCamposAdicionales()}
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
              <i className="fas fa-save me-2"></i>
              {gasto ? 'Actualizar' : 'Crear'} Gasto
            </>
          )}
        </button>
      </div>
    </form>
  )
}