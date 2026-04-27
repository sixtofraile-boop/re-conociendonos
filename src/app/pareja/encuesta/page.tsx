"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PREGUNTAS_PAREJA } from "@/lib/preguntas";
import { RespuestaPareja } from "@/lib/types";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export default function EncuestaPareja() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestaPareja[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [persona, setPersona] = useState<string | null>(null);

  useEffect(() => {
    const sid = getCookie("session_id");
    const per = getCookie("persona");
    if (!sid) {
      router.push("/pareja");
      return;
    }
    setSessionId(sid);
    setPersona(per);

    fetch(`/api/sesiones?session_id=${sid}`)
      .then((res) => res.json())
      .then((data) => {
        const respuestasPrev = data.sesion?.respuestas?.[per || "A"];
        if (respuestasPrev && Array.isArray(respuestasPrev) && respuestasPrev.length > 0) {
          setRespuestas(respuestasPrev);
          setPreguntaActual(respuestasPrev.length);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const pregunta = PREGUNTAS_PAREJA[preguntaActual];

  const handleRespuesta = (campo: string, valor: number) => {
    const nuevas = [...respuestas];
    if (!nuevas[preguntaActual]) {
      nuevas[preguntaActual] = {
        pregunta_id: pregunta.id,
        dimension: pregunta.dimension,
        hist_yo: 5,
        hist_par: 5,
        act_yo: 5,
        act_par: 5,
      };
    }
    nuevas[preguntaActual] = { ...nuevas[preguntaActual], [campo]: valor } as RespuestaPareja;
    setRespuestas(nuevas);
  };

  const handleSiguiente = async () => {
    if (preguntaActual < PREGUNTAS_PAREJA.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      setSaving(true);
      try {
        const res = await fetch("/api/sesiones/respuestas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            persona: persona,
            respuestas,
          }),
        });
        if (!res.ok) throw new Error("Error guardando");
        
        if (persona === "A") {
          router.push("/pareja/resultados");
        } else {
          router.push("/pareja/mapa");
        }
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
    hist_par: 5,
    act_yo: 5,
    act_par: 5,
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
            <p>Este test no mide verdades. Mide miradas.</p>
            <p>
              Cuando respondas sobre ti, estás diciendo cómo te percibes a ti mismo/a en esta relación. 
              Cuando respondas sobre tu pareja, no estás juzgando quién es ni lo que siente — estás 
              poniendo en número lo que observas, lo que interpretas de sus acciones y lo que eso te produce a ti.
            </p>
            <p>
              Dos personas pueden vivir la misma relación y tener mapas muy distintos. Eso no significa 
              que uno tenga razón y el otro no. Significa que hay conversaciones que todavía no han tenido.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="font-medium text-blue-800 mb-2">Cómo responder:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Usa la escala del 1 al 10. No lo pienses demasiado — el primer número que te salga suele ser el más honesto.</li>
                <li>Para cada pregunta responderás dos veces: cómo te ves tú y cómo percibes a tu pareja.</li>
                <li>Las preguntas están mezcladas — los resultados mostrarán el mapa por dimensión.</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => setShowIntro(false)}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Comenzar
          </button>
        </div>
      </div>
    );
  }

  const total = PREGUNTAS_PAREJA.length;
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
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <p className="text-lg text-slate-800 mb-8">{pregunta.texto}</p>

          {[
            { label: "Cómo me veo yo", key: "hist_yo", key2: "act_yo" },
            { label: "Cómo percibo a mi pareja", key: "hist_par", key2: "act_par" },
          ].map((seccion) => (
            <div key={seccion.key} className="mb-8 last:mb-0">
              <p className="font-medium text-slate-700 mb-4">{seccion.label}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-2">Histórico (a lo largo de la relación)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentResp[seccion.key as keyof typeof currentResp] as number}
                      onChange={(e) => handleRespuesta(seccion.key, parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-center font-medium text-slate-700">
                      {currentResp[seccion.key as keyof typeof currentResp] as number}
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
                      value={currentResp[seccion.key2 as keyof typeof currentResp] as number}
                      onChange={(e) => handleRespuesta(seccion.key2, parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-8 text-center font-medium text-slate-700">
                      {currentResp[seccion.key2 as keyof typeof currentResp] as number}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : preguntaActual < total - 1 ? "Siguiente →" : "Finalizar"}
          </button>
        </div>
      </div>
    </div>
  );
}