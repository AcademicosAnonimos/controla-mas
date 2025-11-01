"use strict";(()=>{var e={};e.id=983,e.ids=[983],e.modules={517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},687:(e,r,a)=>{a.a(e,async(e,t)=>{try{a.r(r),a.d(r,{headerHooks:()=>d,originalPathname:()=>_,requestAsyncStorage:()=>p,routeModule:()=>c,serverHooks:()=>h,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>l});var i=a(884),o=a(6132),s=a(8262),n=e([s]);s=(n.then?(await n)():n)[0];let c=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/historial-prediccion/route",pathname:"/api/historial-prediccion",filename:"route",bundlePath:"app/api/historial-prediccion/route"},resolvedPagePath:"C:\\Users\\User\\Documents\\PROYECTOS\\BASE DE DATOS - Facultad\\ProbandoReact\\ControlaMas\\app\\api\\historial-prediccion\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:p,staticGenerationAsyncStorage:u,serverHooks:h,headerHooks:d,staticGenerationBailout:l}=c,_="/api/historial-prediccion/route";t()}catch(e){t(e)}})},8262:(e,r,a)=>{a.a(e,async(e,t)=>{try{a.r(r),a.d(r,{GET:()=>GET,dynamic:()=>n});var i=a(5798),o=a(8818),s=e([o]);o=(s.then?(await s)():s)[0];let n="force-dynamic";async function GET(e){try{let{searchParams:r}=new URL(e.url),a=r.get("id_usuario"),t=r.get("mes"),s=r.get("a\xf1o"),n=`
      SELECT 
        hp.id_historial,
        hp.id_categoria,
        hp.id_usuario,
        hp.mes,
        hp.a\xf1o,
        hp.monto_predicho,
        c.categoria,
        TO_CHAR(TO_DATE(hp.mes::text, 'MM'), 'Month') as nombre_mes,
        u.nombre as nombre_usuario
      FROM Historial_prediccion hp
      JOIN Categoria c ON hp.id_categoria = c.id_categoria
      JOIN Usuario u ON hp.id_usuario = u.id_usuario
    `,c=[],p=[];a&&(p.push("hp.id_usuario = $"+(c.length+1)),c.push(parseInt(a))),t&&(p.push("hp.mes = $"+(c.length+1)),c.push(parseInt(t))),s&&(p.push("hp.a\xf1o = $"+(c.length+1)),c.push(parseInt(s))),p.length>0&&(n+=" WHERE "+p.join(" AND ")),n+=" ORDER BY hp.a\xf1o DESC, hp.mes DESC, c.categoria";let u=await o.Z.query(n,c);return i.Z.json(u.rows)}catch(e){return console.error("❌ Error al obtener historial de predicci\xf3n:",e),i.Z.json({error:"Error al obtener historial de predicci\xf3n"},{status:500})}}t()}catch(e){t(e)}})},8818:(e,r,a)=>{a.a(e,async(e,t)=>{try{a.d(r,{Z:()=>n});var i=a(8678),o=e([i]);i=(o.then?(await o)():o)[0];let s=new i.Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:!1}}),n=s;t()}catch(e){t(e)}})}};var r=require("../../../webpack-runtime.js");r.C(e);var __webpack_exec__=e=>r(r.s=e),a=r.X(0,[997],()=>__webpack_exec__(687));module.exports=a})();