import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Filter,
  Flame,
  Info,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  User,
  Video,
  Wrench
} from 'lucide-react';
import { Asset, Complaint, Issue, NormalizedAIDetection, RepairWorkOrder } from '../../types';
import { calculateAssetRiskScore } from '../../utils/cityMemoryEngine';

interface CityMemoryViewProps {
  assets: Asset[];
  issues: Issue[];
  complaints: Complaint[];
  repairs: RepairWorkOrder[];
  observations: NormalizedAIDetection[];
  selectedAssetId?: string | null;
  onSelectAsset?: (id: string) => void;
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const CityMemoryView: React.FC<CityMemoryViewProps> = ({
  assets,
  issues,
  complaints,
  repairs,
  observations,
  selectedAssetId,
  onSelectAsset,
  onNavigateToModule
}) => {
  const [activeAssetId, setActiveAssetId] = useState<string>(
    selectedAssetId || assets[0]?.id || ''
  );
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentAsset = assets.find((a) => a.id === activeAssetId) || assets[0];

  const assetIssues = issues.filter((i) => i.assetId === currentAsset?.id);
  const assetIssueIds = new Set(assetIssues.map((i) => i.id));
  const assetComplaints = complaints.filter(
    (c) => (c.linkedIssueId && assetIssueIds.has(c.linkedIssueId)) || c.ward === currentAsset?.ward
  );
  const assetRepairs = repairs.filter((r) => r.assetId === currentAsset?.id);

  // Compute live explainable risk assessment
  const riskAssessment = currentAsset
    ? calculateAssetRiskScore(currentAsset, issues, repairs)
    : null;

  // Build unified chronological timeline events
  interface TimelineEvent {
    id: string;
    type: 'complaint' | 'repair' | 'observation' | 'recurrence_alert' | 'issue';
    date: string;
    title: string;
    description: string;
    badge: string;
    badgeColor: string;
    meta?: Record<string, string | number>;
    photoUrl?: string;
  }

  const events: TimelineEvent[] = [];

  // 1. Issues & Recurrence alerts
  assetIssues.forEach((issue) => {
    events.push({
      id: issue.id,
      type: issue.isRecurrent ? 'recurrence_alert' : 'issue',
      date: issue.lastDetectedAt,
      title: issue.isRecurrent ? `RECURRING FAILURE: ${issue.title}` : `Defect Logged: ${issue.title}`,
      description: issue.recurrenceExplanation || issue.description,
      badge: issue.isRecurrent ? `Recurrence #${issue.recurrenceCount}` : issue.severity.toUpperCase(),
      badgeColor: issue.isRecurrent ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-300',
      meta: {
        'Status': issue.status,
        'Est. Cost': `₹${issue.estimatedCost.toLocaleString()}`,
        'Linked Reports': issue.linkedComplaintIds.length
      }
    });
  });

  // 2. Repairs & Work Orders
  assetRepairs.forEach((rep) => {
    const isBreach = rep.status === 'warranty_breached' || rep.isRecurrenceFailure;
    events.push({
      id: rep.id,
      type: 'repair',
      date: rep.completionDate || rep.startDate,
      title: `Work Order ${rep.workOrderNumber}: ${rep.description}`,
      description: `Contractor: ${rep.contractorName} | Material: ${rep.materialUsed} | Warranty: ${rep.warrantyMonths} Months`,
      badge: isBreach ? 'WARRANTY BREACHED' : 'REPAIR COMPLETED',
      badgeColor: isBreach ? 'bg-rose-600 text-white' : 'bg-emerald-500/20 text-emerald-300',
      photoUrl: rep.beforePhotoUrl,
      meta: {
        'Cost': `₹${rep.cost.toLocaleString()}`,
        'Contractor': rep.contractorName,
        'Warranty Expiry': rep.warrantyExpiry
      }
    });
  });

  // 3. Citizen complaints
  assetComplaints.forEach((c) => {
    events.push({
      id: c.id,
      type: 'complaint',
      date: c.createdAt,
      title: `Citizen Report (${c.complaintNumber}): ${c.citizenName}`,
      description: c.description,
      badge: c.status.replace(/_/g, ' ').toUpperCase(),
      badgeColor: 'bg-sky-500/20 text-sky-300',
      photoUrl: c.photoUrl,
      meta: {
        'Citizen': c.citizenName,
        'Source': c.source,
        'Location': c.address
      }
    });
  });

  // Sort newest first
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredEvents = events.filter((e) => {
    if (filterType !== 'all' && e.type !== filterType) return false;
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase()) && !e.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Asset Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 font-mono">
              Core Engine
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Pillar A
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            City Memory: Infrastructure Asset Timeline &amp; Failure Predictor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Persistent physical identity tracking every complaint, AI observation, repair, contractor expenditure, and failure cycle.
          </p>
        </div>

        {/* Asset Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="asset-select" className="text-xs text-slate-400 whitespace-nowrap">
            Selected Asset:
          </label>
          <select
            id="asset-select"
            value={currentAsset?.id}
            onChange={(e) => {
              setActiveAssetId(e.target.value);
              if (onSelectAsset) onSelectAsset(e.target.value);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 font-medium focus:ring-1 focus:ring-amber-500"
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.assetCode} - {a.name} ({a.ward})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentAsset && (
        <>
          {/* Asset Metadata & Risk Assessment Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Identity & Physical Specification */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">{currentAsset.assetCode}</span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5">{currentAsset.name}</h3>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 font-medium px-2 py-1 rounded capitalize">
                  {currentAsset.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Ward &amp; Zone</span>
                  <span className="font-semibold text-slate-200">{currentAsset.ward}</span>
                  <div className="text-slate-400 text-[11px]">{currentAsset.zone}</div>
                </div>

                <div>
                  <span className="text-slate-500 block">Installed / Commissioned</span>
                  <span className="font-semibold text-slate-200">{currentAsset.installedYear}</span>
                  <div className="text-slate-400 text-[11px]">{2026 - currentAsset.installedYear} yrs in service</div>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-500 block">Engineering Specifications</span>
                  <span className="font-semibold text-slate-200">{currentAsset.specifications}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Assigned Contractor</span>
                  <span className="font-semibold text-amber-400">{currentAsset.contractorAssigned}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Warranty Period</span>
                  <span className="font-semibold text-slate-200">{currentAsset.warrantyUntil}</span>
                </div>
              </div>

              {currentAsset.notes && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-amber-400">Engineering Note: </span>
                  {currentAsset.notes}
                </div>
              )}
            </div>

            {/* Explainable Failure Prediction Risk Gauge */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      Explainable Failure Prediction &amp; Recurrence Risk
                    </h3>
                    <p className="text-xs text-slate-400">Multi-factor algorithmic risk decomposition</p>
                  </div>
                </div>

                {riskAssessment && (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Risk Assessment</div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          riskAssessment.level === 'Critical'
                            ? 'bg-rose-500 text-white animate-pulse'
                            : riskAssessment.level === 'High'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {riskAssessment.level} Risk
                      </span>
                    </div>
                    <div
                      className={`text-3xl font-mono font-extrabold ${
                        riskAssessment.score >= 75
                          ? 'text-rose-400'
                          : riskAssessment.score >= 50
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {riskAssessment.score}
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Explainable Risk Factors */}
              {riskAssessment && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {riskAssessment.factors.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-medium text-slate-200">{f.name}</div>
                          <div className="text-[11px] text-slate-400">{f.value}</div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              f.impact === 'critical'
                                ? 'bg-rose-500/20 text-rose-300'
                                : f.impact === 'negative'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            Weight: {f.weight}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/80 border border-amber-500/30 text-xs flex items-start gap-2.5 text-slate-200">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-400">Algorithmic Recommendation: </span>
                      {riskAssessment.recommendation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Unified City Memory Timeline */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  Asset Memory Ledger &amp; Lifecycle Events
                </h3>
                <p className="text-xs text-slate-400">
                  Searchable persistent record linking reports, work orders, dashcam frames, and recurring failures.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search memory..."
                    className="bg-slate-950 border border-slate-800 text-xs pl-8 pr-3 py-1.5 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 w-40"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  {['all', 'recurrence_alert', 'repair', 'complaint'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilterType(type)}
                      className={`px-2.5 py-1 rounded capitalize font-medium text-xs transition-colors ${
                        filterType === type
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type === 'all'
                        ? 'All Events'
                        : type === 'recurrence_alert'
                        ? 'Recurrences'
                        : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {filteredEvents.length === 0 ? (
                <div className="text-xs text-slate-500 py-8 text-center">
                  No timeline events match the filter criteria.
                </div>
              ) : (
                filteredEvents.map((evt) => {
                  const isRecurrence = evt.type === 'recurrence_alert';
                  const isRepair = evt.type === 'repair';

                  return (
                    <div key={evt.id} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-2 ${
                          isRecurrence
                            ? 'bg-rose-500 border-white animate-ping'
                            : isRepair
                            ? 'bg-emerald-500 border-slate-900'
                            : 'bg-amber-400 border-slate-900'
                        }`}
                      />
                      <div
                        className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-2 ${
                          isRecurrence
                            ? 'bg-rose-500 border-white'
                            : isRepair
                            ? 'bg-emerald-500 border-slate-900'
                            : 'bg-amber-400 border-slate-900'
                        }`}
                      />

                      <div
                        className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                          isRecurrence
                            ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/20'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${evt.badgeColor}`}
                            >
                              {evt.badge}
                            </span>
                            <h4 className="font-semibold text-slate-100 text-sm">{evt.title}</h4>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(evt.date).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-slate-300 leading-relaxed">{evt.description}</p>

                        {/* Event Photo if available */}
                        {evt.photoUrl && (
                          <div className="pt-2">
                            <img
                              src={evt.photoUrl}
                              alt="Defect / Evidence"
                              className="h-28 w-44 object-cover rounded-lg border border-slate-800 hover:scale-105 transition-transform"
                            />
                          </div>
                        )}

                        {/* Metadata Tag Row */}
                        {evt.meta && (
                          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-850 text-[11px]">
                            {Object.entries(evt.meta).map(([k, v]) => (
                              <span key={k} className="text-slate-400">
                                <span className="text-slate-500">{k}:</span>{' '}
                                <span className="font-medium text-slate-200">{v}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
