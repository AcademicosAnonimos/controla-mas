"use strict";(()=>{var o={};o.id=707,o.ids=[707],o.modules={517:o=>{o.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:o=>{o.exports=import("pg")},50:(o,a,e)=>{e.a(o,async(o,t)=>{try{e.r(a),e.d(a,{headerHooks:()=>u,originalPathname:()=>T,requestAsyncStorage:()=>n,routeModule:()=>E,serverHooks:()=>d,staticGenerationAsyncStorage:()=>_,staticGenerationBailout:()=>R});var r=e(884),i=e(6132),s=e(1685),c=o([s]);s=(c.then?(await c)():c)[0];let E=new r.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/dashboard/route",pathname:"/api/dashboard",filename:"route",bundlePath:"app/api/dashboard/route"},resolvedPagePath:"C:\\Users\\User\\Documents\\PROYECTOS\\BASE DE DATOS - Facultad\\ProbandoReact\\ControlaMas\\app\\api\\dashboard\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:n,staticGenerationAsyncStorage:_,serverHooks:d,headerHooks:u,staticGenerationBailout:R}=E,T="/api/dashboard/route";t()}catch(o){t(o)}})},1685:(o,a,e)=>{e.a(o,async(o,t)=>{try{e.r(a),e.d(a,{GET:()=>GET,dynamic:()=>c});var r=e(5798),i=e(8818),s=o([i]);i=(s.then?(await s)():s)[0];let c="force-dynamic";async function GET(o){try{let{searchParams:a}=new URL(o.url),e=a.get("id_usuario");if(console.log("\uD83D\uDD0D ID Usuario recibido:",e),!e)return r.Z.json({error:"ID de usuario requerido"},{status:400});let t=await i.Z.query("SELECT id_usuario FROM Usuario WHERE id_usuario = $1",[e]);if(0===t.rows.length)return r.Z.json({error:"Usuario no encontrado"},{status:404});let[s,c,E,n,_,d]=await Promise.all([i.Z.query("SELECT COALESCE(monto_disponible, 0) as monto_disponible FROM Usuario WHERE id_usuario = $1",[e]),i.Z.query(`SELECT COALESCE(SUM(monto), 0) as total 
         FROM Ingreso 
         WHERE id_usuario = $1 
         AND EXTRACT(MONTH FROM fecha_ingreso) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM fecha_ingreso) = EXTRACT(YEAR FROM CURRENT_DATE)`,[e]),i.Z.query(`SELECT COALESCE(SUM(monto_total), 0) as total 
         FROM Gasto 
         WHERE id_usuario = $1 
         AND mes = EXTRACT(MONTH FROM CURRENT_DATE)
         AND a\xf1o = EXTRACT(YEAR FROM CURRENT_DATE)`,[e]),i.Z.query(`SELECT 
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
         LIMIT 5`,[e]).catch(o=>(console.log("⚠️ Error en cuotas, retornando vac\xedo:",o),{rows:[]})),i.Z.query(`SELECT 
           cat.categoria, 
           COALESCE(SUM(g.monto_total), 0) as total
         FROM Gasto g
         JOIN Categoria cat ON g.id_categoria = cat.id_categoria
         WHERE g.id_usuario = $1 
         AND (
           (g.a\xf1o = EXTRACT(YEAR FROM CURRENT_DATE) AND g.mes BETWEEN EXTRACT(MONTH FROM CURRENT_DATE) - 5 AND EXTRACT(MONTH FROM CURRENT_DATE))
           OR
           (g.a\xf1o = EXTRACT(YEAR FROM CURRENT_DATE) - 1 AND g.mes BETWEEN EXTRACT(MONTH FROM CURRENT_DATE) + 7 AND 12)
         )
         GROUP BY cat.id_categoria, cat.categoria
         ORDER BY total DESC`,[e]).catch(o=>(console.log("⚠️ Error en categor\xedas, retornando vac\xedo:",o),{rows:[]})),i.Z.query(`SELECT 
           c.categoria, 
           COALESCE(hp.monto_predicho, 0) as monto_predicho
         FROM Historial_prediccion hp
         JOIN Categoria c ON hp.id_categoria = c.id_categoria
         WHERE hp.id_usuario = $1
         AND hp.mes = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '1 month')
         AND hp.a\xf1o = EXTRACT(YEAR FROM CURRENT_DATE + INTERVAL '1 month')
         ORDER BY hp.monto_predicho DESC
         LIMIT 10`,[e]).catch(o=>(console.log("⚠️ Error en predicci\xf3n, usando fallback:",o),i.Z.query(`SELECT 
             c.categoria,
             COALESCE(AVG(g.monto_total), 0) as monto_predicho
           FROM Gasto g
           JOIN Categoria c ON g.id_categoria = c.id_categoria
           WHERE g.id_usuario = $1
           AND g.fecha_gasto >= CURRENT_DATE - INTERVAL '6 months'
           GROUP BY c.id_categoria, c.categoria
           HAVING AVG(g.monto_total) > 0
           ORDER BY monto_predicho DESC
           LIMIT 10`,[e]).catch(o=>(console.log("⚠️ Fallback tambi\xe9n fall\xf3:",o),{rows:[]}))))]),u={saldo_actual:Number(s.rows[0]?.monto_disponible)||0,ingresos_mes:Number(c.rows[0]?.total)||0,gastos_mes:Number(E.rows[0]?.total)||0,proximas_cuotas:n.rows.map(o=>({id_cuota:o.id_cuota,nro_cuota:o.nro_cuota,total_cuotas:o.total_cuotas,fecha_vencimiento_cuota:new Date(o.fecha_vencimiento_cuota).toISOString().split("T")[0],descripcion_gasto:o.descripcion_gasto,estado:o.estado})),gastos_por_categoria:_.rows.map(o=>({categoria:o.categoria,total:Number(o.total)})),prediccion_proximo_mes:d.rows.map(o=>({categoria:o.categoria,monto_predicho:Number(o.monto_predicho)}))};return r.Z.json(u)}catch(o){return console.error("❌ Error general en dashboard:",o),r.Z.json({error:`Error al cargar datos: ${o instanceof Error?o.message:"Error desconocido"}`,saldo_actual:0,ingresos_mes:0,gastos_mes:0,proximas_cuotas:[],gastos_por_categoria:[],prediccion_proximo_mes:[]},{status:500})}}t()}catch(o){t(o)}})},8818:(o,a,e)=>{e.a(o,async(o,t)=>{try{e.d(a,{Z:()=>c});var r=e(8678),i=o([r]);r=(i.then?(await i)():i)[0];let s=new r.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}}),c=s;t()}catch(o){t(o)}})}};var a=require("../../../webpack-runtime.js");a.C(o);var __webpack_exec__=o=>a(a.s=o),e=a.X(0,[997],()=>__webpack_exec__(50));module.exports=e})();