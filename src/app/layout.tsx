import type { Metadata } from "next";
import "./globals.css";
import { RESTAURANT_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `${RESTAURANT_CONFIG.name} — Reservas`,
  description: RESTAURANT_CONFIG.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
