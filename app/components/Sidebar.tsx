'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { href: '/usuarios', icon: 'fas fa-users', label: 'Usuarios' },
    { href: '/ingresos', icon: 'fas fa-money-bill-wave', label: 'Ingresos' },
    { href: '/gastos', icon: 'fas fa-shopping-cart', label: 'Gastos' },
    { href: '/categorias', icon: 'fas fa-tags', label: 'Categorías' },
    { href: '/tipos-gasto', icon: 'fas fa-list', label: 'Tipos de Gasto' },
    { href: '/estado', icon: 'fas fa-flag', label: 'Estados' },
    { href: '/cuotas', icon: 'fas fa-calendar-alt', label: 'Cuotas' },
    { href: '/pagos', icon: 'fas fa-credit-card', label: 'Pagos' },
    { href: '/medio-pago', icon: 'fas fa-credit-card', label: 'Medio_Pago' },
    { href: '/impacta', icon: 'fas fa-calendar-week', label: 'Impactos' },
    { href: '/historial-prediccion', icon: 'fas fa-chart-line', label: 'Historial Predicción' }
  ]

  return (
    <div className="sidebar" style={{ width: '250px' }}>
      <div className="p-4">
        <div className="text-center mb-4">
          <i className="fas fa-chart-line text-white fa-2x mb-2"></i>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="navbar-brand fw-bold text-primary d-flex align-items-center"
          >
            <i className="fas fa-chart-line me-2"></i>
            <img
              src="https://i.postimg.cc/1Vr3bTRr/Logo-Blanco.png"
              alt="Controla-Más"
              style={{ height: "28px" }}
            />
          </a>
        </div>
        
        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}