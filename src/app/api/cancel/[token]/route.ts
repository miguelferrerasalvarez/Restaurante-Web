import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { sendCancellationEmail } from "@/lib/email";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createSupabaseServiceClient();

  const { data: booking, error: findError } = await supabase
    .from("bookings").select("*").eq("cancel_token", token).eq("status", "confirmed").single();

  if (findError || !booking) {
    return NextResponse.json({ error: "Reserva no encontrada o ya cancelada" }, { status: 404 });
  }

  const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", booking.id);
  if (error) return NextResponse.json({ error: "Error interno" }, { status: 500 });

  sendCancellationEmail(booking).catch(console.error);
  return NextResponse.json({ success: true });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createSupabaseServiceClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("customer_name, booking_date, booking_time, party_size, zone, status")
    .eq("cancel_token", token).single();

  if (!booking) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ booking });
}
