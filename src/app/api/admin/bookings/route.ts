import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/email";

async function requireAuth() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const week = searchParams.get("week");
  const supabase = await createSupabaseServiceClient();

  let query = supabase.from("bookings").select("*")
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });

  if (date) {
    query = query.eq("booking_date", date);
  } else if (week) {
    const monday = new Date(week);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    query = query.gte("booking_date", week).lte("booking_date", sunday.toISOString().split("T")[0]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Error DB" }, { status: 500 });
  return NextResponse.json({ bookings: data });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const supabase = await createSupabaseServiceClient();

  const { data: result, error } = await supabase.rpc("create_booking", {
    p_name: body.customerName,
    p_email: body.customerEmail || null,
    p_phone: body.customerPhone || null,
    p_date: body.bookingDate,
    p_time: body.bookingTime + ":00",
    p_party_size: body.partySize,
    p_zone: body.zone,
    p_notes: body.notes || null,
  });

  if (error) return NextResponse.json({ error: "Error DB" }, { status: 500 });
  const row = result?.[0];
  if (!row?.success) return NextResponse.json({ error: row?.error_msg }, { status: 409 });

  const { data: booking } = await supabase.from("bookings").select("*").eq("id", row.booking_id).single();
  if (booking && body.sendEmail) sendConfirmationEmail(booking).catch(console.error);

  return NextResponse.json({ success: true, bookingId: row.booking_id });
}
