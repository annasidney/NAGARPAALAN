import React from 'react';
import {
  Activity,
  AlertOctagon,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Flame,
  Layers,
  MapPin,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Video,
  Wrench
} from 'lucide-react';
import { Asset, Complaint, Issue, NormalizedAIDetection, RepairWorkOrder } from '../../types';
import { CityMapComponent } from '../CityMapComponent';

interface OverviewViewProps {
  assets: Asset[];
  issues: Issue[];
  complaints: Complaint[];
  repairs: RepairWorkOrder[];
  observations: NormalizedAIDetection[];
  onNavigate: (module: string, contextId?: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  assets,
  issues,
  complaints,
  repairs,
  observations,
  onNavigate
}) => {
  const recurringCount = assets.reduce((sum, a) => sum + (a.recurrenceCount || 0), 0);
  const criticalAssets = assets.filter((a) => a.currentRiskScore >= 75);
  const activeIssues = issues.filter((i) => i.status !== 'repaired' && i.status !== 'closed');
  const totalExpenditure = repairs.reduce((sum, r) => sum + r.cost, 0);

  // Warranty breach expenditures (loss due to poor quality recurrence)
  const breachExpenditures = repairs
    .filter((r) => r.status === 'warranty_breached' || r.isRecurrenceFailure)
    .reduce((sum, r) => sum + r.cost, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Civic Assets Tracked</span>
            <Building2 className="w-5 h-5 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100 font-mono">{assets.length}</div>
          <div className="mt-1 flex items-center text-xs text-slate-400">
            <span className="text-emerald-400 font-medium mr-1.5">100% Digital Twin</span>
            <span>across 4 zones</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-sky-500/10 rounded-full blur-xl" />
        </div>

        <div className="bg-slate-900/80 border border-rose-500/30 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-300">Premature Recurrences</span>
            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">{recurringCount}</div>
          <div className="mt-1 flex items-center text-xs text-rose-300/80">
            <span className="font-semibold text-rose-400 mr-1.5">City Memory Alert</span>
            <span>repeat defects detected</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-rose-500/15 rounded-full blur-xl" />
        </div>

        <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300">Active Civic Issues</span>
            <AlertOctagon className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300 font-mono">{activeIssues.length}</div>
          <div className="mt-1 flex items-center text-xs text-slate-400">
            <span className="text-amber-400 font-medium mr-1.5">{complaints.length} complaints</span>
            <span>processed</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-amber-500/10 rounded-full blur-xl" />
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Repair Expenditure</span>
            <span className="text-xs font-mono font-bold text-emerald-400">₹ INR</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100 font-mono">
            ₹{(totalExpenditure / 1000).toFixed(1)}k
          </div>
          <div className="mt-1 flex items-center text-xs text-rose-400">
            <TrendingDown className="w-3.5 h-3.5 mr-1" />
            <span>₹{(breachExpenditures / 1000).toFixed(1)}k repeat leakage</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl" />
        </div>
      </div>

      {/* Main Grid: Interactive Map + Recurrence / High Risk Corridor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Live City Infrastructure Spatial Grid
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('City Map')}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                Expand Interactive Map →
              </button>
            </div>
            <CityMapComponent
              assets={assets}
              issues={issues}
              height="360px"
              onSelectAsset={(id) => onNavigate('City Memory', id)}
            />
          </div>

          {/* Chronic Recurrence Watchlist */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  City Memory: Chronic Failure &amp; Recurrence Alerts
                </h3>
              </div>
              <span className="text-xs font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                High Priority
              </span>
            </div>

            <div className="space-y-2.5">
              {assets
                .filter((a) => a.recurrenceCount > 0 || a.currentRiskScore >= 70)
                .map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">{asset.assetCode}</span>
                        <span className="text-xs font-semibold text-slate-200">{asset.name}</span>
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.2 rounded">
                          {asset.recurrenceCount} RECURRENCES
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span>Ward: {asset.ward}</span>
                        <span>Contractor: {asset.contractorAssigned}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-[11px] text-slate-400">Risk Score</div>
                        <div className="text-base font-bold font-mono text-rose-400">
                          {asset.currentRiskScore}/100
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('City Memory', asset.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-medium"
                      >
                        Inspect History
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Quick Actions & Live AI Observation Stream */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
            <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick Civic Workflows
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('Complaints')}
                className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400">
                    Register Citizen Complaint
                  </div>
                  <div className="text-[11px] text-slate-400">With AI duplicate check</div>
                </div>
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('Dashcam Intelligence')}
                className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400">
                    Dashcam Patrol Stream
                  </div>
                  <div className="text-[11px] text-slate-400">iWatchRoad &amp; telemetry</div>
                </div>
                <Video className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('Civic Vision')}
                className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400">
                    Civic Vision Sandbox
                  </div>
                  <div className="text-[11px] text-slate-400">Test image inference adapters</div>
                </div>
                <Layers className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('Contractor Management')}
                className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 hover:border-slate-700 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400">
                    Contractor Scorecards
                  </div>
                  <div className="text-[11px] text-slate-400">Recurrence rates &amp; penalties</div>
                </div>
                <Wrench className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              </button>
            </div>
          </div>

          {/* AI Observation Stream */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                Live AI Ingestion Feed
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Adapter Active
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {observations.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-6 border border-dashed border-slate-800 rounded-lg">
                  No live observations yet. Run a dashcam patrol or upload an image in Civic Vision to feed City Memory.
                </div>
              ) : (
                observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/70 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 capitalize">
                        {obs.defect_type.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono text-amber-400 font-bold">
                        {(obs.confidence * 100).toFixed(0)}% Conf
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Model: {obs.model_name}</span>
                      <span>{new Date(obs.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
