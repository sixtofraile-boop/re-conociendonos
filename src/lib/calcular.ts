import {
  Dimension,
  Estado,
  Zona,
  Congruencia,
  RespuestaPareja,
  RespuestaIndividual,
  ResultadoDimension,
  ResultadoGlobal,
  FocoPregunta
} from "./types";
import {
  PREGUNTAS_PAREJA,
  PREGUNTAS_CONVERSACION,
  COLOR_DIMENSION,
  COLOR_ESTADO
} from "./preguntas";

function calcularPercentil(array: number[], valor: number): number {
  const sorted = [...array].sort((a, b) => a - b);
  const below = sorted.filter(v => v < valor).length;
  return Math.round((below / sorted.length) * 100);
}

function semaforoPareja(nivel_act: number, variacion: number, brecha: number): Estado {
  if (nivel_act < 40 || variacion < -25 || brecha > 30) return "ROJO";
  if (nivel_act < 60 || variacion < -15 || brecha > 15) return "AMARILLO";
  return "VERDE";
}

function zona(estado: Estado, variacion: number): Zona {
  if (estado === "ROJO") {
    return variacion < -25 ? "Zona crítica" : "Zona sensible";
  }
  if (estado === "AMARILLO") return "Zona de atención";
  return "Zona sólida";
}

function criterioTexto(variacion: number, nivel_act: number, brecha: number): string {
  if (variacion < -25) {
    const extra = brecha > 5 ? ` + brecha ${brecha.toFixed(1)} pts A/B` : "";
    return `Caída de ${Math.abs(variacion).toFixed(1)} pts hist→hoy${extra}.`;
  }
  if (nivel_act < 40) {
    return `Nivel actual muy bajo (${nivel_act.toFixed(1)}%).`;
  }
  if (brecha > 30) {
    return `Brecha de ${brecha.toFixed(1)} pts entre A y B — están viviendo esto muy diferente.`;
  }
  if (variacion < -15) {
    const extra = brecha > 5 ? ` + brecha ${brecha.toFixed(1)} pts A/B` : "";
    return `Caída de ${Math.abs(variacion).toFixed(1)} pts hist→hoy${extra}.`;
  }
  if (nivel_act < 60) {
    const extra = brecha > 5 ? ` + brecha ${brecha.toFixed(1)} pts A/B` : "";
    return `Nivel moderado-bajo (${nivel_act.toFixed(1)}%)${extra}.`;
  }
  if (brecha > 15) {
    return `Brecha de ${brecha.toFixed(1)} pts entre A y B.`;
  }
  return "Base sólida. Cuidar activamente.";
}

