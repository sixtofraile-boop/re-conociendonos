export type Dimension = "AMISTAD" | "DESEO" | "PROYECTO" | "COMPROMISO";
export type Estado = "ROJO" | "AMARILLO" | "VERDE";
export type Zona = "Zona tranquila" | "Zona de cuidado" | "Zona crítica";
export type Congruencia = "coincidentes" | "divergentes";

export interface RespuestaPareja {
  pregunta_id: number;
  dimension: Dimension;
  hist_yo: number;
  hist_par: number;
  act_yo: number;
  act_par: number;
}

export interface RespuestaIndividual {
  pregunta_id: number;
  dimension: Dimension;
  hist_yo: number;
  act_yo: number;
  hist_par: "MAS_ALTO" | "IGUAL" | "MAS_BAJO";
  act_par: "MAS_ALTO" | "IGUAL" | "MAS_BAJO";
}

export interface ResultadoDimension {
  dimension: Dimension;
  yo_hist_pct: number;
  yo_act_pct: number;
  par_hist_pct?: number;
  par_act_pct?: number;
  nivel_hist: number;
  nivel_act: number;
  variacion: number;
  brecha: number;
  congruencia?: Congruencia;
  estado: Estado;
  zona: Zona;
  puntaje: number;
  rank: number;
  clave_frase: string;
  criterio_texto: string;
  focos: FocoPregunta[];
}

export interface FocoPregunta {
  pregunta_id: number;
  texto: string;
  nivel_act: number;
  brecha: number;
  variacion: number;
  rank: number;
}

export interface ResultadoGlobal {
  global_hist: number;
  global_act: number;
  global_var: number;
  dimensiones: ResultadoDimension[];
  recomienda_profesional: boolean;
}

export interface Sesion {
  id: string;
  version: "pareja" | "individual";
  estado: string;
  email_A?: string;
  email_B?: string;
  respuestas?: { A?: RespuestaPareja[]; B?: RespuestaPareja[]; I?: RespuestaIndividual[] };
  hipotesis_A?: string;
  hipotesis_B?: string;
  quien_ha_respondido?: string;
  createdAt: Date;
  updatedAt: Date;
}