import { z } from "zod";
import { BOOKING_CONFIG } from "./config";

const PHONE_REGEX = /^(\+34|0034|34)?[\s\-]?[6789]\d{2}[\s\-]?\d{3}[\s\-]?\d{3}$/;

export const bookingSchema = z.object({
  customerName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  customerEmail: z
    .string()
    .email("El email no tiene un formato válido")
    .optional()
    .or(z.literal("")),
  customerPhone: z
    .string()
    .regex(PHONE_REGEX, "El teléfono no tiene un formato válido (ej: 612 345 678)")
    .optional()
    .or(z.literal("")),
  partySize: z
    .number({ error: "Indica el número de personas" })
    .int()
    .min(BOOKING_CONFIG.minPartySize, `Mínimo ${BOOKING_CONFIG.minPartySize} persona`)
    .max(BOOKING_CONFIG.maxPartySize, `Máximo ${BOOKING_CONFIG.maxPartySize} personas`),
  bookingDate: z
    .string()
    .min(1, "Selecciona una fecha")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "La fecha debe ser hoy o posterior"),
  bookingTime: z.string().min(1, "Selecciona una franja horaria"),
  zone: z.enum(["interior", "terraza"] as const, {
    error: "Selecciona una zona",
  }),
  notes: z.string().max(500, "Las notas no pueden superar 500 caracteres").optional(),
  website: z.string().max(0, "").optional(),
}).refine(
  (data) => data.customerEmail || data.customerPhone,
  {
    message: "Introduce al menos un email o un teléfono de contacto",
    path: ["customerEmail"],
  }
);

export type BookingFormData = z.infer<typeof bookingSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
