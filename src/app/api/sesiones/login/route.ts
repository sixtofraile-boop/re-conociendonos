import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    // Buscar como persona A (sesión propia o individual)
    const sesionA = await prisma.sesion.findFirst({
      where: { email_A: email },
      orderBy: { createdAt: "desc" },
    });

    if (sesionA && sesionA.password_A && await bcrypt.compare(password, sesionA.password_A)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_A, password_B, ...sesionSegura } = sesionA;
      return NextResponse.json({ sesion: sesionSegura, persona: "A" });
    }

    // Buscar como persona B (se unió a sesión de otro)
    const sesionB = await prisma.sesion.findFirst({
      where: { email_B: email },
      orderBy: { createdAt: "desc" },
    });

    if (sesionB && sesionB.password_B && await bcrypt.compare(password, sesionB.password_B)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_A, password_B, ...sesionSegura } = sesionB;
      return NextResponse.json({ sesion: sesionSegura, persona: "B" });
    }

    return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json({ error: "Error al buscar sesión" }, { status: 500 });
  }
}
