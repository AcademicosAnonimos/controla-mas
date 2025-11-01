import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id_estado, descripcion 
      FROM Estado 
      ORDER BY id_estado
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener estados' },
      { status: 500 }
    )
  }
}