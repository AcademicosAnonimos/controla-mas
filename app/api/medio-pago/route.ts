import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id_medio_pago, medio_pago 
      FROM Medio_pago 
      ORDER BY id_medio_pago
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener medios de pago' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { medio_pago } = await request.json()

    if (!medio_pago || !medio_pago.trim()) {
      return NextResponse.json(
        { error: 'El nombre del medio de pago es requerido' },
        { status: 400 }
      )
    }

    const nombreMedio = medio_pago.trim().toLowerCase()

    // Primero verificar si ya existe (case insensitive)
    const existeResult = await pool.query(
      'SELECT id_medio_pago FROM Medio_pago WHERE LOWER(medio_pago) = LOWER($1)',
      [nombreMedio]
    )

    if (existeResult.rows.length > 0) {
      return NextResponse.json(
        { 
          error: 'Ya existe un medio de pago con ese nombre',
          medioExistente: existeResult.rows[0]
        },
        { status: 400 }
      )
    }

    // Insertar nuevo medio de pago
    const result = await pool.query(
      'INSERT INTO Medio_pago (medio_pago) VALUES ($1) RETURNING *',
      [medio_pago.trim()]
    )
    
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error('Error en POST /api/medio-pago:', error)
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe un medio de pago con ese nombre (constraint)' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al crear medio de pago' },
      { status: 500 }
    )
  }
}