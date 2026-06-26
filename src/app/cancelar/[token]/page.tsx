"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RESTAURANT_CONFIG } from "@/lib/config";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface BookingInfo {
  customer_name: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  zone: string;
  status: string;
}

export default function CancelPage() {
  const { token } = useParams<{ token: string }>();
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/cancel/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.booking) setBooking(data.booking);
        else setError("Reserva no encontrada.");
      })
      .catch(() => setError("Error al cargar la reserva."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleCancel() {
    setCancelling(true);
    try {
      const res = await fetch(`/api/cancel/${token}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setCancelled(true);
      } else {
        setError(data.error ?? "No se pudo cancelar.");
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <p
            className="font-display text-2xl"
            style={{ color: "var(--wine)", fontWeight: 400 }}
          >
            {RESTAURANT_CONFIG.name}
          </p>
        </div>

        <div
          className="rounded-sm shadow-sm"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="px-6 py-5"
            style={{
              borderBottom: "1px solid var(--border)",
              background: "var(--paper-dark)",
            }}
          >
            <h1
              className="font-display text-xl text-[--ink]"
              style={{ fontWeight: 400 }}
            >
              Cancelar reserva
            </h1>
          </div>

          <div className="px-6 py-6">
            {loading && (
              <p className="text-[--ink-soft] text-sm">Cargando detalles…</p>
            )}

            {error && (
              <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {cancelled && (
              <div className="space-y-4 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto"
                  style={{ background: "var(--olive)", color: "white" }}
                >
                  ✓
                </div>
                <p className="font-medium text-[--ink]">Reserva cancelada</p>
                <p className="text-sm text-[--ink-soft]">
                  Tu reserva ha sido cancelada correctamente. La mesa ya está
                  disponible para otros clientes.
                </p>
                <a
                  href="/"
                  className="inline-block text-sm text-[--wine] hover:text-[--wine-dark] underline underline-offset-2 mt-2"
                >
                  Volver a la web
                </a>
              </div>
            )}

            {booking && !cancelled && (
              <div className="space-y-6">
                {booking.status === "cancelled" ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-[--ink-soft]">
                      Esta reserva ya fue cancelada anteriormente.
                    </p>
                    <a
                      href="/"
                      className="inline-block text-sm text-[--wine] hover:text-[--wine-dark] underline underline-offset-2"
                    >
                      Volver a la web
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <p className="text-sm text-[--ink-soft]">
                        Estás a punto de cancelar la siguiente reserva:
                      </p>
                      <div
                        className="rounded p-4 space-y-2"
                        style={{ background: "var(--paper-dark)" }}
                      >
                        <Row label="Nombre" value={booking.customer_name} />
                        <Row
                          label="Fecha"
                          value={format(
                            parseISO(booking.booking_date),
                            "EEEE, d 'de' MMMM 'de' yyyy",
                            { locale: es }
                          )}
                        />
                        <Row label="Hora" value={booking.booking_time.slice(0, 5)} />
                        <Row label="Personas" value={String(booking.party_size)} />
                        <Row
                          label="Zona"
                          value={booking.zone === "interior" ? "Interior" : "Terraza"}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="danger"
                        onClick={handleCancel}
                        disabled={cancelling}
                      >
                        {cancelling ? "Cancelando…" : "Sí, cancelar mi reserva"}
                      </Button>
                      <a
                        href="/"
                        className="text-sm text-center text-[--ink-soft] hover:text-[--ink] underline underline-offset-2"
                      >
                        No, mantener la reserva
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-[--ink-faint] w-20 shrink-0">{label}</span>
      <span className="text-[--ink] font-medium">{value}</span>
    </div>
  );
}
