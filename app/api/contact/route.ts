import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter olmalı").max(100),
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı").max(2000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi" },
      { status: 400 }
    );
  }

  const { name, email, phone, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_EMAIL_TO missing");
    return NextResponse.json(
      { error: "Mesaj gönderilemedi, lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "İletişim Formu <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `Yeni iletişim formu mesajı - ${name}`,
      text: `İsim: ${name}\nE-posta: ${email}\nTelefon: ${phone || "-"}\n\nMesaj:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form send error:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilemedi, lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}
