"use client";
import { cn } from "@/lib/utils";
import type { Zone } from "@/lib/config";

const tables = {
  interior: [
    { id: "i1", x: 60, y: 60, seats: 4 }, { id: "i2", x: 140, y: 60, seats: 4 },
    { id: "i3", x: 220, y: 60, seats: 2 }, { id: "i4", x: 60, y: 140, seats: 6 },
    { id: "i5", x: 150, y: 140, seats: 4 }, { id: "i6", x: 230, y: 140, seats: 4 },
    { id: "i7", x: 90, y: 220, seats: 2 }, { id: "i8", x: 190, y: 220, seats: 2 },
  ],
  terraza: [
    { id: "t1", x: 60, y: 60, seats: 4 }, { id: "t2", x: 150, y: 60, seats: 4 },
    { id: "t3", x: 60, y: 140, seats: 2 }, { id: "t4", x: 150, y: 140, seats: 4 },
    { id: "t5", x: 105, y: 210, seats: 2 },
  ],
};

function Table({ x, y, seats, active }: { x: number; y: number; seats: number; active: boolean }) {
  const w = seats <= 2 ? 34 : seats <= 4 ? 44 : 54;
  const h = 28;
  const chairCount = seats <= 2 ? 2 : seats <= 4 ? 4 : 6;
  const cols = seats <= 2 ? 1 : 2;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect width={w} height={h} rx={3}
        fill={active ? "#c9a84c" : "#f0ebe0"}
        stroke={active ? "#722f37" : "#e8e0d0"}
        strokeWidth={1.5} />
      {Array.from({ length: chairCount }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        return <circle key={i} cx={(col + 0.5) * (w / cols)} cy={row === 0 ? -7 : h + 7} r={4}
          fill={active ? "#722f37" : "#e8e0d0"} />;
      })}
      <text x={w / 2} y={h / 2 + 4} textAnchor="middle" fontSize={9}
        fill={active ? "#4d1f25" : "#9e9085"} fontFamily="Space Mono, monospace">{seats}p</text>
    </g>
  );
}

export function RestaurantMap({ selectedZone, onSelectZone }: { selectedZone: Zone | null; onSelectZone: (z: Zone) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[--ink-soft]">Selecciona la zona</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["interior", "terraza"] as Zone[]).map((zone) => (
          <button key={zone} type="button" onClick={() => onSelectZone(zone)}
            className={cn(
              "rounded border-2 p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--wine]",
              selectedZone === zone ? "border-[--wine] bg-[--wine]/5" : "border-[--border] hover:border-[--wine-light]"
            )}>
            <div className="text-xs font-medium uppercase tracking-widest mb-2 text-[--ink-soft] font-mono-alt">
              {zone === "interior" ? "Interior" : "Terraza"}
            </div>
            {zone === "interior" ? (
              <svg viewBox="0 0 300 280" className="w-full" style={{ maxHeight: 200 }}>
                <rect x={10} y={10} width={280} height={260} rx={4} fill="#f0ebe0" stroke="#e8e0d0" strokeWidth={1.5} />
                <rect x={20} y={20} width={260} height={18} rx={2} fill="#c9a84c" opacity={0.3} />
                <text x={150} y={32} textAnchor="middle" fontSize={8} fill="#9e9085" fontFamily="Space Mono, monospace">BARRA</text>
                {tables.interior.map((t) => <Table key={t.id} {...t} active={selectedZone === zone} />)}
              </svg>
            ) : (
              <svg viewBox="0 0 220 260" className="w-full" style={{ maxHeight: 200 }}>
                <rect x={10} y={10} width={200} height={240} rx={4} fill="#e8e0d0" stroke="#c9a84c" strokeWidth={1.5} strokeDasharray="6 3" />
                <rect x={20} y={18} width={180} height={12} rx={2} fill="#6b7c5a" opacity={0.4} />
                <text x={110} y={28} textAnchor="middle" fontSize={8} fill="#9e9085" fontFamily="Space Mono, monospace">TOLDO</text>
                <circle cx={25} cy={80} r={8} fill="#8a9e74" opacity={0.5} />
                <circle cx={195} cy={80} r={8} fill="#8a9e74" opacity={0.5} />
                <circle cx={25} cy={180} r={8} fill="#8a9e74" opacity={0.5} />
                <circle cx={195} cy={180} r={8} fill="#8a9e74" opacity={0.5} />
                {tables.terraza.map((t) => <Table key={t.id} {...t} active={selectedZone === zone} />)}
              </svg>
            )}
            <div className="mt-2 flex items-center gap-1.5">
              <span className={cn("inline-block w-2.5 h-2.5 rounded-full", selectedZone === zone ? "bg-[--wine]" : "bg-[--border]")} />
              <span className="text-xs text-[--ink-soft]">Aforo: 40 personas</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
