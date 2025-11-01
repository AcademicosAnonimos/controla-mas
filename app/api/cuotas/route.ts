import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idUsuario = searchParams.get('id_usuario')

    let query = `
      SELECT c.*, g.descripcion as descripcion_gasto, e.descripcion as estado,
             g.monto_total, tg.descripcion as tipo_gasto
      FROM Cuota c
      JOIN Gasto g ON c.id_gasto = g.id_gasto
      JOIN Estado e ON c.id_estado = e.id_estado
      JOIN Tipo_gasto tg ON g.id_tipo_gasto = tg.id_tipo_gasto
    `
    let params: any[] = []

    if (idUsuario) {
      query += ' WHERE g.id_usuario = $1'
      params.push(idUsuario)
    }

    query += ' ORDER BY c.fecha_vencimiento_cuota ASC'

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener cuotas' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    const { id_cuota, accion } = await request.json()

    if (accion === 'pagar') {
      await client.query('BEGIN')

      // Obtener información de la cuota
      const cuotaResult = await client.query(
        `SELECT c.*, g.monto_total, g.id_usuario, g.descripcion
         FROM Cuota c
         JOIN Gasto g ON c.id_gasto = g.id_gasto
         WHERE c.id_cuota = $1`,
        [id_cuota]
      )

      if (cuotaResult.rows.length === 0) {
        throw new Error('Cuota no encontrada')
      }

      const cuota = cuotaResult.rows[0]
      const montoCuota = cuota.monto_total / cuota.total_cuotas

      // Crear pago
      const pagoResult = await client.query(
        `INSERT INTO Pago (importe_a_pagar, fecha_pago, id_gasto) 
         VALUES ($1, CURRENT_DATE, $2) RETURNING *`,
        [montoCuota, cuota.id_gasto]
      )

      const pago = pagoResult.rows[0]

      // Actualizar estado de la cuota
      await client.query(
        'UPDATE Cuota SET id_estado = 2 WHERE id_cuota = $1',
        [id_cuota]
      )

      // Actualizar monto disponible del usuario
      await client.query(
        'UPDATE Usuario SET monto_disponible = monto_disponible - $1 WHERE id_usuario = $2',
        [montoCuota, cuota.id_usuario]
      )

      await client.query('COMMIT')
      return NextResponse.json({ 
        message: 'Cuota pagada correctamente',
        pago: pago 
      })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al procesar cuota' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}