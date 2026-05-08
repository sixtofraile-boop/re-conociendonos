import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularResultadosPareja } from "@/lib/calcular";
import { FRASES_GATILLO_PAREJA, PREGUNTAS_CONVERSACION } from "@/lib/preguntas";
import { NuestroMapaPDF } from "@/lib/pdf/nuestro-mapa";
import { renderToBuffer } from "@react-pdf/renderer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Validar cookie
    const cookieSessionId = request.cookies.get("session_id")?.value;
    if (!cookieSessionId || cookieSessionId !== session_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Obtener sesión
    const sesion = await prisma.sesion.findUnique({
      where: { id: session_id },
    });

    if (!sesion) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Obtener respuestas de A y B
    const respuestas = sesion.respuestas as any;
    if (!respuestas?.A || !respuestas?.B || !Array.isArray(respuestas.A) || !Array.isArray(respuestas.B)) {
      return NextResponse.json({ error: "Faltan respuestas de uno o ambos miembros" }, { status: 400 });
    }

    // Calcular resultados conjuntos
    const resultado = calcularResultadosPareja(respuestas.A, respuestas.B);

    // Obtener persona y nombre de las cookies
    const persona = request.cookies.get("persona")?.value || null;
    const nombreA = request.cookies.get("nombre")?.value || null;
    const nombreB = sesion.email_B ? "Pareja" : null;

    // Renderizar PDF
    const pdfBuffer = await renderToBuffer(
      <NuestroMapaPDF
        resultado={resultado}
        sesion={{
          hipotesis_A: sesion.hipotesis_A || undefined,
          hipotesis_B: sesion.hipotesis_B || undefined,
        }}
        persona={persona}
        frasesGatillo={FRASES_GATILLO_PAREJA}
        preguntasConversacion={PREGUNTAS_CONVERSACION}
        nombreA={persona === "A" ? nombreA || undefined : nombreB || undefined}
        nombreB={persona === "B" ? nombreA || undefined : nombreB || undefined}
      />
    );

    // Retornar PDF
    // Convertir Buffer a Uint8Array para compatibilidad con BodyInit
    const uint8Array = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="nuestro-mapa-${session_id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Error al generar PDF: " + (error as Error).message },
      { status: 500 }
    );
  }
}
