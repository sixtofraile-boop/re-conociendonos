import Link from "next/link";

const DIMENSIONES = [
  { nombre: "AMISTAD",    color: "#5B8DD9", sintesis: "La amistad te conecta.",       desc: "Base emocional. Confianza, complicidad, libertad de ser uno mismo." },
  { nombre: "DESEO",      color: "#C0504D", sintesis: "El deseo te enciende.",         desc: "Energía vital que diferencia a la pareja de cualquier otra relación." },
  { nombre: "PROYECTO",   color: "#6B9B3E", sintesis: "El proyecto te orienta.",       desc: "El \"para qué estamos juntos\". Dirección compartida y sentido de futuro." },
  { nombre: "COMPROMISO", color: "#8064A2", sintesis: "El compromiso lo sostiene todo.", desc: "Capacidad de sostener en el tiempo lo que se declara importante." },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#F8F8F8" }}>

      {/* HERO */}
      <section style={{ background: "#1A274A" }} className="px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#E8B850" }}>
            RE-CONOCIÉNDONOS
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Hay conversaciones que tu relación necesita tener.
          </h1>
          <p className="text-xl md:text-2xl font-light mb-3" style={{ color: "#B8CCEE" }}>
            Una experiencia guiada para mirar tu relación y abrir una conversación cuidada.
          </p>
          <p className="mb-10 text-sm" style={{ color: "#88AACC" }}>
            Las 4 dimensiones de una pareja · Las preguntas que nos faltan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/individual"
              className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#028090" }}
            >
              Empezar con Mi Mirada →
            </Link>
            <Link
              href="/pareja"
              className="px-8 py-4 rounded-xl font-semibold transition-all hover:opacity-90"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Versión Pareja
            </Link>
          </div>
        </div>
      </section>

      {/* QUÉ ES / NO ES */}
      <section className="px-6 py-16" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#028090" }}>
            No diagnostica — genera conciencia
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "#1A274A" }}>
            Un espejo, no un juicio
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#444455" }}>
            RE-CONOCIÉNDONOS no te dice qué está mal en tu relación.<br/>
            Te ayuda a poner en palabras lo que ya sentías — y a abrirle la puerta a las conversaciones que faltan.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left mt-10">
            {[
              { icon: "✓", label: "Genera conciencia y lenguaje compartido" },
              { icon: "✓", label: "Revela brechas entre las dos miradas" },
              { icon: "✓", label: "Abre conversaciones, no veredictos" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "#F0F2F5" }}>
                <span className="font-bold text-lg mt-0.5" style={{ color: "#028090" }}>{item.icon}</span>
                <p className="text-sm font-medium" style={{ color: "#1A274A" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAS 4 DIMENSIONES */}
      <section className="px-6 py-16" style={{ background: "#F8F8F8" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#E8B850" }}>
              Las 4 dimensiones
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1A274A" }}>
              Toda relación se sostiene sobre cuatro pilares
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {DIMENSIONES.map((dim) => (
              <div
                key={dim.nombre}
                className="rounded-2xl p-6 flex gap-4"
                style={{ background: "#fff", borderLeft: `4px solid ${dim.color}` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: dim.color }}
                >
                  {dim.nombre[0]}
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "#1A274A" }}>{dim.nombre}</h3>
                  <p className="text-xs font-semibold mb-2" style={{ color: dim.color }}>{dim.sintesis}</p>
                  <p className="text-sm" style={{ color: "#444455" }}>{dim.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOS CAMINOS */}
      <section className="px-6 py-16" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#E8B850" }}>
              Elige tu camino
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#1A274A" }}>
              Dos versiones, una experiencia
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Individual */}
            <div className="rounded-2xl p-8 flex flex-col" style={{ background: "#F0F2F5", border: "2px solid #028090" }}>
              <div className="mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: "#028090" }}>
                  GRATUITO · Paso 1
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#1A274A" }}>MI MIRADA</h3>
              <p className="text-sm mb-4" style={{ color: "#444455" }}>
                Reflexión personal. 22 preguntas. Tú respondes sobre ti y cómo percibes a tu pareja.
                Obtienes tu mapa personal antes de compartir nada.
              </p>
              <ul className="space-y-2 mb-6 text-sm" style={{ color: "#444455" }}>
                <li className="flex gap-2"><span style={{ color: "#028090" }}>→</span> 8-10 minutos</li>
                <li className="flex gap-2"><span style={{ color: "#028090" }}>→</span> Resultado online inmediato</li>
                <li className="flex gap-2"><span style={{ color: "#028090" }}>→</span> Mapa de las 4 dimensiones</li>
                <li className="flex gap-2"><span style={{ color: "#028090" }}>→</span> Puerta de entrada a la versión pareja</li>
              </ul>
              <Link
                href="/individual"
                className="mt-auto text-center px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#028090" }}
              >
                Empezar con Mi Mirada →
              </Link>
            </div>

            {/* Pareja */}
            <div className="rounded-2xl p-8 flex flex-col" style={{ background: "#EBF3FB", border: "2px solid #5B8DD9" }}>
              <div className="mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: "#5B8DD9" }}>
                  VERSIÓN COMPLETA
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#1A274A" }}>VERSIÓN PAREJA</h3>
              <p className="text-sm mb-4" style={{ color: "#444455" }}>
                A y B responden por separado. Luego revelan juntos el mapa conjunto — y ven dónde coinciden y dónde hay brechas.
              </p>
              <ul className="space-y-2 mb-6 text-sm" style={{ color: "#444455" }}>
                <li className="flex gap-2"><span style={{ color: "#5B8DD9" }}>→</span> 23 preguntas por persona</li>
                <li className="flex gap-2"><span style={{ color: "#5B8DD9" }}>→</span> Mapa individual + mapa conjunto</li>
                <li className="flex gap-2"><span style={{ color: "#5B8DD9" }}>→</span> Semáforo + prioridades + brechas</li>
                <li className="flex gap-2"><span style={{ color: "#5B8DD9" }}>→</span> Preguntas de conversación por dimensión</li>
              </ul>
              <Link
                href="/pareja"
                className="mt-auto text-center px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#5B8DD9" }}
              >
                Iniciar versión pareja →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 text-center" style={{ background: "#1A274A" }}>
        <p className="font-semibold mb-2" style={{ color: "#E8B850" }}>RE-CONOCIÉNDONOS</p>
        <p className="text-sm" style={{ color: "#88AACC" }}>
          Esta herramienta no es un diagnóstico clínico.<br />
          Es un espejo para generar conversación y conciencia.
        </p>
      </footer>

    </div>
  );
}
