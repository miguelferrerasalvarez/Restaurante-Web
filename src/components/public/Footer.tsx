import { RESTAURANT_CONFIG } from "@/lib/config";

export function Footer() {
  return (
    <footer
      className="py-12 px-6 text-center"
      style={{
        background: "var(--ink)",
        borderTop: "4px solid var(--wine)",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <p
          className="font-display text-2xl"
          style={{ fontWeight: 300, color: "var(--brass)" }}
        >
          {RESTAURANT_CONFIG.name}
        </p>
        <p className="text-sm" style={{ color: "rgba(250,247,242,0.5)" }}>
          {RESTAURANT_CONFIG.address.street} · {RESTAURANT_CONFIG.address.city}
        </p>
        <div className="flex justify-center gap-6">
          <a
            href={RESTAURANT_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest hover:text-[--brass] transition-colors font-mono-alt"
            style={{ color: "rgba(250,247,242,0.5)" }}
          >
            Instagram
          </a>
          <a
            href={RESTAURANT_CONFIG.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-widest hover:text-[--brass] transition-colors font-mono-alt"
            style={{ color: "rgba(250,247,242,0.5)" }}
          >
            Facebook
          </a>
        </div>
        <p className="text-xs" style={{ color: "rgba(250,247,242,0.3)" }}>
          © {new Date().getFullYear()} {RESTAURANT_CONFIG.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
