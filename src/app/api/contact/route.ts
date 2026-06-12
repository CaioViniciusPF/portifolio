import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteData } from "@/lib/data";

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

const MAX_LENGTHS = { name: 100, email: 200, message: 5000 } as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.set(ip, recent);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type ContactPayload = { name: string; email: string; message: string };

function validate(body: unknown): ContactPayload | null {
  if (typeof body !== "object" || body === null) return null;
  const { name, email, message } = body as Record<string, unknown>;
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return null;
  }
  const trimmed = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };
  if (!trimmed.name || trimmed.name.length > MAX_LENGTHS.name) return null;
  if (!EMAIL_REGEX.test(trimmed.email) || trimmed.email.length > MAX_LENGTHS.email) return null;
  if (!trimmed.message || trimmed.message.length > MAX_LENGTHS.message) return null;
  return trimmed;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  // Honeypot: bots preenchem o campo invisível; responde sucesso sem enviar
  if ((body as Record<string, unknown>)?.company) {
    return NextResponse.json({ ok: true });
  }

  const payload = validate(body);
  if (!payload) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Serviço de email não configurado." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Portfólio <onboarding@resend.dev>",
    to: siteData.contact.email,
    replyTo: payload.email,
    subject: `[Portfólio] Mensagem de ${payload.name}`,
    html: `
      <p><strong>Nome:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Falha ao enviar o email." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
