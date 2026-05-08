"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function IndividualPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecuperar, setIsRecuperar] = useState(false);
  const [consentimientos, setConsentimientos] = useState([false, false, false, false, false, false]);

  const CONSENTIMIENTOS = [
    "Entiendo que esto no es un test psicológico ni un diagnóstico clínico.",
    "Entiendo que los resultados reflejan mis percepciones del momento, no verdades objetivas sobre la relación.",
    "Acepto que esta herramienta no es adecuada en contextos de violencia, coerción o riesgo emocional grave.",
    "Acepto la política de privacidad y el manejo confidencial de mis datos personales.",
    "Consiento que mis respuestas anonimizadas puedan usarse para mejorar la herramienta durante la fase beta.",
    "Entiendo que si algo de esta experiencia me sobrepasa, puedo buscar apoyo profesional.",
  ];

  const toggleConsentimiento = (i: number) => {
    setConsentimientos(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const todosAceptados = consentimientos.every(Boolean);
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
        body: JSON.stringify({ version: "individual", nombre_A: nombre, email_A: email, password_A: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear sesión");

      document.cookie = `session_id=${data.sesion.id}; path=/; max-age=2592000`;
      document.cookie = `nombre=${encodeURIComponent(nombre)}; path=/; max-age=2592000`;
      router.push("/individual/intro");
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

      const { sesion } = data;
      document.cookie = `session_id=${sesion.id}; path=/; max-age=2592000`;
      const tieneRespuestas = sesion.respuestas?.I && Array.isArray(sesion.respuestas.I) && sesion.respuestas.I.length > 0;
      router.push(tieneRespuestas ? "/individual/resultados" : "/individual/encuesta");
    } catch (e: any) {
      setErrorRecuperar(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>

      {/* Header */}
      <div style={{ background: "#1A274A" }} className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <Link href="/" className="text-sm flex items-center gap-1 mb-6" style={{ color: "#88AACC" }}>
            ← Volver
          </Link>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#E8B850" }}>MI MIRADA</p>
          <h1 className="text-3xl font-bold text-white mb-2">Reflexión personal</h1>
          <p style={{ color: "#B8CCEE" }} className="text-sm">
            22 preguntas · Tu mapa de las 4 dimensiones · Gratuito
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-sm font-semibold mb-6" style={{ color: "#1A274A" }}>
            Crea tu acceso para guardar y recuperar tu resultado
          </p>

          <div className="space-y-4">
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
              <p className="text-xs mt-1" style={{ color: "#888" }}>Para personalizar tu resultado</p>
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
              <p className="text-xs mt-1" style={{ color: "#888" }}>Para recibir tu resultado por WhatsApp</p>
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

            {/* Consentimientos */}
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
                    style={{ accentColor: "#028090" }}
                  />
                  <span className="text-xs leading-relaxed" style={{ color: "#444455" }}>{texto}</span>
                </label>
              ))}
            </div>

            {error && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "#FFC7CE", color: "#9C0006" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleCreate}
              disabled={loading || !todosAceptados}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#028090" }}
            >
              {loading ? "Creando..." : "Comenzar mi reflexión →"}
            </button>
          </div>

          <p className="text-xs text-center mt-4" style={{ color: "#888" }}>
            Tu resultado es personal y confidencial.
          </p>
        </div>

        {/* Recuperar acceso */}
        {!isRecuperar ? (
          <p className="text-center mt-6 text-sm" style={{ color: "#888" }}>
            ¿Ya tienes una sesión?{" "}
            <button
              onClick={() => setIsRecuperar(true)}
              className="underline font-medium"
              style={{ color: "#028090" }}
            >
              Recuperar mi resultado
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
                  style={{ background: "#028090" }}
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
