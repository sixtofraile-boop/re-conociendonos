import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, email_B, password_B } = body;

    const sesion = await prisma.sesion.findUnique({
      where: { id: session_id },
    });

    if (!sesion) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(password_B, 10);

    const updatedsesion = await prisma.sesion.update({
      where: { id: session_id },
      data: {
        email_B: email_B,
        password_B: passwordHash,
        estado: sesion.respuestas && Object.keys(sesion.respuestas as object).length > 0 ? "waiting_other_response" : "in_progress",
      },
    });

    return NextResponse.json({ sesion: { id: updatedsesion.id, respuestas: updatedsesion.respuestas } });
  } catch (error) {
    console.error("Error joining session:", error);
    return NextResponse.json({ error: "Error al unirse a la sesión" }, { status: 500 });
  }
}