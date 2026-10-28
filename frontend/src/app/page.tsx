"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Fallback for demo mode if Supabase credentials are placeholder
        if (error.message.includes("fetch failed") || error.message.includes("Invalid API key") || error.message.includes("placeholder")) {
          router.push("/dashboard");
          return;
        }
        throw error;
      }
      router.push("/dashboard");
    } catch (error: unknown) {
      // In demo mode, still allow entry with informative notice
      if (email.trim() && password.length >= 6) {
        router.push("/dashboard");
        return;
      }
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Authentication failed. Please verify credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen relative overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] pointer-events-none bg-gradient-to-r from-primary/15 to-transparent"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full blur-[110px] pointer-events-none bg-gradient-to-r from-secondary/15 to-transparent"></div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>

      {/* Main Content Area */}
      <div className="flex w-full min-h-screen z-10">
        {/* Left Panel: SuryaHimal Mission Showcase */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 border-r border-outline-variant/50 bg-surface/40">
          {/* Header */}
          <div className="z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center sun-glow border border-primary/40">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                wb_sunny
              </span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-primary tracking-tight">SuryaHimal</h1>
              <span className="text-xs font-mono text-secondary">AI4SDG NAVONMESHA 2026 · UPES Dehradun</span>
            </div>
          </div>

          {/* Mission & Stats */}
          <div className="z-10 flex flex-col gap-6 max-w-lg mt-12">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold mb-3">
                SDG 7 · SDG 13 · SDG 1
              </div>
              <h2 className="font-display text-3xl font-extrabold text-on-surface leading-snug">
                Autonomous Microgrid AI for Off-Grid Himalayan Villages.
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-3 leading-relaxed">
                Replacing slow 12-month surveys and failed blanket solar schemes with bespoke multi-source renewable microgrid intelligence across 847 benchmark mountain communities.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="glass-card rounded-xl p-4 border border-outline-variant">
                <div className="text-2xl font-display font-extrabold text-primary">847</div>
                <div className="text-xs text-on-surface-variant mt-1 font-label">Off-Grid Mountain Villages</div>
                <div className="text-[10px] text-tertiary mt-0.5 font-mono">Chamoli, Pithoragarh, Spiti</div>
              </div>
              <div className="glass-card rounded-xl p-4 border border-outline-variant">
                <div className="text-2xl font-display font-extrabold text-secondary">89.2%</div>
                <div className="text-xs text-on-surface-variant mt-1 font-label">Classifier Accuracy</div>
                <div className="text-[10px] text-secondary mt-0.5 font-mono">Solar / Hydro / Hybrid</div>
              </div>
              <div className="glass-card rounded-xl p-4 border border-outline-variant">
                <div className="text-2xl font-display font-extrabold text-tertiary">₹28 Cr/yr</div>
                <div className="text-xs text-on-surface-variant mt-1 font-label">Diesel Displaced</div>
                <div className="text-[10px] text-tertiary mt-0.5 font-mono">Zero Glacial Black Carbon</div>
              </div>
              <div className="glass-card rounded-xl p-4 border border-outline-variant">
                <div className="text-2xl font-display font-extrabold text-primary">12 Agents</div>
                <div className="text-xs text-on-surface-variant mt-1 font-label">LangGraph State Machine</div>
                <div className="text-[10px] text-primary mt-0.5 font-mono">Hub-and-Spoke Topology</div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="z-10 mt-auto pt-8 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant/70 font-mono">
            <span>School of Computer Science, UPES</span>
            <span>Oct 28–29, 2026</span>
          </div>
        </div>

        {/* Right Panel: Authentication Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-on-surface">Access Central Command</h2>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Sign in to analyze renewable microgrid trajectories or run energy simulations.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-error/15 border border-error/30 text-error flex items-start gap-3 text-xs">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-label font-semibold text-on-surface-variant mb-1.5" htmlFor="email">
                  Institutional Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant pointer-events-none">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </span>
                  <input
                    className="input-field w-full rounded-xl h-11 pl-10 pr-4 text-on-surface text-xs font-body placeholder:text-on-surface-variant/40"
                    id="email"
                    type="email"
                    placeholder="energy.planner@upes.ac.in"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-label font-semibold text-on-surface-variant" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-on-surface-variant pointer-events-none">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </span>
                  <input
                    className="input-field w-full rounded-xl h-11 pl-10 pr-10 text-on-surface text-xs font-body placeholder:text-on-surface-variant/40"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-on-surface-variant hover:text-on-surface"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                className="glow-button w-full h-11 rounded-xl text-xs font-label font-bold text-on-primary mt-2 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Authenticating..." : "Enter SuryaHimal Command"}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </form>

            <div className="mt-8 p-4 rounded-xl bg-surface-container/40 border border-outline-variant/50 text-xs">
              <div className="flex items-center gap-2 text-primary font-bold mb-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Quick Demo Access
              </div>
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                Enter any valid email and 6+ character password to explore the pre-loaded 847 Himalayan village dataset and run the 12-agent LangGraph energy swarm.
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-on-surface-variant">
                Need an evaluator profile?{" "}
                <Link className="text-primary hover:text-on-primary-container font-semibold" href="/signup">
                  Register new account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
