import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    const sesion = await prisma.sesion.findUnique({
      where: { token_invitacion: token },
    });

    if (!sesion) {
      return NextResponse.json({ 
        error: "Esta invitación ya no está disponible." 
      }, { status: 404 });
    }

    // Verificar expiración
    if (sesion.token_expira && new Date() > sesion.token_expira) {
      // Actualizar estado a expirada
      await prisma.sesion.update({
        where: { id: sesion.id },
        data: { estado: "expired" }
      });
      return NextResponse.json({ 
        error: "Este link ya expiró. Por cuidado y privacidad, las invitaciones duran 7 días. Puedes pedir a tu pareja que genere una nueva invitación." 
      }, { status: 410 });
    }

    // Verificar si ya fue cancelada
    if (sesion.estado === "cancelled") {
      return NextResponse.json({ 
        error: "Esta invitación ya no está disponible." 
      }, { status: 410 });
    }

    return NextResponse.json({ 
      sesion: {
        id: sesion.id,
        email_A: sesion.email_A,
        estado: sesion.estado,
        token_valido: true
      }
    });

  } catch (error) {
    console.error("Error validating invitation:", error);
    return NextResponse.json({ 
      error: "No pudimos encontrar esta invitación. Revisa si el link está completo o solicita uno nuevo." 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, nombre_B, email_B, password_B, whatsapp_B } = body;

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    const sesion = await prisma.sesion.findUnique({
      where: { token_invitacion: token },
    });

    if (!sesion) {
      return NextResponse.json({ 
        error: "Esta invitación ya no está disponible." 
      }, { status: 404 });
    }

    // Verificar expiración
    if (sesion.token_expira && new Date() > sesion.token_expira) {
      return NextResponse.json({ 
        error: "Este link ya expiró. Por cuidado y privacidad, las invitaciones duran 7 días." 
      }, { status: 410 });
    }

    // Guardar datos de B y actualizar estado
    const passwordHash = await import("bcryptjs").then(bc => bc.default.hash(password_B || "default", 10));

    await prisma.sesion.update({
      where: { id: sesion.id },
      data: {
        nombre_B: nombre_B || null,
        email_B: email_B || null,
        password_B: passwordHash,
        whatsapp_B: whatsapp_B || null,
        estado: "in_progress" // B aceptó, ahora puede responder
      }
    });

    return NextResponse.json({ 
      success: true,
      sesion_id: sesion.id 
    });

  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json({ 
      error: "No pudimos procesar la invitación en este momento. Intenta nuevamente." 
    }, { status: 500 });
  }
}
