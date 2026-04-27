"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FRASES_GATILLO_INDIVIDUAL, PREGUNTAS_REFLEXION, COLOR_DIMENSION, COLOR_ESTADO } from "@/lib/preguntas";
import { ResultadoDimension, Estado } from "@/lib/types";
import { calcularResultadosIndividual } from "@/lib/calcular";
import { mensajeCierre } from "@/lib/calcular";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export default function ResultadosIndividual() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<{ global: { hist: number; act: number; var: number }; dimensiones: ResultadoDimension[] } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sid = getCookie("session_id");
    if (!sid) {
      router.push("/individual");
      return;
    }
    setSessionId(sid);

    fetch(`/api/sesiones?session_id=${sid}`)
      .then((res) => res.json())
      .then(async (data) => {
        const respuestas = data.sesion?.respuestas?.I;
        if (respuestas && Array.isArray(respuestas) && respuestas.length > 0) {
          const results = calcularResultadosIndividual(respuestas);
          setResultado(results);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

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

  const estados = resultado.dimensiones.map((d) => d.estado);
  const mensaje = mensajeCierre(estados);

  const getPercepcionPareja = () => {
    let positivos = 0;
    let negativos = 0;
    resultado.dimensiones.forEach((d) => {
      if (d.brecha > 15) positivos++;
      if (d.brecha < -5 || d.brecha < 0) negativos++;
    });
    if (positivos > negativos) return "La percibes más positiva de lo que tú sientes";
    if (negativos > positivos) return "La percibes más negativa de lo que tú sientes";
    return "Tu percepción de la pareja es equilibrada";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Mi Mirada</h1>
          <p className="text-slate-600">Resultados de tu reflexión personal</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="text-center mb-6">
            <p className="text-slate-500 text-sm">Resumen global</p>
            <div className="flex justify-center gap-8 mt-4">
              <div>
                <p className="text-xs text-slate-500">Histórico</p>
                <p className="text-2xl font-bold text-slate-700">{resultado.global.hist.toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Hoy</p>
                <p className="text-2xl font-bold text-slate-700">{resultado.global.act.toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Variación</p>
                <p className={`text-2xl font-bold ${resultado.global.var >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {resultado.global.var >= 0 ? "+" : ""}{resultado.global.var.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">{getPercepcionPareja()}</p>
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
                  style={{ backgroundColor: COLOR_ESTADO[dim.estado] }}
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
            </div>
          ))}
        </div>

        {(estados.includes("ROJO") || estados.includes("AMARILLO")) && (
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-800">Reflexiones</h2>
            {resultado.dimensiones
              .filter((d) => d.estado !== "VERDE")
              .map((dim) => {
                const frases = FRASES_GATILLO_INDIVIDUAL[`${dim.dimension}|${dim.estado}`];
                return (
                  <div key={dim.dimension} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLOR_DIMENSION[dim.dimension] }}
                      />
                      <h3 className="font-semibold text-slate-800">{dim.dimension}</h3>
                    </div>
                    <p className="text-slate-600 mb-2">{frases?.frase1}</p>
                    <p className="text-slate-500 text-sm mb-4">{frases?.frase2}</p>
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-sm font-medium text-slate-700 mb-3">Preguntas para reflexionar:</p>
                      <ul className="space-y-2">
                        {PREGUNTAS_REFLEXION[dim.dimension].slice(0, 3).map((preg, i) => (
                          <li key={i} className="text-sm text-slate-600 flex gap-2">
                            <span className="text-slate-400">•</span>
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

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <p className="text-slate-600 text-center">{mensaje}</p>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}