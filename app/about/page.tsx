'use client'
import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Sidebar from '@/app/components/Sidebar'
import Footer from '@/app/components/Footer'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: 'fas fa-chart-line',
      title: 'Predicciones Inteligentes',
      description: 'Sistema de IA que analiza tus patrones de gasto para predecir tendencias futuras.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Seguridad Garantizada',
      description: 'Tus datos financieros están protegidos con encriptación de última generación.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Acceso Multiplataforma',
      description: 'Accede a tu información desde cualquier dispositivo, en cualquier momento.'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Actualizaciones Constantes',
      description: 'Mejoras continuas basadas en feedback de usuarios como tú.'
    }
  ]

  const team = [
    {
      name: 'María González',
      role: 'CEO & Fundadora',
      description: 'Especialista en finanzas personales con más de 10 años de experiencia.',
      avatar: 'MG'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'CTO',
      description: 'Ingeniero de software apasionado por crear soluciones tecnológicas innovadoras.',
      avatar: 'CR'
    },
    {
      name: 'Ana Martínez',
      role: 'Diseñadora UX/UI',
      description: 'Diseñadora centrada en crear experiencias intuitivas y atractivas.',
      avatar: 'AM'
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
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column min-vh-100">
        <Header />
        
        <main className="container-fluid py-4 flex-grow-1">
          {/* Hero Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card bg-primary text-white">
                <div className="card-body text-center py-5">
                  <h1 className="display-4 fw-bold mb-3">Acerca de Nosotros</h1>
                  <p className="lead mb-0">
                    Transformando la forma en que manejas tus finanzas personales
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nuestra Misión */}
          <div className="row mb-5">
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="h3 text-primary mb-3">
                    <i className="fas fa-bullseye me-2"></i>
                    Nuestra Misión
                  </h2>
                  <p className="card-text">
                    En <strong>Sistema de Finanzas Personales</strong>, nos dedicamos a 
                    empoderar a las personas para que tomen el control total de su vida 
                    financiera. Creemos que la educación y las herramientas adecuadas 
                    pueden transformar la relación de cualquier persona con el dinero.
                  </p>
                  <p className="card-text">
                    Nuestra plataforma combina tecnología avanzada con principios 
                    financieros sólidos para ofrecerte insights accionables que 
                    realmente marquen la diferencia en tu economía.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h2 className="h3 text-success mb-3">
                    <i className="fas fa-eye me-2"></i>
                    Nuestra Visión
                  </h2>
                  <p className="card-text">
                    Aspiramos a ser la plataforma líder en gestión financiera personal 
                    en Latinoamérica, reconocida por nuestra innovación, confiabilidad 
                    y compromiso con el éxito financiero de nuestros usuarios.
                  </p>
                  <p className="card-text">
                    Visualizamos un futuro donde cada persona tenga las herramientas 
                    y conocimientos necesarios para alcanzar su independencia financiera 
                    y construir el futuro que desea.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="text-center mb-4">¿Por Qué Elegirnos?</h2>
              <div className="row">
                {features.map((feature, index) => (
                  <div key={index} className="col-lg-3 col-md-6 mb-4">
                    <div className="card text-center h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <div className="feature-icon mb-3">
                          <i className={`${feature.icon} fa-3x text-primary`}></i>
                        </div>
                        <h5 className="card-title">{feature.title}</h5>
                        <p className="card-text text-muted">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nuestro Equipo */}
          <div className="row">
            <div className="col-12">
              <h2 className="text-center mb-4">Conoce a Nuestro Equipo</h2>
              <div className="row justify-content-center">
                {team.map((member, index) => (
                  <div key={index} className="col-lg-4 col-md-6 mb-4">
                    <div className="card text-center h-100">
                      <div className="card-body">
                        <div className="avatar-circle bg-primary text-white mx-auto mb-3">
                          {member.avatar}
                        </div>
                        <h5 className="card-title">{member.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{member.role}</h6>
                        <p className="card-text">{member.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card bg-gradient-primary text-white">
                <div className="card-body text-center py-5">
                  <h3 className="h2 mb-3">¿Listo para Transformar tus Finanzas?</h3>
                  <p className="lead mb-4">
                    Únete a miles de usuarios que ya están tomando el control de su futuro financiero
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <a href="/dashboard" className="btn btn-light btn-lg">
                      Comenzar Ahora
                    </a>
                    <a href="/contact" className="btn btn-outline-light btn-lg">
                      Contáctanos
                    </a>
                  </div>
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