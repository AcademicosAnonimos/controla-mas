'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'

interface Categoria {
  id_categoria: number
  categoria: string
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [showForm, setShowForm] = useState(false)
  const [categoriaEdit, setCategoriaEdit] = useState<Categoria | null>(null)
  const [formData, setFormData] = useState({ categoria: '' })
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error('Error cargando categorías:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (categoria: Categoria) => {
    setCategoriaEdit(categoria)
    setFormData({ categoria: categoria.categoria })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const response = await fetch(`/api/categorias/${id}`, { method: 'DELETE' })
      if (response.ok) {
        cargarCategorias()
        alert('Categoría eliminada correctamente')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al eliminar categoría')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoria.trim()) {
      alert('El nombre de la categoría es requerido')
      return
    }

    setFormLoading(true)

    try {
      const url = categoriaEdit 
        ? `/api/categorias/${categoriaEdit.id_categoria}`
        : '/api/categorias'
      
      const method = categoriaEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setCategoriaEdit(null)
        setFormData({ categoria: '' })
        cargarCategorias()
        alert(categoriaEdit ? 'Categoría actualizada' : 'Categoría creada')
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Error al guardar categoría')
    } finally {
      setFormLoading(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setCategoriaEdit(null)
    setFormData({ categoria: '' })
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <main className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Gestión de Categorías</h1>
              <p className="text-muted">Administra las categorías de gastos</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <i className="fas fa-plus me-2"></i>Nueva Categoría
            </button>
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
                        <th>Nombre</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map((categoria) => (
                        <tr key={categoria.id_categoria}>
                          <td>{categoria.id_categoria}</td>
                          <td>{categoria.categoria}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(categoria)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(categoria.id_categoria)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Modal Formulario */}
          {showForm && (
            <div className="modal fade show d-block" tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {categoriaEdit ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h5>
                    <button type="button" className="btn-close" onClick={handleFormClose}></button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label htmlFor="categoria" className="form-label">
                          Nombre de la Categoría
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="categoria"
                          value={formData.categoria}
                          onChange={(e) => setFormData({ categoria: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleFormClose}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={formLoading}>
                        {formLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            {categoriaEdit ? 'Actualizar' : 'Crear'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  )
}