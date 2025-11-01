import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idUsuario = searchParams.get('id_usuario')

    let query = `
      SELECT p.*, g.descripcion as descripcion_gasto, 
             array_agg(json_build_object(
               'id_medio_pago', mp.id_medio_pago,
               'medio_pago', mp.medio_pago,
               'importe_pagado', pxmp.importe_pagado
             )) as medios_pago
      FROM Pago p
      JOIN Gasto g ON p.id_gasto = g.id_gasto
      LEFT JOIN Pagosxmedio_pago pxmp ON p.id_pago = pxmp.id_pago
      LEFT JOIN Medio_pago mp ON pxmp.id_medio_pago = mp.id_medio_pago
    `
    let params: any[] = []

    if (idUsuario) {
      query += ' WHERE g.id_usuario = $1'
      params.push(idUsuario)
    }

    query += ' GROUP BY p.id_pago, g.descripcion ORDER BY p.fecha_pago DESC'

    const result = await pool.query(query, params)
    
    // Procesar resultados para agrupar medios de pago
    const pagos = result.rows.map(row => ({
      ...row,
      medios_pago: row.medios_pago.filter((mp: any) => mp.id_medio_pago !== null)
    }))

    return NextResponse.json(pagos)
  } catch (error) {
    console.error('Error al obtener pagos:', error)
    return NextResponse.json(
      { error: 'Error al obtener pagos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const { importe_a_pagar, fecha_pago, id_gasto, medios_pago, mes_impacto, año_impacto } = await request.json()

    // Validaciones
    if (!importe_a_pagar || importe_a_pagar <= 0) {
      throw new Error('Importe a pagar debe ser mayor a 0')
    }

    if (!id_gasto) {
      throw new Error('Gasto es requerido')
    }

    // Obtener información del gasto
    const gastoResult = await client.query(
      `SELECT g.*, u.id_usuario 
       FROM Gasto g 
       JOIN Usuario u ON g.id_usuario = u.id_usuario 
       WHERE g.id_gasto = $1`,
      [id_gasto]
    )

    if (gastoResult.rows.length === 0) {
      throw new Error('Gasto no encontrado')
    }

    const gasto = gastoResult.rows[0]

    // Crear pago
    const pagoResult = await client.query(
      `INSERT INTO Pago (importe_a_pagar, fecha_pago, id_gasto) 
       VALUES ($1, $2, $3) RETURNING *`,
      [importe_a_pagar, fecha_pago || new Date().toISOString().split('T')[0], id_gasto]
    )

    const pago = pagoResult.rows[0]

    // Procesar medios de pago
    if (medios_pago && medios_pago.length > 0) {
      for (const medio of medios_pago) {
        await client.query(
          `INSERT INTO Pagosxmedio_pago (id_pago, id_medio_pago, importe_pagado) 
           VALUES ($1, $2, $3)`,
          [pago.id_pago, medio.id_medio_pago, medio.importe_pagado]
        )

        // Si el medio es crédito (id=3) y hay mes/año de impacto, registrar en Impacta
        if (medio.id_medio_pago === 3 && mes_impacto && año_impacto) {
          await client.query(
            `INSERT INTO Impacta (id_pago, id_medio_pago, mes, año) 
             VALUES ($1, $2, $3, $4)`,
            [pago.id_pago, medio.id_medio_pago, mes_impacto, año_impacto]
          )
        }
      }
    }

    // Actualizar monto disponible del usuario
    await client.query(
      'UPDATE Usuario SET monto_disponible = monto_disponible - $1 WHERE id_usuario = $2',
      [importe_a_pagar, gasto.id_usuario]
    )

    await client.query('COMMIT')
    return NextResponse.json(pago)
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear pago' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}