"use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormData } from "@/lib/validations";
import { BOOKING_CONFIG, type Zone } from "@/lib/config";
import type { SlotAvailability } from "@/lib/availability";
import { RestaurantMap } from "./RestaurantMap";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");

export function BookingForm({ onSuccess }: { onSuccess: (data: { bookingId: string; cancelToken: string; customerName: string }) => void }) {
  const [zone, setZone] = useState<Zone | null>(null);
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { bookingDate: today, partySize: 2, zone: undefined },
  });

  const watchDate = watch("bookingDate");
  const watchPartySize = watch("partySize");
  const watchTime = watch("bookingTime");

  const fetchSlots = useCallback(async () => {
    if (!zone || !watchDate || !watchPartySize) return;
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/availability?date=${watchDate}&zone=${zone}&partySize=${watchPartySize}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
    } catch { setSlots([]); }
    finally { setLoadingSlots(false); }
  }, [zone, watchDate, watchPartySize]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  function handleZoneSelect(z: Zone) {
    setZone(z);
    setValue("zone", z, { shouldValidate: true });
    setValue("bookingTime", "", { shouldValidate: false });
  }

  async function onSubmit(data: BookingFormData) {
    setSubmitting(true); setServerError(null);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await res.json();
      if (!res.ok || !result.success) { setServerError(result.error ?? "Error al crear la reserva"); return; }
      onSuccess({ bookingId: result.bookingId, cancelToken: result.cancelToken, customerName: data.customerName });
    } catch { setServerError("Error de conexión. Inténtalo de nuevo."); }
    finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <input type="text" {...register("website")} className="absolute opacity-0 h-0 w-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-[--ink-faint] font-mono-alt">01 — Cuándo y cuántos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Fecha" type="date" min={today} error={errors.bookingDate?.message} {...register("bookingDate")} />
          <Input label="Número de personas" type="number" min={BOOKING_CONFIG.minPartySize} max={BOOKING_CONFIG.maxPartySize} error={errors.partySize?.message} {...register("partySize", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-[--ink-faint] font-mono-alt">02 — Elige tu zona</h3>
        <RestaurantMap selectedZone={zone} onSelectZone={handleZoneSelect} />
        {errors.zone && <p className="text-xs text-red-600">{errors.zone.message}</p>}
      </div>

      {zone && (
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest text-[--ink-faint] font-mono-alt">03 — Hora</h3>
          <TimeSlotPicker slots={slots} selectedTime={watchTime || null} onSelect={(t) => setValue("bookingTime", t, { shouldValidate: true })} loading={loadingSlots} />
          {errors.bookingTime && <p className="text-xs text-red-600">{errors.bookingTime.message}</p>}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-[--ink-faint] font-mono-alt">04 — Tus datos</h3>
        <Input label="Nombre completo *" placeholder="Tu nombre" error={errors.customerName?.message} {...register("customerName")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email" type="email" placeholder="tu@email.com" error={errors.customerEmail?.message} hint="Recibirás la confirmación aquí" {...register("customerEmail")} />
          <Input label="Teléfono" type="tel" placeholder="612 345 678" error={errors.customerPhone?.message} {...register("customerPhone")} />
        </div>
        <p className="text-xs text-[--ink-faint]">* Al menos un email o teléfono de contacto es necesario.</p>
        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium text-[--ink-soft]">Notas especiales (opcional)</label>
          <textarea id="notes" placeholder="Alergias, cumpleaños, preferencias de mesa..." rows={2}
            className="w-full px-3 py-2.5 text-sm bg-white border border-[--border] rounded text-[--ink] placeholder:text-[--ink-faint] focus:outline-none focus:ring-2 focus:ring-[--wine] focus:border-transparent resize-none"
            {...register("notes")} />
          {errors.notes && <p className="text-xs text-red-600">{errors.notes.message}</p>}
        </div>
      </div>

      {serverError && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>}

      <Button type="submit" size="lg" disabled={submitting} className="w-full tracking-wide">
        {submitting ? "Reservando…" : "Confirmar reserva"}
      </Button>
    </form>
  );
}
