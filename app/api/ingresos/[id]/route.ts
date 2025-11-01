import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      `SELECT i.*, u.nombre as usuario_nombre 
       FROM Ingreso i 
       JOIN Usuario u ON i.id_usuario = u.id_usuario 
       WHERE i.id_ingreso = $1`,
      [params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ingreso no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener ingreso' },
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
    
    const { descripcion, fecha_ingreso, monto, id_usuario } = await request.json()

    // Obtener ingreso actual para calcular diferencia
    const ingresoActual = await client.query(
      'SELECT monto, id_usuario FROM Ingreso WHERE id_ingreso = $1',
      [params.id]
    )

    if (ingresoActual.rows.length === 0) {
      throw new Error('Ingreso no encontrado')
    }

    const montoAnterior = ingresoActual.rows[0].monto
    const usuarioAnterior = ingresoActual.rows[0].id_usuario

    // Actualizar ingreso
    const result = await client.query(
      `UPDATE Ingreso 
       SET descripcion = $1, fecha_ingreso = $2, monto = $3, id_usuario = $4 
       WHERE id_ingreso = $5 RETURNING *`,
      [descripcion, fecha_ingreso, monto, id_usuario, params.id]
    )

    if (result.rows.length === 0) {
      throw new Error('Ingreso no encontrado')
    }

    // Revertir monto anterior y aplicar nuevo monto
    if (usuarioAnterior === id_usuario) {
      // Mismo usuario: ajustar diferencia
      const diferencia = monto - montoAnterior
      await client.query(
        'UPDATE Usuario SET monto_disponible = monto_disponible + $1 WHERE id_usuario = $2',
        [diferencia, id_usuario]
      )
    } else {
      // Usuario diferente: revertir anterior y aplicar nuevo
      await client.query(
        'UPDATE Usuario SET monto_disponible = monto_disponible - $1 WHERE id_usuario = $2',
        [montoAnterior, usuarioAnterior]
      )
      await client.query(
        'UPDATE Usuario SET monto_disponible = monto_disponible + $1 WHERE id_usuario = $2',
        [monto, id_usuario]
      )
    }

    await client.query('COMMIT')
    return NextResponse.json(result.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar ingreso' },
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

    // Obtener ingreso para revertir monto
    const ingresoResult = await client.query(
      'SELECT monto, id_usuario FROM Ingreso WHERE id_ingreso = $1',
      [params.id]
    )

    if (ingresoResult.rows.length === 0) {
      return NextResponse.json({ error: 'Ingreso no encontrado' }, { status: 404 })
    }

    const ingreso = ingresoResult.rows[0]

    // Eliminar ingreso
    const deleteResult = await client.query(
      'DELETE FROM Ingreso WHERE id_ingreso = $1 RETURNING *',
      [params.id]
    )

    // Revertir monto disponible
    await client.query(
      'UPDATE Usuario SET monto_disponible = monto_disponible - $1 WHERE id_usuario = $2',
      [ingreso.monto, ingreso.id_usuario]
    )

    await client.query('COMMIT')
    return NextResponse.json({ message: 'Ingreso eliminado correctamente' })
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { error: 'Error al eliminar ingreso' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}