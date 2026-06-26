import type { Metadata } from "next";
import { RESTAURANT_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Panel interno — ${RESTAURANT_CONFIG.name}`,
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen" style={{ background: "var(--paper)" }}>{children}</div>;
}
