import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcularResultadosIndividual, mensajeCierre } from "@/lib/calcular";
import { FRASES_GATILLO_INDIVIDUAL, PREGUNTAS_REFLEXION } from "@/lib/preguntas";
import { MiMiradaPDF } from "@/lib/pdf/mi-mirada";
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

    // Obtener respuestas individuales
    const respuestasI = sesion.respuestas as any;
    if (!respuestasI?.I || !Array.isArray(respuestasI.I) || respuestasI.I.length === 0) {
      return NextResponse.json({ error: "No hay respuestas guardadas" }, { status: 400 });
    }

    // Calcular resultados
    const resultado = calcularResultadosIndividual(respuestasI.I);
    const estados = resultado.dimensiones.map((d) => d.estado);
    const mensaje = mensajeCierre(estados);

    // Obtener nombre de la cookie
    const nombre = request.cookies.get("nombre")?.value || null;

    // Renderizar PDF
    const pdfBuffer = await renderToBuffer(
      <MiMiradaPDF
        nombre={nombre}
        global={resultado.global}
        dimensiones={resultado.dimensiones}
        recomiendaProfesional={resultado.recomienda_profesional}
        estados={estados}
        frasesGatillo={FRASES_GATILLO_INDIVIDUAL}
        preguntasReflexion={PREGUNTAS_REFLEXION}
        mensajeCierre={mensaje}
      />
    );

    // Retornar PDF
    // Convertir Buffer a Uint8Array para compatibilidad con BodyInit
    const uint8Array = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="mi-mirada-${session_id}.pdf"`,
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
