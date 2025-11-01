export interface Usuario {
  id_usuario: number;
  nombre: string;
  monto_disponible: number;
}

export interface Ingreso {
  id_ingreso: number;
  descripcion: string;
  fecha_ingreso: string;
  monto: number;
  id_usuario: number;
}

export interface Gasto {
  id_gasto: number;
  mes: number;
  año: number;
  monto_total: number;
  descripcion: string;
  id_tipo_gasto: number;
  id_categoria: number;
  id_usuario: number;
  tipo_gasto?: string;
  categoria?: string;
}

export interface Cuota {
  id_cuota: number;
  nro_cuota: number;
  total_cuotas: number;
  fecha_vencimiento_cuota: string;
  id_gasto: number;
  id_estado: number;
  estado?: string;
  descripcion_gasto?: string;
}

export interface Pago {
  id_pago: number;
  importe_a_pagar: number;
  fecha_pago: string;
  id_gasto: number;
  medios_pago?: MedioPagoDetalle[];
}

export interface MedioPagoDetalle {
  id_medio_pago: number;
  medio_pago: string;
  importe_pagado: number;
}

export interface Categoria {
  id_categoria: number;
  categoria: string;
}

export interface TipoGasto {
  id_tipo_gasto: number;
  descripcion: string;
}

export interface Estado {
  id_estado: number;
  descripcion: string;
}

export interface MedioPago {
  id_medio_pago: number;
  medio_pago: string;
}

export interface DashboardData {
  saldo_actual: number;
  ingresos_mes: number;
  gastos_mes: number;
  proximas_cuotas: Cuota[];
  gastos_por_categoria: { categoria: string; total: number }[];
  prediccion_proximo_mes: { categoria: string; monto_predicho: number }[];
}