"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormData } from "@/lib/validations";
import type { Booking } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BOOKING_CONFIG } from "@/lib/config";
import { format } from "date-fns";

const ALL_TIMES = [
  ...BOOKING_CONFIG.lunchSlots,
  ...BOOKING_CONFIG.dinnerSlots,
];

interface BookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ booking, onClose, onSuccess }: BookingModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!booking;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: booking
      ? {
          customerName: booking.customer_name,
          customerEmail: booking.customer_email ?? "",
          customerPhone: booking.customer_phone ?? "",
          partySize: booking.party_size,
          bookingDate: booking.booking_date,
          bookingTime: booking.booking_time.slice(0, 5),
          zone: booking.zone,
          notes: booking.notes ?? "",
        }
      : {
          bookingDate: format(new Date(), "yyyy-MM-dd"),
          partySize: 2,
        },
  });

  async function onSubmit(data: BookingFormData) {
    setSubmitting(true);
    setError(null);
    try {
      let res: Response;
      if (isEdit) {
        res = await fetch(`/api/admin/bookings/${booking.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: data.customerName,
            partySize: data.partySize,
            bookingDate: data.bookingDate,
            bookingTime: data.bookingTime,
            zone: data.zone,
            notes: data.notes,
          }),
        });
      } else {
        res = await fetch("/api/admin/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, sendEmail: true }),
        });
      }
      const result = await res.json();
      if (!res.ok || result.error) {
        setError(result.error ?? "Error al guardar");
        return;
      }
      onSuccess();
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(26,22,18,0.5)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-sm shadow-xl overflow-hidden"
        style={{ background: "var(--paper)" }}
      >
        {/* Cabecera */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: "var(--wine)",
            borderBottom: "1px solid var(--wine-dark)",
          }}
        >
          <h2 className="font-display text-lg text-white" style={{ fontWeight: 300 }}>
            {isEdit ? "Editar reserva" : "Nueva reserva"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-4">
          <input type="text" name="website" className="hidden" tabIndex={-1} />

          <Input
            label="Nombre *"
            error={errors.customerName?.message}
            {...register("customerName")}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              error={errors.customerEmail?.message}
              {...register("customerEmail")}
            />
            <Input
              label="Teléfono"
              type="tel"
              error={errors.customerPhone?.message}
              {...register("customerPhone")}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Fecha"
              type="date"
              error={errors.bookingDate?.message}
              {...register("bookingDate")}
            />
            <Select
              label="Hora"
              error={errors.bookingTime?.message}
              placeholder="—"
              options={ALL_TIMES.map((t) => ({ value: t, label: t }))}
              {...register("bookingTime")}
            />
            <Input
              label="Personas"
              type="number"
              min={1}
              max={20}
              error={errors.partySize?.message}
              {...register("partySize", { valueAsNumber: true })}
            />
          </div>
          <Select
            label="Zona"
            error={errors.zone?.message}
            placeholder="Selecciona zona"
            options={[
              { value: "interior", label: "Interior" },
              { value: "terraza", label: "Terraza" },
            ]}
            {...register("zone")}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[--ink-soft]">Notas</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2.5 text-sm bg-white border border-[--border] rounded text-[--ink] focus:outline-none focus:ring-2 focus:ring-[--wine] focus:border-transparent resize-none"
              {...register("notes")}
            />
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear reserva"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