export function calcularResultadosPareja(
  respuestasA: RespuestaPareja[],
  respuestasB: RespuestaPareja[]
): ResultadoGlobal {
  const dimensiones: Dimension[] = ["AMISTAD", "DESEO", "PROYECTO", "COMPROMISO"];
  const resultados: ResultadoDimension[] = [];

  const mapByDimension = (respuestas: RespuestaPareja[]): Record<Dimension, RespuestaPareja[]> => {
    const map: Record<Dimension, RespuestaPareja[]> = { AMISTAD: [], DESEO: [], PROYECTO: [], COMPROMISO: [] };
    respuestas.forEach(r => map[r.dimension].push(r));
    return map;
  };

  const mapA = mapByDimension(respuestasA);
  const mapB = mapByDimension(respuestasB);

  let global_hist = 0;
  let global_act = 0;

  for (const dim of dimensiones) {
    const pregDimA = mapA[dim];
    const pregDimB = mapB[dim];

    const sum = (arr:RespuestaPareja[], field: keyof RespuestaPareja) => 
      arr.reduce((acc, r) => acc + (Number(r[field]) * 10), 0);

    const yo_hist = pregDimA.length ? sum(pregDimA, "hist_yo") / pregDimA.length : 0;
    const yo_act = pregDimA.length ? sum(pregDimA, "act_yo") / pregDimA.length : 0;
    const par_hist = pregDimB.length ? sum(pregDimB, "hist_par") / pregDimB.length : 0;
    const par_act = pregDimB.length ? sum(pregDimB, "act_par") / pregDimB.length : 0;

    const nivel_hist = (yo_hist + par_hist) / 2;
    const nivel_act = (yo_act + par_act) / 2;
    const variacion = nivel_act - nivel_hist;
    const brecha = Math.abs(yo_act - par_act);

    const var_yo = yo_act - yo_hist;
    const var_par = par_act - par_hist;
    const congruencia: Congruencia = Math.abs(var_yo - var_par) < 15 ? "coincidentes" : "divergentes";

    const puntaje = (100 - nivel_act) + Math.abs(variacion) * 1.5 + brecha * 0.5;

    const estado = semaforoPareja(nivel_act, variacion, brecha);
    const zonaResult = zona(estado, variacion);
    const criterio = criterioTexto(variacion, nivel_act, brecha);

    const puntajesPregunta: { id: number; puntaje: number }[] = respuestasA.map(r => {
      const rA = r;
      const rB = respuestasB.find(b => b.pregunta_id === r.pregunta_id);
      if (!rB) return { id: r.pregunta_id, puntaje: 0 };
      const n_act = ((rA.act_yo * 10) + (rB.act_par * 10)) / 2;
      const v = n_act - (((rA.hist_yo * 10) + (rB.hist_par * 10)) / 2);
      const br = Math.abs(rA.act_yo * 10 - rB.act_par * 10);
      return { id: r.pregunta_id, puntaje: (100 - n_act) + Math.abs(v) * 1.5 + br * 0.5 };
    });

    puntajesPregunta.sort((a, b) => b.puntaje - a.puntaje);
    const topFocos: FocoPregunta[] = puntajesPregunta.slice(0, 3).map((p, i) => {
      const preg = PREGUNTAS_PAREJA.find(pr => pr.id === p.id);
      if (!preg) return null;
      const rA = respuestasA.find(r => r.pregunta_id === p.id);
      const rB = respuestasB.find(r => r.pregunta_id === p.id);
      if (!rA || !rB) return null;
      return {
        pregunta_id: p.id,
        texto: preg.texto,
        nivel_act: ((rA.act_yo * 10) + (rB.act_par * 10)) / 2,
        brecha: Math.abs(rA.act_yo * 10 - rB.act_par * 10),
        variacion: ((rA.act_yo * 10) + (rB.act_par * 10)) / 2 - ((rA.hist_yo * 10) + (rB.hist_par * 10)) / 2,
        rank: i + 1
      };
    }).filter((f): f is FocoPregunta => f !== null);

    resultados.push({
      dimension: dim,
      yo_hist_pct: yo_hist,
      yo_act_pct: yo_act,
      par_hist_pct: par_hist,
      par_act_pct: par_act,
      nivel_hist,
      nivel_act,
      variacion,
      brecha,
      congruencia,
      estado,
      zona: zonaResult,
      puntaje,
      rank: 0,
      clave_frase: `${dim}|${estado}`,
      criterio_texto: criterio,
      focos: topFocos
    });

    global_hist += nivel_hist;
    global_act += nivel_act;
  }

  resultados.sort((a, b) => b.puntaje - a.puntaje);
  resultados.forEach((r, i) => r.rank = i + 1);

  return {
    global_hist: global_hist / 4,
    global_act: global_act / 4,
    global_var: global_act / 4 - global_hist / 4,
    dimensiones: resultados
  };
}

