"use client";

import { useState } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { RESTAURANT_CONFIG } from "@/lib/config";

interface SuccessData {
  bookingId: string;
  cancelToken: string;
  customerName: string;
}

export function BookingSection() {
  const [success, setSuccess] = useState<SuccessData | null>(null);

  if (success) {
    return (
      <section id="reservar" className="py-24 px-6" style={{ background: "var(--paper-dark)" }}>
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto"
            style={{ background: "var(--olive)", color: "white" }}
          >
            ✓
          </div>
          <h2
            className="font-display text-3xl text-[--ink]"
            style={{ fontWeight: 400 }}
          >
            ¡Reserva confirmada!
          </h2>
          <p className="text-[--ink-soft] leading-relaxed">
            Gracias, <strong>{success.customerName}</strong>. Tu reserva está confirmada
            en {RESTAURANT_CONFIG.name}. Recibirás un email de confirmación con todos
            los detalles y un enlace para cancelar si fuera necesario.
          </p>
          <p className="text-sm text-[--ink-faint]">
            También recibirás un recordatorio 2 horas antes de tu reserva.
          </p>
          <button
            onClick={() => setSuccess(null)}
            className="text-sm text-[--wine] hover:text-[--wine-dark] underline underline-offset-2"
          >
            Hacer otra reserva
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="reservar"
      className="py-24 px-6"
      style={{ background: "var(--paper-dark)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Cabecera */}
        <div className="text-center mb-12 space-y-3">
          <p className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--brass]">
            Reservas
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl text-[--ink]"
            style={{ fontWeight: 300 }}
          >
            Reserva tu mesa
          </h2>
          <p className="text-[--ink-soft]">
            Disponibilidad en tiempo real. Confirmación inmediata por email.
          </p>
          <div className="flex justify-center pt-2">
            <div className="w-16 h-px" style={{ background: "var(--brass)" }} />
          </div>
        </div>

        {/* Tarjeta estilo ticket */}
        <div
          className="rounded-sm shadow-sm overflow-hidden"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Cabecera del ticket */}
          <div
            className="px-8 py-6 text-center"
            style={{
              background: "var(--wine)",
              borderBottom: "2px dashed rgba(255,255,255,0.2)",
            }}
          >
            <p className="font-mono-alt text-xs uppercase tracking-widest text-white/60 mb-1">
              {RESTAURANT_CONFIG.name}
            </p>
            <p className="font-display text-xl text-white" style={{ fontWeight: 300 }}>
              Mesa para esta noche
            </p>
          </div>

          {/* Formulario */}
          <div className="px-8 py-8">
            <BookingForm onSuccess={setSuccess} />
          </div>

          {/* Pie del ticket */}
          <div
            className="px-8 py-4 text-center"
            style={{
              borderTop: "2px dashed var(--border)",
            }}
          >
            <p className="text-xs text-[--ink-faint] font-mono-alt">
              {RESTAURANT_CONFIG.phone} · {RESTAURANT_CONFIG.email}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
