import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idUsuario = searchParams.get('id_usuario')

    let query = `
      SELECT i.*, mp.medio_pago, g.descripcion as descripcion_gasto,
             p.importe_a_pagar, p.fecha_pago,
             u.nombre as usuario_nombre
      FROM Impacta i
      JOIN Medio_pago mp ON i.id_medio_pago = mp.id_medio_pago
      JOIN Pago p ON i.id_pago = p.id_pago
      JOIN Gasto g ON p.id_gasto = g.id_gasto
      JOIN Usuario u ON g.id_usuario = u.id_usuario
    `
    let params: any[] = []

    if (idUsuario) {
      query += ' WHERE g.id_usuario = $1'
      params.push(idUsuario)
    }

    query += ' ORDER BY i.año DESC, i.mes DESC, p.fecha_pago DESC'

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error al obtener impactos:', error)
    return NextResponse.json(
      { error: 'Error al obtener datos de impacto' },
      { status: 500 }
    )
  }
}