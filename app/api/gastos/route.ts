import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idUsuario = searchParams.get('id_usuario')

    let query = `
      SELECT g.*, tg.descripcion as tipo_gasto, cat.categoria
      FROM Gasto g
      JOIN Tipo_gasto tg ON g.id_tipo_gasto = tg.id_tipo_gasto
      JOIN Categoria cat ON g.id_categoria = cat.id_categoria
    `
    let params: any[] = []

    if (idUsuario) {
      query += ' WHERE g.id_usuario = $1'
      params.push(idUsuario)
    }

    query += ' ORDER BY g.año DESC, g.mes DESC'

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener gastos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const { mes, año, monto_total, descripcion, id_tipo_gasto, id_categoria, id_usuario, dia_vencimiento, total_cuotas, fecha_primera_cuota } = await request.json()

    // Insertar gasto
    const gastoResult = await client.query(
      `INSERT INTO Gasto (mes, año, monto_total, descripcion, id_tipo_gasto, id_categoria, id_usuario) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [mes, año, monto_total, descripcion, id_tipo_gasto, id_categoria, id_usuario]
    )

    const gasto = gastoResult.rows[0]

    // Lógica específica por tipo de gasto
    if (id_tipo_gasto === 1) { // Fijo - Insertar en Vence
      if (!dia_vencimiento) {
        throw new Error('Día de vencimiento requerido para gastos fijos')
      }
      
      await client.query(
        'INSERT INTO Vence (id_gasto, id_tipogasto, dia) VALUES ($1, $2, $3)',
        [gasto.id_gasto, id_tipo_gasto, dia_vencimiento]
      )
    } 
    else if (id_tipo_gasto === 3) { // Temporal - Generar cuotas
      if (!total_cuotas || !fecha_primera_cuota) {
        throw new Error('Total de cuotas y fecha de primera cuota requeridos para gastos temporales')
      }

      const cuotaMensual = monto_total / total_cuotas
      const fechaVencimiento = new Date(fecha_primera_cuota)

      for (let i = 1; i <= total_cuotas; i++) {
        await client.query(
          `INSERT INTO Cuota (nro_cuota, total_cuotas, fecha_vencimiento_cuota, id_gasto, id_estado) 
           VALUES ($1, $2, $3, $4, 1)`, // Estado 1 = Pendiente
          [i, total_cuotas, fechaVencimiento.toISOString().split('T')[0], gasto.id_gasto]
        )
        
        // Incrementar un mes para la siguiente cuota
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1)
      }
    }

    await client.query('COMMIT')
    return NextResponse.json(gasto)
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear gasto' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}