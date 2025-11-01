import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { medio_pago } = await request.json()

    if (!medio_pago || !medio_pago.trim()) {
      return NextResponse.json(
        { error: 'El nombre del medio de pago es requerido' },
        { status: 400 }
      )
    }

    const nombreMedio = medio_pago.trim().toLowerCase()

    // Verificar si ya existe otro medio con el mismo nombre (excluyendo el actual)
    const existeResult = await pool.query(
      'SELECT id_medio_pago FROM Medio_pago WHERE LOWER(medio_pago) = LOWER($1) AND id_medio_pago != $2',
      [nombreMedio, params.id]
    )

    if (existeResult.rows.length > 0) {
      return NextResponse.json(
        { 
          error: 'Ya existe otro medio de pago con ese nombre',
          medioExistente: existeResult.rows[0]
        },
        { status: 400 }
      )
    }

    // Actualizar medio de pago
    const result = await pool.query(
      'UPDATE Medio_pago SET medio_pago = $1 WHERE id_medio_pago = $2 RETURNING *',
      [medio_pago.trim(), params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Medio de pago no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error('Error en PUT /api/medio-pago/[id]:', error)
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe un medio de pago con ese nombre (constraint)' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar medio de pago' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar si hay pagos asociados
    const pagosAsociados = await pool.query(
      'SELECT 1 FROM Pagosxmedio_pago WHERE id_medio_pago = $1 LIMIT 1',
      [params.id]
    )

    if (pagosAsociados.rows.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar el medio de pago porque tiene pagos asociados' },
        { status: 400 }
      )
    }

    // Verificar si hay impactos asociados
    const impactosAsociados = await pool.query(
      'SELECT 1 FROM Impacta WHERE id_medio_pago = $1 LIMIT 1',
      [params.id]
    )

    if (impactosAsociados.rows.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar el medio de pago porque tiene impactos asociados' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      'DELETE FROM Medio_pago WHERE id_medio_pago = $1 RETURNING *',
      [params.id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Medio de pago no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      message: 'Medio de pago eliminado correctamente',
      medioEliminado: result.rows[0]
    })
  } catch (error) {
    console.error('Error en DELETE /api/medio-pago/[id]:', error)
    return NextResponse.json(
      { error: 'Error al eliminar medio de pago' },
      { status: 500 }
    )
  }
}