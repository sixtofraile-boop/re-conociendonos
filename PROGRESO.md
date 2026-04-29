# RE-CONOCIÉNDOS — Estado del Proyecto

## Estado: ✅ LIVE en Producción — https://re-conociendonos.vercel.app

## Stack Tecnológico
- **Frontend**: Next.js 16.2.4 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL (Neon)
- **Autenticación**: Cookies simples (session_id, persona, nombre)

---

## Archivos del Proyecto
```
re-conociendonos-app/
├── prisma/
│   ├── schema.prisma          # Schema PostgreSQL con url = env("DATABASE_URL")
│   └── dev.db                 # SQLite local (no usar en producción)
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing completa (hero + 4 dim + 2 caminos)
│   │   ├── pareja/
│   │   │   ├── page.tsx                # Crear/unirse + pantalla con código + WhatsApp
│   │   │   ├── encuesta/page.tsx       # 23 preguntas + código visible en header
│   │   │   ├── resultados/page.tsx     # Mi mapa individual + hipótesis
│   │   │   └── mapa/page.tsx           # Reveal intencional + mapa conjunto
│   │   ├── individual/
│   │   │   ├── page.tsx                # Registro con nombre + WhatsApp
│   │   │   ├── encuesta/page.tsx       # 22 preguntas
│   │   │   └── resultados/page.tsx     # Resultado + CTA "Invitar pareja"
│   │   └── api/sesiones/
│   │       ├── route.ts                # GET sin passwords / POST crear sesión
│   │       ├── join/route.ts
│   │       ├── respuestas/route.ts
│   │       └── hipotesis/route.ts
│   └── lib/
│       ├── types.ts
│       ├── preguntas.ts
│       ├── calcular.ts
│       └── prisma.ts              # PrismaNeonHttp adapter
├── vercel.json
├── .env                           # DATABASE_URL = Neon PostgreSQL
├── .env.example
├── PROGRESO.md
└── package.json
```

---

## Funcionalidades Implementadas (100%)

### Identidad Visual ✓
- Paleta navy `#1A274A` como primario en todos los headers
- Gold `#E8B850` para labels de sección
- Fondo `#F8F8F8` consistente
- Colores de dimensión como bordes izquierdos en cards
- Zonas con color contextual (rojo/naranja/amarillo/verde)

### Landing Page ✓
- Hero con frase gancho: "Hay conversaciones que tu relación necesita tener"
- Sección "espejo, no juicio" con 3 pilares
- Las 4 dimensiones con color, síntesis y descripción
- Dos caminos: MI MIRADA (gratuito) vs VERSIÓN PAREJA
- Footer con disclaimer

### Registro ✓
- Campos: nombre + email + WhatsApp (opcional) + contraseña
- Nombre guardado en cookie para personalizar resultados
- Toggle Crear/Unirse en pareja (UI limpia)
- Instrucciones del flujo pareja visibles

### Compartir código de sesión ✓
- Pantalla intermedia después de crear sesión con código visible
- Botón "Copiar código" (clipboard)
- Botón "Enviar por WhatsApp" con mensaje listo (URL dinámica, funciona en prod)
- Código visible en barra superior durante la encuesta (clic para copiar)

### Versión Pareja ✓
- Crear sesión con email + contraseña + nombre
- Unirse a sesión existente con código
- 23 preguntas con doble respuesta (4 sliders)
- Guardado progresivo: autoguarda en cada pregunta
- Todas las preguntas inicializadas con valor 5 por defecto
- Resultados individuales con zona + criterio
- Hipótesis antes del reveal (con copy explicativo)
- Pantalla de espera cuando falta la pareja (muestra código + WhatsApp)
- Reveal intencional: pantalla navy oscura con botón "Ver nuestro mapa →"
- Mapa conjunto completo

### Versión Individual ✓
- Registro con nombre + WhatsApp opcional
- 22 preguntas con percepción de pareja (dropdowns)
- Guardado progresivo
- Resultado personalizado con nombre
- Zona visible en cada dimensión
- Frases gatillo + preguntas de reflexión
- Mensaje de cierre dinámico
- CTA "Invitar a mi pareja →" (momento de upgrade)
- Compartir por WhatsApp

