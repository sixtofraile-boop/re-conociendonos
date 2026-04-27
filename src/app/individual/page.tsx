"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IndividualPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos");
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
        body: JSON.stringify({ version: "individual", email_A: email, password_A: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear sesión");
      
      document.cookie = `session_id=${data.sesion.id}; path=/; max-age=2592000`;
      router.push("/individual/encuesta");
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

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Mi Mirada</h1>
        <p className="text-slate-600 mb-8">Versión individual para reflexión personal</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tu email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Crear contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Repite tu contraseña"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creando..." : "Comenzar reflexión"}
          </button>
        </div>

        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Nota:</strong> Esta versión te permite reflexionar sobre tu relación desde tu propia mirada. 
            Al final, podrás ver un mapa de las 4 dimensiones y reflexiones personalizadas.
          </p>
        </div>
      </div>
    </div>
  );
}