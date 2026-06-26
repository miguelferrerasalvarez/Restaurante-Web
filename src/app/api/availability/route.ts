import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { computeAvailability, toOccupancyMap } from "@/lib/availability";
import type { Zone } from "@/lib/config";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const zone = searchParams.get("zone") as Zone | null;
  const partySize = parseInt(searchParams.get("partySize") ?? "1", 10);

  if (!date || !zone || !["interior", "terraza"].includes(zone)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const supabase = await createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("slot_occupancy")
    .select("booking_time, occupied_seats")
    .eq("booking_date", date)
    .eq("zone", zone);

  if (error) return NextResponse.json({ error: "Error interno" }, { status: 500 });

  const occupancyMap = toOccupancyMap(data ?? []);
  const slots = computeAvailability(occupancyMap, zone, partySize);

  return NextResponse.json({ slots }, { headers: { "Cache-Control": "no-store" } });
}
