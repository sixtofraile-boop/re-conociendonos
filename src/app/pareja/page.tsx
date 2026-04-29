"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ParejaPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isJoin, setIsJoin] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codigoCreado, setCodigoCreado] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [isRecuperar, setIsRecuperar] = useState(false);
  const [emailRecuperar, setEmailRecuperar] = useState("");
  const [passwordRecuperar, setPasswordRecuperar] = useState("");
  const [errorRecuperar, setErrorRecuperar] = useState("");

  const handleCreate = async () => {
    if (!nombre || !email || !password) {
      setError("Nombre, email y contraseña son obligatorios");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sesiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: "pareja", email_A: email, password_A: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear sesión");

      document.cookie = `session_id=${data.sesion.id}; path=/; max-age=2592000`;
      document.cookie = `persona=A; path=/; max-age=2592000`;
      document.cookie = `nombre=${encodeURIComponent(nombre)}; path=/; max-age=2592000`;
      setCodigoCreado(data.sesion.id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!sessionCode || !nombre || !email || !password) {
      setError("Todos los campos obligatorios deben completarse");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sesiones/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionCode, email_B: email, password_B: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al unirse");

      document.cookie = `session_id=${data.sesion.id}; path=/; max-age=2592000`;
      document.cookie = `persona=B; path=/; max-age=2592000`;
      document.cookie = `nombre=${encodeURIComponent(nombre)}; path=/; max-age=2592000`;

      if (data.sesion.respuestas?.A) {
        router.push("/pareja/resultados");
      } else {
        router.push("/pareja/encuesta");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperar = async () => {
    if (!emailRecuperar || !passwordRecuperar) {
      setErrorRecuperar("Completa email y contraseña");
      return;
    }
    setLoading(true);
    setErrorRecuperar("");
    try {
      const res = await fetch("/api/sesiones/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailRecuperar, password: passwordRecuperar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al recuperar");

      const { sesion, persona } = data;
      document.cookie = `session_id=${sesion.id}; path=/; max-age=2592000`;
      if (persona) document.cookie = `persona=${persona}; path=/; max-age=2592000`;

      // Redirigir según el estado de la sesión
      const estado = sesion.estado;
      if (estado === "mapa_conjunto") {
        router.push("/pareja/mapa");
      } else if (persona === "A" && (estado === "resultados_A" || estado === "esperando_B")) {
        router.push("/pareja/resultados");
      } else {
        router.push("/pareja/encuesta");
      }
    } catch (e: any) {
      setErrorRecuperar(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = () => {
    if (!codigoCreado) return;
    navigator.clipboard.writeText(codigoCreado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const compartirWhatsApp = () => {
    if (!codigoCreado) return;
    const url = `${window.location.origin}/pareja`;
    const msg = `Hola 💙\n\nHice un test sobre nuestra relación y me hizo pensar bastante. Me gustaría que lo hiciéramos juntos para ver nuestro mapa completo.\n\n→ Entra aquí: ${url}\n→ Selecciona "Unirse a sesión"\n→ Usa este código: *${codigoCreado}*\n\nRE-CONOCIÉNDONOS`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  // ── Pantalla: código de sesión creado ─────────────────────────────────────
  if (codigoCreado) {
    return (
      <div className="min-h-screen" style={{ background: "#F8F8F8" }}>
        <div style={{ background: "#1A274A" }} className="px-6 py-8">
          <div className="max-w-md mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>SESIÓN CREADA</p>
            <h1 className="text-2xl font-bold text-white">Comparte este código con tu pareja</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto px-6 py-8 space-y-4">
          {/* Código */}
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#888" }}>
              Código de sesión
            </p>
            <div className="px-4 py-4 rounded-xl mb-4 font-mono text-lg font-bold tracking-wider break-all"
              style={{ background: "#F0F2F5", color: "#1A274A" }}>
              {codigoCreado}
            </div>
            <div className="flex gap-3">
              <button
                onClick={copiarCodigo}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={copiado
                  ? { background: "#C6EFCE", color: "#276221" }
                  : { background: "#1A274A", color: "#fff" }}
              >
                {copiado ? "¡Copiado!" : "Copiar código"}
              </button>
              <button
                onClick={compartirWhatsApp}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#25D366" }}
              >
                Enviar por WhatsApp
              </button>
            </div>
          </div>

          {/* Instrucciones para la pareja */}
          <div className="rounded-2xl p-5" style={{ background: "#EBF3FB" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#5B8DD9" }}>
              Instrucciones para tu pareja
            </p>
            <ol className="space-y-2 text-sm" style={{ color: "#2C3E6B" }}>
              <li className="flex gap-2"><span className="font-bold">1.</span> Entra a <strong>re-conociendonos.app</strong> → Versión Pareja</li>
              <li className="flex gap-2"><span className="font-bold">2.</span> Selecciona "Unirse a sesión"</li>
              <li className="flex gap-2"><span className="font-bold">3.</span> Ingresa el código de arriba</li>
              <li className="flex gap-2"><span className="font-bold">4.</span> Responde las preguntas por separado</li>
              <li className="flex gap-2"><span className="font-bold">5.</span> Cuando los dos terminen, revelan el mapa juntos</li>
            </ol>
          </div>

          <button
            onClick={() => router.push("/pareja/encuesta")}
            className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#5B8DD9" }}
          >
            Ir a mi encuesta →
          </button>

          <p className="text-xs text-center" style={{ color: "#888" }}>
            Guarda el código — lo necesitarás para que tu pareja se una.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>

      {/* Header */}
      <div style={{ background: "#1A274A" }} className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <Link href="/" className="text-sm flex items-center gap-1 mb-6" style={{ color: "#88AACC" }}>
            ← Volver
          </Link>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>
            VERSIÓN PAREJA
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">Dos mapas, una verdad</h1>
          <p style={{ color: "#B8CCEE" }} className="text-sm">
            Cada uno responde por separado · Luego revelan juntos el mapa completo
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm">

          {/* Toggle crear / unirse */}
          <div className="flex rounded-xl overflow-hidden border mb-6" style={{ borderColor: "#CCCCCC" }}>
            <button
              onClick={() => { setIsJoin(false); setError(""); }}
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={!isJoin ? { background: "#1A274A", color: "#fff" } : { background: "#fff", color: "#444455" }}
            >
              Crear sesión
            </button>
            <button
              onClick={() => { setIsJoin(true); setError(""); }}
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={isJoin ? { background: "#1A274A", color: "#fff" } : { background: "#fff", color: "#444455" }}
            >
              Unirse a sesión
            </button>
          </div>

          <div className="space-y-4">
            {isJoin && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
                  Código de sesión <span style={{ color: "#C0504D" }}>*</span>
                </label>
                <input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                  placeholder="ID de la sesión (te lo compartió tu pareja)"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
                Tu nombre <span style={{ color: "#C0504D" }}>*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                placeholder="¿Cómo te llamas?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
                Correo electrónico <span style={{ color: "#C0504D" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
                WhatsApp <span className="font-normal" style={{ color: "#888" }}>(opcional)</span>
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                placeholder="+56 9 XXXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
                Contraseña <span style={{ color: "#C0504D" }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {!isJoin && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#444455" }}>
                  Confirmar contraseña <span style={{ color: "#C0504D" }}>*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                  placeholder="Repite tu contraseña"
                />
              </div>
            )}

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "#FFC7CE", color: "#9C0006" }}>
                {error}
              </p>
            )}

            <button
              onClick={isJoin ? handleJoin : handleCreate}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#5B8DD9" }}
            >
              {loading ? "..." : isJoin ? "Unirse a la sesión →" : "Crear mi sesión →"}
            </button>
          </div>

          {!isJoin && (
            <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: "#EBF3FB", color: "#2C3E6B" }}>
              <p className="font-semibold mb-1">¿Cómo funciona?</p>
              <ol className="space-y-1 text-xs list-decimal list-inside" style={{ color: "#444455" }}>
                <li>Tú creas la sesión y respondes las 23 preguntas</li>
                <li>Compartes el código de sesión con tu pareja</li>
                <li>Tu pareja se une y responde por separado</li>
                <li>Cuando los dos terminan, revelan juntos el mapa</li>
              </ol>
            </div>
          )}

          <p className="text-xs text-center mt-4" style={{ color: "#888" }}>
            Al continuar aceptas los términos de privacidad.
          </p>
        </div>

        {/* Recuperar acceso */}
        {!isRecuperar ? (
          <p className="text-center mt-6 text-sm" style={{ color: "#888" }}>
            ¿Perdiste el acceso a una sesión?{" "}
            <button
              onClick={() => setIsRecuperar(true)}
              className="underline font-medium"
              style={{ color: "#5B8DD9" }}
            >
              Recuperar acceso
            </button>
          </p>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
            <p className="text-sm font-semibold mb-4" style={{ color: "#1A274A" }}>
              Recuperar sesión existente
            </p>
            <div className="space-y-3">
              <input
                type="email"
                value={emailRecuperar}
                onChange={(e) => setEmailRecuperar(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none"
                style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                placeholder="Email con el que te registraste"
              />
              <input
                type="password"
                value={passwordRecuperar}
                onChange={(e) => setPasswordRecuperar(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none"
                style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                placeholder="Tu contraseña"
              />
              {errorRecuperar && (
                <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "#FFC7CE", color: "#9C0006" }}>
                  {errorRecuperar}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => { setIsRecuperar(false); setErrorRecuperar(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "#F0F2F5", color: "#444455" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRecuperar}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: "#5B8DD9" }}
                >
                  {loading ? "Buscando..." : "Recuperar →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
