'use client'
import { useState, useEffect } from 'react'

interface MedioPago {
  id_medio_pago?: number
  medio_pago: string
}

interface MedioPagoFormProps {
  medioPago?: MedioPago | null
  onSuccess: () => void
  onCancel: () => void
}

export default function MedioPagoForm({ medioPago, onSuccess, onCancel }: MedioPagoFormProps) {
  const [formData, setFormData] = useState<MedioPago>({
    medio_pago: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [mediosExistentes, setMediosExistentes] = useState<string[]>([])

  useEffect(() => {
    cargarMediosExistentes()
    if (medioPago) {
      setFormData(medioPago)
    }
  }, [medioPago])

  const cargarMediosExistentes = async () => {
    try {
      const response = await fetch('/api/medio-pago')
      const data = await response.json()
      setMediosExistentes(data.map((mp: any) => mp.medio_pago.toLowerCase()))
    } catch (error) {
      console.error('Error cargando medios existentes:', error)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.medio_pago.trim()) {
      newErrors.medio_pago = 'El nombre del medio de pago es requerido'
    } else {
      const nombreLower = formData.medio_pago.trim().toLowerCase()
      if (mediosExistentes.includes(nombreLower) && !medioPago) {
        newErrors.medio_pago = 'Ya existe un medio de pago con ese nombre'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const url = medioPago 
        ? `/api/medio-pago/${medioPago.id_medio_pago}`
        : '/api/medio-pago'
      
      const method = medioPago ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ medio_pago: formData.medio_pago.trim() })
      })

      if (response.ok) {
        onSuccess()
        alert(medioPago ? 'Medio de pago actualizado correctamente' : 'Medio de pago creado correctamente')
      } else {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        alert(errorData.error || 'Error al guardar medio de pago')
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      alert('Error de conexión al guardar medio de pago')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error cuando el usuario escribe
    if (errors.medio_pago) {
      setErrors({})
    }
  }

  // Función para asignar colores fijos
  const getMedioColor = (medio: string): string => {
    const colores: { [key: string]: string } = {
      'efectivo': '#28a745',
      'transferencia': '#17a2b8',
      'credito': '#ffc107',
      'debito': '#20c997',
      'mercadopago': '#009ee3',
      'paypal': '#003087',
      'bitcoin': '#f7931a',
      'débito': '#20c997',
      'crédito': '#ffc107',
    }
    
    const medioLower = medio.toLowerCase().trim()
    return colores[medioLower] || '#6c757d'
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
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-12 mb-3">
          <label htmlFor="medio_pago" className="form-label">
            Nombre del Medio de Pago <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.medio_pago ? 'is-invalid' : ''}`}
            id="medio_pago"
            name="medio_pago"
            value={formData.medio_pago}
            onChange={handleChange}
            placeholder="Ej: Tarjeta de Crédito, PayPal, Bitcoin, etc."
            required
            disabled={loading}
          />
          {errors.medio_pago && (
            <div className="invalid-feedback">{errors.medio_pago}</div>
          )}
          <div className="form-text">
            Sugerencias: Efectivo, Transferencia, Débito, Crédito, MercadoPago, PayPal, Bitcoin
          </div>
          {mediosExistentes.length > 0 && (
            <div className="form-text">
              Medios existentes: {mediosExistentes.join(', ')}
            </div>
          )}
        </div>

        {/* Vista previa */}
        {formData.medio_pago && (
          <div className="col-12 mb-3">
            <label className="form-label">Vista Previa:</label>
            <div className="card">
              <div className="card-body text-center">
                <i 
                  className={`${getMedioIcon(formData.medio_pago)} fa-2x mb-2`}
                  style={{ color: getMedioColor(formData.medio_pago) }}
                ></i>
                <h6 className="card-title text-capitalize mb-0">
                  <span 
                    className="badge"
                    style={{ 
                      backgroundColor: getMedioColor(formData.medio_pago),
                      color: getContrastColor(getMedioColor(formData.medio_pago))
                    }}
                  >
                    {formData.medio_pago}
                  </span>
                </h6>
                <small className="text-muted">
                  El color se asignará automáticamente según el nombre
                </small>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Guardando...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              {medioPago ? 'Actualizar' : 'Crear'} Medio de Pago
            </>
          )}
        </button>
      </div>
    </form>
  )
}