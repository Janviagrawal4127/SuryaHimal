"use client";

import React, { useState } from "react";

interface InsightCard {
  id: string;
  type: "risk" | "opportunity";
  category: "Energy Desert" | "Quick-Win Corridor" | "Infrastructure Risk" | "Climate Impact" | "Technology Selection";
  title: string;
  description: string;
  metricImpact: string;
  confidence: "High" | "Medium";
  district: string;
}

const INSIGHTS_DATA: InsightCard[] = [
  {
    id: "INS-001",
    type: "risk",
    category: "Energy Desert",
    title: "Critical Energy Desert: Chamoli & Pithoragarh Belts",
    description: "64 high-altitude villages above 3,000m altitude have 0% electrical grid access and >75% poverty rates. Families burn biomass and kerosene for light and warmth in sub-zero winter temperatures.",
    metricImpact: "SDG 7.1 Universal Access",
    confidence: "High",
    district: "Chamoli & Pithoragarh",
  },
  {
    id: "INS-002",
    type: "opportunity",
    category: "Quick-Win Corridor",
    title: "412 Villages Ready for Immediate Solar-First Deployment",
    description: "Ridge-top villages across Kinnaur and Lahaul-Spiti maintain Solar Viability Index Sv ≥ 2.5 kWh/m²/day even after slope and cloud corrections. Phase 1 deployment can electrify 2,060 households within 12 months.",
    metricImpact: "2,060 Households Electrified",
    confidence: "High",
    district: "Kinnaur & Lahaul-Spiti",
  },
  {
    id: "INS-003",
    type: "opportunity",
    category: "Quick-Win Corridor",
    title: "278 Villages Situated within 300m of Perennial Run-of-River Streams",
    description: "Fast-flowing mountain streams in Gangotri and Darma valleys offer Hydro Potential Index Hp ≥ 5.0 with hydraulic slope >15m/km, providing 24/7 baseload power immune to seasonal snow cover.",
    metricImpact: "1,390 Households Electrified",
    confidence: "High",
    district: "Uttarkashi & Pithoragarh",
  },
  {
    id: "INS-004",
    type: "risk",
    category: "Infrastructure Risk",
    title: "Battery Burnout Trajectory in 2024 Blanket Solar Installations",
    description: "Ordinary Least Squares demand forecasting projects per-household load expansion from 0.31 to 0.65 kWh/day by 2030 (+85%). Blanket solar microgrids sized only for lighting will suffer inverter and battery failure within 2-3 years.",
    metricImpact: "Battery Sizing Calibration",
    confidence: "High",
    district: "All Himalayan Districts",
  },
  {
    id: "INS-005",
    type: "opportunity",
    category: "Climate Impact",
    title: "₹28 Crore/yr Diesel Generator Expenditure Displacement",
    description: "High-altitude health centers, army border transit posts, and mountain schools consume ₹28 Crore annually in carbon-heavy diesel fuel. Renewable microgrids eliminate 14,200 metric tons of localized black carbon emissions in fragile glacial zones.",
    metricImpact: "SDG 13.2 Climate Policy Integration",
    confidence: "High",
    district: "High-Altitude Passes",
  },
  {
    id: "INS-006",
    type: "opportunity",
    category: "Technology Selection",
    title: "Dual Hydro-Solar Optimization Eliminates Winter Abandonment",
    description: "157 high-altitude settlements experience winter solar drops below 3.5 hrs/day accompanied by stream freezing. Hybrid microgrid co-generation with intelligent load-dispatch prevents total winter abandonment.",
    metricImpact: "100% Year-Round Power Reliability",
    confidence: "High",
    district: "Milam, Niti, & Zanskar",
  },
];

export default function InsightsPage() {
  const [filterType, setFilterType] = useState<string>("All");

  const filtered = INSIGHTS_DATA.filter((i) => {
    if (filterType === "All") return true;
    if (filterType === "Deserts") return i.category === "Energy Desert";
    if (filterType === "Quick-Wins") return i.category === "Quick-Win Corridor";
    if (filterType === "Risks") return i.type === "risk";
    return true;
  });

  return (
    <div className="flex flex-col relative w-full h-full space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-xl">lightbulb</span>
            <span className="font-label text-xs uppercase tracking-widest text-tertiary font-bold">
              Spatial Rule Matching
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
            Energy Deserts &amp; Quick-Win Corridors
          </h2>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Heuristic spatial pattern matching on GIS attributes identifying unelectrified clusters and optimal renewable corridors.
          </p>
        </div>

        {/* Filters */}
        <div className="flex p-1 rounded-xl bg-surface-container/60 border border-outline-variant self-start">
          {["All", "Deserts", "Quick-Wins", "Risks"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1 rounded-lg text-xs font-label font-semibold transition-all ${
                filterType === f
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`glass-card rounded-2xl p-6 border transition-all flex flex-col justify-between ${
              item.type === "risk"
                ? "border-error/40 hover:border-error"
                : "border-primary/40 hover:border-primary"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    item.type === "risk"
                      ? "bg-error/20 text-error border border-error/40"
                      : "bg-primary/20 text-primary border border-primary/40"
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-tertiary">
                  Confidence: {item.confidence}
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-on-surface mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono">
              <span className="text-on-surface-variant">
                Target: <strong className="text-primary">{item.district}</strong>
              </span>
              <span className="text-secondary font-bold">
                Impact → {item.metricImpact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
