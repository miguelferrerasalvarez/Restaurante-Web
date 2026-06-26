const REVIEWS = [
  {
    name: "María G.",
    date: "marzo 2024",
    rating: 5,
    text: "Una experiencia gastronómica de diez. Las croquetas, las mejores que he comido en mi vida. El cochinillo lacado es un espectáculo. Volveremos seguro.",
  },
  {
    name: "Carlos M.",
    date: "febrero 2024",
    rating: 5,
    text: "Ambiente precioso, trato exquisito y cocina que emocionó a toda la mesa. El tiramisú pone el broche perfecto. Muy recomendable para ocasiones especiales.",
  },
  {
    name: "Lucía & Tomás",
    date: "enero 2024",
    rating: 5,
    text: "Celebramos nuestro aniversario aquí y fue perfecto. El personal muy atento, la carta equilibrada. Nos sorprendió la terraza: íntima y con mucho encanto.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="text-sm"
          style={{ color: i < n ? "var(--brass)" : "var(--border)" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section
      id="resenas"
      className="py-24 px-6"
      style={{ background: "var(--paper-dark)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--brass]">
            Reseñas
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl text-[--ink]"
            style={{ fontWeight: 300 }}
          >
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex justify-center pt-2">
            <div className="w-16 h-px" style={{ background: "var(--brass)" }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="rounded p-6 space-y-4"
              style={{ background: "var(--paper)", border: "1px solid var(--border)" }}
            >
              <Stars n={r.rating} />
              <p className="text-[--ink-soft] leading-relaxed text-sm">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="pt-2 border-t border-[--border]">
                <p className="font-medium text-sm text-[--ink]">{r.name}</p>
                <p className="text-xs text-[--ink-faint] font-mono-alt">{r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
