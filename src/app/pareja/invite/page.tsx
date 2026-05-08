"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Forzar dinámico para usar useSearchParams
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function InviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [validando, setValidando] = useState(true);
  const [valido, setValido] = useState(false);
  const [error, setError] = useState("");
  const [sesionId, setSesionId] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Enlace inválido");
      setValidando(false);
      return;
    }

    fetch(`/api/sesiones/invite?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setValido(true);
          setSesionId(data.sesion?.id || "");
        }
      })
      .catch(() => setError("No pudimos validar la invitación"))
      .finally(() => setValidando(false));
  }, [token]);

  const handleAceptar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !password || password !== confirmar) return;

    setEnviando(true);
    setError("");

    try {
      const res = await fetch("/api/sesiones/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nombre_B: nombre, email_B: email, password_B: password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Guardar cookies para B
      document.cookie = `session_id=${data.sesion_id}; path=/; max-age=604800`;
      document.cookie = `persona=B; path=/; max-age=604800`;
      document.cookie = `nombre=${encodeURIComponent(nombre)}; path=/; max-age=604800`;

      router.push("/pareja/encuesta");
    } catch (err: any) {
      setError(err.message || "Error al aceptar invitación");
    } finally {
      setEnviando(false);
    }
  };

  if (validando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F8F8" }}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: "#5B8DD9", borderTopColor: "transparent" }} />
          <p style={{ color: "#444455" }}>Validando invitación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F8F8F8" }}>
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#FFEB9C" }}>
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#1A274A" }}>Invitación no disponible</h2>
          <p className="text-sm mb-6" style={{ color: "#444455" }}>{error}</p>
          <button
            onClick={() => router.push("/pareja")}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "#5B8DD9" }}
          >
            Crear nueva invitación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F8F8F8" }}>
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>INVITACIÓN A NUESTRO MAPA</p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1A274A" }}>Aceptar invitación</h1>
          <p className="text-sm" style={{ color: "#444455" }}>
            Tu pareja te ha invitado a construir Nuestro Mapa juntos.
            <br />No es para juzgarnos; es para conversar con más cuidado.
          </p>
        </div>

        <form onSubmit={handleAceptar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
              Tu nombre <span style={{ color: "#C0504D" }}>*</span>
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
              placeholder="¿Cómo te llamas?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
              Tu correo <span style={{ color: "#C0504D" }}>*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
              Crear contraseña <span style={{ color: "#C0504D" }}>*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
              Confirmar contraseña <span style={{ color: "#C0504D" }}>*</span>
            </label>
            <input
              type="password"
              required
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
              placeholder="Repite tu contraseña"
            />
            {password && confirmar && password !== confirmar && (
              <p className="text-xs mt-1" style={{ color: "#E74C3C" }}>Las contraseñas no coinciden</p>
            )}
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "#FFC7CE", color: "#9C0006" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={enviando || !nombre || !email || !password || password !== confirmar}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#5B8DD9" }}
          >
            {enviando ? "Aceptando..." : "Aceptar invitación y continuar →"}
          </button>
        </form>

        <p className="text-xs text-center mt-4" style={{ color: "#888" }}>
          Al aceptar, aceptas participar en esta experiencia de forma respetuosa.
        </p>
      </div>
    </div>
  );
}

export default function InvitePareja() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F8F8" }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto" style={{ borderColor: "#5B8DD9", borderTopColor: "transparent" }} />
      </div>
    }>
      <InviteContent />
    </Suspense>
  );
}
