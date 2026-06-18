import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// nodemailer needs the Node.js runtime (not the edge runtime).
export const runtime = "nodejs";

// Where contact-form submissions are delivered.
const TO = process.env.CONTACT_TO || "info@modularhouses.rs";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    // server-side validation of the required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error("SMTP env vars are not set - cannot send contact email.");
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
    }

    const port = Number(SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // true for 465 (implicit TLS), false for 587/STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM || `Modular Houses <${SMTP_USER}>`,
      to: TO,
      replyTo: email,
      subject: `Nova poruka sa sajta - ${name}`,
      text:
        `Ime i prezime: ${name}\n` +
        `Email: ${email}\n` +
        `Telefon: ${phone || "-"}\n\n` +
        `Poruka:\n${message}`,
      html:
        `<h2>Nova poruka sa sajta</h2>` +
        `<p><strong>Ime i prezime:</strong> ${escapeHtml(name)}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        `<p><strong>Telefon:</strong> ${escapeHtml(phone || "-")}</p>` +
        `<p><strong>Poruka:</strong></p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
