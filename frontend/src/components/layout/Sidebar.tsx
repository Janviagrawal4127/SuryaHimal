"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  icon: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    name: "Central Command",
    icon: "dashboard",
    href: "/dashboard",
  },
  {
    name: "GIS Village Upload",
    icon: "upload_file",
    href: "/dashboard/upload",
  },
  {
    name: "Clean Energy Map",
    icon: "explore",
    href: "/dashboard/energy-map",
  },
  {
    name: "Demand & Classifier",
    icon: "trending_up",
    href: "/dashboard/forecasting",
  },
  {
    name: "Energy Deserts",
    icon: "lightbulb",
    href: "/dashboard/insights",
  },
  {
    name: "CapEx & Rollout",
    icon: "account_balance_wallet",
    href: "/dashboard/recommendations",
  },
  {
    name: "NL-to-SQL Studio",
    icon: "terminal",
    href: "/dashboard/nl-query",
  },
  {
    name: "SDG-7 Policy Report",
    icon: "description",
    href: "/dashboard/sdg-report",
    badge: "SDG 7",
  },
  {
    name: "12-Agent Swarm",
    icon: "hub",
    href: "/dashboard/agents",
    badge: "12",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface/80 backdrop-blur-xl border-r border-outline-variant shadow-[0_0_25px_rgba(245,158,11,0.06)] z-50 py-6">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/40 sun-glow flex items-center justify-center bg-primary-container">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            wb_sunny
          </span>
        </div>
        <div>
          <h1 className="font-display text-xl font-black text-primary tracking-tight leading-none">
            SuryaHimal
          </h1>
          <span className="font-label text-[11px] text-secondary font-medium tracking-wide">
            UPES AI4SDG 2026
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 text-xs font-label font-semibold ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-highest text-secondary border border-secondary/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-6 pt-4 border-t border-outline-variant/60 flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label text-xs text-on-surface-variant font-medium">
            LangGraph Swarm Online
          </span>
        </div>
        <div className="text-[10px] text-outline font-mono">
          847 Benchmark Villages Loaded
        </div>
      </div>
    </aside>
  );
}
