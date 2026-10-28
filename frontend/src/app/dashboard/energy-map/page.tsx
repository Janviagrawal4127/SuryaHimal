"use client";

import React, { useState } from "react";

interface VillageItem {
  id: string;
  name: string;
  district: string;
  state: string;
  elevation: number;
  solarSv: number;
  hydroHp: number;
  tech: "Solar-First" | "Micro-Hydro" | "Hybrid";
  households: number;
  poverty: string;
  status: string;
}

const VILLAGES_DATA: VillageItem[] = [
  { id: "VIL001", name: "Munsiyari", district: "Pithoragarh", state: "Uttarakhand", elevation: 2350, solarSv: 3.42, hydroHp: 4.12, tech: "Solar-First", households: 240, poverty: "62%", status: "Off-Grid" },
  { id: "VIL002", name: "Milam", district: "Pithoragarh", state: "Uttarakhand", elevation: 3430, solarSv: 1.84, hydroHp: 8.92, tech: "Micro-Hydro", households: 76, poverty: "78%", status: "Critical Desert" },
  { id: "VIL003", name: "Gangotri", district: "Uttarkashi", state: "Uttarakhand", elevation: 3048, solarSv: 2.12, hydroHp: 11.45, tech: "Micro-Hydro", households: 124, poverty: "71%", status: "Critical Desert" },
  { id: "VIL004", name: "Harsil", district: "Uttarkashi", state: "Uttarakhand", elevation: 2620, solarSv: 3.15, hydroHp: 6.20, tech: "Hybrid", households: 168, poverty: "59%", status: "Off-Grid" },
  { id: "VIL005", name: "Chamoli Ghati", district: "Chamoli", state: "Uttarakhand", elevation: 2800, solarSv: 2.85, hydroHp: 3.84, tech: "Solar-First", households: 112, poverty: "66%", status: "Off-Grid" },
  { id: "VIL006", name: "Badrinath Valley", district: "Chamoli", state: "Uttarakhand", elevation: 3100, solarSv: 1.76, hydroHp: 4.20, tech: "Hybrid", households: 58, poverty: "82%", status: "Critical Desert" },
  { id: "VIL007", name: "Niti", district: "Chamoli", state: "Uttarakhand", elevation: 3600, solarSv: 1.45, hydroHp: 12.80, tech: "Micro-Hydro", households: 36, poverty: "89%", status: "Critical Desert" },
  { id: "VIL010", name: "Ralam", district: "Pithoragarh", state: "Uttarakhand", elevation: 3700, solarSv: 1.32, hydroHp: 15.20, tech: "Micro-Hydro", households: 48, poverty: "91%", status: "Critical Desert" },
  { id: "VIL011", name: "Sangla", district: "Kinnaur", state: "Himachal Pradesh", elevation: 2680, solarSv: 3.65, hydroHp: 5.80, tech: "Solar-First", households: 196, poverty: "55%", status: "Off-Grid" },
  { id: "VIL012", name: "Chitkul", district: "Kinnaur", state: "Himachal Pradesh", elevation: 3450, solarSv: 2.30, hydroHp: 9.40, tech: "Micro-Hydro", households: 82, poverty: "76%", status: "Off-Grid" },
  { id: "VIL016", name: "Kaza", district: "Lahaul-Spiti", state: "Himachal Pradesh", elevation: 3800, solarSv: 3.82, hydroHp: 2.10, tech: "Solar-First", households: 136, poverty: "88%", status: "Off-Grid" },
  { id: "VIL017", name: "Losar", district: "Lahaul-Spiti", state: "Himachal Pradesh", elevation: 4079, solarSv: 3.95, hydroHp: 1.80, tech: "Solar-First", households: 42, poverty: "95%", status: "Critical Desert" },
  { id: "VIL018", name: "Kibber", district: "Lahaul-Spiti", state: "Himachal Pradesh", elevation: 4205, solarSv: 4.10, hydroHp: 1.20, tech: "Solar-First", households: 24, poverty: "96%", status: "Critical Desert" },
  { id: "VIL025", name: "Padum (Zanskar)", district: "Kargil", state: "Ladakh", elevation: 3657, solarSv: 4.35, hydroHp: 3.40, tech: "Solar-First", households: 420, poverty: "65%", status: "Off-Grid" },
];

