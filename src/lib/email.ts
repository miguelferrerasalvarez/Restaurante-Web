import { Resend } from "resend";
import { RESTAURANT_CONFIG } from "./config";
import type { Booking } from "@/types/database";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

const FROM = `${process.env.RESEND_FROM_NAME ?? RESTAURANT_CONFIG.name} <${process.env.RESEND_FROM_EMAIL}>`;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function formatBookingDate(dateStr: string): string {
  return format(parseISO(dateStr), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
}

function cancelUrl(token: string): string {
  return `${APP_URL}/cancelar/${token}`;
}

export async function sendConfirmationEmail(booking: Booking) {
  if (!booking.customer_email) return;
  const date = formatBookingDate(booking.booking_date);
  const time = booking.booking_time.slice(0, 5);
  const zone = booking.zone === "interior" ? "Interior" : "Terraza";
  const cancelLink = cancelUrl(booking.cancel_token);
  await getResend().emails.send({
    from: FROM,
    to: booking.customer_email,
    subject: `Reserva confirmada — ${RESTAURANT_CONFIG.name}`,
    html: buildEmailHtml({
      title: "¡Reserva confirmada!",
      preheader: `Te esperamos el ${date} a las ${time}`,
      body: `<p>Hola <strong>${booking.customer_name}</strong>,</p><p>Tu reserva en <strong>${RESTAURANT_CONFIG.name}</strong> ha quedado confirmada:</p><table class="details"><tr><td>📅 Fecha</td><td>${date}</td></tr><tr><td>🕐 Hora</td><td>${time}</td></tr><tr><td>👥 Personas</td><td>${booking.party_size}</td></tr><tr><td>🪑 Zona</td><td>${zone}</td></tr></table><p><a href="${cancelLink}" class="btn">Cancelar mi reserva</a></p><p>¡Te esperamos!</p>`,
    }),
  });
}

export async function sendReminderEmail(booking: Booking) {
  if (!booking.customer_email) return;
  const date = formatBookingDate(booking.booking_date);
  const time = booking.booking_time.slice(0, 5);
  const zone = booking.zone === "interior" ? "Interior" : "Terraza";
  const cancelLink = cancelUrl(booking.cancel_token);
  await getResend().emails.send({
    from: FROM,
    to: booking.customer_email,
    subject: `Recordatorio — Tu reserva es hoy a las ${time}`,
    html: buildEmailHtml({
      title: "Tu reserva es en 2 horas",
      preheader: `Recuerda que tienes mesa a las ${time} en ${RESTAURANT_CONFIG.name}`,
      body: `<p>Hola <strong>${booking.customer_name}</strong>,</p><p>Recordatorio de tu reserva en <strong>${RESTAURANT_CONFIG.name}</strong>:</p><table class="details"><tr><td>📅 Fecha</td><td>${date}</td></tr><tr><td>🕐 Hora</td><td>${time}</td></tr><tr><td>👥 Personas</td><td>${booking.party_size}</td></tr><tr><td>🪑 Zona</td><td>${zone}</td></tr></table><p><a href="${cancelLink}" class="btn">Cancelar mi reserva</a></p><p>¡Hasta pronto!</p>`,
    }),
  });
}

export async function sendCancellationEmail(booking: Booking) {
  if (!booking.customer_email) return;
  const date = formatBookingDate(booking.booking_date);
  const time = booking.booking_time.slice(0, 5);
  await getResend().emails.send({
    from: FROM,
    to: booking.customer_email,
    subject: `Reserva cancelada — ${RESTAURANT_CONFIG.name}`,
    html: buildEmailHtml({
      title: "Reserva cancelada",
      preheader: `Tu reserva del ${date} ha sido cancelada`,
      body: `<p>Hola <strong>${booking.customer_name}</strong>,</p><p>Tu reserva en <strong>${RESTAURANT_CONFIG.name}</strong> para el <strong>${date} a las ${time}</strong> ha sido cancelada correctamente.</p><p>¡Esperamos verte pronto!</p>`,
    }),
  });
}

function buildEmailHtml({ title, preheader, body }: { title: string; preheader: string; body: string }): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/><title>${title}</title><style>body{margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;color:#1a1612}.wrapper{max-width:600px;margin:40px auto;background:#faf7f2;border-radius:4px;overflow:hidden}.header{background:#722f37;padding:32px 40px;text-align:center}.header h1{margin:0;color:#f5f0e8;font-size:24px;letter-spacing:2px;font-weight:400}.restaurant{color:#c9a84c;font-size:13px;letter-spacing:4px;text-transform:uppercase;margin-top:4px}.content{padding:40px}.content p{line-height:1.7;color:#3d3530}table.details{width:100%;border-collapse:collapse;margin:24px 0}table.details td{padding:10px 0;border-bottom:1px solid #e8e0d0;font-size:15px}table.details td:first-child{color:#6b7c5a;font-style:italic;width:40%}.btn{display:inline-block;margin-top:8px;padding:12px 28px;background:#722f37;color:#faf7f2!important;text-decoration:none;border-radius:2px;font-size:14px}.footer{padding:24px 40px;border-top:1px solid #e8e0d0;text-align:center;color:#9e9085;font-size:12px}</style></head><body><div class="wrapper"><div class="header"><div class="restaurant">${RESTAURANT_CONFIG.name}</div><h1>${title}</h1></div><div class="content"><p style="display:none;font-size:0;opacity:0">${preheader}</p>${body}</div><div class="footer"><p>${RESTAURANT_CONFIG.address.street}, ${RESTAURANT_CONFIG.address.city}</p><p>${RESTAURANT_CONFIG.phone} &middot; ${RESTAURANT_CONFIG.email}</p></div></div></body></html>`;
}
