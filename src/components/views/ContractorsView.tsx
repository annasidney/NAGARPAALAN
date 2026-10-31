import React from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Phone,
  ShieldAlert,
  Star,
  UserCheck,
  UserX,
  Wrench
} from 'lucide-react';
import { Asset, Contractor, RepairWorkOrder } from '../../types';

interface ContractorsViewProps {
  contractors: Contractor[];
  repairs: RepairWorkOrder[];
  assets: Asset[];
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const ContractorsView: React.FC<ContractorsViewProps> = ({
  contractors,
  repairs,
  assets,
  onNavigateToModule
}) => {
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
              Module 11
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Contractor Performance &amp; Accountability Scorecards
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hold civic contractors accountable through City Memory: evaluate premature recurrence rates, warranty compliance, and penalty strikes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Enlisted Contractors:</span>
          <span className="font-mono font-bold text-amber-400 text-sm bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {contractors.length}
          </span>
        </div>
      </div>

      {/* Contractor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contractors.map((contractor) => {
          const isBlacklisted = contractor.status === 'blacklisted';
          const isWarning = contractor.status === 'warning';

          return (
            <div
              key={contractor.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isBlacklisted
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/20'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/50'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {contractor.licenseNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isBlacklisted
                            ? 'bg-rose-600 text-white'
                            : isWarning
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {contractor.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{contractor.name}</h3>
                    <p className="text-xs text-slate-400">{contractor.specialization}</p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 font-mono text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{contractor.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <span className="text-slate-500 block text-[10px]">Total Work Orders</span>
                    <span className="font-mono font-bold text-slate-200">
                      {contractor.totalWorkOrders}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <span className="text-slate-500 block text-[10px]">Avg Resolution</span>
                    <span className="font-mono font-bold text-slate-200">
                      {contractor.averageResolutionDays} Days
                    </span>
                  </div>

                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <span className="text-slate-500 block text-[10px]">Penalty Points</span>
                    <span
                      className={`font-mono font-bold ${
                        contractor.penaltyPoints > 30 ? 'text-rose-400' : 'text-slate-300'
                      }`}
                    >
                      {contractor.penaltyPoints} Pts
                    </span>
                  </div>
                </div>

                {/* Recurrence Failure Gauge */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Premature Recurrence Rate:</span>
                    <span
                      className={`font-mono font-bold ${
                        contractor.prematureRecurrenceRate >= 20
                          ? 'text-rose-400'
                          : contractor.prematureRecurrenceRate >= 10
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {contractor.prematureRecurrenceRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, contractor.prematureRecurrenceRate * 2.5)}%` }}
                      className={`h-full ${
                        contractor.prematureRecurrenceRate >= 20
                          ? 'bg-rose-500'
                          : contractor.prematureRecurrenceRate >= 10
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {contractor.prematureRecurrenceRate > 15
                      ? '⚠️ Elevated recurrence: works repeatedly break down within warranty.'
                      : '✓ High durability compliance rating.'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{contractor.contactPerson} ({contractor.phone})</span>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToModule('Maintenance')}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  View Work Orders
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
