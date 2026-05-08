import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, respuestas } = body;

    const cookieSessionId = request.cookies.get("session_id")?.value;
    if (!cookieSessionId || cookieSessionId !== session_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.sesion.update({
      where: { id: session_id },
      data: { feedback: respuestas },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json({ error: "No pudimos guardar tu feedback." }, { status: 500 });
  }
}
