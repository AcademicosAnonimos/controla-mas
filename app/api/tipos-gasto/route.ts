import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id_tipo_gasto, descripcion 
      FROM Tipo_gasto 
      ORDER BY id_tipo_gasto
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener tipos de gasto' },
      { status: 500 }
    )
  }
}