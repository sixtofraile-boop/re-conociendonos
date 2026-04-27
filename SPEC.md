# RE-CONOCIÉNDOS - Especificación Técnica

## 1. Stack Tecnológico
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de datos**: SQLite con Prisma ORM (desarrollo), con migración a PostgreSQL
- **Autenticación**: JWT con cookies httpOnly
- **Hosting**: Vercel (frontend) + Railway/Supabase (backend)

## 2. Estructura del Proyecto
```
re-conociendonos-app/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (routes)/
│   │   │   ├── page.tsx              # Landing
│   │   │   ├── pareja/
│   │   │   │   ├── page.tsx          # Inicio versión pareja
│   │   │   │   ├── encuesta/
│   │   │   │   │   └── page.tsx      # Formulario A/B
│   │   │   │   ├── resultados/
│   │   │   │   │   └── page.tsx      # Mi resultado individual
│   │   │   │   └── mapa/
│   │   │   │       └── page.tsx      # Mapa conjunto (reveal)
│   │   │   ├── individual/
│   │   │   │   ├── page.tsx          # Inicio versión individual
│   │   │   │   ├── encuesta/
│   │   │   │   │   └── page.tsx       # Formulario individual
│   │   │   │   └── resultados/
│   │   │   │       └── page.tsx       # Resultados individuales
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── sesiones/
│   │   │   └── resultados/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── calcular.ts               # Lógica de cálculo
│   │   ├── preguntas.ts              # Preguntas y catálogos
│   │   └── types.ts
│   └── utils/
├── public/
├── SPEC.md
└── package.json
```

## 3. Modelos de Base de Datos (Prisma)
```prisma
model Sesion {
  id            String    @id @default(cuid())
  version       String    // "pareja" | "individual"
  estado        String    // "inicio" | "encuesta_A" | "encuesta_B" | "Resultados_A" | "Resultados_B" | "mapa_conjunto"
  email_A       String?
  email_B       String?
  password_A    String?
  password_B    String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  respuestas_A  RespuestaPareja?
  respuestas_B  RespuestaPareja?
  respuesta_I   RespuestaIndividual?
  
  hipotesis_A   String?
  hipotesis_B   String?
  
  // Pareja: estado de quién ha respondido
  quien_ha_respondido String?  // "A" | "B" | "ambos"
}

model RespuestaPareja {
  id            String   @id @default(cuid())
  sesionId      String   @unique
  sesion        Sesion   @relation(fields: [sesionId], references: [id])
  persona       String   // "A" | "B"
  respuestas    Json     // Array de {pregunta_id, hist_yo, hist_par, act_yo, act_par}
  createdAt     DateTime @default(now())
}

model RespuestaIndividual {
  id            String   @id @default(cuid())
  sesionId      String   @unique
  sesion        Sesion   @relation(fields: [sesionId], references: [id])
  respuestas    Json     // Array de {pregunta_id, hist_yo, act_yo, hist_par, act_par}
  createdAt     DateTime @default(now())
}
```

## 4. Flujo de Usuario

### Versión Pareja:
1. **Landing** → Elegir versión Pareja
2. **Crear sesión** → Ingresar email y password (A)
3. **Invitar Pareja B** → Link para que B se una
4. **Encuesta A** → 23 preguntas (sin saber dimensión)
5. **Encuesta B** → 23 preguntas
6. **Resultados individuales** → Cada quien ve su mapa
7. **Hipótesis** → Escribir qué cree antes del reveal
8. **Mapa conjunto** → Reveal con brechas, preguntas conversación

### Versión Individual:
1. **Landing** → Elegir versión Individual
2. **Crear sesión** → Email + password
3. **Encuesta** → 22 preguntas
4. **Resultados** → Mi mapa, patrón percepción pareja, reflexiones

## 5. Componentes UI
- **SemaforoIndicator**: Visualización rojo/amarillo/verde
- **DimensionCard**: Card por dimensión con resultado
- **PreguntaSlider**: Slider 1-10 con doble respuesta
- **PercepcionDropdown**: Dropdown Más alto/Igual/Más bajo
- **MapaConjunto**: Tabla comparativa A/B/Sistema
- **FocosView**: Preguntas con mayor urgencia
- **ConversacionList**: Preguntas de conversación

## 6. Próximos Pasos
1. Inicializar proyecto Next.js
2. Configurar Prisma + SQLite
3. Crear componentes base
4. Implementar lógica de cálculo
5. Construir flujos de encuesta
6. Implementar resultados
7.Estilos y responsive