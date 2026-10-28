"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Topbar() {
  const [telemetryStatus, setTelemetryStatus] = useState<"connected" | "connecting" | "offline">("connecting");

  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      const wsUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
        .replace(/^http/, "ws") + "/ws/telemetry";
      ws = new WebSocket(wsUrl);
      ws.onopen = () => setTelemetryStatus("connected");
      ws.onerror = () => setTelemetryStatus("offline");
      ws.onclose = () => setTelemetryStatus("offline");
    } catch {
      setTelemetryStatus("offline");
    }
    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <header className="h-16 fixed top-0 right-0 left-0 md:left-64 bg-surface/80 backdrop-blur-xl border-b border-outline-variant z-40 px-6 flex items-center justify-between">
      {/* Left: District / Programme Indicator */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-mono font-bold">
          <span className="material-symbols-outlined text-[13px]">terrain</span>
          Indian Himalayan Region (&gt;2,500m)
        </span>
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-mono">
          SDG 7.1 · SDG 13.2 · SDG 1.4
        </span>
      </div>

      {/* Right: Telemetry & Actions */}
      <div className="flex items-center gap-4">
        {/* WebSocket Stream Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container border border-outline-variant text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              telemetryStatus === "connected"
                ? "bg-tertiary animate-pulse"
                : telemetryStatus === "connecting"
                ? "bg-primary animate-ping"
                : "bg-error"
            }`}
          ></span>
          <span className="text-on-surface-variant text-[11px]">
            {telemetryStatus === "connected"
              ? "Swarm Stream Live"
              : telemetryStatus === "connecting"
              ? "Connecting..."
              : "Backend Standby"}
          </span>
        </div>

        {/* Quick Report Download / Link */}
        <Link
          href="/dashboard/sdg-report"
          className="px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 border border-primary/40 text-primary text-xs font-label font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          <span className="hidden sm:inline">SDG Brief</span>
        </Link>

        {/* User profile avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-xs ring-2 ring-primary/30">
          UH
        </div>
      </div>
    </header>
  );
}
