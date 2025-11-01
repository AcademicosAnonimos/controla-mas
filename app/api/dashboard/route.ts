import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idUsuario = searchParams.get('id_usuario')
    console.log('🔍 ID Usuario recibido:', idUsuario)

    if (!idUsuario) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 })
    }

    // Validar que el usuario existe
    const usuarioExists = await pool.query(
      'SELECT id_usuario FROM Usuario WHERE id_usuario = $1',
      [idUsuario]
    )

    if (usuarioExists.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener todos los datos en paralelo para mejor performance
    const [
      saldoResult,
      ingresosResult,
      gastosResult,
      cuotasResult,
      gastosCategoriaResult,
      prediccionResult
    ] = await Promise.all([
      // 1. Saldo actual
      pool.query(
        'SELECT COALESCE(monto_disponible, 0) as monto_disponible FROM Usuario WHERE id_usuario = $1',
        [idUsuario]
      ),
      
      // 2. Ingresos del mes actual
      pool.query(
        `SELECT COALESCE(SUM(monto), 0) as total 
         FROM Ingreso 
         WHERE id_usuario = $1 
         AND EXTRACT(MONTH FROM fecha_ingreso) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE)`,
        [idUsuario]
      ),
      
      // 3. Gastos del mes actual
      pool.query(
        `SELECT COALESCE(SUM(monto_total), 0) as total 
         FROM Gasto 
         WHERE id_usuario = $1 
         AND mes = EXTRACT(MONTH FROM CURRENT_DATE)
         AND año = EXTRACT(YEAR FROM CURRENT_DATE)`,
        [idUsuario]
      ),
      
      // 4. Próximas cuotas (próximos 30 días)
      pool.query(
        `SELECT 
           c.id_cuota,
           c.nro_cuota,
           c.total_cuotas,
           c.fecha_vencimiento_cuota,
           g.descripcion as descripcion_gasto,
           e.descripcion as estado
         FROM Cuota c
         JOIN Gasto g ON c.id_gasto = g.id_gasto
         JOIN Estado e ON c.id_estado = e.id_estado
         WHERE g.id_usuario = $1 
         AND c.fecha_vencimiento_cuota BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
         AND c.id_estado != 2
         ORDER BY c.fecha_vencimiento_cuota ASC
         LIMIT 5`,
        [idUsuario]
      ).catch(error => {
        console.log('⚠️ Error en cuotas, retornando vacío:', error)
        return { rows: [] }
      }),
      
      // 5. Gastos por categoría (últimos 6 meses) - CORREGIDA
      pool.query(
        `SELECT 
           cat.categoria, 
           COALESCE(SUM(g.monto_total), 0) as total
         FROM Gasto g
         JOIN Categoria cat ON g.id_categoria = cat.id_categoria
         WHERE g.id_usuario = $1 
         AND (
           (g.año = EXTRACT(YEAR FROM CURRENT_DATE) AND g.mes BETWEEN EXTRACT(MONTH FROM CURRENT_DATE) - 5 AND EXTRACT(MONTH FROM CURRENT_DATE))
           OR
           (g.año = EXTRACT(YEAR FROM CURRENT_DATE) - 1 AND g.mes BETWEEN EXTRACT(MONTH FROM CURRENT_DATE) + 7 AND 12)
         )
         GROUP BY cat.id_categoria, cat.categoria
         ORDER BY total DESC`,
        [idUsuario]
      ).catch(error => {
        console.log('⚠️ Error en categorías, retornando vacío:', error)
        return { rows: [] }
      }),
      
      // 6. Predicción próximo mes - SIMPLIFICADA con la nueva FK
      pool.query(
        `SELECT 
           c.categoria, 
           COALESCE(hp.monto_predicho, 0) as monto_predicho
         FROM Historial_prediccion hp
         JOIN Categoria c ON hp.id_categoria = c.id_categoria
         WHERE hp.id_usuario = $1
         AND hp.mes = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '1 month')
         AND hp.año = EXTRACT(YEAR FROM CURRENT_DATE + INTERVAL '1 month')
         ORDER BY hp.monto_predicho DESC
         LIMIT 10`,
        [idUsuario]
      ).catch(error => {
        console.log('⚠️ Error en predicción, usando fallback:', error)
        // Fallback: usar promedio de gastos históricos
        return pool.query(
          `SELECT 
             c.categoria,
             COALESCE(AVG(g.monto_total), 0) as monto_predicho
           FROM Gasto g
           JOIN Categoria c ON g.id_categoria = c.id_categoria
           WHERE g.id_usuario = $1
           AND g.fecha_gasto >= CURRENT_DATE - INTERVAL '6 months'
           GROUP BY c.id_categoria, c.categoria
           HAVING AVG(g.monto_total) > 0
           ORDER BY monto_predicho DESC
           LIMIT 10`,
          [idUsuario]
        ).catch(fallbackError => {
          console.log('⚠️ Fallback también falló:', fallbackError)
          return { rows: [] }
        })
      })
    ])

    const dashboardData = {
      saldo_actual: Number(saldoResult.rows[0]?.monto_disponible) || 0,
      ingresos_mes: Number(ingresosResult.rows[0]?.total) || 0,
      gastos_mes: Number(gastosResult.rows[0]?.total) || 0,
      proximas_cuotas: cuotasResult.rows.map(cuota => ({
        id_cuota: cuota.id_cuota,
        nro_cuota: cuota.nro_cuota,
        total_cuotas: cuota.total_cuotas,
        fecha_vencimiento_cuota: new Date(cuota.fecha_vencimiento_cuota).toISOString().split('T')[0],
        descripcion_gasto: cuota.descripcion_gasto,
        estado: cuota.estado
      })),
      gastos_por_categoria: gastosCategoriaResult.rows.map(cat => ({
        categoria: cat.categoria,
        total: Number(cat.total)
      })),
      prediccion_proximo_mes: prediccionResult.rows.map(pred => ({
        categoria: pred.categoria,
        monto_predicho: Number(pred.monto_predicho)
      }))
    }

    /*
    console.log('✅ Dashboard data cargada correctamente:')
    console.log('- Saldo:', dashboardData.saldo_actual)
    console.log('- Ingresos:', dashboardData.ingresos_mes)
    console.log('- Gastos:', dashboardData.gastos_mes)
    console.log('- Cuotas:', dashboardData.proximas_cuotas.length)
    console.log('- Categorías:', dashboardData.gastos_por_categoria.length)
    console.log('- Predicciones:', dashboardData.prediccion_proximo_mes.length)
    

    // Debug detallado
    console.log('📊 Detalle categorías:', dashboardData.gastos_por_categoria)
    console.log('📊 Detalle predicciones:', dashboardData.prediccion_proximo_mes)
    */
    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('❌ Error general en dashboard:', error)
    
    return NextResponse.json(
      { 
        error: `Error al cargar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        saldo_actual: 0,
        ingresos_mes: 0,
        gastos_mes: 0,
        proximas_cuotas: [],
        gastos_por_categoria: [],
        prediccion_proximo_mes: []
      },
      { status: 500 }
    )
  }
}