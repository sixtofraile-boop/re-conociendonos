import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, persona, respuestas } = body;

    const cookieSessionId = request.cookies.get("session_id")?.value;
    if (!cookieSessionId || cookieSessionId !== session_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const sesion = await prisma.sesion.findUnique({
      where: { id: session_id },
    });

    if (!sesion) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }

    const respuestasActuales = (sesion.respuestas as Record<string, unknown>) || {};
    const nuevasRespuestas = { ...respuestasActuales, [persona]: respuestas };

    // Estados según spec 13.2
    const quienYaRespondio = sesion.quien_ha_respondido;
    const esPrimero = quienYaRespondio === null || quienYaRespondio === persona;
    
    let nuevoEstado = sesion.estado;
    if (persona === "A" || persona === "B") {
      const otroHaRespondido = quienYaRespondio !== null && quienYaRespondio !== persona;
      if (!otroHaRespondido) {
        // Primera persona en terminar - esperar a la otra
        nuevoEstado = "waiting_other_response";
      } else {
        // Ambas ya terminaron
        nuevoEstado = "both_tests_completed";
      }
    }

    const nuevoQuienRespondio = esPrimero ? persona : "ambos";

    await prisma.sesion.update({
      where: { id: session_id },
      data: {
        respuestas: nuevasRespuestas,
        estado: nuevoEstado,
        quien_ha_respondido: nuevoQuienRespondio,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving respuestas:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}