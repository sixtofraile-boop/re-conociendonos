import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { COLORES, estilos, colorDimension, colorEstado } from "./estilos";
import { ResultadoGlobal } from "@/lib/types";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@fontsource/helvetica@5.0.7/files/helvetica-latin-400-normal.woff2" },
    { src: "https://cdn.jsdelivr.net/npm/@fontsource/helvetica@5.0.7/files/helvetica-latin-700-normal.woff2", fontWeight: "bold" },
  ],
});

interface NuestroMapaPDFProps {
  resultado: ResultadoGlobal;
  sesion: {
    hipotesis_A?: string;
    hipotesis_B?: string;
  };
  persona: string | null;
  frasesGatillo: Record<string, { frase1: string; frase2: string }>;
  preguntasConversacion: Record<string, string[]>;
  nombreA?: string;
  nombreB?: string;
}

export function NuestroMapaPDF({
  resultado,
  sesion,
  persona,
  frasesGatillo,
  preguntasConversacion,
  nombreA,
  nombreB,
}: NuestroMapaPDFProps) {
  const ZONA_COLORES: Record<string, { bg: string; text: string }> = {
    "Zona crítica":    { bg: "#FFC7CE", text: "#9C0006" },
    "Zona de cuidado": { bg: "#FFEB9C", text: "#9C6500" },
    "Zona tranquila":  { bg: "#C6EFCE", text: "#276221" },
  };

  const miHipotesis = persona === "B" ? sesion.hipotesis_B : sesion.hipotesis_A;
  const hipotesisPareja = persona === "B" ? sesion.hipotesis_A : sesion.hipotesis_B;

  return (
    <Document>
      <Page size="A4" style={estilos.pagina}>

        {/* 1. PORTADA */}
        <View style={estilos.headerNavy}>
          <Text style={estilos.etiqueta}>RE-CONOCIÉNDONOS</Text>
          <Text style={{ fontSize: 28, fontFamily: "Helvetica-Bold", color: "#FFFFFF", marginBottom: 8 }}>
            Nuestro Mapa
          </Text>
          <Text style={estilos.subtitulo}>
            Una experiencia para mirar tu relación y abrir conversaciones pendientes
          </Text>
        </View>

        {/* 2. QUÉ ES Y QUÉ NO ES */}
        <View style={estilos.aviso}>
          <Text style={[estilos.seccionTitulo, { marginBottom: 6 }]}>Qué es y qué no es esta experiencia</Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            Re-conociéndonos no es un test psicológico, ni un diagnóstico clínico, ni una evaluación objetiva de tu relación.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            No mide la verdad sobre tu relación. Busca ayudarte a ordenar percepciones, no definir la relación.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9 }]}>
            Es una fotografía de cómo cada uno está viviendo la relación hoy. No es una sentencia.
          </Text>
        </View>

        {/* 3. RESUMEN GLOBAL HUMANO */}
        <View style={estilos.card}>
          <Text style={estilos.seccionTitulo}>Lectura humana</Text>
          <Text style={[estilos.texto, { fontSize: 10, marginBottom: 8 }]}>
            Este mapa muestra cómo ambos están viviendo la relación en cuatro dimensiones clave. 
            No busca juzgar ni diagnosticar, sino ordenar percepciones para abrir conversaciones necesarias.
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {[
              { label: "Histórico", value: `${resultado.global_hist.toFixed(0)}%` },
              { label: "Hoy", value: `${resultado.global_act.toFixed(0)}%` },
              { label: "Variación", value: `${resultado.global_var >= 0 ? "+" : ""}${resultado.global_var.toFixed(0)}%`, color: resultado.global_var >= 0 ? COLORES.verde : COLORES.rojo },
            ].map((item) => (
              <View key={item.label} style={{ alignItems: "center" }}>
                <Text style={[estilos.textoSmall, { marginBottom: 4 }]}>{item.label}</Text>
                <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: item.color || COLORES.navy }}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hipótesis antes del reveal */}
        {(miHipotesis || hipotesisPareja) && (
          <View style={{ marginBottom: 16 }}>
            <Text style={estilos.seccionTitulo}>Hipótesis antes del reveal</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {miHipotesis && (
                <View style={[estilos.card, { flex: 1 }]}>
                  <Text style={[estilos.textoSmall, { marginBottom: 4, color: COLORES.gold }]}>Mi hipótesis</Text>
                  <Text style={[estilos.texto, { fontSize: 9 }]}>{miHipotesis}</Text>
                </View>
              )}
              {hipotesisPareja && (
                <View style={[estilos.card, { flex: 1 }]}>
                  <Text style={[estilos.textoSmall, { marginBottom: 4, color: COLORES.blue }]}>Hipótesis de mi pareja</Text>
                  <Text style={[estilos.texto, { fontSize: 9 }]}>{hipotesisPareja}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* 4. TABLA SISTÉMICA */}
        <View style={estilos.card}>
          <Text style={estilos.seccionTitulo}>Resumen sistémico</Text>
          {/* Headers */}
          <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: "#F0F2F5", paddingBottom: 6, marginBottom: 4 }}>
            {["Dimensión", "Tú hoy", "Pareja hoy", "Sistema", "Brecha", "Var", "Estado"].map((h) => (
              <View key={h} style={{ flex: h === "Dimensión" ? 2 : 1 }}>
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#888" }}>{h}</Text>
              </View>
            ))}
          </View>
          {/* Rows */}
          {resultado.dimensiones.map((dim) => (
            <View key={dim.dimension} style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F0F2F5", paddingVertical: 5, alignItems: "center" }}>
              <View style={{ flex: 2, flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={[estilos.dot, { backgroundColor: colorDimension(dim.dimension), width: 6, height: 6 }]} />
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORES.navy }}>{dim.dimension}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 9, color: "#444455" }}>{dim.yo_act_pct?.toFixed(0)}%</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 9, color: "#444455" }}>{dim.par_act_pct?.toFixed(0)}%</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORES.navy }}>{dim.nivel_act.toFixed(0)}%</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 9, color: "#444455" }}>{dim.brecha.toFixed(0)}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 9, color: dim.variacion >= 0 ? COLORES.verde : COLORES.rojo }}>
                  {dim.variacion >= 0 ? "▲" : "▼"}{Math.abs(dim.variacion).toFixed(0)}%
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <View style={[estilos.badge, { backgroundColor: colorEstado(dim.estado) }]}>
                  <Text style={{ fontSize: 7, color: "#FFF", fontFamily: "Helvetica-Bold" }}>{dim.estado}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 5. LECTURA POR DIMENSIÓN */}
        <View style={{ marginBottom: 16 }}>
          <Text style={estilos.seccionTitulo}>Lectura por dimensión</Text>
          {resultado.dimensiones.map((dim) => {
            const frases = frasesGatillo[`${dim.dimension}|${dim.estado}`];
            const zona = ZONA_COLORES[dim.zona];
            const dimColor = colorDimension(dim.dimension);
            return (
              <View key={dim.dimension} style={[estilos.card, { borderLeftWidth: 4, borderLeftColor: dimColor }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={[estilos.dot, { backgroundColor: dimColor }]} />
                    <Text style={[estilos.textoBold, { fontSize: 10 }]}>{dim.dimension}</Text>
                  </View>
                  <View style={[estilos.badge, { backgroundColor: zona.bg }]}>
                    <Text style={{ fontSize: 7, color: zona.text, fontFamily: "Helvetica-Bold" }}>{dim.zona}</Text>
                  </View>
                </View>

                {frases && (
                  <>
                    <Text style={[estilos.texto, { marginBottom: 3, fontSize: 9 }]}>{frases.frase1}</Text>
                    <Text style={[estilos.texto, { fontSize: 8, marginBottom: 6 }]}>{frases.frase2}</Text>
                  </>
                )}

                {/* 6. DIMENSIÓN PRIORITARIA */}
                {dim.rank === 1 && (
                  <View style={{ backgroundColor: "#EBF3FB", borderRadius: 6, padding: 8, marginBottom: 6 }}>
                    <Text style={[estilos.textoBold, { fontSize: 8, marginBottom: 4, color: COLORES.blue }]}>Dimensión prioritaria</Text>
                    <Text style={[estilos.texto, { fontSize: 9 }]}>
                      Esta es la dimensión que merece mayor atención. {dim.criterio_texto}
                    </Text>
                  </View>
                )}

                {dim.congruencia && (
                  <View style={{ marginBottom: 6 }}>
                    <Text style={[estilos.textoSmall, { color: dim.congruencia === "coincidentes" ? COLORES.teal : COLORES.amarillo }]}>
                      Trayectorias {dim.congruencia}
                    </Text>
                  </View>
                )}

                {dim.focos && dim.focos.length > 0 && (
                  <View style={{ backgroundColor: "#FFEB9C", borderRadius: 6, padding: 8, marginBottom: 6 }}>
                    <Text style={[estilos.textoSmall, { marginBottom: 4, fontFamily: "Helvetica-Bold" }]}>Focos de atención</Text>
                    {dim.focos.map((foco) => (
                      <Text key={foco.pregunta_id} style={[estilos.texto, { fontSize: 8, marginBottom: 2 }]}>
                        {foco.rank}. {foco.texto}
                      </Text>
                    ))}
                  </View>
                )}

                <View style={estilos.separador} />
                {/* 7. PREGUNTAS PRINCIPALES */}
                <Text style={[estilos.seccionTitulo, { fontSize: 7, marginBottom: 4 }]}>Preguntas para conversar</Text>
                {(preguntasConversacion[dim.dimension] || []).slice(0, 3).map((preg, i) => (
                  <Text key={i} style={[estilos.texto, { fontSize: 8, marginBottom: 2 }]}>· {preg}</Text>
                ))}
              </View>
            );
          })}
        </View>

        {/* 8. GUÍA PARA CONVERSAR SIN DAÑARSE */}
        <View style={estilos.card}>
          <Text style={estilos.seccionTitulo}>Guía para conversar sin dañarse</Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            • Usen "yo siento" y "yo necesito", evitando "tú siempre" o "tú nunca".
          </Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            • No busquen ganar una discusión ni demostrar quién tiene razón.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            • Pueden pausar si algo duele demasiado. No tienen que resolver todo hoy.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9 }]}>
            • Elijan una sola conversación para empezar.
          </Text>
        </View>

        {/* 9. RITUAL SUGERIDO */}
        <View style={estilos.card}>
          <Text style={estilos.seccionTitulo}>Ritual sugerido de conversación</Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Duración:</Text> 45 minutos, sin interrupciones.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Antes:</Text> Elegir un momento tranquilo, sin prisa.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Durante:</Text> Elegir una sola pregunta de las listadas arriba.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9 }]}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Después:</Text> No busquen resolver todo. Basta con abrir una conversación más honesta.
          </Text>
        </View>

        {/* Pregunta de cierre */}
        <View style={{ backgroundColor: COLORES.navy, borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <Text style={[estilos.etiqueta, { marginBottom: 6 }]}>Pregunta de cierre</Text>
          <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: "#FFFFFF" }}>
            ¿Qué es lo primero que quieren cuidar o construir los dos?
          </Text>
        </View>

        {/* 10. CIERRE */}
        <View style={estilos.aviso}>
          <Text style={[estilos.texto, { fontSize: 9 }]}>
            No tienen que resolver todo hoy. Basta con abrir una conversación más honesta y cuidadosa.
          </Text>
        </View>

        {/* 11. AVISO ÉTICO Y PRIVACIDAD */}
        <View style={{ backgroundColor: "#F8F8F8", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#EEEEEE" }}>
          <Text style={[estilos.seccionTitulo, { fontSize: 7, marginBottom: 4 }]}>Aviso ético y privacidad</Text>
          <Text style={[estilos.textoSmall, { fontSize: 8 }]}>
            Esta herramienta no es adecuada para contextos de violencia, coerción, abuso o riesgo emocional grave.
          </Text>
          <Text style={[estilos.textoSmall, { fontSize: 8 }]}>
            Los datos son guardados de forma segura. No se comparte información sin consentimiento explícito.
          </Text>
        </View>

        {/* Derivación profesional */}
        {resultado.recomienda_profesional && (
          <View style={{ backgroundColor: "#FFEB9C", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: COLORES.gold }}>
            <Text style={[estilos.textoBold, { marginBottom: 4 }]}>Apoyo profesional disponible</Text>
            <Text style={[estilos.texto, { fontSize: 9 }]}>
              El mapa conjunto muestra señales importantes. Lo que aparece aquí merece ser mirado con un profesional.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={estilos.footer}>
          <Text style={[estilos.textoSmall, { textAlign: "center" }]}>Re-conociendonos · https://re-conociendonos.vercel.app</Text>
        </View>
      </Page>
    </Document>
  );
}
