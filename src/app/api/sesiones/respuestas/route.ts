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

    let nuevoEstado = sesion.estado;
    if (persona === "A") {
      nuevoEstado = "resultados_A";
      if (sesion.email_B) nuevoEstado = "esperando_B";
    } else if (persona === "B") {
      nuevoEstado = "mapa_conjunto";
    }

    // Detecta correctamente "ambos" sin importar el orden de respuesta
    const yaHayOtro = sesion.quien_ha_respondido !== null && sesion.quien_ha_respondido !== persona;
    const nuevoQuienRespondio = yaHayOtro ? "ambos" : persona;

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