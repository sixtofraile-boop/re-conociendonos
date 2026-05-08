import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { version, nombre_A, email_A, password_A, email_B, password_B, whatsapp_A, consentimientos_A } = body;

    const passwordHash = await bcrypt.hash(password_A || password_B || "default", 10);

    // Generar token seguro de 32 caracteres hex
    const token = randomBytes(16).toString("hex");
    const expira = new Date();
    expira.setDate(expira.getDate() + 7); // 7 días

    const sesion = await prisma.sesion.create({
      data: {
        version,
        estado: "invitation_created",
        nombre_A: nombre_A || null,
        email_A: email_A || null,
        password_A: passwordHash,
        email_B: email_B || null,
        password_B: email_B ? passwordHash : null,
        whatsapp_A: whatsapp_A || null,
        consentimientos_A: consentimientos_A || null,
        token_invitacion: token,
        token_expira: expira,
        respuestas: {},
      },
    });

    return NextResponse.json({ 
      sesion: { 
        id: sesion.id,
        token: token 
      } 
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "No pudimos crear la sesión. Intenta nuevamente." }, { status: 500 });
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

  // Verificar expiración de token
  if (sesion.token_expira && new Date() > sesion.token_expira && sesion.estado !== "reveal_ready" && sesion.estado !== "reveal_opened") {
    await prisma.sesion.update({
      where: { id: session_id },
      data: { estado: "expired" }
    });
    return NextResponse.json({ error: "Este link ya expiró. Por cuidado y privacidad, las invitaciones duran 7 días. Puedes pedir a tu pareja que genere una nueva invitación.", estado: "expired" }, { status: 410 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_A, password_B, token_invitacion, ...sesionSegura } = sesion;

  // Privacidad A/B: filtrar respuestas crudas según la persona que consulta (spec 13.1)
  const persona = request.cookies.get("persona")?.value;
  if (sesion.version === "pareja" && persona && sesionSegura.respuestas) {
    const respuestas = sesionSegura.respuestas as Record<string, unknown>;
    if (persona === "A") {
      sesionSegura.respuestas = { A: respuestas.A } as any;
    } else if (persona === "B") {
      sesionSegura.respuestas = { B: respuestas.B } as any;
    }
  }

  return NextResponse.json({ sesion: sesionSegura });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, estado } = body;

    const cookieSessionId = request.cookies.get("session_id")?.value;
    if (!cookieSessionId || cookieSessionId !== session_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await prisma.sesion.update({
      where: { id: session_id },
      data: { estado },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Error al actualizar sesión" }, { status: 500 });
  }
}