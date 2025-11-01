'use client'
import { useState, useEffect } from 'react'

interface Ingreso {
  id_ingreso?: number
  descripcion: string
  fecha_ingreso: string
  monto: number
  id_usuario: number
}

interface IngresoFormProps {
  ingreso?: Ingreso | null
  onSuccess: () => void
  onCancel: () => void
}

export default function IngresoForm({ ingreso, onSuccess, onCancel }: IngresoFormProps) {
  const [formData, setFormData] = useState<Ingreso>({
    descripcion: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    monto: 0,
    id_usuario: 0
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (ingreso) {
      setFormData(ingreso)
    } else {
      // Obtener usuario actual de localStorage
      const usuarioId = localStorage.getItem('usuarioActual')
      if (usuarioId) {
        setFormData(prev => ({
          ...prev,
          id_usuario: parseInt(usuarioId)
        }))
      }
    }
  }, [ingreso])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida'
    }

    if (!formData.fecha_ingreso) {
      newErrors.fecha_ingreso = 'La fecha es requerida'
    }

    if (formData.monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0'
    }

    if (!formData.id_usuario) {
      newErrors.id_usuario = 'Usuario es requerido'
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
      const url = ingreso 
        ? `/api/ingresos/${ingreso.id_ingreso}`
        : '/api/ingresos'
      
      const method = ingreso ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
        alert(ingreso ? 'Ingreso actualizado correctamente' : 'Ingreso creado correctamente')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al guardar ingreso')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monto' ? parseFloat(value) || 0 : 
              name === 'id_usuario' ? parseInt(value) || 0 : value
    }))
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
          <label htmlFor="fecha_ingreso" className="form-label">
            Fecha <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.fecha_ingreso ? 'is-invalid' : ''}`}
            id="fecha_ingreso"
            name="fecha_ingreso"
            value={formData.fecha_ingreso}
            onChange={handleChange}
            required
          />
          {errors.fecha_ingreso && (
            <div className="invalid-feedback">{errors.fecha_ingreso}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="monto" className="form-label">
            Monto <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.monto ? 'is-invalid' : ''}`}
            id="monto"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            min="0.01"
            required
          />
          {errors.monto && (
            <div className="invalid-feedback">{errors.monto}</div>
          )}
        </div>
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
              {ingreso ? 'Actualizar' : 'Crear'} Ingreso
            </>
          )}
        </button>
      </div>
    </form>
  )
}