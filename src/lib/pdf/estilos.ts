import { StyleSheet } from "@react-pdf/renderer";

export const COLORES = {
  navy: "#1A274A",
  gold: "#E8B850",
  teal: "#028090",
  blue: "#5B8DD9",
  rojo: "#E74C3C",
  amarillo: "#F39C12",
  verde: "#27AE60",
  gris: "#444455",
  grisClaro: "#F8F8F8",
  grisMedio: "#888888",
  borde: "#EEEEEE",
  amistad: "#5B8DD9",
  deseo: "#C0504D",
  proyecto: "#6B9B3E",
  compromiso: "#8064A2",
};

export const estilos = StyleSheet.create({
  pagina: {
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  headerNavy: {
    backgroundColor: COLORES.navy,
    marginHorizontal: -40,
    marginTop: -40,
    paddingHorizontal: 40,
    paddingVertical: 32,
    marginBottom: 28,
  },
  etiqueta: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORES.gold,
    letterSpacing: 2,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 10,
    color: "#B8CCEE",
  },
  seccion: {
    marginBottom: 20,
  },
  seccionTitulo: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORES.teal,
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: COLORES.grisClaro,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  texto: {
    fontSize: 10,
    color: COLORES.gris,
    lineHeight: 1.6,
  },
  textoSmall: {
    fontSize: 9,
    color: COLORES.grisMedio,
    lineHeight: 1.5,
  },
  textoBold: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORES.navy,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  separador: {
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
    marginBottom: 16,
    marginTop: 6,
  },
  aviso: {
    backgroundColor: "#EBF3FB",
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  footer: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
});

export const colorDimension = (dim: string): string => {
  const m: Record<string, string> = {
    AMISTAD: COLORES.amistad,
    DESEO: COLORES.deseo,
    PROYECTO: COLORES.proyecto,
    COMPROMISO: COLORES.compromiso,
  };
  return m[dim] ?? COLORES.navy;
};

export const colorEstado = (estado: string): string => {
  if (estado === "ROJO") return COLORES.rojo;
  if (estado === "AMARILLO") return COLORES.amarillo;
  return COLORES.verde;
};
