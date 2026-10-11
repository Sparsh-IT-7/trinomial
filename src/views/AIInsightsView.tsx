import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Activity, Layers } from 'lucide-react';

export const AIInsightsView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#F97316]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">
            MUNICIPAL INTELLIGENCE ENGINE
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#047857] tracking-tight">
          Civic AI Insights & Ward Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-[#047857]/80 max-w-3xl leading-relaxed">
          Predictive pattern correlation across telemetry nodes, municipal tender delays, statutory SLA adherence, and localized pollution spikes.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-2 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-[#047857]/70">
            CETP RAIN BYPASS PREDICTOR
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#F97316]">94% Prob.</div>
          <p className="text-xs text-[#047857]/80">
            Strong correlation between rainfall &gt;12mm/hr and midnight illegal discharge into Yamalur stormwater channels.
          </p>
        </div>

        <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-2 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-[#047857]/70">
            STATUTORY SLA ADHERENCE
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#047857]">64.2%</div>
          <p className="text-xs text-[#047857]/80">
            Average civic complaint closure rate across BBMP Ward 150 within statutory 7-day citizen charter deadline.
          </p>
        </div>

        <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-2 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-[#047857]/70">
            POTHOLE CLUSTER HAZARD INDEX
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#F97316]">High Risk</div>
          <p className="text-xs text-[#047857]/80">
            Sarjapur-ORR Junction flagged for critical subsurface subsidence following unresolved water pipe leakages.
          </p>
        </div>
      </div>

      {/* Telemetry Breakdown */}
      <div className="bg-white border border-[#047857]/20 rounded-xs p-6 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#047857]" />
            <h3 className="text-base font-bold text-[#047857]">
              Continuous Hydro-Sensor Telemetry (Bellandur Outflow #7)
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 border border-[#047857] text-[#047857] rounded-xs uppercase">
            LIVE STREAM
          </span>
        </div>

        <div className="space-y-4">
          <div className="text-xs text-[#047857]/80">
            Sensor stream sampling every 15 minutes. Heavy nighttime anomalies recorded between 01:00 AM and 04:30 AM IST.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border border-[#047857]/20 rounded bg-[#fcfcfc]">
              <span className="text-xs text-[#047857]/70 block">pH Index</span>
              <span className="text-2xl font-bold font-mono text-[#F97316]">8.6</span>
              <span className="text-[10px] text-[#047857]/60 block mt-1">Alkaline Spill Alert</span>
            </div>
            <div className="p-4 border border-[#047857]/20 rounded bg-[#fcfcfc]">
              <span className="text-xs text-[#047857]/70 block">Dissolved Oxygen</span>
              <span className="text-2xl font-bold font-mono text-[#F97316]">0.8 mg/L</span>
              <span className="text-[10px] text-[#047857]/60 block mt-1">Anoxic Hazard</span>
            </div>
            <div className="p-4 border border-[#047857]/20 rounded bg-[#fcfcfc]">
              <span className="text-xs text-[#047857]/70 block">Turbidity</span>
              <span className="text-2xl font-bold font-mono text-[#047857]">142 NTU</span>
              <span className="text-[10px] text-[#047857]/60 block mt-1">Silt + Surfactant</span>
            </div>
            <div className="p-4 border border-[#047857]/20 rounded bg-[#fcfcfc]">
              <span className="text-xs text-[#047857]/70 block">Conductivity</span>
              <span className="text-2xl font-bold font-mono text-[#047857]">1,820 µS/cm</span>
              <span className="text-[10px] text-[#047857]/60 block mt-1">Heavy Dissolved Solids</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIInsightsView;
