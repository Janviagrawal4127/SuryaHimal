"use client";

import React from "react";

interface RecommendationItem {
  id: string;
  phase: string;
  actionItem: string;
  description: string;
  capexLakh: number;
  households: number;
  timeframe: string;
  sdgTarget: string;
  roi: "High" | "Medium";
  leadAgency: string;
}

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "REC-001",
    phase: "Phase 1 (0–12 Mo)",
    actionItem: "Emergency Solar-First Deployment in 64 Critical Energy Deserts",
    description: "Install 2030-calibrated solar photovoltaic microgrids with LiFePO4 battery banks in Chamoli and Pithoragarh unelectrified villages. Size battery storage for 0.65 kWh/household/day to prevent burnout.",
    capexLakh: 520,
    households: 5128,
    timeframe: "12 Months",
    sdgTarget: "SDG 7.1",
    roi: "High",
    leadAgency: "UREDA / HIMURJA (State REDAs)",
  },
  {
    id: "REC-002",
    phase: "Phase 2 (12–18 Mo)",
    actionItem: "Run-of-River Micro-Hydro Installations (10–50 kW)",
    description: "Construct 45 low-head run-of-river micro-hydro turbines at sites with perennial stream access within 300m and hydraulic gradient >15m/km in Gangotri and Darma catchments.",
    capexLakh: 350,
    households: 2450,
    timeframe: "18 Months",
    sdgTarget: "SDG 7.2",
    roi: "High",
    leadAgency: "Central Electricity Authority (CEA)",
  },
  {
    id: "REC-003",
    phase: "Phase 3 (18–24 Mo)",
    actionItem: "Hybrid Solar-Hydro Co-Generation in High Snowbound Passes",
    description: "Deploy hybrid microgrids with intelligent load-dispatch controllers in high passes (Milam, Spiti, Zanskar) where winter panel snow-cover coincides with stream freezing.",
    capexLakh: 260,
    households: 1820,
    timeframe: "24 Months",
    sdgTarget: "SDG 7.1, SDG 13.2",
    roi: "High",
    leadAgency: "Ministry of New & Renewable Energy (MNRE)",
  },
  {
    id: "REC-004",
    phase: "Ongoing (0–24 Mo)",
    actionItem: "Health Clinic Cold-Chain & School Electrification Linkage",
    description: "Priority microgrid feeder lines direct to 28 high-altitude Primary Health Centers (PHCs) for vaccine refrigeration and 42 mountain schools for digital education platforms.",
    capexLakh: 170,
    households: 0,
    timeframe: "Ongoing",
    sdgTarget: "SDG 1.4, SDG 3",
    roi: "High",
    leadAgency: "District Rural Development Authority (DRDA)",
  },
];

export default function RecommendationsPage() {
  const totalCapex = RECOMMENDATIONS.reduce((a, b) => a + b.capexLakh, 0);
  const totalHH = RECOMMENDATIONS.reduce((a, b) => a + b.households, 0);

  return (
    <div className="flex flex-col relative w-full h-full space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-tertiary text-xl">account_balance_wallet</span>
            <span className="font-label text-xs uppercase tracking-widest text-tertiary font-bold">
              Multi-Criteria Cost-Benefit Optimization
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
            Targeted Phased CapEx &amp; Microgrid Rollout Plan
          </h2>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Constructing a ₹11.3 Crore, 3-phase rollout covering 5,128 households across 64 critical villages within 24 months.
          </p>
        </div>

        <button className="glow-button px-4 py-2 rounded-xl text-xs font-label font-bold text-on-primary flex items-center gap-2 self-start">
          <span className="material-symbols-outlined text-sm">print</span>
          <span>Export Bankable DPR</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-outline-variant">
          <div className="text-xs font-label text-on-surface-variant mb-1">Total Rollout Budget</div>
          <div className="font-display text-3xl font-black text-primary">₹{(totalCapex / 100).toFixed(1)} Crore</div>
          <div className="text-[11px] font-mono text-tertiary mt-1">₹{totalCapex} Lakh across 3 Phases</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-outline-variant">
          <div className="text-xs font-label text-on-surface-variant mb-1">Total Target Households</div>
          <div className="font-display text-3xl font-black text-secondary">{totalHH.toLocaleString()} Families</div>
          <div className="text-[11px] font-mono text-secondary mt-1">Accelerating SDG 7.1 Compliance</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-outline-variant">
          <div className="text-xs font-label text-on-surface-variant mb-1">Delivery Timeframe</div>
          <div className="font-display text-3xl font-black text-tertiary">24 Months</div>
          <div className="text-[11px] font-mono text-tertiary mt-1">Ahead of 2030 Global Deadline</div>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {RECOMMENDATIONS.map((rec) => (
          <div
            key={rec.id}
            className="glass-card rounded-2xl p-6 border border-outline-variant hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary text-xs font-mono font-bold">
                  {rec.phase}
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary text-[11px] font-mono font-semibold">
                  {rec.sdgTarget}
                </span>
                <span className="px-2 py-0.5 rounded bg-tertiary/15 text-tertiary text-[11px] font-mono font-bold">
                  ROI: {rec.roi}
                </span>
              </div>

              <h3 className="font-display text-base font-bold text-on-surface">
                {rec.actionItem}
              </h3>

              <p className="text-xs text-on-surface-variant leading-relaxed max-w-3xl">
                {rec.description}
              </p>

              <div className="text-[11px] font-mono text-outline-variant text-on-surface-variant/70">
                Lead Implementing Agency: <span className="text-primary font-bold">{rec.leadAgency}</span>
              </div>
            </div>

            {/* Financial and Impact Numbers */}
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-outline-variant/40 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
              <div>
                <div className="text-[10px] text-on-surface-variant uppercase font-mono">Estimated CapEx</div>
                <div className="text-2xl font-display font-black text-primary">₹{rec.capexLakh} Lakh</div>
              </div>
              <div className="text-right mt-2">
                <div className="text-[10px] text-on-surface-variant uppercase font-mono">Beneficiaries</div>
                <div className="text-sm font-mono font-bold text-secondary">
                  {rec.households > 0 ? `${rec.households.toLocaleString()} HHs` : "Institutional"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
