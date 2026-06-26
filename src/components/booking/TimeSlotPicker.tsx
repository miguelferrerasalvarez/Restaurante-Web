"use client";
import { cn } from "@/lib/utils";
import type { SlotAvailability } from "@/lib/availability";

export function TimeSlotPicker({ slots, selectedTime, onSelect, loading }: {
  slots: SlotAvailability[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading?: boolean;
}) {
  if (loading) return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[--ink-soft]">Selecciona la hora</p>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 rounded border border-[--border] bg-[--paper-dark] animate-pulse" />)}
      </div>
    </div>
  );

  const lunch = slots.filter((s) => s.turn === "comida");
  const dinner = slots.filter((s) => s.turn === "cena");

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[--ink-soft]">Selecciona la hora</p>
      {[{ label: "Comida", items: lunch }, { label: "Cena", items: dinner }].map(({ label, items }) => (
        <div key={label}>
          <p className="text-xs uppercase tracking-widest text-[--ink-faint] mb-2 font-mono-alt">{label}</p>
          <div className="grid grid-cols-3 gap-2">
            {items.map((slot) => (
              <button key={slot.time} type="button" disabled={!slot.isAvailable} onClick={() => onSelect(slot.time)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 px-2 rounded border text-sm transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--wine]",
                  selectedTime === slot.time
                    ? "border-[--wine] bg-[--wine] text-white"
                    : slot.isAvailable
                    ? "border-[--border] hover:border-[--wine-light] text-[--ink] hover:bg-[--paper-dark]"
                    : "border-[--border] bg-[--paper-dark] text-[--ink-faint] cursor-not-allowed opacity-60"
                )}>
                <span className="font-medium font-mono-alt text-xs">{slot.time}</span>
                {!slot.isAvailable && <span className="text-[10px] mt-0.5">Sin disponibilidad</span>}
                {slot.isAvailable && selectedTime !== slot.time && <span className="text-[10px] mt-0.5 text-[--olive]">{slot.availableSeats} plazas</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
