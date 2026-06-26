import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limited = await rateLimit(ip, 5, 600);
  if (limited) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if ((body as Record<string, unknown>).website) {
    return NextResponse.json({ success: true });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;
  const supabase = await createSupabaseServiceClient();

  const { data: result, error } = await supabase.rpc("create_booking", {
    p_name: data.customerName,
    p_email: data.customerEmail || null,
    p_phone: data.customerPhone || null,
    p_date: data.bookingDate,
    p_time: data.bookingTime + ":00",
    p_party_size: data.partySize,
    p_zone: data.zone,
    p_notes: data.notes || null,
  });

  if (error) { console.error("DB error:", error); return NextResponse.json({ error: "Error interno" }, { status: 500 }); }

  const row = result?.[0];
  if (!row?.success) {
    return NextResponse.json({ error: row?.error_msg ?? "No hay disponibilidad para esa franja" }, { status: 409 });
  }

  const { data: booking } = await supabase.from("bookings").select("*").eq("id", row.booking_id).single();
  if (booking) sendConfirmationEmail(booking).catch(console.error);

  return NextResponse.json({ success: true, bookingId: row.booking_id, cancelToken: row.cancel_token });
}