export function calcularResultadosIndividual(
  respuestas: RespuestaIndividual[]
): { global: { hist: number; act: number; var: number }; dimensiones: ResultadoDimension[] } {
  const dimensiones: Dimension[] = ["AMISTAD", "DESEO", "PROYECTO", "COMPROMISO"];
  const resultados: ResultadoDimension[] = [];

  const mapByDimension = (respuestas: RespuestaIndividual[]): Record<Dimension, RespuestaIndividual[]> => {
    const map: Record<Dimension, RespuestaIndividual[]> = { AMISTAD: [], DESEO: [], PROYECTO: [], COMPROMISO: [] };
    respuestas.forEach(r => map[r.dimension].push(r));
    return map;
  };

  const map = mapByDimension(respuestas);

  let global_hist = 0;
  let global_act = 0;

  const percepFromStr = (v: "MAS_ALTO" | "IGUAL" | "MAS_BAJO"): number => {
    if (v === "MAS_ALTO") return 1;
    if (v === "IGUAL") return 0;
    return -1;
  };

  for (const dim of dimensiones) {
    const pregDim = map[dim];
    if (pregDim.length === 0) continue;

    const yo_hist = pregDim.reduce((acc, r) => acc + r.hist_yo * 10, 0) / pregDim.length;
    const yo_act = pregDim.reduce((acc, r) => acc + r.act_yo * 10, 0) / pregDim.length;
    const par_hist_avg = pregDim.reduce((acc, r) => acc + percepFromStr(r.hist_par), 0) / pregDim.length;
    const par_act_avg = pregDim.reduce((acc, r) => acc + percepFromStr(r.act_par), 0) / pregDim.length;

    const variacion_yo = yo_act - yo_hist;
    const conteo_par_baja = pregDim.filter(r => r.act_par === "MAS_BAJO").length;
    const n_preguntas = pregDim.length;

    const nivel_act = yo_act;
    const variacion = variacion_yo;

    const puntaje = (100 - nivel_act) + Math.abs(variacion_yo) * 1.5 + Math.max(0, -par_act_avg) * 10;

    let estado: Estado;
    if (nivel_act < 40 || variacion_yo < -25 || conteo_par_baja >= n_preguntas * 0.6) {
      estado = "ROJO";
    } else if (nivel_act < 60 || variacion_yo < -15 || conteo_par_baja >= n_preguntas * 0.4) {
      estado = "AMARILLO";
    } else {
      estado = "VERDE";
    }

    const zonaResult: Zona = estado === "ROJO"
      ? (variacion_yo < -25 ? "Zona crítica" : "Zona sensible")
      : estado === "AMARILLO" ? "Zona de atención" : "Zona sólida";

    const criterio = criterioTexto(variacion, nivel_act, 0);

    resultados.push({
      dimension: dim,
      yo_hist_pct: yo_hist,
      yo_act_pct: yo_act,
      nivel_hist: yo_hist,
      nivel_act,
      variacion,
      brecha: par_act_avg > 0.2 ? 10 : par_act_avg < -0.2 ? 20 : 0,
      estado,
      zona: zonaResult,
      puntaje,
      rank: 0,
      clave_frase: `${dim}|${estado}`,
      criterio_texto: criterio,
      focos: []
    });

    global_hist += yo_hist;
    global_act += yo_act;
  }

  resultados.sort((a, b) => b.puntaje - a.puntaje);
  resultados.forEach((r, i) => r.rank = i + 1);

  return {
    global: {
      hist: global_hist / 4,
      act: global_act / 4,
      var: global_act / 4 - global_hist / 4
    },
    dimensiones: resultados
  };
}

export function mensajeCierre(estados: Estado[]): string {
  const rojos = estados.filter(e => e === "ROJO").length;
  const amarillos = estados.filter(e => e === "AMARILLO").length;

  if (rojos >= 3) {
    return "Lo que ves en este mapa merece ser tomado en serio. No como un diagnóstico — sino como una invitación a no seguir postergando lo que ya sabes. Si sientes que necesitas apoyo, hay profesionales disponibles.";
  }
  if (amarillos >= 2) {
    return "Tu mirada muestra señales de atención en varios ámbitos. Hay cosas que nombrar — primero contigo, después quizás con tu pareja. Es un buen momento para detenerse antes de que se vuelva más difícil.";
  }
  return "Tu relación muestra una base sólida desde tu mirada. Hay cosas que cuidar, pero no hay urgencia. El siguiente paso natural puede ser invitar a tu pareja a hacer este proceso juntos.";
}