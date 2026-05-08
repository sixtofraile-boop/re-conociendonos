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
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [emailPareja, setEmailPareja] = useState("");
  const [mensajeTono, setMensajeTono] = useState<"calido" | "directo" | "reparador">("calido");
  const [mensajeEditado, setMensajeEditado] = useState("");
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");

  const MENSAJES_INVITACION = {
    calido: "Hice Mi Mirada y me dejó pensando en nosotros. Me gustaría invitarte a construir Nuestro Mapa juntos, solo si te hace sentido. No es para juzgarnos; es para conversar con más cuidado sobre lo que nos importa.",
    directo: "Me gustaría que hagamos esta experiencia juntos. Creo que puede ayudarnos a mirar qué estamos viviendo bien, qué necesita cuidado y por dónde empezar a conversar.",
    reparador: "Sé que hay cosas que no han sido fáciles entre nosotros. No quiero usar esto para reclamarte ni para tener la razón. Me gustaría que nos ayude a hablar con más cuidado, si a ti también te hace sentido.",
  };
  const [consentimientos, setConsentimientos] = useState([false, false, false, false, false, false]);

  const CONSENTIMIENTOS = [
    "Entiendo que esto no es un test psicológico ni un diagnóstico clínico.",
    "Entiendo que los resultados reflejan percepciones personales del momento, no verdades objetivas sobre la relación.",
    "Acepto que esta herramienta no es adecuada en contextos de violencia, coerción o riesgo emocional grave.",
    "Acepto la política de privacidad y el manejo confidencial de mis datos personales.",
    "Consiento que mis respuestas anonimizadas puedan usarse para mejorar la herramienta durante la fase beta.",
    "Entiendo que si algo de esta experiencia nos sobrepasa, podemos buscar apoyo profesional.",
  ];

  const toggleConsentimiento = (i: number) => {
    setConsentimientos(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const todosAceptados = consentimientos.every(Boolean);

  const [emailRecuperar, setEmailRecuperar] = useState("");
  const [passwordRecuperar, setPasswordRecuperar] = useState("");
  const [nombreRecuperar, setNombreRecuperar] = useState("");
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
    if (!todosAceptados) {
      setError("Debes aceptar todos los consentimientos para continuar");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sesiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: "pareja",
          nombre_A: nombre,
          email_A: email,
          password_A: password,
          whatsapp_A: whatsapp || undefined,
          consentimientos_A: CONSENTIMIENTOS.filter((_, i) => consentimientos[i]),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear sesión");

      document.cookie = `session_id=${data.sesion.id}; path=/; max-age=2592000`;
      document.cookie = `persona=A; path=/; max-age=2592000`;
      document.cookie = `nombre=${encodeURIComponent(nombre)}; path=/; max-age=2592000`;
      // Usar token_invitacion en lugar de session.id
      setCodigoCreado(data.sesion.token || data.sesion.id);
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
        body: JSON.stringify({
          session_id: sessionCode,
          nombre_B: nombre,
          email_B: email,
          password_B: password,
          whatsapp_B: whatsapp || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al unirse");

      document.cookie = `session_id=${data.sesion.id}; path=/; max-age=2592000`;
      document.cookie = `persona=B; path=/; max-age=2592000`;
      document.cookie = `nombre=${encodeURIComponent(nombre)}; path=/; max-age=2592000`;

      if (data.sesion.respuestas?.A) {
        router.push("/pareja/resultados");
      } else {
        router.push("/pareja/intro");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperar = async () => {
    if (!emailRecuperar || !passwordRecuperar || !nombreRecuperar) {
      setErrorRecuperar("Completa nombre, email y contraseña");
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
      document.cookie = `nombre=${encodeURIComponent(nombreRecuperar)}; path=/; max-age=2592000`;

      // Redirigir según el estado de la sesión (spec 13.2)
      const estado = sesion.estado;
      if (estado === "reveal_ready" || estado === "reveal_opened") {
        router.push("/pareja/mapa");
      } else if (["in_progress", "waiting_other_response", "both_tests_completed", "waiting_hypotheses"].includes(estado)) {
        const tieneRespuestas = sesion.respuestas?.[persona || "A"] && Array.isArray(sesion.respuestas[persona || "A"]) && sesion.respuestas[persona || "A"].length > 0;
        router.push(tieneRespuestas ? "/pareja/resultados" : "/pareja/encuesta");
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
    const inviteUrl = `${window.location.origin}/pareja/invite?token=${codigoCreado}`;
    const msg = `${mensajeEditado || MENSAJES_INVITACION[mensajeTono]}\n\n→ Entra aquí: ${inviteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  const enviarPorEmail = async () => {
    if (!codigoCreado || !emailPareja) return;
    setEnviandoEmail(true);
    setErrorEmail("");
    try {
      const res = await fetch("/api/email/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: document.cookie.match(/session_id=([^;]+)/)?.[1],
          email_B: emailPareja,
          mensaje_personalizado: mensajeEditado || MENSAJES_INVITACION[mensajeTono],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmailEnviado(true);
      setMostrarEmail(false);
    } catch (e: any) {
      setErrorEmail(e.message || "No pudimos enviar el correo");
    } finally {
      setEnviandoEmail(false);
    }
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
              Token de invitación
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
                {copiado ? "¡Copiado!" : "Copiar token"}
              </button>
              <button
                onClick={compartirWhatsApp}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#25D366" }}
              >
                Enviar por WhatsApp
              </button>
            </div>
            <button
              onClick={() => setMostrarEmail(!mostrarEmail)}
              className="w-full mt-3 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "#EBF3FB", color: "#1A274A" }}
            >
              {mostrarEmail ? "Cancelar" : "Enviar por correo"}
            </button>
            {mostrarEmail && (
              <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: "#EEE" }}>
                <div>
                  <label className="block text-xs font-medium mb-1 text-left" style={{ color: "#444455" }}>
                    Correo de tu pareja <span style={{ color: "#C0504D" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={emailPareja}
                    onChange={(e) => setEmailPareja(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                    placeholder="pareja@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-left" style={{ color: "#444455" }}>
                    Tono del mensaje
                  </label>
                  <div className="flex gap-2">
                    {(["calido", "directo", "reparador"] as const).map((tono) => (
                      <button
                        key={tono}
                        onClick={() => { setMensajeTono(tono); setMensajeEditado(MENSAJES_INVITACION[tono]); }}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={mensajeTono === tono
                          ? { background: "#1A274A", color: "#fff" }
                          : { background: "#F0F2F5", color: "#444455" }}
                      >
                        {tono === "calido" ? "Cálido" : tono === "directo" ? "Directo" : "Reparador"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-left" style={{ color: "#444455" }}>
                    Mensaje (editable)
                  </label>
                  <textarea
                    value={mensajeEditado || MENSAJES_INVITACION[mensajeTono]}
                    onChange={(e) => setMensajeEditado(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 resize-none"
                    style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                    rows={3}
                  />
                </div>
                {errorEmail && (
                  <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "#FFC7CE", color: "#9C0006" }}>
                    {errorEmail}
                  </p>
                )}
                <button
                  onClick={enviarPorEmail}
                  disabled={enviandoEmail || !emailPareja}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: "#5B8DD9" }}
                >
                  {enviandoEmail ? "Enviando..." : "Enviar invitación por correo"}
                </button>
              </div>
            )}
            {emailEnviado && (
              <p className="text-sm mt-3 px-3 py-2 rounded-lg" style={{ background: "#C6EFCE", color: "#276221" }}>
                ¡Invitación enviada por correo!
              </p>
            )}
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
            onClick={() => router.push("/pareja/intro")}
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

            {/* Consentimientos — solo al crear sesión */}
            {!isJoin && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#444455" }}>
                  Antes de continuar, confirma lo siguiente:
                </p>
                {CONSENTIMIENTOS.map((texto, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentimientos[i]}
                      onChange={() => toggleConsentimiento(i)}
                      className="mt-0.5 h-4 w-4 rounded"
                      style={{ accentColor: "#5B8DD9" }}
                    />
                    <span className="text-xs leading-relaxed" style={{ color: "#444455" }}>{texto}</span>
                  </label>
                ))}
              </div>
            )}

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "#FFC7CE", color: "#9C0006" }}>
                {error}
              </p>
            )}

            <button
              onClick={isJoin ? handleJoin : handleCreate}
              disabled={loading || (!isJoin && !todosAceptados)}
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
            Tus datos son confidenciales.
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
                type="text"
                value={nombreRecuperar}
                onChange={(e) => setNombreRecuperar(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none"
                style={{ borderColor: "#CCCCCC", color: "#1A274A" }}
                placeholder="Tu nombre"
              />
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
                  onClick={() => { setIsRecuperar(false); setErrorRecuperar(""); setNombreRecuperar(""); }}
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
