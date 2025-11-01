import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      `SELECT g.*, tg.descripcion as tipo_gasto, c.categoria
       FROM Gasto g
       JOIN Tipo_gasto tg ON g.id_tipo_gasto = tg.id_tipo_gasto
       JOIN Categoria c ON g.id_categoria = c.id_categoria
       WHERE g.id_gasto = $1`,
      [params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Gasto no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener gasto' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const { mes, año, monto_total, descripcion, id_tipo_gasto, id_categoria, id_usuario } = await request.json()

    // Obtener gasto actual para calcular diferencia
    const gastoActual = await client.query(
      'SELECT monto_total, id_usuario FROM Gasto WHERE id_gasto = $1',
      [params.id]
    )

    if (gastoActual.rows.length === 0) {
      throw new Error('Gasto no encontrado')
    }

    const montoAnterior = gastoActual.rows[0].monto_total
    const usuarioAnterior = gastoActual.rows[0].id_usuario

    // Actualizar gasto
    const result = await client.query(
      `UPDATE Gasto 
       SET mes = $1, año = $2, monto_total = $3, descripcion = $4, 
           id_tipo_gasto = $5, id_categoria = $6, id_usuario = $7 
       WHERE id_gasto = $8 RETURNING *`,
      [mes, año, monto_total, descripcion, id_tipo_gasto, id_categoria, id_usuario, params.id]
    )

    if (result.rows.length === 0) {
      throw new Error('Gasto no encontrado')
    }

    // Ajustar monto disponible
    if (usuarioAnterior === id_usuario) {
      // Mismo usuario: ajustar diferencia
      const diferencia = monto_total - montoAnterior
      await client.query(
        'UPDATE Usuario SET monto_disponible = monto_disponible - $1 WHERE id_usuario = $2',
        [diferencia, id_usuario]
      )
    } else {
      // Usuario diferente: revertir anterior y aplicar nuevo
      await client.query(
        'UPDATE Usuario SET monto_disponible = monto_disponible + $1 WHERE id_usuario = $2',
        [montoAnterior, usuarioAnterior]
      )
      await client.query(
        'UPDATE Usuario SET monto_disponible = monto_disponible - $1 WHERE id_usuario = $2',
        [monto_total, id_usuario]
      )
    }

    await client.query('COMMIT')
    return NextResponse.json(result.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar gasto' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')

    // Obtener gasto para revertir monto
    const gastoResult = await client.query(
      'SELECT monto_total, id_usuario FROM Gasto WHERE id_gasto = $1',
      [params.id]
    )

    if (gastoResult.rows.length === 0) {
      return NextResponse.json({ error: 'Gasto no encontrado' }, { status: 404 })
    }

    const gasto = gastoResult.rows[0]

    // Eliminar gasto (CASCADE eliminará cuotas, vence, etc.)
    const deleteResult = await client.query(
      'DELETE FROM Gasto WHERE id_gasto = $1 RETURNING *',
      [params.id]
    )

    // Revertir monto disponible (sumar porque se elimina un gasto)
    await client.query(
      'UPDATE Usuario SET monto_disponible = monto_disponible + $1 WHERE id_usuario = $2',
      [gasto.monto_total, gasto.id_usuario]
    )

    await client.query('COMMIT')
    return NextResponse.json({ message: 'Gasto eliminado correctamente' })
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { error: 'Error al eliminar gasto' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}