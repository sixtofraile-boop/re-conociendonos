import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">RE-CONOCIÉNDOS</h1>
          <p className="text-xl text-slate-600 mb-2">Las 4 dimensiones de una pareja</p>
          <p className="text-slate-500">y las preguntas que nos faltan</p>
        </header>

        <main className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link href="/pareja" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 text-center h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Versión Pareja</h2>
                <p className="text-slate-600 mb-4">Para dos personas que quieren conocerse y entenderse juntos</p>
              </div>
              <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-medium group-hover:bg-blue-700 transition-colors">
                Comenzar
              </span>
            </div>
          </Link>

          <Link href="/individual" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-transparent hover:border-purple-400 transition-all duration-300 text-center h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Mi Mirada</h2>
                <p className="text-slate-600 mb-4">Versión individual para reflexión personal</p>
              </div>
              <span className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full font-medium group-hover:bg-purple-700 transition-colors">
                Comenzar
              </span>
            </div>
          </Link>
        </main>

        <footer className="mt-16 text-center text-slate-400 text-sm">
          <p>Esta herramienta no es un diagnóstico clínico.</p>
          <p>Es un espejo para generar conversación y conciencia.</p>
        </footer>
      </div>
    </div>
  );
}