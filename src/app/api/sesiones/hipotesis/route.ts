import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, persona, hipotesis } = body;

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

    const dataToUpdate: any = persona === "A" 
      ? { hipotesis_A: hipotesis } 
      : { hipotesis_B: hipotesis };

    // Actualizar estado después de guardar hipótesis
    const currentSesion = sesion;
    const ambasHipotesis = Boolean(
      (persona === "A" ? hipotesis : currentSesion.hipotesis_A) &&
      (persona === "B" ? hipotesis : currentSesion.hipotesis_B)
    );
    
    if (!ambasHipotesis) {
      dataToUpdate.estado = "waiting_hypotheses";
    }

    await prisma.sesion.update({
      where: { id: session_id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving hipotesis:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}