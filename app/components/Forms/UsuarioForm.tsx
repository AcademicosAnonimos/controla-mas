'use client'
import { useState, useEffect } from 'react'

interface Usuario {
  id_usuario?: number
  nombre: string
  monto_disponible: number
}

interface UsuarioFormProps {
  usuario?: Usuario | null
  onSuccess: () => void
  onCancel: () => void
}

export default function UsuarioForm({ usuario, onSuccess, onCancel }: UsuarioFormProps) {
  const [formData, setFormData] = useState<Usuario>({
    nombre: '',
    monto_disponible: 0
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (usuario) {
      setFormData(usuario)
    }
  }, [usuario])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (formData.monto_disponible < 0) {
      newErrors.monto_disponible = 'El monto no puede ser negativo'
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
      const url = usuario 
        ? `/api/usuarios/${usuario.id_usuario}`
        : '/api/usuarios'
      
      const method = usuario ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
        alert(usuario ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al guardar usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monto_disponible' ? parseFloat(value) || 0 : value
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label htmlFor="monto_disponible" className="form-label">
            Monto Disponible
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.monto_disponible ? 'is-invalid' : ''}`}
            id="monto_disponible"
            name="monto_disponible"
            value={formData.monto_disponible}
            onChange={handleChange}
            min="0"
          />
          {errors.monto_disponible && (
            <div className="invalid-feedback">{errors.monto_disponible}</div>
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
              {usuario ? 'Actualizar' : 'Crear'} Usuario
            </>
          )}
        </button>
      </div>
    </form>
  )
}