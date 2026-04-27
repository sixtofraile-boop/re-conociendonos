"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FRASES_GATILLO_PAREJA, PREGUNTAS_CONVERSACION, COLOR_DIMENSION, COLOR_ESTADO } from "@/lib/preguntas";
import { ResultadoGlobal, Estado } from "@/lib/types";
import { calcularResultadosPareja } from "@/lib/calcular";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export default function MapaConjunto() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<ResultadoGlobal | null>(null);
  const [sesion, setSesion] = useState<any>(null);

  useEffect(() => {
    const sid = getCookie("session_id");
    if (!sid) {
      router.push("/pareja");
      return;
    }

    fetch(`/api/sesiones?session_id=${sid}`)
      .then((res) => res.json())
      .then(async (data) => {
        const respuestas = data.sesion?.respuestas;
        if (respuestas && respuestas.A && respuestas.B) {
          const { calcularResultadosPareja } = await import("@/lib/calcular");
          const results = calcularResultadosPareja(respuestas.A, respuestas.B);
          setResultado(results);
          setSesion(data.sesion);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!resultado || !sesion) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p>No hay suficientes datos para mostrar el mapa conjunto.</p>
        <p className="text-sm text-slate-500">Asegúrate de que ambos hayan respondido la encuesta.</p>
        <button onClick={() => router.push("/pareja")} className="text-blue-600 hover:underline">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Mapa Conjunto</h1>
          <p className="text-slate-600">Dos miradas que al unirse revelan la verdad</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="font-semibold text-slate-800 mb-4">Resumen sistémico</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-2 text-slate-500">Dimensión</th>
                  <th className="text-center py-2 px-2 text-slate-500">Tú Hoy</th>
                  <th className="text-center py-2 px-2 text-slate-500">Pareja Hoy</th>
                  <th className="text-center py-2 px-2 text-slate-500">Sistema</th>
                  <th className="text-center py-2 px-2 text-slate-500">Brecha</th>
                  <th className="text-center py-2 px-2 text-slate-500">Variación</th>
                  <th className="text-center py-2 px-2 text-slate-500">Estado</th>
                </tr>
              </thead>
              <tbody>
                {resultado.dimensiones.map((dim) => (
                  <tr key={dim.dimension} className="border-b border-slate-100">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_DIMENSION[dim.dimension] }} />
                        <span className="font-medium text-slate-700">{dim.dimension}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 text-slate-600">{dim.yo_act_pct?.toFixed(0)}%</td>
                    <td className="text-center py-3 px-2 text-slate-600">{dim.par_act_pct?.toFixed(0)}%</td>
                    <td className="text-center py-3 px-2 font-medium text-slate-700">{dim.nivel_act.toFixed(0)}%</td>
                    <td className="text-center py-3 px-2 text-slate-600">{dim.brecha.toFixed(0)}</td>
                    <td className={`text-center py-3 px-2 ${dim.variacion >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {dim.variacion >= 0 ? "+" : ""}{dim.variacion.toFixed(0)}%
                    </td>
                    <td className="text-center py-3 px-2">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: COLOR_ESTADO[dim.estado] }}
                      >
                        {dim.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {sesion.hipotesis_A && sesion.hipotesis_B && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="font-semibold text-slate-800 mb-4">Hipótesis antes del reveal</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-600 mb-2">Tu hipótesis</p>
                <p className="text-sm text-slate-700">{sesion.hipotesis_A}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-xs font-medium text-purple-600 mb-2">Hipótesis de tu pareja</p>
                <p className="text-sm text-slate-700">{sesion.hipotesis_B}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {resultado.dimensiones.map((dim) => {
            const frases = FRASES_GATILLO_PAREJA[`${dim.dimension}|${dim.estado}`];
            return (
              <div key={dim.dimension} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
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
                
                <p className="text-slate-600 mb-4">{frases?.frase1}</p>
                <p className="text-slate-500 text-sm mb-4">{frases?.frase2}</p>

                {dim.focos.length > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-xs font-medium text-amber-700 mb-2">Focos de atención:</p>
                    {dim.focos.map((foco) => (
                      <p key={foco.pregunta_id} className="text-sm text-amber-800 mb-1">
                        {foco.rank}. {foco.texto.substring(0, 100)}...
                      </p>
                    ))}
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">Preguntas para conversar:</p>
                  <ul className="space-y-2">
                    {PREGUNTAS_CONVERSACION[dim.dimension].slice(0, 3).map((preg, i) => (
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

        <div className="mt-8 text-center">
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