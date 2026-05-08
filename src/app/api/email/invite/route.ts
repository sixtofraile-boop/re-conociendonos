import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, mensaje_personalizado } = body;

    if (!session_id) {
      return NextResponse.json({ error: "Session ID requerido" }, { status: 400 });
    }

    // Validar cookie
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

    if (!sesion.email_B) {
      return NextResponse.json({ error: "No hay email de pareja configurado" }, { status: 400 });
    }

    if (!resend) {
      console.warn("RESEND_API_KEY no configurada - simulando envío");
      return NextResponse.json({ success: true, simulado: true });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://re-conociendonos.vercel.app";
    const inviteUrl = `${baseUrl}/pareja/invite?token=${sesion.token_invitacion}`;

    const mensajeBase = mensaje_personalizado || 
      "Hice Mi Mirada y me dejó pensando en nosotros. Me gustaría invitarte a construir Nuestro Mapa juntos, solo si te hace sentido. No es para juzgarnos; es para conversar con más cuidado sobre lo que nos importa.";

    const { data, error } = await resend.emails.send({
      from: "Re-conociendonos <hola@re-conociendonos.com>",
      to: [sesion.email_B],
      subject: "Te han invitado a construir Nuestro Mapa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1A274A; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0 0 10px 0; font-size: 24px;">Re-conociéndonos</h1>
            <p style="margin: 0; color: #E8B850; font-size: 12px; letter-spacing: 2px;">INVITACIÓN PARA NUESTRO MAPA</p>
          </div>
          <div style="background: #F8F8F8; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="color: #444455; line-height: 1.6;">${mensajeBase}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="background: #5B8DD9; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Aceptar invitación</a>
            </div>
            <p style="color: #888; font-size: 12px; text-align: center;">O copia este enlace: ${inviteUrl}</p>
            <p style="color: #888; font-size: 11px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #EEE;">Este enlace expira en 7 días. Si no pudiste aceptarlo, pide a tu pareja que genere uno nuevo.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json({ error: "No pudimos enviar el correo ahora. Intenta nuevamente." }, { status: 500 });
    }

    // Actualizar estado
    await prisma.sesion.update({
      where: { id: session_id },
      data: { estado: "invitacion_enviada" }
    });

    return NextResponse.json({ success: true, email_id: data?.id });

  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json({ 
      error: "No pudimos enviar el correo en este momento. Intenta nuevamente." 
    }, { status: 500 });
  }
}
