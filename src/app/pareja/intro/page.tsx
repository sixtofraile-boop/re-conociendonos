"use client";

import { useRouter } from "next/navigation";

export default function ParejaIntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>

      {/* Header */}
      <div style={{ background: "#1A274A" }} className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>NUESTRO MAPA</p>
          <h1 className="text-2xl font-bold text-white mb-2">Antes de empezar</h1>
          <p style={{ color: "#B8CCEE" }} className="text-sm">
            Un momento para situarte en lo que van a hacer juntos
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-5">

        {/* Aviso principal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm leading-relaxed" style={{ color: "#2C3E6B" }}>
            Esto no busca revelar una verdad sobre tu relación. Busca ayudarlos a{" "}
            <strong>comparar cómo están mirando su relación hoy</strong>, cada uno desde su lugar.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: "#444455" }}>
            Cada uno responde por separado. Las respuestas son percepciones personales del momento, no verdades sobre el otro.
          </p>
        </div>

        {/* Qué es */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "#5B8DD9" }}>
            Esto SÍ es
          </p>
          <ul className="space-y-3">
            {[
              "Una experiencia de autoconocimiento relacional compartida",
              "Un mapa de cómo cada uno está viviendo la relación",
              "Un punto de partida para conversaciones más honestas",
              "Un espejo para mirar juntos, sin juzgar al otro",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#444455" }}>
                <span className="mt-0.5 text-base" style={{ color: "#27AE60" }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Qué no es */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "#C0504D" }}>
            Esto NO es
          </p>
          <ul className="space-y-3">
            {[
              "Un test psicológico ni un diagnóstico clínico",
              "Una evaluación objetiva ni un árbitro de quién tiene razón",
              "Un predictor de si la relación funcionará o no",
              "Una terapia ni un sustituto de apoyo profesional",
              "Un arma para ganar una discusión",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#444455" }}>
                <span className="mt-0.5 text-base" style={{ color: "#C0504D" }}>✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Aviso adicional */}
        <div className="rounded-2xl p-5 text-sm leading-relaxed" style={{ background: "#EBF3FB", color: "#2C3E6B" }}>
          Si en algún momento algo duele demasiado, densen permiso de pausar.
          Esta herramienta no es adecuada si existe violencia, coerción o riesgo emocional grave en la relación.
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/pareja/encuesta")}
          className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#5B8DD9" }}
        >
          Entendido, comenzar mi parte →
        </button>

        <p className="text-xs text-center pb-4" style={{ color: "#888" }}>
          23 preguntas · Tus respuestas son confidenciales y tu pareja no las verá hasta el reveal
        </p>
      </div>
    </div>
  );
}
