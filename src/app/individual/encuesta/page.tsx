"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PREGUNTAS_INDIVIDUAL } from "@/lib/preguntas";
import { RespuestaIndividual } from "@/lib/types";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export default function EncuestaIndividual() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestaIndividual[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
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
      .then((data) => {
        const respuestasPrev = data.sesion?.respuestas?.I;
        if (respuestasPrev && Array.isArray(respuestasPrev) && respuestasPrev.length > 0) {
          setRespuestas(respuestasPrev);
          setPreguntaActual(respuestasPrev.length);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const pregunta = PREGUNTAS_INDIVIDUAL[preguntaActual];

  const handleRespuesta = (campo: string, valor: number | string) => {
    const nuevas = [...respuestas];
    if (!nuevas[preguntaActual]) {
       nuevas[preguntaActual] = {
         pregunta_id: pregunta.id,
         dimension: pregunta.dimension,
         hist_yo: 5,
         act_yo: 5,
         hist_par: "IGUAL",
         act_par: "IGUAL",
       };
    }
    nuevas[preguntaActual] = { ...nuevas[preguntaActual], [campo]: valor } as RespuestaIndividual;
    setRespuestas(nuevas);
  };

  const handleSiguiente = async () => {
    if (preguntaActual < PREGUNTAS_INDIVIDUAL.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      setSaving(true);
      try {
        const res = await fetch("/api/sesiones/respuestas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            persona: "I",
            respuestas,
          }),
        });
        if (!res.ok) throw new Error("Error guardando");
        
        router.push("/individual/resultados");
      } catch (e) {
        console.error(e);
        alert("Error al guardar. Intenta de nuevo.");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) setPreguntaActual(preguntaActual - 1);
  };

  const currentResp = respuestas[preguntaActual] || {
    hist_yo: 5,
    act_yo: 5,
    hist_par: "IGUAL",
    act_par: "IGUAL",
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <div className="max-w-2xl bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Antes de comenzar</h2>
          <div className="text-slate-600 space-y-4 text-leading-relaxed">
            <p>Este no es un test para juzgar tu relación ni a tu pareja. Es un espejo.</p>
            <p>
              Te ayuda a nombrar lo que quizás ya sientes pero no has podido poner en palabras — 
              y a ver con más claridad dónde conviene poner atención.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg mt-4">
              <p className="font-medium text-purple-800 mb-2">Cómo responder:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-700">
                <li>Para cada pregunta hay DOS respuestas: Tu nota (1 al 7) y cómo crees que respondería tu pareja (Más alto / Igual / Más bajo)</li>
                <li>No lo pienses demasiado — la primera respuesta suele ser la más honesta.</li>
                <li>Las preguntas están mezcladas — los resultados mostrarán el mapa por dimensión.</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => setShowIntro(false)}
            className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Comenzar
          </button>
        </div>
      </div>
    );
  }

  const total = PREGUNTAS_INDIVIDUAL.length;
  const progreso = ((preguntaActual + 1) / total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Pregunta {preguntaActual + 1} de {total}</span>
            <span>{Math.round(progreso)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <p className="text-lg text-slate-800 mb-8">{pregunta.texto}</p>

          <div className="mb-8">
            <p className="font-medium text-slate-700 mb-4">Mi nota</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">Histórico (a lo largo de la relación)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentResp.hist_yo}
                    onChange={(e) => handleRespuesta("hist_yo", parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-8 text-center font-medium text-slate-700">
                    {currentResp.hist_yo}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Hoy</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentResp.act_yo}
                    onChange={(e) => handleRespuesta("act_yo", parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-8 text-center font-medium text-slate-700">
                    {currentResp.act_yo}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-4">¿Cómo crees que respondería tu pareja esta misma pregunta?</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">Histórico</p>
                <select
                  value={currentResp.hist_par}
                  onChange={(e) => handleRespuesta("hist_par", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="MAS_ALTO">Más alto que yo</option>
                  <option value="IGUAL">Igual que yo</option>
                  <option value="MAS_BAJO">Más bajo que yo</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Hoy</p>
                <select
                  value={currentResp.act_par}
                  onChange={(e) => handleRespuesta("act_par", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="MAS_ALTO">Más alto que yo</option>
                  <option value="IGUAL">Igual que yo</option>
                  <option value="MAS_BAJO">Más bajo que yo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleAnterior}
            disabled={preguntaActual === 0}
            className="px-6 py-3 text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          <button
            onClick={handleSiguiente}
            disabled={saving}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : preguntaActual < total - 1 ? "Siguiente →" : "Finalizar"}
          </button>
        </div>
      </div>
    </div>
  );
}