import { RESTAURANT_CONFIG } from "@/lib/config";

export function About() {
  return (
    <section
      id="historia"
      className="py-24 px-6"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <div className="space-y-6">
            <p className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--brass]">
              Nuestra historia
            </p>
            <h2
              className="font-display text-4xl sm:text-5xl leading-tight"
              style={{ fontWeight: 300, color: "var(--paper)" }}
            >
              Cuatro décadas
              <br />
              <em>de cocina honesta</em>
            </h2>
            <div className="space-y-4 text-[--paper] opacity-80 leading-relaxed">
              <p>
                {RESTAURANT_CONFIG.name} nació en 1987 de las manos de la familia Bellver,
                cuando Amalia y Jordi abrieron las puertas de lo que entonces era
                una pequeña taberna de barrio. Su filosofía era sencilla: producto
                fresco, recetas de la abuela y trato personal.
              </p>
              <p>
                Hoy, casi cuarenta años después, la segunda generación mantiene viva
                esa misma filosofía, incorporando técnicas contemporáneas sin perder
                el alma de la cocina mediterránea que nos vio nacer.
              </p>
              <p>
                Cada plato que sale de nuestra cocina lleva consigo décadas de
                aprendizaje, respeto por el productor local y la convicción de que
                la buena comida es el mejor motivo para reunirse.
              </p>
            </div>
          </div>

          {/* Citas / datos */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { num: "1987", label: "Año de fundación" },
              { num: "2ª", label: "Generación al frente" },
              { num: "100%", label: "Producto de temporada" },
              { num: "0 km", label: "Proveedores locales" },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="rounded p-6 text-center"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <p
                  className="font-display text-4xl"
                  style={{ fontWeight: 300, color: "var(--brass)" }}
                >
                  {num}
                </p>
                <p className="text-sm mt-1 opacity-60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
