"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ParejaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isJoin, setIsJoin] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return null;
  };

  const handleCreate = async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
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
      router.push("/pareja/encuesta");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!sessionCode || !email || !password) {
      setError("Por favor completa todos los campos");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-md mx-auto px-6 py-12">
        <button onClick={() => router.push("/")} className="text-slate-500 hover:text-slate-700 mb-8">
          ← Volver
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Versión Pareja</h1>
        <p className="text-slate-600 mb-8">Dos mapas que al unirse revelan la verdad de la relación</p>

        {!isJoin ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tu email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Crear contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Repite tu contraseña"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear nueva sesión"}
            </button>
            <p className="text-center text-slate-500 text-sm">
              o{" "}
              <button onClick={() => setIsJoin(true)} className="text-blue-600 hover:underline">
                unirse a una sesión existente
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código de sesión</label>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ID de la sesión"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tu email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tu contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Uniéndose..." : "Unirse a la sesión"}
            </button>
            <p className="text-center text-slate-500 text-sm">
              o{" "}
              <button onClick={() => setIsJoin(false)} className="text-blue-600 hover:underline">
                crear una nueva sesión
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}