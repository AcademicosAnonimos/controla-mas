import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idUsuario = searchParams.get('id_usuario')
    const mes = searchParams.get('mes')
    const año = searchParams.get('año')

    let query = `
      SELECT 
        hp.id_historial,
        hp.id_categoria,
        hp.id_usuario,
        hp.mes,
        hp.año,
        hp.monto_predicho,
        c.categoria,
        TO_CHAR(TO_DATE(hp.mes::text, 'MM'), 'Month') as nombre_mes,
        u.nombre as nombre_usuario
      FROM Historial_prediccion hp
      JOIN Categoria c ON hp.id_categoria = c.id_categoria
      JOIN Usuario u ON hp.id_usuario = u.id_usuario
    `
    let params: any[] = []
    let whereConditions: string[] = []

    // Filtrar por usuario - AHORA DIRECTO desde historial_prediccion
    if (idUsuario) {
      whereConditions.push('hp.id_usuario = $' + (params.length + 1))
      params.push(parseInt(idUsuario))
    }

    if (mes) {
      whereConditions.push('hp.mes = $' + (params.length + 1))
      params.push(parseInt(mes))
    }

    if (año) {
      whereConditions.push('hp.año = $' + (params.length + 1))
      params.push(parseInt(año))
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ')
    }

    // Ya no necesitamos GROUP BY porque no hay JOIN con Gasto
    query += ' ORDER BY hp.año DESC, hp.mes DESC, c.categoria'

    //console.log('🔍 Query ejecutada:', query)
    //console.log('🔍 Parámetros:', params)

    const result = await pool.query(query, params)
    
    //console.log('✅ Resultados obtenidos:', result.rows.length)
    //console.log('✅ Resultados obtenidos:', result)
    
    return NextResponse.json(result.rows)
    
  } catch (error) {
    console.error('❌ Error al obtener historial de predicción:', error)
    return NextResponse.json(
      { error: 'Error al obtener historial de predicción' },
      { status: 500 }
    )
  }
}