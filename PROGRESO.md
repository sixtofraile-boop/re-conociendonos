# RE-CONOCIÉNDOS - Progreso de Desarrollo

## Estado: En desarrollo (MVP funcional)

## Stack Tecnológico
- **Frontend**: Next.js 16.2.4 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de datos**: SQLite con Prisma 7.8 + adapter libsql
- **Autenticación**: Cookies simples (session_id, persona)

---

## Estructura del Proyecto
```
re-conociendonos-app/
├── prisma/
│   ├── schema.prisma
│   └── dev.db (SQLite)
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing - selección versión
│   │   ├── pareja/                     # Versión Pareja
│   │   │   ├── page.tsx                # Inicio/create/join sesión
│   │   │   ├── encuesta/page.tsx       # 23 preguntas (hist + act)
│   │   │   ├── resultados/page.tsx     # Mi resultado individual
│   │   │   └── mapa/page.tsx           # Mapa conjunto (reveal)
│   │   ├── individual/                  # Versión Individual
│   │   │   ├── page.tsx                # Inicio sesión
│   │   │   ├── encuesta/page.tsx       # 22 preguntas
│   │   │   └── resultados/page.tsx     # Resultados + reflexiones
│   │   └── api/sesiones/
│   │       ├── route.ts                # GET/POST sesiones
│   │       ├── join/route.ts           # Unirse a sesión
│   │       ├── respuestas/route.ts     # Guardar respuestas
│   │       └── hipotesis/route.ts       # Guardar hipótesis
│   └── lib/
│       ├── types.ts                    # TypeScript interfaces
│       ├── preguntas.ts                # Preguntas, frases, catálogos
│       ├── calcular.ts                 # Lógica de cálculo
│       └── prisma.ts                   # Conexión DB
├── SPEC.md                             # Especificación técnica
└── package.json
```

---

## Funcionalidades Implementadas

### Versión Pareja (Completo)
- [x] Crear sesión (email + password)
- [x] Unirse a sesión existente
- [x] 23 preguntas con estructura:
  - hist_yo (1-10)
  - hist_pareja (1-10)
  - act_yo (1-10)
  - act_pareja (1-10)
- [x] Introducción antes de empezar
- [x] Barra de progreso
- [x] Persistencia en DB
- [x] Resultados individuales (mi mapa)
- [x] Hipótesis antes del reveal
- [x] Mapa conjunto con:
  - Tabla comparativa A/B/Sistema
  - Brechas y variaciones
  - Semáforo (rojo/amarillo/verde)
  - Frases gatillo por dimensión
  - Focos de atención
  - Preguntas de conversación

### Versión Individual (Completo)
- [x] Crear sesión
- [x] 22 preguntas con estructura:
  - hist_yo / act_yo (1-10)
  - hist_par / act_par (dropdown: Más alto/Igual/Más bajo)
- [x] Resultados con:
  - Resumen global
  - Por dimensión (hist%, act%, variación)
  - Percepción de la pareja
  - Semáforo
  - Reflexiones (para ROJO/AMARILLO)
  - Mensaje de cierre dinámico

### Lógica de Cálculo (Completo)
- [x] Conversión escala 1-10 → porcentaje
- [x] Nivel histórico y actual
- [x] Variación (actual - histórico)
- [x] Brecha entre parejas
- [x] Congruencia de trayectorias
- [x] Puntaje de urgencia
- [x] Ranking por dimensión
- [x] Semáforo (ROJO/AMARILLO/VERDE)
- [x] Zonas (crítica/sensible/atención/sólida)
- [x] Criterios de texto dinámico
- [x] Mensaje de cierre para versión individual

---

## Catálogos Implementados
- [x] 23 preguntas versión pareja
- [x] 22 preguntas versión individual
- [x] Frases gatillo pareja (4 dims × 3 estados)
- [x] Frases gatillo individual (4 dims × 3 estados)
- [x] Preguntas de conversación (6 por dimensión)
- [x] Preguntas de reflexión (5 por dimensión)
- [x] Colores por dimensión:
  - AMISTAD: #5B8DD9
  - DESEO: #C0504D
  - PROYECTO: #6B9B3E
  - COMPROMISO: #8064A2

---

## Pendiente / Mejoras Futuras
- [ ] Autenticación más robusta (JWT)
- [ ] Envío de email para invitar pareja B
- [ ] Recuperar contraseña
- [ ] Dashboard admin para profesionales
- [ ] Historial de sesiones
- [ ] Exportar resultados PDF
- [ ] Integración con profesionales (derivación)
- [ ] Deploy a producción (Vercel + PostgreSQL)
- [ ] Tests unitarios

---

## Cómo Ejecutar

```powershell
# Navegar a la carpeta
cd "C:\Users\SixtoEstebanFraile\Downloads\re-conociendonos-app"

# Ejecutar servidor
npm run dev
```

Acceder a: **http://localhost:3002**

---

## Notas Técnicas
- Puerto configurado: 3002
- DB: SQLite en `prisma/dev.db`
- Prisma v7.8 con adapter libsql
- Next.js 16 con Turbopack

## Fecha de última actualización
27/04/2026