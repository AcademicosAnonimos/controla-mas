'use client'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const enlacesRapidos = [
    { nombre: 'Dashboard', href: '/dashboard' },
    { nombre: 'Gastos', href: '/gastos' },
    { nombre: 'Ingresos', href: '/ingresos' },
    { nombre: 'Pagos', href: '/pagos' },
    { nombre: 'Categorías', href: '/categorias' },
    { nombre: 'Historial de Predicciones', href: '/historial-prediccion' }
  ]

  const enlacesSistema = [
    { nombre: 'Tipos de Gasto', href: '/tipos-gasto' },
    { nombre: 'Medios de Pago', href: '/medios-pago' },
    { nombre: 'Estados', href: '/estados' },
    { nombre: 'Cuotas', href: '/cuotas' }
  ]

  const enlacesInformacion = [
    { nombre: 'Acerca de Nosotros', href: '/about' },
    { nombre: 'Contacto', href: '/contact' },
    { nombre: 'Política de Privacidad', href: '/privacy' },
    { nombre: 'Términos de Servicio', href: '/terms' }
  ]

  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container-fluid py-5">
        <div className="row">
          {/* Enlaces Rápidos */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-primary mb-3">Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              {enlacesRapidos.map((enlace) => (
                <li key={enlace.nombre} className="mb-2">
                  <Link 
                    href={enlace.href}
                    className="text-light text-decoration-none hover-text-primary"
                  >
                    <i className="fas fa-arrow-right me-2 small"></i>
                    {enlace.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sistema */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-success mb-3">Sistema</h5>
            <ul className="list-unstyled">
              {enlacesSistema.map((enlace) => (
                <li key={enlace.nombre} className="mb-2">
                  <Link 
                    href={enlace.href}
                    className="text-light text-decoration-none hover-text-success"
                  >
                    <i className="fas fa-cog me-2 small"></i>
                    {enlace.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-info mb-3">Información</h5>
            <ul className="list-unstyled">
              {enlacesInformacion.map((enlace) => (
                <li key={enlace.nombre} className="mb-2">
                  <Link 
                    href={enlace.href}
                    className="text-light text-decoration-none hover-text-info"
                  >
                    <i className="fas fa-info-circle me-2 small"></i>
                    {enlace.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto y Redes Sociales */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-warning mb-3">Contáctanos</h5>
            <div className="mb-3">
              <p className="mb-2">
                <i className="fas fa-envelope me-2 text-warning"></i>
                <a href="mailto:controlamas24@gmail.com" className="text-light text-decoration-none">
                  controlamas24@gmail.com
                </a>
              </p>
              <p className="mb-2">
                <i className="fas fa-phone me-2 text-warning"></i>
                <a href="tel:+5491112345678" className="text-light text-decoration-none">
                  +54 9 11 1234-5678
                </a>
              </p>
              <p className="mb-0">
                <i className="fas fa-map-marker-alt me-2 text-warning"></i>
                Misiones, Argentina
              </p>
            </div>
            
            <div className="social-links">
              <h6 className="text-warning mb-2">Síguenos</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-light hover-text-warning">
                  <i className="fab fa-facebook-f fa-lg"></i>
                </a>
                <a href="#" className="text-light hover-text-warning">
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
                <a href="#" className="text-light hover-text-warning">
                  <i className="fab fa-linkedin-in fa-lg"></i>
                </a>
                <a href="#" className="text-light hover-text-warning">
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="bg-secondary" />

        {/* Copyright */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">
              &copy; {currentYear} Controla Más. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0">
              Desarrollado con <i className="fas fa-heart text-danger"></i> para tu control financiero
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-text-primary:hover {
          color: var(--bs-primary) !important;
          transition: color 0.3s ease;
        }
        .hover-text-success:hover {
          color: var(--bs-success) !important;
          transition: color 0.3s ease;
        }
        .hover-text-info:hover {
          color: var(--bs-info) !important;
          transition: color 0.3s ease;
        }
        .hover-text-warning:hover {
          color: var(--bs-warning) !important;
          transition: color 0.3s ease;
        }
      `}</style>
    </footer>
  )
}