import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { COLORES, estilos, colorDimension, colorEstado } from "./estilos";
import { ResultadoDimension } from "@/lib/types";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/@fontsource/helvetica@5.0.7/files/helvetica-latin-400-normal.woff2" },
    { src: "https://cdn.jsdelivr.net/npm/@fontsource/helvetica@5.0.7/files/helvetica-latin-700-normal.woff2", fontWeight: "bold" },
  ],
});

interface MiMiradaPDFProps {
  nombre: string | null;
  global: { hist: number; act: number; var: number };
  dimensiones: ResultadoDimension[];
  recomiendaProfesional: boolean;
  estados: string[];
  frasesGatillo: Record<string, { frase1: string; frase2: string }>;
  preguntasReflexion: Record<string, string[]>;
  mensajeCierre: string;
}

export function MiMiradaPDF({
  nombre,
  global,
  dimensiones,
  recomiendaProfesional,
  estados,
  frasesGatillo,
  preguntasReflexion,
  mensajeCierre,
}: MiMiradaPDFProps) {
  const ZONA_COLORES: Record<string, { bg: string; text: string }> = {
    "Zona crítica":    { bg: "#FFC7CE", text: "#9C0006" },
    "Zona de cuidado": { bg: "#FFEB9C", text: "#9C6500" },
    "Zona tranquila":  { bg: "#C6EFCE", text: "#276221" },
  };

  const getPercepcionPareja = () => {
    let masAlta = 0, masBaja = 0;
    dimensiones.forEach((d) => {
      if (d.brecha === 10) masAlta++;
      if (d.brecha === 20) masBaja++;
    });
    if (masAlta > masBaja) return "Tiendes a percibir que tu pareja valora la relación más que tú";
    if (masBaja > masAlta) return "Tiendes a percibir que tu pareja valora la relación menos que tú";
    return "Tu percepción de la pareja es equilibrada respecto a tu propia mirada";
  };

  return (
    <Document>
      <Page size="A4" style={estilos.pagina}>

        {/* 1. PORTADA */}
        <View style={estilos.headerNavy}>
          <Text style={estilos.etiqueta}>RE-CONOCIÉNDONOS</Text>
          <Text style={{ fontSize: 28, fontFamily: "Helvetica-Bold", color: "#FFFFFF", marginBottom: 8 }}>
            Mi Mirada
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
            Es una fotografía de cómo estás viviendo tu relación hoy. No es una sentencia.
          </Text>
        </View>

        {/* 3. RESUMEN GLOBAL HUMANO */}
        <View style={estilos.card}>
          <Text style={estilos.seccionTitulo}>Lectura humana</Text>
          <Text style={[estilos.texto, { fontSize: 10, marginBottom: 8 }]}>
            Este mapa muestra cómo estás percibiendo tu relación en este momento. 
            No busca darte una verdad, sino ayudarte a ponerle nombre a lo que ya sentías.
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 12 }}>
            {[
              { label: "Histórico", value: `${global.hist.toFixed(0)}%` },
              { label: "Hoy", value: `${global.act.toFixed(0)}%` },
              { label: "Variación", value: `${global.var >= 0 ? "+" : ""}${global.var.toFixed(0)}%`, color: global.var >= 0 ? COLORES.verde : COLORES.rojo },
            ].map((item) => (
              <View key={item.label} style={{ alignItems: "center" }}>
                <Text style={[estilos.textoSmall, { marginBottom: 4 }]}>{item.label}</Text>
                <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: item.color || COLORES.navy }}>{item.value}</Text>
              </View>
            ))}
          </View>
          <View style={{ backgroundColor: "#EBF3FB", borderRadius: 6, padding: 8 }}>
            <Text style={[estilos.texto, { fontSize: 9, color: "#2C3E6B" }]}>{getPercepcionPareja()}</Text>
          </View>
        </View>

        {/* 4. RESULTADO GLOBAL */}
        <View style={{ marginBottom: 16 }}>
          <Text style={estilos.seccionTitulo}>Resultado por dimensión</Text>
          {dimensiones.map((dim) => {
            const zona = ZONA_COLORES[dim.zona];
            const dimColor = colorDimension(dim.dimension);
            return (
              <View key={dim.dimension} style={[estilos.card, { borderLeftWidth: 4, borderLeftColor: dimColor }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={[estilos.dot, { backgroundColor: dimColor }]} />
                    <Text style={[estilos.textoBold, { fontSize: 11 }]}>{dim.dimension}</Text>
                  </View>
                  <View style={[estilos.badge, { backgroundColor: zona.bg }]}>
                    <Text style={{ fontSize: 8, color: zona.text, fontFamily: "Helvetica-Bold" }}>{dim.zona}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 16, marginBottom: 6 }}>
                  <Text style={estilos.textoSmall}>Hist: <Text style={{ fontFamily: "Helvetica-Bold" }}>{dim.nivel_hist.toFixed(0)}%</Text></Text>
                  <Text style={estilos.textoSmall}>Hoy: <Text style={{ fontFamily: "Helvetica-Bold" }}>{dim.nivel_act.toFixed(0)}%</Text></Text>
                  <Text style={[estilos.textoSmall, { color: dim.variacion >= 0 ? COLORES.verde : COLORES.rojo }]}>
                    {dim.variacion >= 0 ? "▲" : "▼"} {Math.abs(dim.variacion).toFixed(0)}%
                  </Text>
                </View>
                <View style={[estilos.badge, { alignSelf: "flex-start", backgroundColor: colorEstado(dim.estado) }]}>
                  <Text style={{ fontSize: 8, color: "#FFFFFF", fontFamily: "Helvetica-Bold" }}>{dim.estado}</Text>
                </View>
                <Text style={[estilos.texto, { marginTop: 6, fontSize: 9 }]}>{dim.criterio_texto}</Text>
              </View>
            );
          })}
        </View>

        {/* 5. DIMENSIÓN PRIORITARIA */}
        {dimensiones.length > 0 && (
          <View style={estilos.card}>
            <Text style={estilos.seccionTitulo}>Dimensión prioritaria</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <View style={[estilos.dot, { backgroundColor: colorDimension(dimensiones[0].dimension), width: 8, height: 8 }]} />
              <Text style={[estilos.textoBold, { fontSize: 12 }]}>{dimensiones[0].dimension}</Text>
              <Text style={[estilos.badge, { backgroundColor: colorEstado(dimensiones[0].estado) }]}>
                <Text style={{ fontSize: 8, color: "#FFF", fontFamily: "Helvetica-Bold" }}>Rank #{dimensiones[0].rank}</Text>
              </Text>
            </View>
            <Text style={[estilos.texto, { fontSize: 9 }]}>{dimensiones[0].criterio_texto}</Text>
          </View>
        )}

        {/* 6. 2-3 PREGUNTAS PRINCIPALES */}
        {dimensiones.filter((d) => d.estado !== "VERDE").length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={estilos.seccionTitulo}>Preguntas principales</Text>
            {dimensiones.filter((d) => d.estado !== "VERDE").slice(0, 3).map((dim) => {
              const frases = frasesGatillo[`${dim.dimension}|${dim.estado}`];
              return (
                <View key={dim.dimension} style={[estilos.card, { borderLeftWidth: 4, borderLeftColor: colorDimension(dim.dimension) }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <View style={[estilos.dot, { backgroundColor: colorDimension(dim.dimension) }]} />
                    <Text style={[estilos.textoBold, { fontSize: 10 }]}>{dim.dimension}</Text>
                  </View>
                  {frases && (
                    <>
                      <Text style={[estilos.texto, { fontSize: 8, marginBottom: 3 }]}>{frases.frase1}</Text>
                      <Text style={[estilos.texto, { fontSize: 7 }]}>{frases.frase2}</Text>
                    </>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Reflexiones */}
        {(estados.includes("ROJO") || estados.includes("AMARILLO")) && (
          <View style={{ marginBottom: 16 }}>
            <Text style={estilos.seccionTitulo}>Reflexiones</Text>
            {dimensiones.filter((d) => d.estado !== "VERDE").map((dim) => {
              const frases = frasesGatillo[`${dim.dimension}|${dim.estado}`];
              const dimColor = colorDimension(dim.dimension);
              return (
                <View key={dim.dimension} style={[estilos.card, { borderLeftWidth: 4, borderLeftColor: dimColor }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <View style={[estilos.dot, { backgroundColor: dimColor }]} />
                    <Text style={[estilos.textoBold, { fontSize: 11 }]}>{dim.dimension}</Text>
                  </View>
                  {frases && (
                    <>
                        <Text style={[estilos.texto, { marginBottom: 4 }]}>{frases.frase1}</Text>
                        <Text style={[estilos.texto, { fontSize: 9, marginBottom: 8 }]}>{frases.frase2}</Text>
                    </>
                  )}
                  <View style={estilos.separador} />
                  <Text style={[estilos.seccionTitulo, { fontSize: 7, marginBottom: 3 }]}>Preguntas para reflexionar</Text>
                  {(preguntasReflexion[dim.dimension] || []).slice(0, 3).map((preg, i) => (
                    <Text key={i} style={[estilos.texto, { fontSize: 8, marginBottom: 3 }]}>· {preg}</Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* 7. GUÍA PARA CONVERSAR SIN DAÑARSE */}
        <View style={estilos.card}>
          <Text style={estilos.seccionTitulo}>Guía para conversar sin dañarse</Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            • Usen "yo siento" y "yo necesito", evitando "tú siempre" o "tú nunca".
          </Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            • No busquen ganar una discusión ni demostrar quién tiene razón.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9, marginBottom: 4 }]}>
            • Pueden pausar si algo duele demasiado. No tienen que resolverlo ahora.
          </Text>
          <Text style={[estilos.texto, { fontSize: 9 }]}>
            • Elijan una sola conversación para empezar.
          </Text>
        </View>

        {/* 8. RITUAL SUGERIDO */}
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

        {/* 9. CIERRE */}
        <View style={{ backgroundColor: COLORES.navy, borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <Text style={[estilos.etiqueta, { marginBottom: 6 }]}>Cierre</Text>
          <Text style={{ fontSize: 10, color: "#FFFFFF", lineHeight: 1.6 }}>{mensajeCierre}</Text>
        </View>

        {/* 10. AVISO ÉTICO Y PRIVACIDAD */}
        <View style={{ backgroundColor: "#F8F8F8", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#EEEEEE" }}>
          <Text style={[estilos.seccionTitulo, { fontSize: 7, marginBottom: 4 }]}>Aviso ético y privacidad</Text>
          <Text style={[estilos.textoSmall, { fontSize: 8, marginBottom: 3 }]}>
            Esta herramienta no es adecuada para contextos de violencia, coerción, abuso o riesgo emocional grave.
          </Text>
          <Text style={[estilos.textoSmall, { fontSize: 8 }]}>
            Los datos son guardados de forma segura. No se comparte información sin consentimiento explícito.
          </Text>
        </View>

        {/* Derivación profesional */}
        {recomiendaProfesional && (
          <View style={{ backgroundColor: "#FFEB9C", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: COLORES.gold }}>
            <Text style={[estilos.textoBold, { marginBottom: 4 }]}>Apoyo profesional disponible</Text>
            <Text style={[estilos.texto, { fontSize: 9 }]}>
              Lo que aparece en tu mapa merece ser mirado con un profesional. No hay respuesta incorrecta — hay conversaciones que a veces necesitan un espacio seguro.
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
