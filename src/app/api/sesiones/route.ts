import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { version, email_A, password_A, email_B, password_B } = body;

    const passwordHash = await bcrypt.hash(password_A || password_B || "default", 10);

    const sesion = await prisma.sesion.create({
      data: {
        version,
        estado: "inicio",
        email_A: email_A || null,
        password_A: passwordHash,
        email_B: email_B || null,
        password_B: email_B ? passwordHash : null,
        respuestas: {},
      },
    });

    return NextResponse.json({ sesion: { id: sesion.id } });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Error al crear sesión: " + (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  // Solo el dueño de la sesión puede leer sus datos
  const cookieSessionId = request.cookies.get("session_id")?.value;
  if (!cookieSessionId || cookieSessionId !== session_id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const sesion = await prisma.sesion.findUnique({
    where: { id: session_id },
  });

  if (!sesion) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_A, password_B, ...sesionSegura } = sesion;
  return NextResponse.json({ sesion: sesionSegura });
}