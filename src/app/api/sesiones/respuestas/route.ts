import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validarEstado } from "@/lib/estados";
import { calcularResultadosIndividual, calcularResultadosIndividualPareja, calcularResultadosPareja } from "@/lib/calcular";

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

    // Validar estado de sesión
    const estadoValido = validarEstado(sesion.estado, "responder");
    if (!estadoValido.valido) {
      return NextResponse.json({ error: estadoValido.error }, { status: 400 });
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

    // Calcular y cachear resultado_json
    const nuevasMap = nuevasRespuestas as Record<string, any>;
    let resultadoCache = sesion.resultado_json as Record<string, unknown> || {};
    if (sesion.version === "individual") {
      resultadoCache = { individual: calcularResultadosIndividual(respuestas) };
    } else if (persona === "A" || persona === "B") {
      const resultA = calcularResultadosIndividualPareja(nuevasMap["A"] || []);
      const resultB = calcularResultadosIndividualPareja(nuevasMap["B"] || []);
      const resultPareja = nuevasMap["A"] && nuevasMap["B"]
        ? calcularResultadosPareja(nuevasMap["A"], nuevasMap["B"])
        : null;
      resultadoCache = { A: resultA, B: resultB, pareja: resultPareja };
    }

    await prisma.sesion.update({
      where: { id: session_id },
      data: {
        respuestas: nuevasRespuestas,
        estado: nuevoEstado,
        quien_ha_respondido: nuevoQuienRespondio,
        resultado_json: resultadoCache as any,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving respuestas:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}