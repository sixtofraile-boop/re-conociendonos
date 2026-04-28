"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calcularResultadosPareja } from "@/lib/calcular";
import { PREGUNTAS_PAREJA, FRASES_GATILLO_PAREJA, COLOR_DIMENSION, COLOR_ESTADO } from "@/lib/preguntas";
import { ResultadoGlobal, ResultadoDimension, Estado } from "@/lib/types";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export default function ResultadosPareja() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<ResultadoGlobal | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [persona, setPersona] = useState<string | null>(null);
  const [hipotesis, setHipotesis] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const sid = getCookie("session_id");
    const per = getCookie("persona");
    if (!sid || !per) {
      router.push("/pareja");
      return;
    }
    setSessionId(sid);
    setPersona(per);

    fetch(`/api/sesiones?session_id=${sid}`)
      .then((res) => res.json())
      .then(async (data) => {
        const respuestas = data.sesion?.respuestas;
        if (respuestas && respuestas[per]) {
          const { calcularResultadosIndividualPareja } = await import("@/lib/calcular");
          const results = calcularResultadosIndividualPareja(respuestas[per]);
          setResultado(results);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!resultado) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No hay resultados disponibles.</p>
      </div>
    );
  }

  const getSemaforoColor = (estado: Estado) => COLOR_ESTADO[estado];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Tu Mapa Individual</h1>
          <p className="text-slate-600">Estas son las 4 dimensiones vistas desde tu mirada</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="text-center mb-6">
            <p className="text-slate-500 text-sm">Resumen global</p>
            <div className="flex justify-center gap-8 mt-4">
              <div>
                <p className="text-xs text-slate-500">Histórico</p>
                <p className="text-2xl font-bold text-slate-700">{resultado.global_hist.toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Hoy</p>
                <p className="text-2xl font-bold text-slate-700">{resultado.global_act.toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Variación</p>
                <p className={`text-2xl font-bold ${resultado.global_var >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {resultado.global_var >= 0 ? "+" : ""}{resultado.global_var.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {resultado.dimensiones.map((dim) => (
            <div key={dim.dimension} className="bg-white rounded-xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLOR_DIMENSION[dim.dimension] }}
                  />
                  <h3 className="font-semibold text-slate-800">{dim.dimension}</h3>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getSemaforoColor(dim.estado) }}
                >
                  {dim.estado}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Hist: {dim.nivel_hist.toFixed(0)}%</span>
                <span>Hoy: {dim.nivel_act.toFixed(0)}%</span>
                <span>Var: {dim.variacion >= 0 ? "+" : ""}{dim.variacion.toFixed(0)}%</span>
              </div>
              <p className="text-sm text-slate-500">{dim.criterio_texto}</p>
              {dim.focos.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-2">Focos de atención:</p>
                  {dim.focos.slice(0, 2).map((foco) => (
                    <p key={foco.pregunta_id} className="text-xs text-slate-600 mb-1">
                      • {foco.texto.substring(0, 80)}...
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="font-semibold text-slate-800 mb-4">Antes de ver el mapa conjunto...</h2>
          <p className="text-sm text-slate-600 mb-4">
            Escribe brevemente qué crees que verás cuando tu pareja haya respondido también. 
            ¿Qué crees que coincidirá? ¿Qué crees que diferirá?
          </p>
          <textarea
            value={hipotesis}
            onChange={(e) => setHipotesis(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            placeholder="Mi hipótesis es que..."
          />
        </div>

        <button
          onClick={handleGuardarHipotesis}
          disabled={guardando}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Ver mapa conjunto"}
        </button>
      </div>
    </div>
  );
}