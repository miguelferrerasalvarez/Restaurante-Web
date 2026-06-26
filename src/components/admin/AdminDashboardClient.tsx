"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { es } from "date-fns/locale";
import type { Booking } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BookingModal } from "./BookingModal";
import { ToastContainer, useToast } from "@/components/ui/toast";

type ViewMode = "day" | "week";

export function AdminDashboardClient() {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = viewMode === "day"
        ? `date=${selectedDate}`
        : `week=${format(startOfWeek(new Date(selectedDate), { weekStartsOn: 1 }), "yyyy-MM-dd")}`;
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      addToast("Error al cargar reservas", "error");
    } finally {
      setLoading(false);
    }
  }, [viewMode, selectedDate]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function handleCancel(booking: Booking) {
    if (!confirm(`¿Cancelar la reserva de ${booking.customer_name}?`)) return;
    const res = await fetch(`/api/admin/bookings/${booking.id}`, { method: "DELETE" });
    if (res.ok) {
      addToast("Reserva cancelada", "success");
      fetchBookings();
    } else {
      addToast("Error al cancelar", "error");
    }
  }

  function handleEdit(booking: Booking) {
    setEditingBooking(booking);
    setShowModal(true);
  }

  function handleNew() {
    setEditingBooking(null);
    setShowModal(true);
  }

  async function handleModalSuccess() {
    setShowModal(false);
    await fetchBookings();
    addToast(editingBooking ? "Reserva actualizada" : "Reserva creada", "success");
  }

  const confirmed = bookings.filter((b) => b.status !== "cancelled");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Vista día/semana */}
          <div
            className="flex rounded overflow-hidden border"
            style={{ borderColor: "var(--border)" }}
          >
            {(["day", "week"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-4 py-2 text-sm transition-colors",
                  viewMode === mode
                    ? "bg-[--wine] text-white"
                    : "bg-white text-[--ink-soft] hover:bg-[--paper-dark]"
                )}
              >
                {mode === "day" ? "Día" : "Semana"}
              </button>
            ))}
          </div>

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm py-2"
          />
        </div>

        <Button onClick={handleNew} size="sm">
          + Nueva reserva
        </Button>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: confirmed.length, color: "var(--wine)" },
          {
            label: "Interior",
            value: confirmed.filter((b) => b.zone === "interior").length,
            color: "var(--olive)",
          },
          {
            label: "Terraza",
            value: confirmed.filter((b) => b.zone === "terraza").length,
            color: "var(--brass)",
          },
          {
            label: "Comensales",
            value: confirmed.reduce((s, b) => s + b.party_size, 0),
            color: "var(--ink)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded p-4 text-center"
            style={{ background: "white", border: "1px solid var(--border)" }}
          >
            <p
              className="font-display text-3xl"
              style={{ color: s.color, fontWeight: 300 }}
            >
              {s.value}
            </p>
            <p className="text-xs text-[--ink-faint] font-mono-alt uppercase tracking-widest mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabla de reservas */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded bg-white border border-[--border] animate-pulse" />
          ))}
        </div>
      ) : confirmed.length === 0 ? (
        <div
          className="rounded py-16 text-center"
          style={{ background: "white", border: "1px solid var(--border)" }}
        >
          <p className="text-[--ink-faint]">No hay reservas para este período</p>
        </div>
      ) : (
        <div
          className="rounded overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <table className="w-full text-sm bg-white">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)", background: "var(--paper-dark)" }}>
                {["Hora", "Nombre", "Personas", "Zona", "Fecha", "Estado", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-[--ink-faint] font-mono-alt"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confirmed.map((booking, idx) => (
                <tr
                  key={booking.id}
                  className="transition-colors hover:bg-[--paper-dark]"
                  style={{
                    borderBottom: idx < confirmed.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <td className="px-4 py-3 font-mono-alt font-bold text-[--wine]">
                    {booking.booking_time.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3 font-medium text-[--ink]">
                    {booking.customer_name}
                    {booking.notes && (
                      <span className="ml-2 text-[10px] text-[--ink-faint]" title={booking.notes}>
                        📝
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[--ink-soft]">{booking.party_size} pax</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-mono-alt"
                      style={{
                        background: booking.zone === "interior" ? "var(--wine)" : "var(--olive)",
                        color: "white",
                      }}
                    >
                      {booking.zone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[--ink-soft] text-xs">
                    {format(new Date(booking.booking_date + "T00:00:00"), "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background:
                          booking.status === "confirmed"
                            ? "#dcfce7"
                            : booking.status === "reminder_sent"
                            ? "#fef9c3"
                            : "#fee2e2",
                        color:
                          booking.status === "confirmed"
                            ? "#166534"
                            : booking.status === "reminder_sent"
                            ? "#854d0e"
                            : "#991b1b",
                      }}
                    >
                      {booking.status === "confirmed"
                        ? "Confirmada"
                        : booking.status === "reminder_sent"
                        ? "Recordatorio enviado"
                        : "Cancelada"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(booking)}
                        className="text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancel(booking)}
                        className="text-xs"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cancelled.length > 0 && (
        <details className="mt-6">
          <summary className="text-xs text-[--ink-faint] cursor-pointer hover:text-[--ink] font-mono-alt uppercase tracking-widest">
            Ver {cancelled.length} canceladas
          </summary>
          <div className="mt-2 rounded overflow-hidden border border-[--border]">
            <table className="w-full text-sm bg-white opacity-60">
              <tbody>
                {cancelled.map((b) => (
                  <tr key={b.id} className="border-b border-[--border] last:border-b-0">
                    <td className="px-4 py-2 font-mono-alt text-[--ink-faint]">
                      {b.booking_time.slice(0, 5)}
                    </td>
                    <td className="px-4 py-2 text-[--ink-soft] line-through">
                      {b.customer_name}
                    </td>
                    <td className="px-4 py-2 text-[--ink-faint] text-xs">{b.party_size} pax</td>
                    <td className="px-4 py-2 text-xs text-[--ink-faint]">{b.zone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {/* Modal */}
      {showModal && (
        <BookingModal
          booking={editingBooking}
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
}
