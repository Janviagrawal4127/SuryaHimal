"use client";

import React, { useState, useEffect } from "react";

export default function SdgReportPage() {
  const [reportHtml, setReportHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/data/report`);
        if (res.ok) {
          const html = await res.text();
          setReportHtml(html);
        } else {
          setReportHtml("<p>Report preview will appear once the 12-agent pipeline is run.</p>");
        }
      } catch {
        setReportHtml("<p>Standalone Demo Mode: Run backend pipeline to generate live customized reports.</p>");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(reportHtml || "<h1>SuryaHimal SDG-7 Policy Brief</h1>");
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="flex flex-col relative w-full h-full space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xl">description</span>
            <span className="font-label text-xs uppercase tracking-widest text-primary font-bold">
              Document Compiler Agent
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
            Audit-Ready SDG-7 Policy Action Plan
          </h2>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Automated district-level executive summaries and bankable DPR milestones for MNRE, state REDAs, and funding agencies.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button
            onClick={handlePrint}
            className="glow-button px-4 py-2 rounded-xl text-xs font-label font-bold text-on-primary flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div className="glass-card rounded-2xl border border-outline-variant p-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-xs font-mono text-primary gap-2">
            <span className="material-symbols-outlined animate-spin">sync</span>
            <span>Loading compiled SDG-7 policy brief...</span>
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-xl p-6 sm:p-10 border border-outline-variant/60 shadow-inner max-w-4xl mx-auto">
            <iframe
              srcDoc={reportHtml}
              className="w-full min-h-[750px] rounded-lg border-0 bg-transparent"
              title="SuryaHimal SDG-7 Policy Report"
            />
          </div>
        )}
      </div>
    </div>
  );
}
