import React from 'react';
import {
  AlertOctagon,
  CloudRain,
  Flame,
  Layers,
  MapPin,
  ShieldAlert,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Asset, Issue, RepairWorkOrder } from '../../types';

interface HotspotViewProps {
  assets: Asset[];
  issues: Issue[];
  repairs: RepairWorkOrder[];
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const HotspotView: React.FC<HotspotViewProps> = ({
  assets,
  issues,
  repairs,
  onNavigateToModule
}) => {
  // Sort worst failure corridors
  const worstCorridors = [...assets]
    .sort((a, b) => b.recurrenceCount * 10 + b.currentRiskScore - (a.recurrenceCount * 10 + a.currentRiskScore))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 font-mono">
              Pillar A: Core Civic
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Module 8
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Hotspot Analysis &amp; Chronic Recurrence Corridors
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Predictive infrastructure clustering: identify recurring failure corridors and monsoon waterlogging vulnerabilities.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg text-rose-300 text-xs">
          <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>3 Critical Corridors Identified</span>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>City-Wide Recurrence Rate</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">28.4%</div>
          <p className="text-[11px] text-slate-400">
            28.4% of patched road potholes recur within 180 days of repair.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monsoon Vulnerability Index</span>
            <CloudRain className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">76 / 100</div>
          <p className="text-[11px] text-slate-400">
            High subsurface saturation risk along East Zone stormwater corridors.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Contractor Warranty Leakage</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">₹1,25,200</div>
          <p className="text-[11px] text-slate-400">
            Re-spend on assets where original contractor warranty was violated.
          </p>
        </div>
      </div>

      {/* Chronic Failure Corridors List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Top 5 Chronic Recurrence Stretches (City Memory Watchlist)
          </h3>
          <span className="text-xs text-slate-400">Algorithmic Rank by Repeat Failure Velocity</span>
        </div>

        <div className="space-y-3">
          {worstCorridors.map((asset, idx) => (
            <div
              key={asset.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{asset.assetCode}</span>
                    <h4 className="font-bold text-slate-100 text-sm">{asset.name}</h4>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Ward: {asset.ward}</span>
                    <span>Zone: {asset.zone}</span>
                    <span>Installed: {asset.installedYear}</span>
                  </div>
                  {asset.notes && (
                    <div className="text-[11px] text-rose-300/80 bg-rose-500/10 px-2 py-1 rounded inline-block mt-1">
                      Root Cause: {asset.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 self-end lg:self-center shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Recurrences</div>
                  <div className="text-base font-bold font-mono text-rose-400">
                    {asset.recurrenceCount} Cycles
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Risk Score</div>
                  <div className="text-base font-bold font-mono text-amber-400">
                    {asset.currentRiskScore}/100
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToModule('City Memory', asset.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  Inspect Memory
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
