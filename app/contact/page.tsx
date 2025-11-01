'use client'
import { useState, useEffect } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'

export default function ContactPage() {
  const [mounted, setMounted] = useState(false)
  const [state, handleSubmit] = useForm("manlljaw")

  useEffect(() => {
    setMounted(true)
  }, [])

  const contactMethods = [
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      details: 'controlamas24@gmail.com',
      link: 'mailto:controlamas24@gmail.com'
    },
    {
      icon: 'fas fa-phone',
      title: 'Teléfono',
      details: '+54 9 11 1234-5678',
      link: 'tel:+5491112345678'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Oficina',
      details: 'Av. Jauretche y Av. López y Planes, N3300PBU, Posadas, Misiones, Argentina',
      link: '#'
    },
    {
      icon: 'fas fa-clock',
      title: 'Horarios',
      details: 'Lun-Vie: 9:00 - 18:00',
      link: '#'
    }
  ]

  const faqs = [
    {
      question: '¿Es gratuito el servicio?',
      answer: 'Sí, ofrecemos una versión gratuita con funciones básicas y planes premium con características avanzadas.'
    },
    {
      question: '¿Cómo protegen mis datos financieros?',
      answer: 'Utilizamos encriptación de grado bancario y cumplimos con los más altos estándares de seguridad.'
    },
    {
      question: '¿Puedo exportar mis datos?',
      answer: 'Sí, puedes exportar todos tus datos en formatos CSV, PDF y Excel en cualquier momento.'
    }
  ]

  if (!mounted) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column">
          <Header />
          
          <main className="container-fluid py-4 flex-grow-1">
            {/* Hero Section - Más compacta */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card bg-success text-white">
                  <div className="card-body text-center py-3">
                    <h1 className="h2 fw-bold mb-1">Contáctanos</h1>
                    <p className="mb-0">
                      Estamos aquí para ayudarte en tu journey financiero
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido principal - Estructura corregida */}
            <div className="row g-3 flex-grow-1 align-items-start">
              {/* Columna izquierda - Información de Contacto */}
              <div className="col-lg-4 d-flex flex-column" style={{ minHeight: '500px' }}>
                {/* Información de Contacto */}
                <div className="card flex-grow-1">
                  <div className="card-header py-2">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-info-circle me-2 text-success"></i>
                      Información de Contacto
                    </h5>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="flex-grow-1">
                      {contactMethods.map((method, index) => (
                        <div key={index} className="d-flex align-items-start mb-3">
                          <div className="flex-shrink-0">
                            <i className={`${method.icon} fa-lg text-success me-3`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1 small">{method.title}</h6>
                            <a 
                              href={method.link} 
                              className="text-decoration-none text-muted small"
                            >
                              {method.details}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto">
                      <hr />
                      <h6 className="fw-bold mb-2 small">Síguenos en Redes Sociales</h6>
                      <div className="d-flex gap-2">
                        <a href="#" className="text-success">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="text-success">
                          <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="text-success">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href="#" className="text-success">
                          <i className="fab fa-instagram"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Section - Separada y con altura fija */}
                <div className="card mt-3 flex-shrink-0" style={{ maxHeight: '250px' }}>
                  <div className="card-header py-2">
                    <h5 className="card-title mb-0 small">
                      <i className="fas fa-question-circle me-2 text-info"></i>
                      Preguntas Frecuentes
                    </h5>
                  </div>
                  <div className="card-body py-2" style={{ overflowY: 'auto', maxHeight: '180px' }}>
                    {faqs.map((faq, index) => (
                      <div key={index} className="mb-2">
                        <h6 className="fw-bold text-primary small mb-1">{faq.question}</h6>
                        <p className="small text-muted mb-2">{faq.answer}</p>
                        {index < faqs.length - 1 && <hr className="my-1" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna derecha - Formulario */}
              <div className="col-lg-8">
                <div className="card h-100">
                  <div className="card-header">
                    <h4 className="card-title mb-0">
                      <i className="fas fa-paper-plane me-2 text-primary"></i>
                      Envíanos un Mensaje
                    </h4>
                  </div>
                  <div className="card-body">
                    {state.succeeded ? (
                      <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <i className="fas fa-check-circle me-2"></i>
                        <strong>¡Mensaje enviado exitosamente!</strong> Te contactaremos pronto en academicosanonimos24@gmail.com
                        <button 
                          type="button" 
                          className="btn-close" 
                          data-bs-dismiss="alert"
                        ></button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="nombre" className="form-label">
                              Nombre Completo *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="nombre"
                              name="nombre"
                              required
                              disabled={state.submitting}
                            />
                            <ValidationError 
                              prefix="Nombre" 
                              field="nombre"
                              errors={state.errors}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">
                              Email *
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              required
                              disabled={state.submitting}
                            />
                            <ValidationError 
                              prefix="Email" 
                              field="email"
                              errors={state.errors}
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="asunto" className="form-label">
                            Asunto *
                          </label>
                          <select
                            className="form-select"
                            id="asunto"
                            name="asunto"
                            required
                            disabled={state.submitting}
                          >
                            <option value="">Selecciona un asunto</option>
                            <option value="soporte">Soporte Técnico</option>
                            <option value="facturacion">Facturación</option>
                            <option value="sugerencia">Sugerencia</option>
                            <option value="reporte">Reportar Problema</option>
                            <option value="otros">Otros</option>
                          </select>
                          <ValidationError 
                            prefix="Asunto" 
                            field="asunto"
                            errors={state.errors}
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="mensaje" className="form-label">
                            Mensaje *
                          </label>
                          <textarea
                            className="form-control"
                            id="mensaje"
                            name="mensaje"
                            rows={5}
                            required
                            disabled={state.submitting}
                            placeholder="Describe tu consulta o sugerencia en detalle..."
                          ></textarea>
                          <ValidationError 
                            prefix="Mensaje" 
                            field="mensaje"
                            errors={state.errors}
                          />
                        </div>

                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={state.submitting}
                          >
                            {state.submitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Enviando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-paper-plane me-2"></i>
                                Enviar Mensaje
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}