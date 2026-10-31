import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Filter,
  Flame,
  Layers,
  MapPin,
  Search,
  ShieldAlert,
  Sparkles,
  Wrench
} from 'lucide-react';
import { Asset, Issue, RepairWorkOrder } from '../../types';

interface RegistryViewProps {
  assets: Asset[];
  issues: Issue[];
  repairs: RepairWorkOrder[];
  onSelectAsset: (assetId: string) => void;
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const RegistryView: React.FC<RegistryViewProps> = ({
  assets,
  issues,
  repairs,
  onSelectAsset,
  onNavigateToModule
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  const filteredAssets = assets.filter((asset) => {
    if (categoryFilter !== 'all' && asset.category !== categoryFilter) return false;
    if (zoneFilter !== 'all' && asset.zone !== zoneFilter) return false;
    if (
      searchQuery &&
      !asset.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !asset.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !asset.ward.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
              Module 5
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Physical Civic Infrastructure Registry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Master asset registry of permanent physical infrastructure: road segments, streetlights, bridges, and stormwater culverts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Indexed Assets:</span>
          <span className="font-mono font-bold text-amber-400 text-sm bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {assets.length} Assets
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by asset code, name, or ward..."
              className="w-full bg-slate-950 border border-slate-800 text-xs pl-9 pr-3 py-2 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500"
              >
                <option value="all">All Infrastructure</option>
                <option value="road">Roads</option>
                <option value="streetlight">Streetlights</option>
                <option value="drainage">Stormwater Drains</option>
                <option value="bridge">Bridges &amp; Flyovers</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Zone:</span>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500"
              >
                <option value="all">All Zones</option>
                <option value="East Zone">East Zone</option>
                <option value="South Zone">South Zone</option>
                <option value="Mahadevapura">Mahadevapura</option>
              </select>
            </div>
          </div>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredAssets.map((asset) => {
            const assetIssues = issues.filter((i) => i.assetId === asset.id);
            const activeIssuesCount = assetIssues.filter(
              (i) => i.status !== 'repaired' && i.status !== 'closed'
            ).length;
            const isHighRisk = asset.currentRiskScore >= 70;

            return (
              <div
                key={asset.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isHighRisk
                    ? 'bg-slate-900/90 border-rose-500/40 hover:border-rose-400 shadow-lg shadow-rose-950/20'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{asset.assetCode}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 uppercase px-2 py-0.5 rounded font-medium">
                      {asset.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{asset.name}</h3>
                  <div className="text-xs text-slate-400">{asset.ward}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-2">{asset.specifications}</div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Condition Index</span>
                      <span className="font-mono font-bold text-slate-200">{asset.conditionScore}/100</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Failure Risk</span>
                      <span
                        className={`font-mono font-bold ${
                          isHighRisk ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {asset.currentRiskScore}/100
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Active Issues</span>
                      <span className="font-mono text-slate-200">{activeIssuesCount}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Recurrences</span>
                      <span
                        className={`font-mono font-bold ${
                          asset.recurrenceCount > 0 ? 'text-rose-400' : 'text-slate-400'
                        }`}
                      >
                        {asset.recurrenceCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                    {asset.contractorAssigned}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectAsset(asset.id);
                      onNavigateToModule('City Memory', asset.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                  >
                    Open Memory →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
