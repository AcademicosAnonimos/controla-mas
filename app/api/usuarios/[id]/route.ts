import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      'SELECT id_usuario, nombre, monto_disponible FROM Usuario WHERE id_usuario = $1',
      [params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { nombre, monto_disponible } = await request.json()
    
    const result = await pool.query(
      'UPDATE Usuario SET nombre = $1, monto_disponible = $2 WHERE id_usuario = $3 RETURNING *',
      [nombre, monto_disponible, params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      'DELETE FROM Usuario WHERE id_usuario = $1 RETURNING *',
      [params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    )
  }
}