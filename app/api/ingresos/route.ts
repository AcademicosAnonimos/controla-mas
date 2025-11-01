import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idUsuario = searchParams.get('id_usuario')

    let query = `
      SELECT i.*, u.nombre as usuario_nombre
      FROM Ingreso i
      JOIN Usuario u ON i.id_usuario = u.id_usuario
    `
    let params: any[] = []

    if (idUsuario) {
      query += ' WHERE i.id_usuario = $1'
      params.push(idUsuario)
    }

    query += ' ORDER BY i.fecha_ingreso DESC'

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener ingresos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const { descripcion, fecha_ingreso, monto, id_usuario } = await request.json()

    // Validaciones
    if (!descripcion || !fecha_ingreso || !monto || !id_usuario) {
      throw new Error('Todos los campos son requeridos')
    }

    if (monto <= 0) {
      throw new Error('El monto debe ser mayor a 0')
    }

    // Insertar ingreso
    const ingresoResult = await client.query(
      `INSERT INTO Ingreso (descripcion, fecha_ingreso, monto, id_usuario) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [descripcion, fecha_ingreso, monto, id_usuario]
    )

    // Actualizar monto disponible del usuario
    await client.query(
      'UPDATE Usuario SET monto_disponible = monto_disponible + $1 WHERE id_usuario = $2',
      [monto, id_usuario]
    )

    await client.query('COMMIT')
    return NextResponse.json(ingresoResult.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear ingreso' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}