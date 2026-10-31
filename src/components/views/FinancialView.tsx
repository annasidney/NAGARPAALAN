import React from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  FileCheck,
  Flame,
  PiggyBank,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { Asset, Contractor, RepairWorkOrder } from '../../types';

interface FinancialViewProps {
  repairs: RepairWorkOrder[];
  assets: Asset[];
  contractors: Contractor[];
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  repairs,
  assets,
  contractors,
  onNavigateToModule
}) => {
  const totalExpenditure = repairs.reduce((sum, r) => sum + r.cost, 0);

  // Recurrence / Warranty Leakage: Money spent on repairs where previous work on the same spot failed prematurely
  const leakageRepairs = repairs.filter(
    (r) => r.status === 'warranty_breached' || r.isRecurrenceFailure
  );
  const totalLeakage = leakageRepairs.reduce((sum, r) => sum + r.cost, 0);
  const leakagePercentage = totalExpenditure > 0 ? (totalLeakage / totalExpenditure) * 100 : 0;

  // Potential Warranty Recovery from penalized contractors
  const potentialRecovery = leakageRepairs.reduce((sum, r) => sum + r.cost * 0.8, 0);

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
              Module 10
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Financial Intelligence &amp; Recurrence Leakage Auditing
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify municipal capital leakage caused by repeat failures, poor patch durability, and enforce warranty clawbacks.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-300 text-xs font-mono">
          <span>FY 2026-27 Civic Audit Active</span>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <span className="text-xs text-slate-400">Total Infrastructure Maintenance</span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            ₹{totalExpenditure.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Across all municipal wards</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/40 shadow-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300">Repeat Failure Leakage</span>
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400">
            ₹{totalLeakage.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-300/80">
            {leakagePercentage.toFixed(1)}% of total repair budget wasted
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 shadow-lg space-y-1">
          <span className="text-xs text-amber-300">Warranty Clawback Target</span>
          <div className="text-2xl font-bold font-mono text-amber-400">
            ₹{potentialRecovery.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Recoverable under contractor clauses</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-1">
          <span className="text-xs text-slate-400">Estimated City Memory Savings</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">₹3,40,000 / yr</div>
          <span className="text-[11px] text-slate-500">By predicting root cause failures</span>
        </div>
      </div>

      {/* Audit Table: Repeat Repair Expenditures */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Audit Ledger: Premature Recurrence &amp; Warranty Breaches
          </h3>
          <span className="text-xs text-slate-400">City Memory Cost-of-Poor-Quality (CoPQ) Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Work Order</th>
                <th className="p-3">Asset Code &amp; Name</th>
                <th className="p-3">Contractor</th>
                <th className="p-3">Expenditure</th>
                <th className="p-3">Warranty Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {repairs.map((r) => {
                const isBreach = r.status === 'warranty_breached' || r.isRecurrenceFailure;
                const asset = assets.find((a) => a.id === r.assetId);

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-850/50 transition-colors ${
                      isBreach ? 'bg-rose-950/15' : ''
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-amber-400">{r.workOrderNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{asset?.name || r.assetId}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{asset?.assetCode}</div>
                    </td>
                    <td className="p-3 text-slate-300">{r.contractorName}</td>
                    <td className="p-3 font-mono font-bold text-slate-100">
                      ₹{r.cost.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isBreach ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isBreach ? 'Warranty Violated' : 'Compliant'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {asset && (
                        <button
                          type="button"
                          onClick={() => onNavigateToModule('City Memory', asset.id)}
                          className="text-amber-400 hover:text-amber-300 font-medium"
                        >
                          Audit History →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
