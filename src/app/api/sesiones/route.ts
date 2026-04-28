import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { version, email_A, password_A, email_B, password_B } = body;

    console.log("Creating session:", { version, email_A: email_A ? "provided" : null });

    const passwordHash = await bcrypt.hash(password_A || password_B || "default", 10);
    console.log("Password hashed successfully");

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

    console.log("Session created:", sesion.id);
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

  const sesion = await prisma.sesion.findUnique({
    where: { id: session_id },
  });

  if (!sesion) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  console.log("GET /api/sesiones: sesion.respuestas:", JSON.stringify(sesion.respuestas));
  return NextResponse.json({ sesion });
}