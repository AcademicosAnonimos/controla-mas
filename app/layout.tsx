import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Finanzas Personales',
  description: 'Controla y gestiona tus finanzas personales de manera eficiente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.className} d-flex flex-column min-vh-100`}>
        {/* El contenido crece para ocupar todo el espacio restante */}
        <main className="flex-grow-1">
          {children}
        </main>
      </body>
    </html>
  )
}
