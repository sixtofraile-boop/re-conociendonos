"use client";

import { useRouter } from "next/navigation";

export default function ContencionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1A274A" }}>

      <div className="flex-1 max-w-lg mx-auto px-6 py-16 flex flex-col justify-center">

        {/* Encabezado contenedor */}
        <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-center" style={{ color: "#E8B850" }}>
          UN MOMENTO PARA TI
        </p>

        <h1 className="text-3xl font-bold text-white mb-6 leading-tight text-center">
          Lo que viste hoy<br />no tiene que resolverse hoy.
        </h1>

        {/* Cuerpo de contención */}
        <div className="space-y-5 mb-10">

          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.07)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#B8CCEE" }}>
              Si algo de lo que apareció en el mapa te dolió, es normal. Lo importante no es ganar una discusión
              ni demostrar quién tiene razón — es cuidar la próxima conversación.
            </p>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#E8B850" }}>
              Para la próxima conversación
            </p>
            <ul className="space-y-3">
              {[
                "Elijan una sola pregunta para empezar — no lo hablen todo de una vez.",
                "Busquen un momento tranquilo, sin interrupciones.",
                "Dense permiso de pausar si algo se vuelve demasiado intenso.",
                "Hablen desde «yo siento» o «yo necesito», evitando «tú siempre» o «tú nunca».",
                "Recuerden que están del mismo lado del problema.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#B8CCEE" }}>
                  <span style={{ color: "#E8B850" }}>·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "rgba(232,184,80,0.1)", border: "1px solid rgba(232,184,80,0.3)" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#E8B850" }}>
              Abrir este mapa no significa resolver todo hoy. Significa empezar a mirar con más honestidad y cuidado.
            </p>
          </div>

        </div>

        {/* Acciones */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/pareja/mapa")}
            className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#5B8DD9" }}
          >
            Ver el mapa completo →
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all hover:opacity-80"
            style={{ color: "#88AACC", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Volver al inicio
          </button>
        </div>

        <p className="text-xs text-center mt-6" style={{ color: "#557099" }}>
          Si sienten que esta conversación puede sobrepasarlos, busquen apoyo profesional en un espacio seguro.
        </p>
      </div>
    </div>
  );
}
