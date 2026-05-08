# RE-CONOCIÉNDOS — Estado del Proyecto

## Estado: ✅ LIVE en Producción — https://re-conociendonos.vercel.app

## Última actualización
08/05/2026 — Correcciones auditoría spec v2.2: cálculo Nuestro Mapa, privacidad A/B, percepciones, commitment 3, copies

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
│   ├── schema.prisma          # Schema PostgreSQL (token_invitacion, acuerdo_aceptado_A/B)
│   └── dev.db                 # SQLite local (no usar en producción)
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing completa (hero + 4 dim + 2 caminos)
│   │   ├── pareja/
│   │   │   ├── page.tsx                # Crear/unirse + token seguro + WhatsApp
│   │   │   ├── invitacion/page.tsx      # Página donde B acepta invitación con token
│   │   │   ├── acuerdo/page.tsx        # Acuerdo obligatorio antes del reveal
│   │   │   ├── encuesta/page.tsx       # 23 preguntas + código visible en header
│   │   │   ├── resultados/page.tsx     # Mi mapa individual + hipótesis
│   │   │   └── mapa/page.tsx           # Reveal intencional + mapa conjunto
│   │   ├── individual/
│   │   │   ├── page.tsx                # Registro con nombre + WhatsApp
│   │   │   ├── encuesta/page.tsx       # 22 preguntas
│   │   │   └── resultados/page.tsx     # Resultado + CTA "Invitar pareja"
│   │   └── api/
│   │       ├── sesiones/
│   │       │   ├── route.ts                # GET/POST (token seguro, 13 estados)
│   │       │   ├── invite/route.ts        # GET/POST validar y aceptar invitación
│   │       │   ├── join/route.ts
│   │       │   ├── respuestas/route.ts
│   │       │   ├── hipotesis/route.ts
│   │       │   └── acuerdo/route.ts       # Guardar aceptación de acuerdo
│   │       ├── pdf/
│   │       │   ├── individual/route.ts    # Generar PDF Mi Mirada
│   │       │   └── pareja/route.ts       # Generar PDF Nuestro Mapa
│   │       └── email/
│   │           └── invite/route.ts      # Enviar invitación por correo (Resend)
│   └── lib/
│       ├── types.ts
│       ├── preguntas.ts
│       ├── calcular.ts
│       ├── prisma.ts              # PrismaNeonHttp adapter
│       └── pdf/
│           ├── estilos.ts
│           ├── mi-mirada.tsx         # Componente PDF Mi Mirada (9 secciones)
│           └── nuestro-mapa.tsx     # Componente PDF Nuestro Mapa (9 secciones)
├── vercel.json
├── .env                           # DATABASE_URL, RESEND_API_KEY
├── .env.example
├── PROGRESO.md
└── package.json
```

---

## Funcionalidades Implementadas (100%)

### Sistema de Invitación Segura ✓
- Token único de 32 caracteres hex (crypto.randomBytes)
- Expiración automática a 7 días
- Ruta `/api/sesiones/invite` para validar tokens
- Página `/pareja/invite` para que B acepte la invitación
- Migración de `session_id` a `token_invitacion` seguro
- Estados de sesión expandidos (13 estados según spec 13.2)
- Integración con Resend para emails transaccionales
- Ruta `/api/email/invite` para envío de invitaciones por correo
- Página de invitación con formulario para B (email + contraseña)

### Acuerdo de Conversación Obligatorio ✓
- Página `/pareja/acuerdo` con 5 puntos obligatorios
- Checkbox múltiples que deben aceptarse todos
- API `/api/sesiones/acuerdo` para guardar aceptación
- Campos `acuerdo_aceptado_A` y `acuerdo_aceptado_B` en BD
- Verificación antes del reveal en mapa conjunto
- Redirección automática a `/pareja/acuerdo` si falta aceptación

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

### Generación de PDFs ✓
- `@react-pdf/renderer` v4 instalado
- **PDF Mi Mirada** (`/api/pdf/individual`): resumen global, 4 dimensiones, reflexiones, mensaje de cierre
- **PDF Nuestro Mapa** (`/api/pdf/pareja`): tabla sistémica A/B, lectura por dimensión, hipótesis, preguntas de conversación
- Componentes en `src/lib/pdf/` (estilos.ts, mi-mirada.tsx, nuestro-mapa.tsx)
- Botones "Descargar PDF" en resultados individual y mapa conjunto
- Validación de cookie y session_id en ambas APIs

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

## Correcciones sesión 29/04/2026

18. ✓ Array sparse al finalizar encuesta — `respFinal` garantiza 23 entradas completas con `??` fallback
19. ✓ Sin validación de 23 respuestas antes de finalizar — ahora se construye con `PREGUNTAS_PAREJA.map`
20. ✓ Flujo traba si B termina antes que A — polling cada 5s en resultados, banner verde + botón cambia color
21. ✓ Nombre no se restaura al recuperar sesión — campo nombre agregado al form de recuperar acceso
22. ✓ Colores inconsistentes en encuesta — `blue-600`/`slate-*` reemplazados por `#5B8DD9`/`#1A274A`/`#444455`
23. ✓ Sin botón copiar código en mapa revelado — agregado junto al botón de WhatsApp

