import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { categoria } = await request.json()

    if (!categoria) {
      return NextResponse.json(
        { error: 'El nombre de la categoría es requerido' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      'UPDATE Categoria SET categoria = $1 WHERE id_categoria = $2 RETURNING *',
      [categoria, params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
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
      'DELETE FROM Categoria WHERE id_categoria = $1 RETURNING *',
      [params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Categoría eliminada correctamente' })
  } catch (error: any) {
    if (error.code === '23503') {
      return NextResponse.json(
        { error: 'No se puede eliminar la categoría porque tiene gastos asociados' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al eliminar categoría' },
      { status: 500 }
    )
  }
}