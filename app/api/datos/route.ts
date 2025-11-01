import { NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Consulta para obtener los usuarios
    const result = await client.query(`
      SELECT id_usuario, nombre, monto_disponible 
      FROM Usuario 
      ORDER BY id_usuario
    `);
    
    client.release();

    // Convertir NUMERIC (que viene como string) a número
    const usuarios = result.rows.map(usuario => ({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      monto_disponible: parseFloat(usuario.monto_disponible) // Convertir a número
    }));
    
    return NextResponse.json({ 
      success: true,
      usuarios: usuarios,
      total: result.rowCount
    });
    
  } catch (error: any) {
    console.error("Error de base de datos:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Error al conectar con la base de datos",
        details: error.message 
      },
      { status: 500 }
    );
  }
}