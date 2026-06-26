export const RESTAURANT_CONFIG = {
  name: "Casa Bellver",
  tagline: "Cocina de raíz, alma mediterránea",
  description:
    "Desde 1987, en el corazón del barrio antiguo, ofrecemos una cocina que honra el recetario tradicional con producto de temporada y técnica contemporánea.",
  phone: "+34 912 345 678",
  email: "hola@casabellver.es",
  address: {
    street: "DIRECCIÓN PENDIENTE — sustituir antes de publicar",
    city: "Madrid",
    postalCode: "28001",
    country: "España",
  },
  googleMapsUrl: "https://maps.google.com/?q=PENDIENTE",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=PENDIENTE",
  openingHours: [
    { days: "Martes – Viernes", lunch: "13:00 – 16:00", dinner: "19:00 – 23:00" },
    { days: "Sábado – Domingo", lunch: "13:00 – 16:30", dinner: "19:00 – 23:30" },
    { days: "Lunes", lunch: "Cerrado", dinner: "Cerrado" },
  ],
  social: {
    instagram: "https://instagram.com/casabellver",
    facebook: "https://facebook.com/casabellver",
  },
} as const;

export const BOOKING_CONFIG = {
  maxCapacityPerSlot: {
    interior: 40,
    terraza: 40,
  },
  lunchSlots: ["13:00", "14:00", "15:00"] as const,
  dinnerSlots: ["19:00", "20:00", "21:00"] as const,
  slotGapMinutes: 120,
  timezone: "Europe/Madrid",
  reminderHoursBeforeBooking: 2,
  maxPartySize: 20,
  minPartySize: 1,
} as const;

export type Zone = "interior" | "terraza";
export type LunchSlot = (typeof BOOKING_CONFIG.lunchSlots)[number];
export type DinnerSlot = (typeof BOOKING_CONFIG.dinnerSlots)[number];
export type TimeSlot = LunchSlot | DinnerSlot;
export type Turn = "comida" | "cena";

export const ALL_SLOTS = [
  ...BOOKING_CONFIG.lunchSlots,
  ...BOOKING_CONFIG.dinnerSlots,
] as const;
