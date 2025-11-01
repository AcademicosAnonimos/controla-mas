# **CONTROLAMAS - Sistema de Gestión Financiera Personal**

## 📋 Descripción

Sistema web completo para gestión y control de finanzas personales desarrollado con Next.js 14, PostgreSQL y TypeScript. Permite a los usuarios gestionar ingresos, gastos, categorías y obtener predicciones financieras inteligentes.

## 🚀 **Cómo Ejecutar el Proyecto**

### **Prerrequisitos**

- Node.js 18+
- PostgreSQL 12+
- npm o yarn
### **Instalación y Configuración**

1. **Clonar el repositorio**

`git clone <url-del-repositorio>`
`cd CONTROLAMAS`

2. **Instalar dependencias**

`npm install`

3. **Configurar variables de entorno**
    
```
# Crear archivo .env.local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=controlamas
DB_USER=tu_usuario
DB_PASSWORD=tu_password
```

4. **Ejecutar en desarrollo**

`npm run dev`

5. **Build para producción**

```
npm run build
npm start
```

## 🗃️ **Estructura de la Base de Datos**

### **Tablas Principales**

|Tabla|Descripción|Relaciones|
|---|---|---|
|**Usuario**|Usuarios del sistema con saldo disponible|-|
|**Gasto**|Gastos registrados por usuario, mes y año|Usuario, Categoria, Tipo_gasto|
|**Ingreso**|Ingresos del usuario (sueldo, freelance, etc.)|Usuario|
|**Categoria**|Categorías de gastos (comida, transporte, etc.)|-|
|**Tipo_gasto**|Tipos de gasto: fijo, variable, etc.|-|
|**Cuota**|Cuotas de un gasto financiado|Gasto, Estado|
|**Pago**|Pagos realizados a un gasto|Gasto|
|**Medio_pago**|Tarjeta, efectivo, transferencia, etc.|-|
|**Estado**|Estados de cuotas: pendiente, pagada, vencida|-|
|**Historial_prediccion**|Predicciones mensuales por categoría|Usuario, Categoria|
|**Vence**|Días de vencimiento por tipo de gasto fijo|Gasto, Tipo_gasto|
|**Pagosxmedio_pago**|Desglose de pagos por medio de pago|Pago, Medio_pago|
|**Impacta**|Registro de impacto de pagos en medios por período|Pago, Medio_pago|

### **Relaciones Clave**

- **Usuario** → **Gasto** (1:N) - Un usuario tiene muchos gastos

- **Usuario** → **Ingreso** (1:N) - Un usuario tiene muchos ingresos

- **Categoria** → **Gasto** (1:N) - Una categoría tiene muchos gastos

- **Gasto** → **Cuota** (1:N) - Un gasto puede tener muchas cuotas

- **Gasto** → **Pago** (1:N) - Un gasto puede tener muchos pagos


## 🎯 **Funcionalidades Principales**

### **📊 Dashboard**

- Resumen financiero en tiempo real
- Gráficos de gastos por categoría
- Predicciones para el próximo mes
- Próximas cuotas a vencer

### **💰 Gestión Financiera**

- **Gastos**: CRUD completo de gastos
- **Ingresos**: Registro y gestión de ingresos
- **Categorías**: Organización personalizada
- **Pagos**: Seguimiento de pagos realizados

### **🔮 Sistema de Predicciones**

- Análisis histórico de 6 meses
- Predicciones por categoría
- Tendencias y patrones de gasto

### **📞 Contacto**

- Formulario integrado con Formspree
- Envío automático de emails
- Preguntas frecuentes


## 🛠️ **Tecnologías Utilizadas**

### **Frontend**

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Bootstrap** - Componentes UI
- **Chart.js** - Gráficos y visualizaciones
### **Backend**

- **Next.js API Routes** - Endpoints
- **PostgreSQL** - Base de datos
- **pg** - Cliente PostgreSQL

### **Herramientas**

- **Formspree** - Formularios de contacto
- **Font Awesome** - Iconografía


## 🚀 **Scripts Disponibles**

```
npm run dev      # Desarrollo
npm run build    # Build producción  
npm run start    # Producción
npm run lint     # Análisis de código
```