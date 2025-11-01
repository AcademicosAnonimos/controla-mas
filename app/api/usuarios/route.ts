import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id_usuario, nombre, monto_disponible 
      FROM Usuario 
      ORDER BY nombre
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, monto_disponible } = await request.json()
    
    const result = await pool.query(
      'INSERT INTO Usuario (nombre, monto_disponible) VALUES ($1, $2) RETURNING *',
      [nombre, monto_disponible || 0]
    )
    
    return NextResponse.json(result.rows[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    )
  }
}