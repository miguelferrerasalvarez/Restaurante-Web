import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { sendReminderEmail } from "@/lib/email";
import { format, addHours } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const TZ = "Europe/Madrid";
  const nowMadrid = toZonedTime(new Date(), TZ);
  const windowStart = addHours(nowMadrid, 2);
  const windowEnd = new Date(windowStart.getTime() + 15 * 60 * 1000);
  const dateStr = format(windowStart, "yyyy-MM-dd");
  const timeStart = format(windowStart, "HH:mm");
  const timeEnd = format(windowEnd, "HH:mm");

  const supabase = await createSupabaseServiceClient();
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_date", dateStr)
    .gte("booking_time", timeStart + ":00")
    .lt("booking_time", timeEnd + ":00")
    .eq("status", "confirmed")
    .eq("reminder_sent", false);

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });

  let sent = 0;
  for (const booking of bookings ?? []) {
    try {
      await sendReminderEmail(booking);
      await supabase.from("bookings").update({ reminder_sent: true, status: "reminder_sent" }).eq("id", booking.id);
      sent++;
    } catch (e) { console.error(`Failed reminder for ${booking.id}:`, e); }
  }

  return NextResponse.json({ processed: bookings?.length ?? 0, sent });
}
