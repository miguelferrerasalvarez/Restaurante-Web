import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { sendCancellationEmail } from "@/lib/email";
import type { Database } from "@/types/database";

type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

async function requireAuth() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = await createSupabaseServiceClient();

  const updateData: BookingUpdate = {};
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.partySize !== undefined) updateData.party_size = body.partySize;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.bookingDate !== undefined) updateData.booking_date = body.bookingDate;
  if (body.bookingTime !== undefined) updateData.booking_time = body.bookingTime + ":00";
  if (body.zone !== undefined) updateData.zone = body.zone;

  const { error } = await supabase.from("bookings").update(updateData).eq("id", id);
  if (error) return NextResponse.json({ error: "Error DB" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const supabase = await createSupabaseServiceClient();

  const { data: booking } = await supabase.from("bookings").select("*").eq("id", id).single();
  const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
  if (error) return NextResponse.json({ error: "Error DB" }, { status: 500 });

  if (booking) sendCancellationEmail(booking).catch(console.error);
  return NextResponse.json({ success: true });
}
