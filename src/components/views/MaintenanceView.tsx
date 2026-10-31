import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  Filter,
  Flame,
  Plus,
  ShieldAlert,
  Sparkles,
  User,
  Wrench,
  X
} from 'lucide-react';
import { Asset, Contractor, Issue, RepairWorkOrder } from '../../types';
import { mockDb } from '../../services/mockDatabase';

interface MaintenanceViewProps {
  repairs: RepairWorkOrder[];
  issues: Issue[];
  assets: Asset[];
  contractors: Contractor[];
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  repairs,
  issues,
  assets,
  contractors,
  onNavigateToModule
}) => {
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state for recording repair
  const [selectedIssueId, setSelectedIssueId] = useState<string>(issues[0]?.id || '');
  const [selectedContractorId, setSelectedContractorId] = useState<string>(contractors[0]?.id || '');
  const [description, setDescription] = useState('Hot mix mastic asphalt compaction and crack sealing');
  const [materialUsed, setMaterialUsed] = useState('Bitumen Emulsion Grade VG-30 + 10mm Stone Aggregate');
  const [cost, setCost] = useState(48500);
  const [warrantyMonths, setWarrantyMonths] = useState(12);

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const issue = issues.find((i) => i.id === selectedIssueId);
    if (!issue) return;

    mockDb.recordRepair({
      issueId: selectedIssueId,
      assetId: issue.assetId,
      contractorId: selectedContractorId,
      description,
      materialUsed,
      cost: Number(cost),
      warrantyMonths: Number(warrantyMonths),
      beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
      afterPhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80'
    });

    setShowRecordModal(false);
  };

  const filteredRepairs = repairs.filter((r) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'breached') return r.status === 'warranty_breached' || r.isRecurrenceFailure;
    return r.status === filterStatus;
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
              Module 9
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Maintenance &amp; Repair Work Order Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log municipal maintenance dispatches, materials used, warranty tracking, and contractor accountability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRecordModal(true)}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-colors self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Record Completed Repair</span>
        </button>
      </div>

      {/* Filter and Overview Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Work Orders:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500"
            >
              <option value="all">All Work Orders ({repairs.length})</option>
              <option value="completed">Completed &amp; Under Warranty</option>
              <option value="breached">Warranty Breached / Recurrent</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Total Spend Logged:{' '}
            <span className="font-mono font-bold text-emerald-400">
              ₹{repairs.reduce((s, r) => s + r.cost, 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="space-y-3">
          {filteredRepairs.map((repair) => {
            const isBreach = repair.status === 'warranty_breached' || repair.isRecurrenceFailure;
            const asset = assets.find((a) => a.id === repair.assetId);

            return (
              <div
                key={repair.id}
                className={`p-4 rounded-xl border transition-all ${
                  isBreach
                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {repair.workOrderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isBreach ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isBreach ? 'WARRANTY BREACH (RECURRED)' : 'UNDER WARRANTY'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Completed: {repair.completionDate || repair.startDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-200">{repair.description}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Contractor:</span>
                        <span className="font-medium text-slate-200">{repair.contractorName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Material Specification:</span>
                        <span className="font-medium text-slate-200">{repair.materialUsed}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Warranty Expiry:</span>
                        <span className="font-medium text-slate-200">{repair.warrantyExpiry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end lg:self-center shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Expenditure</div>
                      <div className="text-base font-bold font-mono text-emerald-400">
                        ₹{repair.cost.toLocaleString()}
                      </div>
                    </div>

                    {asset && (
                      <button
                        type="button"
                        onClick={() => onNavigateToModule('City Memory', asset.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                      >
                        Asset Memory →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Record Repair Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleRecordSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowRecordModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <Wrench className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">Record Completed Repair Work Order</h3>
                <p className="text-xs text-slate-400">Log repair details, cost, contractor, and warranty</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Target Issue to Resolve</label>
                <select
                  value={selectedIssueId}
                  onChange={(e) => setSelectedIssueId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                >
                  {issues.map((iss) => (
                    <option key={iss.id} value={iss.id}>
                      {iss.issueCode} - {iss.title} ({iss.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Contractor Dispatched</label>
                <select
                  value={selectedContractorId}
                  onChange={(e) => setSelectedContractorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                >
                  {contractors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Recurrence: {c.prematureRecurrenceRate}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Total Cost (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 font-mono focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Warranty Period (Months)</label>
                <input
                  type="number"
                  required
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 font-mono focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Materials Used</label>
                <input
                  type="text"
                  required
                  value={materialUsed}
                  onChange={(e) => setMaterialUsed(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Description of Work Performed</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign-off &amp; Commit to City Memory</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
