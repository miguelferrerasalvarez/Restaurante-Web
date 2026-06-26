import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { RESTAURANT_CONFIG } from "@/lib/config";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen" style={{ background: "#f8f6f2" }}>
      {/* Barra superior */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{
          background: "var(--wine)",
          borderBottom: "1px solid var(--wine-dark)",
        }}
      >
        <div>
          <p className="font-display text-lg text-white" style={{ fontWeight: 300 }}>
            {RESTAURANT_CONFIG.name}
          </p>
          <p className="text-xs text-white/50 font-mono-alt uppercase tracking-widest">
            Panel de reservas
          </p>
        </div>
        <LogoutButton />
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <AdminDashboardClient />
      </main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="text-xs text-white/60 hover:text-white font-mono-alt uppercase tracking-widest transition-colors"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