export default function CleanEnergyMapPage() {
  const [filterTech, setFilterTech] = useState<string>("All");
  const [searchDistrict, setSearchDistrict] = useState<string>("All");

  const filtered = VILLAGES_DATA.filter((v) => {
    const matchTech = filterTech === "All" || v.tech === filterTech;
    const matchDist = searchDistrict === "All" || v.district === searchDistrict;
    return matchTech && matchDist;
  });

  return (
    <div className="flex flex-col relative w-full h-full space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-xl">explore</span>
            <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
              Spatial Geospatial Intelligence
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
            Himalayan Clean Energy &amp; Microgrid Map
          </h2>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Site-specific Solar Viability ($S_v$) and Hydro Potential ($H_p$) indices across off-grid mountain belts (&gt;2,500m).
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          <select
            className="input-field rounded-xl px-3 py-1.5 text-xs text-on-surface bg-surface font-label"
            value={searchDistrict}
            onChange={(e) => setSearchDistrict(e.target.value)}
          >
            <option value="All">All Districts</option>
            <option value="Chamoli">Chamoli (Uttarakhand)</option>
            <option value="Pithoragarh">Pithoragarh (Uttarakhand)</option>
            <option value="Uttarkashi">Uttarkashi (Uttarakhand)</option>
            <option value="Kinnaur">Kinnaur (Himachal)</option>
            <option value="Lahaul-Spiti">Lahaul-Spiti (Himachal)</option>
            <option value="Kargil">Kargil / Zanskar (Ladakh)</option>
          </select>

          <div className="flex p-1 rounded-xl bg-surface-container/60 border border-outline-variant">
            {["All", "Solar-First", "Micro-Hydro", "Hybrid"].map((tech) => (
              <button
                key={tech}
                onClick={() => setFilterTech(tech)}
                className={`px-3 py-1 rounded-lg text-xs font-label font-semibold transition-all ${
                  filterTech === tech
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Geospatial Heatmap Spec Banner */}
      <div className="glass-card rounded-2xl p-6 border border-outline-variant relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <div>
            <h3 className="font-display text-base font-bold text-on-surface">
              High-Altitude Solar vs Hydro Dual Optimization Landscape
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5 font-mono">
              Leaflet GeoJSON &amp; Digital Elevation Model (SRTM 30m resolution)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-primary"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Solar-First (Sv ≥ 2.5)</span>
            <span className="flex items-center gap-1.5 text-secondary"><span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Micro-Hydro (Hp ≥ 5.0)</span>
            <span className="flex items-center gap-1.5 text-tertiary"><span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span> Hybrid Co-gen</span>
          </div>
        </div>

        {/* Visual Map Representation */}
        <div className="w-full h-48 bg-gradient-to-r from-surface-container via-surface to-surface-container-low rounded-xl border border-outline-variant/60 relative p-4 flex items-center justify-around overflow-hidden">
          {/* Elevation bands */}
          <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none"></div>
          
          <div className="z-10 text-center">
            <div className="text-xl font-display font-black text-secondary">Kinnaur &amp; Spiti</div>
            <div className="text-[11px] text-on-surface-variant font-mono">3,450m – 4,200m</div>
            <div className="mt-1 px-2.5 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">High Solar Insolation (4.2 kWh/m²)</div>
          </div>

          <div className="z-10 text-center">
            <div className="text-xl font-display font-black text-primary">Chamoli &amp; Uttarkashi</div>
            <div className="text-[11px] text-on-surface-variant font-mono">2,600m – 3,600m</div>
            <div className="mt-1 px-2.5 py-0.5 rounded bg-secondary/20 text-secondary text-[10px] font-bold">Fast Run-of-River (∇ &gt; 20m/km)</div>
          </div>

          <div className="z-10 text-center">
            <div className="text-xl font-display font-black text-tertiary">Darma &amp; Milam Valley</div>
            <div className="text-[11px] text-on-surface-variant font-mono">3,100m – 3,800m</div>
            <div className="mt-1 px-2.5 py-0.5 rounded bg-tertiary/20 text-tertiary text-[10px] font-bold">Hybrid Snowbound Co-gen</div>
          </div>
        </div>
      </div>

      {/* Village Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vil) => (
          <div
            key={vil.id}
            className="glass-card rounded-2xl p-5 border border-outline-variant hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-display text-base font-bold text-on-surface">{vil.name}</h4>
                  <div className="text-xs text-on-surface-variant">{vil.district}, {vil.state}</div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    vil.tech === "Solar-First"
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : vil.tech === "Micro-Hydro"
                      ? "bg-secondary/20 text-secondary border border-secondary/40"
                      : "bg-tertiary/20 text-tertiary border border-tertiary/40"
                  }`}
                >
                  {vil.tech}
                </span>
              </div>

              {/* Village Attributes */}
              <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-surface-container/50 border border-outline-variant/60 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-on-surface-variant">Altitude:</span>
                  <div className="font-bold text-on-surface">{vil.elevation}m</div>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant">Households:</span>
                  <div className="font-bold text-on-surface">{vil.households}</div>
                </div>
                <div>
                  <span className="text-[10px] text-primary">Solar (Sv):</span>
                  <div className="font-bold text-primary">{vil.solarSv}</div>
                </div>
                <div>
                  <span className="text-[10px] text-secondary">Hydro (Hp):</span>
                  <div className="font-bold text-secondary">{vil.hydroHp}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40 text-[11px] font-mono">
              <span className="text-on-surface-variant">Poverty: <strong className="text-error">{vil.poverty}</strong></span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${vil.status.includes("Critical") ? "bg-error/20 text-error" : "bg-primary/20 text-primary"}`}>
                {vil.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