### Lógica de Cálculo ✓
- Porcentajes, variaciones, brechas (bug ×10 corregido)
- Semáforo (ROJO/AMARILLO/VERDE)
- Zona (crítica/sensible/atención/sólida)
- Congruencia de trayectorias (coincidentes/divergentes)
- Ranking de urgencia
- Frases gatillo
- Preguntas de conversación y reflexión
- Mensaje de cierre dinámico

### Derivación Profesional ✓
- Se activa con 3+ dimensiones en ROJO (ajustado según spec)
- Copy no alarmista (fiel al slide 8 del journey)
- Link a contacto profesional

### Seguridad ✓
- Contraseñas hasheadas con bcrypt
- GET /api/sesiones no expone password_A ni password_B
- GET /api/sesiones valida cookie — solo el dueño puede leer sus datos
- POST respuestas e hipótesis validan cookie antes de escribir
- Sin console.log con datos de sesión

### Recuperación de sesión ✓
- Endpoint POST /api/sesiones/login (email + contraseña → session_id)
- Sección "Recuperar acceso" en /individual y /pareja
- Redirige al lugar correcto según estado (encuesta / resultados / mapa)

---

## Base de Datos Neon

**Connection String:**
```
postgresql://neondb_owner:npg_u1HCAwK0bRjM@ep-silent-thunder-amlablv4-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## Deploy — COMPLETADO ✅

1. ✅ Subir código a GitHub (usuario: sixtofraile-boop, rama: main)
2. ✅ Conectar GitHub a Vercel (proyecto: re-conociendonos)
3. ✅ `DATABASE_URL` configurada en Vercel (Neon PostgreSQL)
4. ✅ `npx prisma db push` ejecutado en build via vercel.json
5. ✅ App live: https://re-conociendonos.vercel.app

---

## Cómo ejecutar localmente

```powershell
cd "C:\Users\SixtoEstebanFraile\Downloads\02_Personal\Inteligencia Artificial\RECONOCIENDONOS\re-conociendonos-app"
npm run dev -- --port 3002
```

---

## Bugs corregidos

1. ✓ Cuadrados desiguales en landing — corregido con flexbox
2. ✓ Crear contraseña — agregado campo confirmar contraseña
3. ✓ Error de base de datos SQLite → migrado a PostgreSQL + Neon
4. ✓ Error en calculation de focos — agregado null check
5. ✓ Tabla Sesion no existe en producción — agregado db push en vercel.json
6. ✓ Resultados muestran 0% — faltaba ×10 en calcularResultadosIndividualPareja
7. ✓ Respuestas incompletas si no se mueven sliders — inicialización con valor 5
8. ✓ Contraseñas expuestas en API GET — excluidas del response
9. ✓ getPercepcionPareja lógica rota — corregida para usar valores reales de brecha
10. ✓ Código de sesión no se mostraba — pantalla de compartir con copia y WhatsApp
11. ✓ WhatsApp hardcodeado a localhost — cambiado a window.location.origin

---

## Bugs corregidos en deploy

12. ✓ Prisma 7 rechaza `url` en schema.prisma — movido a `prisma.config.ts` con `datasource.url`
13. ✓ `postinstall` fallaba por config duplicada — schema.prisma sin `url`, prisma.config.ts con `datasource`

## Bugs corregidos en auditoría post-deploy (29/04/2026)

14. ✓ getCookie no decodificaba URI — nombres con ñ/acentos se mostraban corruptos
15. ✓ quien_ha_respondido incorrecto si B responde antes que A — lógica reescrita
16. ✓ Sin validación de cookie en API → cualquiera podía leer/escribir sesiones ajenas
17. ✓ Sin pantalla de error en encuestas cuando falla la carga de red

---

## Pendiente (próxima sesión)

### Medio — afecta flujo real
1. `getRespuestasCompletas` solo llena gaps hasta pregunta actual, no el array completo
2. Sin validación de array completo (22/23 respuestas) antes de finalizar encuesta
3. Cuando B termina y A aún no fue al mapa, el flujo se traba sin notificación
4. Al recuperar sesión con login, el nombre no se restaura (solo está en cookie, no en BD)

### Menor — UX
5. Pantalla de espera no indica si pareja ya empezó
6. Mapa conjunto: no hay botón para copiar código
7. WhatsApp comparte link sin código prefilled
8. Colores inconsistentes: individual usa morado, pareja usa azul

### No implementado (requiere infra)
9. Rate limiting (requiere Redis o store externo)
10. Sincronización en tiempo real (polling / WebSocket)

---

## Última actualización
29/04/2026
