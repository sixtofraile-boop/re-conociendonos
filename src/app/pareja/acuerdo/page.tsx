"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function AcuerdoConversacion() {
  const router = useRouter();
  const [acepta1, setAcepta1] = useState(false);
  const [acepta2, setAcepta2] = useState(false);
  const [acepta3, setAcepta3] = useState(false);
  const [acepta4, setAcepta4] = useState(false);
  const [acepta5, setAcepta5] = useState(false);
  const [acepta6, setAcepta6] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const sessionId = getCookie("session_id");
  const persona = getCookie("persona");

  const todosAceptados = acepta1 && acepta2 && acepta3 && acepta4 && acepta5 && acepta6;

  const handleAceptar = async () => {
    if (!todosAceptados || !sessionId) return;
    
    setEnviando(true);
    setError("");

    try {
      const res = await fetch("/api/sesiones/acuerdo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, persona }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar");
      }

      router.push("/pareja/mapa");
    } catch {
      setError("No pudimos registrar tu aceptación. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#1A274A" }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#E8B850" }}>
            ACUERDO DE CONVERSACIÓN SEGURA
          </p>
          <h1 className="text-3xl font-bold text-white mb-4">
            Antes de abrir Nuestro Mapa
          </h1>
          <p className="text-sm" style={{ color: "#B8CCEE" }}>
            Ambos deben aceptar este acuerdo antes de ver el mapa conjunto.
            <br />Esto no es una sentencia sobre la relación. Es una fotografía de cómo cada uno la está viviendo hoy.
          </p>
        </div>

        {/* Acuerdo */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-8 text-white">
          <p className="font-semibold mb-6 text-lg">Confirma los siguientes puntos para continuar:</p>

          <div className="space-y-4">
            {[
              { id: 1, text: "Usaremos este mapa como espejo, no como arma.", state: acepta1, set: setAcepta1 },
              { id: 2, text: "No buscaremos ganar una discusión ni demostrar quién tiene razón.", state: acepta2, set: setAcepta2 },
              { id: 3, text: "Hablaré desde \"yo siento\" y \"yo necesito\", evitando \"tú siempre\" o \"tú nunca\".", state: acepta3, set: setAcepta3 },
              { id: 4, text: "Podemos pausar si algo duele demasiado.", state: acepta4, set: setAcepta4 },
              { id: 5, text: "Elegiremos una sola conversación para empezar.", state: acepta5, set: setAcepta5 },
              { id: 6, text: "Recordaremos que esto no mide la verdad, solo ordena percepciones.", state: acepta6, set: setAcepta6 },
            ].map((item) => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={item.state}
                  onChange={(e) => item.set(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 cursor-pointer"
                  style={{ accentColor: "#E8B850", borderColor: "#E8B850" }}
                />
                <span className={`text-sm leading-relaxed ${item.state ? "text-white" : "text-white/70"}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Cierre */}
        <p className="text-center text-sm mb-8" style={{ color: "#B8CCEE" }}>
          Abrir el mapa no significa resolver todo hoy. Significa empezar a mirar con más honestidad y cuidado.
        </p>

        {error && (
          <p className="text-center text-sm mb-4 p-3 rounded-lg" style={{ background: "rgba(231, 76, 60, 0.2)", color: "#E74C3C" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleAceptar}
          disabled={!todosAceptados || enviando}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: todosAceptados ? "#5B8DD9" : "#444455", color: "#FFFFFF" }}
        >
          {enviando ? "Guardando..." : "Aceptar y continuar →"}
        </button>

        <p className="text-center text-xs mt-4" style={{ color: "#557099" }}>
          Requerido para continuar al mapa conjunto
        </p>
      </div>
    </div>
  );
}
