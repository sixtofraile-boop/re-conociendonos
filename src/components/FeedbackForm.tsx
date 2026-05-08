"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PREGUNTAS_FEEDBACK = [
  { id: "claridad", label: "Claridad", pregunta: "¿Entendiste qué era y qué no era la experiencia?" },
  { id: "friccion", label: "Fricción", pregunta: "¿En qué parte te cansaste, dudaste o quisiste abandonar?" },
  { id: "seguridad", label: "Seguridad emocional", pregunta: "¿Sentiste que el lenguaje cuidaba la conversación?" },
  { id: "utilidad", label: "Utilidad", pregunta: "¿Te ayudó a ponerle nombre a algo real?" },
  { id: "conversacion", label: "Conversación", pregunta: "¿Abrieron una conversación que no habían tenido?" },
  { id: "recomendacion", label: "Recomendación", pregunta: "¿Se lo recomendarías a otra pareja?" },
  { id: "pago", label: "Valor", pregunta: "Si costara un monto razonable, ¿lo pagarías? ¿Cuánto te parecería justo?" },
];

export default function FeedbackForm({ returnPath }: { returnPath: string }) {
  const router = useRouter();
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async () => {
    setEnviando(true);
    try {
      const sessionMatch = document.cookie.match(/session_id=([^;]+)/);
      await fetch("/api/sesiones/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionMatch?.[1], respuestas }),
      });
      setEnviado(true);
    } catch {
      // silently fail - feedback is optional
      setEnviado(true);
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F8F8F8" }}>
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#C6EFCE" }}>
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#1A274A" }}>Gracias por tu feedback</h2>
          <p className="text-sm mb-6" style={{ color: "#444455" }}>
            Tu experiencia nos ayuda a cuidar mejor esta herramienta.
          </p>
          <button
            onClick={() => router.push(returnPath)}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "#028090" }}
          >
            Volver a mis resultados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>
      <div style={{ background: "#1A274A" }} className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>FEEDBACK</p>
          <h1 className="text-2xl font-bold text-white">Cuéntanos tu experiencia</h1>
          <p style={{ color: "#B8CCEE" }} className="text-sm mt-2">
            Tus respuestas nos ayudan a mejorar. Todo es anónimo.
          </p>
        </div>
      </div>
      <div className="max-w-md mx-auto px-6 py-8 space-y-4">
        {PREGUNTAS_FEEDBACK.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#5B8DD9" }}>
              {p.label}
            </p>
            <p className="text-sm font-medium mb-3" style={{ color: "#1A274A" }}>
              {p.pregunta}
            </p>
            <textarea
              value={respuestas[p.id] || ""}
              onChange={(e) => setRespuestas(prev => ({ ...prev, [p.id]: e.target.value }))}
              className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
              rows={2}
              placeholder="Escribe aquí..."
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={enviando}
          className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "#028090" }}
        >
          {enviando ? "Enviando..." : "Enviar feedback"}
        </button>
        <button
          onClick={() => router.push(returnPath)}
          className="w-full py-3 rounded-xl text-sm font-medium"
          style={{ background: "#F0F2F5", color: "#444455" }}
        >
          Saltar (solo quiero ver mis resultados)
        </button>
      </div>
    </div>
  );
}
