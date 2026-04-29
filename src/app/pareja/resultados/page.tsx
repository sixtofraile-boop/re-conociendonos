"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calcularResultadosIndividualPareja } from "@/lib/calcular";
import { COLOR_DIMENSION, COLOR_ESTADO } from "@/lib/preguntas";
import { ResultadoGlobal, Estado } from "@/lib/types";

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

export default function ResultadosPareja() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<ResultadoGlobal | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [persona, setPersona] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [hipotesis, setHipotesis] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [parejaLista, setParejaLista] = useState(false);

  useEffect(() => {
    const sid = getCookie("session_id");
    const per = getCookie("persona");
    const nom = getCookie("nombre");
    if (!sid || !per) { router.push("/pareja"); return; }
    setSessionId(sid);
    setPersona(per);
    setNombre(nom);

    fetch(`/api/sesiones?session_id=${sid}`)
      .then((res) => res.json())
      .then((data) => {
        const respuestas = data.sesion?.respuestas;
        if (respuestas && respuestas[per]) {
          setResultado(calcularResultadosIndividualPareja(respuestas[per]));
        }
        if (data.sesion?.estado === "mapa_conjunto") {
          setParejaLista(true);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Polling: detecta cuando la pareja termina su encuesta
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/sesiones?session_id=${sid}`);
        const data = await res.json();
        if (data.sesion?.estado === "mapa_conjunto") {
          setParejaLista(true);
          clearInterval(interval);
        }
      } catch { /* silencioso */ }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleGuardarHipotesis = async () => {
    if (!sessionId || !persona) return;
    setGuardando(true);
    try {
      await fetch("/api/sesiones/hipotesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, persona, hipotesis }),
      });
      router.push("/pareja/mapa");
    } catch (e) {
      console.error(e);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F8F8" }}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: "#5B8DD9", borderTopColor: "transparent" }} />
          <p style={{ color: "#444455" }}>Calculando tu mapa...</p>
        </div>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4" style={{ background: "#F8F8F8" }}>
        <p style={{ color: "#444455" }}>No se encontraron respuestas guardadas.</p>
        <button onClick={() => router.push("/pareja/encuesta")}
          className="px-6 py-3 rounded-xl font-semibold text-white" style={{ background: "#5B8DD9" }}>
          Volver a la encuesta
        </button>
      </div>
    );
  }

  const rojos = resultado.dimensiones.filter((d) => d.estado === "ROJO").length;
  const mostrarProfesional = rojos >= 3;

  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>

      {/* Header */}
      <div style={{ background: "#1A274A" }} className="px-6 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>TU MAPA INDIVIDUAL</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            {nombre ? `El mapa de ${nombre}` : "Tu mapa individual"}
          </h1>
          <p style={{ color: "#B8CCEE" }} className="text-sm">
            Antes de ver el mapa conjunto — esta es tu mirada
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Resumen global */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "#028090" }}>Resumen global</p>
          <div className="flex justify-center gap-8">
            {[
              { label: "Histórico", value: `${resultado.global_hist.toFixed(0)}%` },
              { label: "Hoy",       value: `${resultado.global_act.toFixed(0)}%` },
              { label: "Variación", value: `${resultado.global_var >= 0 ? "+" : ""}${resultado.global_var.toFixed(0)}%`, color: resultado.global_var >= 0 ? "#276221" : "#9C0006" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs mb-1" style={{ color: "#888" }}>{item.label}</p>
                <p className="text-2xl font-bold" style={{ color: item.color || "#1A274A" }}>{item.value}</p>
              </div>
            ))}
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
                {dim.focos.length > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid #F0F2F5" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9C6500" }}>Focos de atención</p>
                    {dim.focos.slice(0, 2).map((foco) => (
                      <p key={foco.pregunta_id} className="text-xs mb-1" style={{ color: "#444455" }}>· {foco.texto}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Derivación — 3+ ROJO */}
        {mostrarProfesional && (
          <div className="rounded-2xl p-6" style={{ background: "#FFEB9C", border: "1px solid #E8B850" }}>
            <p className="font-bold mb-2" style={{ color: "#1A274A" }}>Apoyo profesional disponible</p>
            <p className="text-sm mb-4" style={{ color: "#444455" }}>
              Tu mapa muestra señales importantes en varias dimensiones. Hablar con un profesional puede ser un primer paso valioso.
            </p>
            <a href="mailto:contacto@re-conociendonos.com"
              className="inline-block px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#9C6500" }}>
              Hablar con un profesional →
            </a>
          </div>
        )}

        {/* Hipótesis antes del reveal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#5B8DD9" }}>
            Antes de ver el mapa conjunto
          </p>
          <h2 className="font-bold mb-3" style={{ color: "#1A274A" }}>
            ¿Qué esperas encontrar cuando vean el mapa juntos?
          </h2>
          <p className="text-sm mb-4" style={{ color: "#666" }}>
            ¿Dónde crees que van a coincidir? ¿Dónde habrá sorpresas?<br />
            Este texto queda guardado y aparece en el reveal. Es el primer acto de honestidad antes de ver los datos.
          </p>
          <textarea
            value={hipotesis}
            onChange={(e) => setHipotesis(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm h-32"
            style={{ borderColor: "#CCCCCC", color: "#1A274A", background: "#F8F8F8" }}
            placeholder="Mi hipótesis es que..."
          />
        </div>

        {/* Banner: pareja ya terminó */}
        {parejaLista && (
          <div className="rounded-2xl p-4 text-center animate-pulse" style={{ background: "#C6EFCE", border: "1px solid #02C39A" }}>
            <p className="font-bold" style={{ color: "#276221" }}>¡Tu pareja ya terminó! El mapa está listo.</p>
          </div>
        )}

        <button
          onClick={handleGuardarHipotesis}
          disabled={guardando}
          className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: parejaLista ? "#02C39A" : "#5B8DD9" }}
        >
          {guardando ? "Guardando..." : parejaLista ? "¡Ver el mapa juntos ahora! →" : "Continuar al mapa conjunto →"}
        </button>

        <p className="text-xs text-center" style={{ color: "#888" }}>
          Puedes continuar sin escribir tu hipótesis — aunque te recomendamos hacerlo.
        </p>
      </div>
    </div>
  );
}
