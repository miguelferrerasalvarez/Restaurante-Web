const MENU = {
  entrantes: [
    {
      name: "Croquetas de jamón ibérico",
      desc: "Bechamel larga, jamón de bellota D.O.P., pan rallado artesano",
      price: "12",
      tag: "Favorito",
    },
    {
      name: "Tartar de atún rojo",
      desc: "Atún de almadraba, aguacate, wasabi suave, alga nori",
      price: "18",
    },
    {
      name: "Pan con tomate y anchoas",
      desc: "Pan de masa madre, tomate de colgar, anchoa del Cantábrico",
      price: "9",
    },
    {
      name: "Ensalada de temporada",
      desc: "Lechugas de pequeño productor, vinagreta de jerez, flores comestibles",
      price: "11",
    },
  ],
  principales: [
    {
      name: "Cochinillo lacado al horno",
      desc: "Lechal de Segovia, piel crujiente, puré de manzana asada",
      price: "28",
      tag: "Plato estrella",
    },
    {
      name: "Lubina a la sal",
      desc: "Lubina salvaje, aceite de oliva virgen extra, patata panadera",
      price: "26",
    },
    {
      name: "Carrilleras estofadas",
      desc: "Mejilla de ternera, vino tinto de la casa, verduras de temporada",
      price: "22",
    },
    {
      name: "Paella de mariscos",
      desc: "Arroz D.O. Valencia, gambas, almejas, calamar, caldo casero",
      price: "24",
    },
    {
      name: "Risotto de setas y trufa",
      desc: "Arroz Carnaroli, setas silvestres, parmesano, aceite de trufa negra",
      price: "20",
      tag: "Vegetariano",
    },
  ],
  postres: [
    {
      name: "Tarta de queso al horno",
      desc: "Queso idiazábal, galleta de mantequilla, coulis de frutos rojos",
      price: "8",
      tag: "Favorito",
    },
    {
      name: "Tiramisú de la casa",
      desc: "Mascarpone, café de filtro, bizcocho savoiardo, cacao puro",
      price: "7",
    },
    {
      name: "Helados artesanos",
      desc: "Tres sabores de temporada — pregunta al personal",
      price: "6",
    },
  ],
};

function MenuItem({
  name,
  desc,
  price,
  tag,
}: {
  name: string;
  desc: string;
  price: string;
  tag?: string;
}) {
  return (
    <div className="flex gap-4 py-5 border-b border-[--border] last:border-b-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h4 className="font-display text-lg leading-tight text-[--ink]" style={{ fontWeight: 400 }}>
            {name}
          </h4>
          {tag && (
            <span className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-mono-alt"
              style={{ background: "var(--brass)", color: "var(--ink)" }}>
              {tag}
            </span>
          )}
        </div>
        <p className="text-sm text-[--ink-soft] mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="shrink-0 font-mono-alt text-sm font-bold text-[--wine] mt-1">
        {price}€
      </div>
    </div>
  );
}

export function Menu() {
  return (
    <section id="carta" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Cabecera */}
        <div className="text-center mb-16 space-y-3">
          <p className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--brass]">
            La carta
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-[--ink]" style={{ fontWeight: 300 }}>
            De la tierra al plato
          </h2>
          <p className="text-[--ink-soft] max-w-md mx-auto">
            Producto de temporada, recetas de siempre y una cocina que evoluciona sin olvidar sus raíces.
          </p>
          <div className="flex justify-center pt-2">
            <div className="w-16 h-px" style={{ background: "var(--brass)" }} />
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--olive] mb-2">
              — Entrantes
            </h3>
            {MENU.entrantes.map((item) => (
              <MenuItem key={item.name} {...item} />
            ))}
          </div>
          <div>
            <h3 className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--olive] mb-2">
              — Principales
            </h3>
            {MENU.principales.map((item) => (
              <MenuItem key={item.name} {...item} />
            ))}
          </div>
          <div>
            <h3 className="font-mono-alt text-xs uppercase tracking-[0.35em] text-[--olive] mb-2">
              — Postres
            </h3>
            {MENU.postres.map((item) => (
              <MenuItem key={item.name} {...item} />
            ))}
          </div>
        </div>

        <p className="text-xs text-[--ink-faint] text-center mt-8">
          Alérgenos disponibles bajo petición · Carta sujeta a disponibilidad de temporada
        </p>
      </div>
    </section>
  );
}
