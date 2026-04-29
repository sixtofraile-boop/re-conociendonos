"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FRASES_GATILLO_PAREJA, PREGUNTAS_CONVERSACION, COLOR_DIMENSION, COLOR_ESTADO } from "@/lib/preguntas";
import { ResultadoGlobal } from "@/lib/types";
import { calcularResultadosPareja } from "@/lib/calcular";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const ZONA_COLORES: Record<string, { bg: string; text: string }> = {
  "Zona crítica":     { bg: "#FFC7CE", text: "#9C0006" },
  "Zona sensible":    { bg: "#FFE0B2", text: "#E65100" },
  "Zona de atención": { bg: "#FFEB9C", text: "#9C6500" },
  "Zona sólida":      { bg: "#C6EFCE", text: "#276221" },
};

export default function MapaConjunto() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<ResultadoGlobal | null>(null);
  const [sesion, setSesion] = useState<any>(null);
  const [persona, setPersona] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [quienRespondio, setQuienRespondio] = useState<string | null>(null);

  useEffect(() => {
    const sid = getCookie("session_id");
    const per = getCookie("persona");
    const nom = getCookie("nombre");
    if (!sid) { router.push("/pareja"); return; }
    setPersona(per);
    setNombre(nom);
    setSessionId(sid);

    fetch(`/api/sesiones?session_id=${sid}`)
      .then((res) => res.json())
      .then((data) => {
        const respuestas = data.sesion?.respuestas;
        setQuienRespondio(data.sesion?.quien_ha_respondido ?? null);
        if (respuestas && respuestas.A && respuestas.B) {
          setResultado(calcularResultadosPareja(respuestas.A, respuestas.B));
          setSesion(data.sesion);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const copiarCodigo = () => {
    if (!sessionId) return;
    navigator.clipboard.writeText(sessionId);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const compartirWhatsApp = () => {
    if (!sessionId) return;
    const url = `${window.location.origin}/pareja`;
    const msg = `Hola 💙\n\nYa respondí el test de RE-CONOCIÉNDONOS. Cuando puedas, únete para que veamos juntos nuestro mapa.\n\n→ Entra aquí: ${url}\n→ Selecciona "Unirse a sesión"\n→ Usa este código: *${sessionId}*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F8F8" }}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: "#5B8DD9", borderTopColor: "transparent" }} />
          <p style={{ color: "#444455" }}>Cargando el mapa conjunto...</p>
        </div>
      </div>
    );
  }

  if (!resultado || !sesion) {
    // Pantalla de espera: uno ya respondió, falta el otro
    return (
      <div className="min-h-screen" style={{ background: "#1A274A" }}>
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "#E8B850" }}>
            ESPERANDO A TU PAREJA
          </p>
          <h1 className="text-3xl font-bold text-white mb-4">
            Tu parte está lista
          </h1>
          <p className="mb-10" style={{ color: "#B8CCEE" }}>
            El mapa conjunto se abre cuando los dos hayan respondido.<br />
            Comparte el código con tu pareja para que pueda unirse.
          </p>

          {sessionId && (
            <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#88AACC" }}>
                Código de sesión
              </p>
              <p className="font-mono text-xl font-bold mb-5 break-all" style={{ color: "#E8B850" }}>
                {sessionId}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={copiarCodigo}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={copiado
                    ? { background: "#02C39A", color: "#fff" }
                    : { background: "rgba(255,255,255,0.15)", color: "#fff" }}
                >
                  {copiado ? "¡Copiado!" : "Copiar código"}
                </button>
                <button
                  onClick={compartirWhatsApp}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "#25D366" }}
                >
                  Enviar por WhatsApp
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl p-4 text-sm text-left" style={{ background: "rgba(255,255,255,0.06)", color: "#B8CCEE" }}>
            <p className="font-semibold mb-2 text-white">Tu pareja debe:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Ir a la Versión Pareja en re-conociendonos.app</li>
              <li>Seleccionar "Unirse a sesión"</li>
              <li>Ingresar el código de arriba</li>
              <li>Responder las 23 preguntas</li>
            </ol>
          </div>

          <p className="text-xs mt-6" style={{ color: "#557099" }}>
            Esta página se actualiza sola cuando tu pareja termine.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm px-5 py-2 rounded-xl transition-all"
            style={{ color: "#88AACC", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Verificar si ya respondió
          </button>
        </div>
      </div>
    );
  }

  const rojos = resultado.dimensiones.filter((d) => d.estado === "ROJO").length;
  const mostrarProfesional = rojos >= 3;
  const miHipotesis = persona === "B" ? sesion.hipotesis_B : sesion.hipotesis_A;
  const hipotesisPareja = persona === "B" ? sesion.hipotesis_A : sesion.hipotesis_B;

  const shareWhatsApp = () => {
    const resumen = resultado.dimensiones
      .map((d) => `${d.dimension}: ${d.nivel_act.toFixed(0)}% (${d.estado})`)
      .join("\n");
    const texto = `Nuestro mapa RE-CONOCIÉNDONOS:\n\n${resumen}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`);
  };

  // ─── PANTALLA DE REVEAL INTENCIONAL ───────────────────────────────────────
  if (!revealed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#1A274A" }}>
        <div className="max-w-lg w-full text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "#E8B850" }}>
            MAPA CONJUNTO
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Dos miradas que al unirse revelan la verdad
          </h1>
          <p className="mb-10" style={{ color: "#B8CCEE" }}>
            Este es un acto intencional.<br />
            Ábrelo cuando los dos estén listos — juntos.
          </p>

          {(miHipotesis || hipotesisPareja) && (
            <div className="grid grid-cols-2 gap-4 mb-10 text-left">
              {miHipotesis && (
                <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#E8B850" }}>
                    Mi hipótesis
                  </p>
                  <p className="text-sm text-white opacity-80">{miHipotesis}</p>
                </div>
              )}
              {hipotesisPareja && (
                <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#B8CCEE" }}>
                    Hipótesis de mi pareja
                  </p>
                  <p className="text-sm text-white opacity-80">{hipotesisPareja}</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setRevealed(true)}
            className="px-10 py-4 rounded-xl font-bold text-white text-lg transition-all hover:opacity-90"
            style={{ background: "#5B8DD9" }}
          >
            Ver nuestro mapa →
          </button>
          <p className="text-xs mt-4" style={{ color: "#88AACC" }}>
            Recomendamos abrirlo los dos al mismo tiempo
          </p>
        </div>
      </div>
    );
  }

  // ─── MAPA COMPLETO ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>

      {/* Header */}
      <div style={{ background: "#1A274A" }} className="px-6 py-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>MAPA CONJUNTO</p>
          <h1 className="text-3xl font-bold text-white mb-2">El mapa de los dos</h1>
          <p style={{ color: "#B8CCEE" }} className="text-sm">
            Global: <strong className="text-white">{resultado.global_act.toFixed(0)}%</strong> hoy
            &nbsp;·&nbsp;
            Variación: <span style={{ color: resultado.global_var >= 0 ? "#02C39A" : "#E86050" }}>
              {resultado.global_var >= 0 ? "▲" : "▼"} {Math.abs(resultado.global_var).toFixed(0)}%
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Tabla sistémica */}
        <div className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "#028090" }}>Resumen sistémico</p>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid #F0F2F5" }}>
                {["Dimensión", "Tú hoy", "Pareja hoy", "Sistema", "Brecha", "Variación", "Estado"].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-semibold text-xs" style={{ color: "#888" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultado.dimensiones.map((dim) => (
                <tr key={dim.dimension} style={{ borderBottom: "1px solid #F0F2F5" }}>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLOR_DIMENSION[dim.dimension] }} />
                      <span className="font-semibold text-xs" style={{ color: "#1A274A" }}>{dim.dimension}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 text-xs" style={{ color: "#444455" }}>{dim.yo_act_pct?.toFixed(0)}%</td>
                  <td className="text-center py-3 px-2 text-xs" style={{ color: "#444455" }}>{dim.par_act_pct?.toFixed(0)}%</td>
                  <td className="text-center py-3 px-2 text-xs font-bold" style={{ color: "#1A274A" }}>{dim.nivel_act.toFixed(0)}%</td>
                  <td className="text-center py-3 px-2 text-xs" style={{ color: "#444455" }}>{dim.brecha.toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-xs font-medium"
                    style={{ color: dim.variacion >= 0 ? "#276221" : "#9C0006" }}>
                    {dim.variacion >= 0 ? "▲" : "▼"}{Math.abs(dim.variacion).toFixed(0)}%
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className="px-2 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: COLOR_ESTADO[dim.estado] }}>
                      {dim.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lectura por dimensión */}
        <div className="space-y-4">
          {resultado.dimensiones.map((dim) => {
            const frases = FRASES_GATILLO_PAREJA[`${dim.dimension}|${dim.estado}`];
            const zona = ZONA_COLORES[dim.zona];
            return (
              <div key={dim.dimension} className="bg-white rounded-2xl p-6 shadow-sm"
                style={{ borderLeft: `4px solid ${COLOR_DIMENSION[dim.dimension]}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLOR_DIMENSION[dim.dimension] }} />
                      <h3 className="font-bold" style={{ color: "#1A274A" }}>{dim.dimension}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: zona.bg, color: zona.text }}>
                        {dim.zona}
                      </span>
                      {dim.congruencia && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={dim.congruencia === "coincidentes"
                            ? { background: "#EBF3FB", color: "#2C3E6B" }
                            : { background: "#FFEB9C", color: "#9C6500" }}>
                          Trayectorias {dim.congruencia}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: COLOR_ESTADO[dim.estado] }}>
                    {dim.estado}
                  </span>
                </div>

                <p className="mb-2 leading-relaxed" style={{ color: "#444455" }}>{frases?.frase1}</p>
                <p className="text-sm mb-4" style={{ color: "#666" }}>{frases?.frase2}</p>

                {dim.focos.length > 0 && (
                  <div className="mb-4 p-4 rounded-xl" style={{ background: "#FFEB9C" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9C6500" }}>
                      Focos de atención
                    </p>
                    {dim.focos.map((foco) => (
                      <p key={foco.pregunta_id} className="text-sm mb-1" style={{ color: "#444455" }}>
                        {foco.rank}. {foco.texto}
                      </p>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4" style={{ borderColor: "#F0F2F5" }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#028090" }}>
                    Preguntas para conversar
                  </p>
                  <ul className="space-y-2">
                    {PREGUNTAS_CONVERSACION[dim.dimension].slice(0, 3).map((preg, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: "#444455" }}>
                        <span style={{ color: COLOR_DIMENSION[dim.dimension] }}>·</span>
                        {preg}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pregunta de cierre */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "#1A274A" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#E8B850" }}>
            Pregunta de cierre
          </p>
          <p className="text-xl font-bold text-white">
            ¿Qué es lo primero que quieren cuidar o construir los dos?
          </p>
        </div>

        {/* Derivación profesional — 3+ ROJO */}
        {mostrarProfesional && (
          <div className="rounded-2xl p-6" style={{ background: "#FFEB9C", border: "1px solid #E8B850" }}>
            <p className="font-bold mb-2" style={{ color: "#1A274A" }}>Apoyo profesional disponible</p>
            <p className="text-sm mb-4" style={{ color: "#444455" }}>
              El mapa conjunto muestra señales importantes. Lo que aparece aquí merece ser mirado con un profesional.
              No hay respuesta incorrecta — hay conversaciones que a veces necesitan un espacio seguro.
            </p>
            <a href="mailto:contacto@re-conociendonos.com"
              className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#9C6500" }}>
              Hablar con un profesional →
            </a>
          </div>
        )}

        {/* Compartir */}
        <div className="flex gap-3">
          <button onClick={shareWhatsApp}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#25D366" }}>
            Compartir por WhatsApp
          </button>
          {sessionId && (
            <button
              onClick={copiarCodigo}
              className="py-3 px-5 rounded-xl text-sm font-semibold transition-all"
              style={copiado
                ? { background: "#C6EFCE", color: "#276221" }
                : { background: "#F0F2F5", color: "#1A274A" }}
            >
              {copiado ? "¡Copiado!" : "Copiar código"}
            </button>
          )}
        </div>

        <div className="text-center pb-8">
          <button onClick={() => router.push("/")}
            className="text-sm px-6 py-3 rounded-xl" style={{ color: "#888" }}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