---

## Correcciones sesión 08/05/2026 (auditoría pack final v1)

24. ✓ Escala incorrecta "1 al 7" → "1 al 10" en encuesta individual
25. ✓ Colores inconsistentes (purple/slate) reemplazados por paleta de marca en encuesta individual
26. ✓ Persona B saltaba directo a mapa sin pasar por hipótesis ni acuerdo — ahora va a resultados igual que A
27. ✓ Focos de atención: `nivel_act` recibía `puntaje` en vez del nivel real — corregido
28. ✓ Estados de sesión alineados con spec 13.2 (invitation_created, in_progress, waiting_other_response, both_tests_completed, waiting_hypotheses, waiting_reveal_agreement, reveal_ready, reveal_opened, expired)
29. ✓ Nombre de B derivado de email — ahora se pide nombre en formulario de invitación
30. ✓ Mensaje post-reveal agregado (spec 6.5)
31. ✓ Schema actualizado con nombre_A y nombre_B
32. ✓ Preguntas de conversación COMPROMISO actualizadas (lenguaje sin culpa)
33. ✓ Endpoint PATCH /api/sesiones agregado para actualizar estados
34. ✓ Hipótesis ahora redirige a acuerdo antes del reveal

## Correcciones sesión 08/05/2026 (auditoría profunda spec v2.2 — fase 2)

### Crítico
35. ✓ **Fórmula Nuestro Mapa** — `calcularResultadosPareja` ahora promedia los 4 valores (A hist_yo, B hist_yo, A hist_par, B hist_par) por dimensión, en vez de solo 2 (A hist_yo + B hist_par). Spec 10.3.
36. ✓ **Sort por puntaje_dim** — `ordenarDimensiones` ahora ordena primariamente por `puntaje_dim` antes de aplicar reglas de desempate (estado, brecha, variación, nivel). Spec 11.3.
37. ✓ **Privacidad A/B** — GET `/api/sesiones` filtra `respuestas` crudas según cookie `persona`. A no ve respuestas de B ni viceversa. Spec 13.1. El resultado conjunto se sirve desde `resultado_json.pareja`.
38. ✓ **Caché resultado pareja** — `respuestas/route.ts` ahora computa y cachea `resultado_json.pareja` al guardar respuestas de A o B.
39. ✓ **Mapa conjunto** — `pareja/mapa/page.tsx` ahora lee desde `resultado_json.pareja` en vez de recalcular desde respuestas crudas de ambos.

### Alto
40. ✓ **Percepción "¿Percibo..."** — Las 23 preguntas de percepción en `preguntas.ts` corregidas a formato `"¿Percibo..."` en vez de `"¿Cuánto siento...?"` / `"¿Cómo siento...?"`. Spec 9.3. También corregidas Q3, Q5, Q19.
41. ✓ **Commitment 3** — `"Hablaré desde yo siento"` → `"Hablaremos desde yo veo, yo siento y yo necesito"`. Spec 6.4.
42. ✓ **calcularResultadosIndividualPareja** — Ahora incluye `hist_par`/`act_par` (percepción de pareja) en nivel_hist/nivel_act/brecha. Ya no usa solo `hist_yo`/`act_yo`.

### Medio
43. ✓ **Landing bajada** — `"Este es el mapa para encontrarlas"` → `"Una experiencia guiada para mirar tu relación y abrir una conversación cuidada."`. Spec 6.1.
44. ✓ **"crees" → "imaginas"** — Encuesta individual ahora usa `"cómo imaginas que tu pareja podría vivir esto"` en vez de `"cómo crees que respondería tu pareja"`. Spec 3.1.
45. ✓ **Transición hipótesis** — `hipotesis/route.ts` ahora transiciona a `waiting_reveal_agreement` cuando ambas hipótesis están completas.
46. ✓ **Estados acuerdo** — `aceptar_acuerdo` en `estados.ts` ahora permite `both_tests_completed` como estado de entrada.
47. ✓ **Mensajes de espera** — Mapa página muestra `"Tu pareja ya completó su parte. Falta tu mirada..."` o `"Tu parte está lista..."` según quién haya respondido. Spec 13.3.

### Build
48. ✓ Build limpio — 29 páginas, 0 errores, commit `dedad0d` pusheado a main.

## Pendiente (próxima sesión)

### No implementado (requiere infra)
1. Rate limiting (requiere Redis o store externo)
2. Sincronización en tiempo real (WebSocket) — el polling actual cubre el caso de uso básico

### Mejoras futuras sugeridas
1. Migrar a modelos de datos separados User/SesionMiMirada/SesionNuestroMapa/Participante según spec
2. Implementar seguimiento beta automatizado (correos día 3, 7, 14, 21/30)
3. Sistema de pago único para Nuestro Mapa
4. Export CSV de respuestas para análisis beta
