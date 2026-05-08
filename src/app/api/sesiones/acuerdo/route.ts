import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, persona } = body;

    if (!session_id || !persona) {
      return NextResponse.json({ error: "Datos requeridos" }, { status: 400 });
    }

    // Validar cookie
    const cookieSessionId = request.cookies.get("session_id")?.value;
    if (!cookieSessionId || cookieSessionId !== session_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const updateData: any = {};
    
    if (persona === "A") {
      updateData.acuerdo_aceptado_A = true;
    } else if (persona === "B") {
      updateData.acuerdo_aceptado_B = true;
    }

    // Verificar si ambos aceptaron
    const sesion = await prisma.sesion.findUnique({
      where: { id: session_id },
    });

    if (!sesion) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }

    // Actualizar el estado del acuerdo
    await prisma.sesion.update({
      where: { id: session_id },
      data: updateData,
    });

    // Si ambos aceptaron, cambiar estado a reveal_ready
    const updatedSesion = await prisma.sesion.findUnique({
      where: { id: session_id },
    });

    if (updatedSesion?.acuerdo_aceptado_A && updatedSesion?.acuerdo_aceptado_B) {
      await prisma.sesion.update({
        where: { id: session_id },
        data: { estado: "reveal_ready" }
      });
    } else {
      // Al menos uno ya aceptó
      if (updatedSesion?.acuerdo_aceptado_A || updatedSesion?.acuerdo_aceptado_B) {
        await prisma.sesion.update({
          where: { id: session_id },
          data: { estado: "waiting_reveal_agreement" }
        });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error saving agreement:", error);
    return NextResponse.json({ 
      error: "No pudimos registrar tu aceptación. Intenta nuevamente." 
    }, { status: 500 });
  }
}
