// Estados de sesión según spec 13.2
export type EstadoSesion =
  | "draft"
  | "invitation_created"
  | "invitation_sent"
  | "waiting_acceptance"
  | "in_progress"
  | "waiting_other_response"
  | "both_tests_completed"
  | "waiting_hypotheses"
  | "waiting_reveal_agreement"
  | "reveal_ready"
  | "reveal_opened"
  | "cancelled"
  | "closed"
  | "expired";

type Accion = "responder" | "guardar_hipotesis" | "aceptar_acuerdo" | "ver_mapa" | "enviar_invitacion";

const TRANSICIONES: Record<Accion, EstadoSesion[]> = {
  responder: ["in_progress", "waiting_other_response", "invitation_created"],
  guardar_hipotesis: ["both_tests_completed", "waiting_hypotheses"],
  aceptar_acuerdo: ["both_tests_completed", "waiting_hypotheses", "waiting_reveal_agreement"],
  ver_mapa: ["reveal_ready", "reveal_opened"],
  enviar_invitacion: ["invitation_created"],
};

export function validarEstado(estado: string, accion: Accion): { valido: boolean; error?: string } {
  const permitidos = TRANSICIONES[accion];
  if (!permitidos) {
    return { valido: false, error: "Acción no reconocida." };
  }
  if (estado === "expired" || estado === "cancelled" || estado === "closed") {
    return { valido: false, error: "Esta sesión ya no está activa." };
  }
  if (!permitidos.includes(estado as EstadoSesion)) {
    return { valido: false, error: `Esta acción no está disponible en el estado actual de la sesión.` };
  }
  return { valido: true };
}
