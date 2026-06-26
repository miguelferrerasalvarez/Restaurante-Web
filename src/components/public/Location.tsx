import { RESTAURANT_CONFIG } from "@/lib/config";

export function Location() {
  return (
    <section id="ubicacion" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--brass]">
            Encuéntranos
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl text-[--ink]"
            style={{ fontWeight: 300 }}
          >
            Dónde estamos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-mono-alt text-xs uppercase tracking-widest text-[--olive] mb-3">
                Dirección
              </h3>
              <p className="text-[--ink] leading-relaxed">
                {RESTAURANT_CONFIG.address.street}
                <br />
                {RESTAURANT_CONFIG.address.postalCode} {RESTAURANT_CONFIG.address.city}
                <br />
                {RESTAURANT_CONFIG.address.country}
              </p>
              <a
                href={RESTAURANT_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-[--wine] hover:text-[--wine-dark] underline underline-offset-2"
              >
                Ver en Google Maps →
              </a>
            </div>

            <div>
              <h3 className="font-mono-alt text-xs uppercase tracking-widest text-[--olive] mb-3">
                Horarios
              </h3>
              <div className="space-y-2">
                {RESTAURANT_CONFIG.openingHours.map((h) => (
                  <div key={h.days} className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-[--ink-soft]">{h.days}</span>
                    <span className="text-[--ink]">
                      {h.lunch !== "Cerrado"
                        ? `${h.lunch} / ${h.dinner}`
                        : "Cerrado"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono-alt text-xs uppercase tracking-widest text-[--olive] mb-3">
                Contacto
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-[--ink-soft]">Teléfono: </span>
                  <a
                    href={`tel:${RESTAURANT_CONFIG.phone}`}
                    className="text-[--ink] hover:text-[--wine]"
                  >
                    {RESTAURANT_CONFIG.phone}
                  </a>
                </p>
                <p>
                  <span className="text-[--ink-soft]">Email: </span>
                  <a
                    href={`mailto:${RESTAURANT_CONFIG.email}`}
                    className="text-[--ink] hover:text-[--wine]"
                  >
                    {RESTAURANT_CONFIG.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Mapa embed */}
          <div
            className="rounded overflow-hidden"
            style={{ border: "1px solid var(--border)", aspectRatio: "4/3" }}
          >
            {RESTAURANT_CONFIG.googleMapsEmbed.includes("PENDIENTE") ? (
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3 text-center p-8"
                style={{ background: "var(--paper-dark)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: "var(--border)" }}
                >
                  📍
                </div>
                <p className="text-sm text-[--ink-soft]">
                  El mapa estará disponible una vez que configures la dirección en{" "}
                  <code className="font-mono-alt text-xs bg-[--border] px-1 py-0.5 rounded">
                    src/lib/config.ts
                  </code>
                </p>
              </div>
            ) : (
              <iframe
                src={RESTAURANT_CONFIG.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del restaurante"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
