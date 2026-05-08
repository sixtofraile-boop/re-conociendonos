"use client";

import { useRouter } from "next/navigation";

export default function IndividualIntroPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>

      {/* Header */}
      <div style={{ background: "#1A274A" }} className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>MI MIRADA</p>
          <h1 className="text-2xl font-bold text-white mb-2">Antes de empezar</h1>
          <p style={{ color: "#B8CCEE" }} className="text-sm">
            Un momento para situarte en lo que vas a hacer
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-5">

        {/* Aviso principal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm leading-relaxed" style={{ color: "#2C3E6B" }}>
            Esto no busca darte una verdad sobre tu relación. Busca ayudarte a{" "}
            <strong>ordenar cómo estás mirando tu relación hoy</strong>.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: "#444455" }}>
            Responde desde tu experiencia. No intentes adivinar perfectamente; solo registra tu percepción del momento.
          </p>
        </div>

        {/* Qué es */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "#028090" }}>
            Esto SÍ es
          </p>
          <ul className="space-y-3">
            {[
              "Una experiencia de autoconocimiento relacional",
              "Una forma de ordenar tus percepciones del momento",
              "Un punto de partida para conversaciones más honestas",
              "Un espejo para mirar lo que sientes, sin juzgarte",
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
              "Una evaluación objetiva de tu relación",
              "Un predictor de si la relación funcionará o no",
              "Una terapia ni un sustituto de apoyo profesional",
              "Una sentencia sobre quién tiene razón",
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
          Si sientes que algo de esta experiencia te sobrepasa, date permiso de pausar.
          Esta herramienta no es adecuada si estás viviendo una situación de violencia, coerción o riesgo emocional grave.
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/individual/encuesta")}
          className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#028090" }}
        >
          Entendido, comenzar Mi Mirada →
        </button>

        <p className="text-xs text-center pb-4" style={{ color: "#888" }}>
          22 preguntas · Tus respuestas son personales y confidenciales
        </p>
      </div>
    </div>
  );
}
