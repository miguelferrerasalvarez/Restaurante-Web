import { BOOKING_CONFIG, type Zone } from "./config";

export type SlotAvailability = {
  time: string;
  turn: "comida" | "cena";
  availableSeats: number;
  isAvailable: boolean;
};

export function computeAvailability(
  occupancyMap: Record<string, number>,
  zone: Zone,
  partySize: number
): SlotAvailability[] {
  const maxCapacity = BOOKING_CONFIG.maxCapacityPerSlot[zone];

  const allSlots = [
    ...BOOKING_CONFIG.lunchSlots.map((t) => ({ time: t, turn: "comida" as const })),
    ...BOOKING_CONFIG.dinnerSlots.map((t) => ({ time: t, turn: "cena" as const })),
  ];

  return allSlots.map(({ time, turn }) => {
    const adjacent = getAdjacentSlots(time, turn);
    const blocked = [time, ...adjacent].reduce(
      (sum, t) => sum + (occupancyMap[t] ?? 0),
      0
    );
    const availableSeats = Math.max(0, maxCapacity - blocked);
    return { time, turn, availableSeats, isAvailable: availableSeats >= partySize };
  });
}

function getAdjacentSlots(time: string, turn: "comida" | "cena"): string[] {
  const slots =
    turn === "comida"
      ? [...BOOKING_CONFIG.lunchSlots]
      : [...BOOKING_CONFIG.dinnerSlots];
  const idx = slots.indexOf(time as never);
  const adj: string[] = [];
  if (idx > 0) adj.push(slots[idx - 1]);
  if (idx < slots.length - 1) adj.push(slots[idx + 1]);
  return adj;
}

export function toOccupancyMap(
  rows: { booking_time: string; occupied_seats: number }[]
): Record<string, number> {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const time = row.booking_time.slice(0, 5);
    acc[time] = (acc[time] ?? 0) + row.occupied_seats;
    return acc;
  }, {});
}
