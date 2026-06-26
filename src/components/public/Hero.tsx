import { RESTAURANT_CONFIG } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Fondo texturizado */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(114,47,55,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(107,124,90,0.06) 0%, transparent 50%),
            #faf7f2
          `,
        }}
      />
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--wine)" }} />

      {/* Contenido */}
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--brass]">
          Desde 1987 · {RESTAURANT_CONFIG.address.city}
        </p>

        <h1
          className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.9] text-[--ink]"
          style={{ fontWeight: 300 }}
        >
          {RESTAURANT_CONFIG.name}
        </h1>

        <p className="font-display italic text-xl sm:text-2xl text-[--wine-light]" style={{ fontWeight: 300 }}>
          {RESTAURANT_CONFIG.tagline}
        </p>

        <p className="text-[--ink-soft] max-w-xl mx-auto leading-relaxed text-base sm:text-lg">
          {RESTAURANT_CONFIG.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="#reservar"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded text-sm font-medium tracking-widest uppercase transition-colors hover:opacity-90"
            style={{ background: "var(--wine)", color: "var(--paper)" }}
          >
            Reservar mesa
          </a>
          <a
            href="#carta"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded text-sm font-medium tracking-widest uppercase transition-colors border"
            style={{
              borderColor: "var(--border)",
              color: "var(--ink-soft)",
            }}
          >
            Ver la carta
          </a>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[--ink-faint]">
        <div className="w-px h-12" style={{ background: "var(--border)" }} />
        <p className="font-mono-alt text-[10px] uppercase tracking-widest">Desliza</p>
      </div>
    </section>
  );
}
