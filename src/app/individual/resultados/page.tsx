"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FRASES_GATILLO_INDIVIDUAL, PREGUNTAS_REFLEXION, COLOR_DIMENSION, COLOR_ESTADO } from "@/lib/preguntas";
import { ResultadoDimension, Estado } from "@/lib/types";
import { calcularResultadosIndividual, mensajeCierre } from "@/lib/calcular";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const ZONA_COLORES: Record<string, { bg: string; text: string }> = {
  "Zona crítica":    { bg: "#FFC7CE", text: "#9C0006" },
  "Zona de cuidado": { bg: "#FFEB9C", text: "#9C6500" },
  "Zona tranquila":  { bg: "#C6EFCE", text: "#276221" },
};

export default function ResultadosIndividual() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<{
    global: { hist: number; act: number; var: number };
    dimensiones: ResultadoDimension[];
    recomienda_profesional: boolean;
  } | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sid = getCookie("session_id");
    const nom = getCookie("nombre");
    if (!sid) { router.push("/individual"); return; }
    setSessionId(sid);
    setNombre(nom);

    fetch(`/api/sesiones?session_id=${sid}`)
      .then((res) => res.json())
      .then((data) => {
        const respuestas = data.sesion?.respuestas?.I;
        if (respuestas && Array.isArray(respuestas) && respuestas.length > 0) {
          setResultado(calcularResultadosIndividual(respuestas));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F8F8" }}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: "#028090", borderTopColor: "transparent" }} />
          <p style={{ color: "#444455" }}>Calculando tu mapa...</p>
        </div>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ background: "#F8F8F8" }}>
        <p style={{ color: "#444455" }}>No se encontraron respuestas guardadas.</p>
        <button onClick={() => router.push("/individual/encuesta")}
          className="px-6 py-3 rounded-xl font-semibold text-white" style={{ background: "#028090" }}>
          Volver a la encuesta
        </button>
      </div>
    );
  }

  const estados = resultado.dimensiones.map((d) => d.estado);
  const mensaje = mensajeCierre(estados);
  const mostrarProfesional = resultado.recomienda_profesional;

  const getPercepcionPareja = () => {
    let masAlta = 0, masBaja = 0;
    resultado.dimensiones.forEach((d) => {
      if (d.brecha === 10) masAlta++;
      if (d.brecha === 20) masBaja++;
    });
    if (masAlta > masBaja) return "Tiendes a percibir que tu pareja valora la relación más que tú";
    if (masBaja > masAlta) return "Tiendes a percibir que tu pareja valora la relación menos que tú";
    return "Tu percepción de la pareja es equilibrada respecto a tu propia mirada";
  };

  const shareWhatsApp = () => {
    const resumen = resultado.dimensiones
      .map((d) => `${d.dimension}: ${d.nivel_act.toFixed(0)}% (${d.estado})`)
      .join("\n");
    const texto = `Mi mapa RE-CONOCIÉNDONOS:\n\n${resumen}\n\nVariación global: ${resultado.global.var >= 0 ? "+" : ""}${resultado.global.var.toFixed(0)}%`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>

      {/* Header */}
      <div style={{ background: "#1A274A" }} className="px-6 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>MI MIRADA</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            {nombre ? `El mapa de ${nombre}` : "Tu mapa personal"}
          </h1>
          <p style={{ color: "#B8CCEE" }} className="text-sm">Las 4 dimensiones vistas desde tu mirada</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Resumen global */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "#028090" }}>Resumen global</p>
          <div className="flex justify-center gap-8 mb-4">
            {[
              { label: "Histórico", value: `${resultado.global.hist.toFixed(0)}%` },
              { label: "Hoy",       value: `${resultado.global.act.toFixed(0)}%` },
              { label: "Variación", value: `${resultado.global.var >= 0 ? "+" : ""}${resultado.global.var.toFixed(0)}%`, color: resultado.global.var >= 0 ? "#276221" : "#9C0006" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs mb-1" style={{ color: "#888" }}>{item.label}</p>
                <p className="text-2xl font-bold" style={{ color: item.color || "#1A274A" }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="text-center p-3 rounded-xl text-sm font-medium" style={{ background: "#EEF2FF", color: "#2C3E6B" }}>
            {getPercepcionPareja()}
          </div>
        </div>

        {/* Dimensiones */}
        <div className="space-y-3">
          {resultado.dimensiones.map((dim) => {
            const zona = ZONA_COLORES[dim.zona];
            return (
              <div key={dim.dimension} className="bg-white rounded-2xl p-5 shadow-sm"
                style={{ borderLeft: `4px solid ${COLOR_DIMENSION[dim.dimension]}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLOR_DIMENSION[dim.dimension] }} />
                      <h3 className="font-bold" style={{ color: "#1A274A" }}>{dim.dimension}</h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: zona.bg, color: zona.text }}>
                      {dim.zona}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: COLOR_ESTADO[dim.estado as Estado] }}>
                    {dim.estado}
                  </span>
                </div>
                <div className="flex gap-6 text-sm mb-2" style={{ color: "#444455" }}>
                  <span>Hist: <strong>{dim.nivel_hist.toFixed(0)}%</strong></span>
                  <span>Hoy: <strong>{dim.nivel_act.toFixed(0)}%</strong></span>
                  <span style={{ color: dim.variacion >= 0 ? "#276221" : "#9C0006" }}>
                    {dim.variacion >= 0 ? "▲" : "▼"} {Math.abs(dim.variacion).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#666" }}>{dim.criterio_texto}</p>
              </div>
            );
          })}
        </div>

        {/* Reflexiones por dimensión */}
        {(estados.includes("ROJO") || estados.includes("AMARILLO")) && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold px-1" style={{ color: "#1A274A" }}>Reflexiones</h2>
            {resultado.dimensiones.filter((d) => d.estado !== "VERDE").map((dim) => {
              const frases = FRASES_GATILLO_INDIVIDUAL[`${dim.dimension}|${dim.estado}`];
              return (
                <div key={dim.dimension} className="bg-white rounded-2xl p-6 shadow-sm"
                  style={{ borderLeft: `4px solid ${COLOR_DIMENSION[dim.dimension]}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLOR_DIMENSION[dim.dimension] }} />
                    <h3 className="font-bold" style={{ color: "#1A274A" }}>{dim.dimension}</h3>
                  </div>
                  <p className="mb-2 leading-relaxed" style={{ color: "#444455" }}>{frases?.frase1}</p>
                  <p className="text-sm mb-4" style={{ color: "#666" }}>{frases?.frase2}</p>
                  <div className="border-t pt-4" style={{ borderColor: "#F0F2F5" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#028090" }}>
                      Preguntas para reflexionar
                    </p>
                    <ul className="space-y-2">
                      {PREGUNTAS_REFLEXION[dim.dimension].slice(0, 3).map((preg, i) => (
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
        )}

        {/* Mensaje de cierre */}
        <div className="rounded-2xl p-6 text-center" style={{ background: "#1A274A" }}>
          <p className="text-white leading-relaxed">{mensaje}</p>
        </div>

        {/* Derivación profesional — 3+ ROJO */}
        {mostrarProfesional && (
          <div className="rounded-2xl p-6" style={{ background: "#FFEB9C", border: "1px solid #E8B850" }}>
            <p className="font-bold mb-2" style={{ color: "#1A274A" }}>Apoyo profesional disponible</p>
            <p className="text-sm mb-4" style={{ color: "#444455" }}>
              Lo que aparece en tu mapa merece ser mirado con un profesional. No hay respuesta incorrecta
              — hay conversaciones que a veces necesitan un espacio seguro y con apoyo.
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
          <button
            onClick={() => window.open(`/api/pdf/individual?session_id=${sessionId}`, "_blank")}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "#1A274A" }}
          >
            Descargar PDF
          </button>
        </div>

        {/* ✨ MOMENTO DE UPGRADE — Invitar a la pareja */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "#EBF3FB", border: "2px solid #5B8DD9" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#5B8DD9" }}>
            El siguiente paso
          </p>
          <h3 className="text-xl font-bold mb-3" style={{ color: "#1A274A" }}>
            ¿Te hace sentido vivir esta experiencia con tu pareja?
          </h3>
          <p className="text-sm mb-2" style={{ color: "#444455" }}>
            Ver juntos el mapa completo — y descubrir dónde coinciden y dónde hay brechas.
          </p>
          {(estados.includes("ROJO") || estados.includes("AMARILLO")) && (
            <p className="text-sm mb-4 font-medium" style={{ color: "#C0504D" }}>
              Tu mapa muestra dimensiones que merecen ser conversadas con tu pareja.
            </p>
          )}
          <button
            onClick={() => router.push("/pareja")}
            className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#5B8DD9" }}>
            Invitar a mi pareja →
          </button>
        </div>

        <div className="text-center pb-8">
          <button onClick={() => router.push("/individual/feedback")}
            className="text-sm px-6 py-3 rounded-xl font-medium mt-2" style={{ color: "#028090" }}>
            Dar feedback sobre la experiencia
          </button>
          <button onClick={() => router.push("/")}
            className="text-sm px-6 py-3 rounded-xl" style={{ color: "#888" }}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
