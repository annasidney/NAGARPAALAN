import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  GitCompare,
  RotateCcw,
  Sparkles,
  Video,
  Wrench,
  ShieldAlert
} from 'lucide-react';
import { mockDb } from '../services/mockDatabase';

interface MasterDemoWalkthroughProps {
  currentStep: number;
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const MasterDemoWalkthrough: React.FC<MasterDemoWalkthroughProps> = ({
  currentStep,
  onNavigateToModule,
}) => {
  const steps = [
    {
      num: 1,
      title: 'Citizen Reports Pothole',
      desc: 'Complaint #CMP-1049 registered for MG Road Sector 4 near Metro Pillar 42.',
      icon: FileText,
      targetModule: 'Complaints',
      badge: 'Step 1'
    },
    {
      num: 2,
      title: 'Differently-Worded Duplicate',
      desc: 'AI detects 92% semantic & GPS duplicate match with explainable score. Admin reviews.',
      icon: GitCompare,
      targetModule: 'Complaints',
      badge: 'Step 2'
    },
    {
      num: 3,
      title: 'Repair Dispatched',
      desc: 'Work Order #WO-2026-731 assigned to Apex Urban Infra (₹48,500) under 1-yr warranty.',
      icon: Wrench,
      targetModule: 'Maintenance',
      badge: 'Step 3'
    },
    {
      num: 4,
      title: 'Dashcam Detects Recurrence',
      desc: 'Patrol Vehicle CV flags pothole reappearance at same GPS coordinates.',
      icon: Video,
      targetModule: 'Dashcam Intelligence',
      badge: 'Step 4'
    },
    {
      num: 5,
      title: 'City Memory Elevated Risk',
      desc: 'Recurrence recorded. Asset Risk jumps to 84/100 with contractor penalty & warranty breach.',
      icon: ShieldAlert,
      targetModule: 'City Memory',
      badge: 'Step 5'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 mb-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400 font-mono">
                Hackathon Master Demo
              </span>
              <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                City Memory Loop
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-100">
              End-to-End Failure Recurrence &amp; City Memory Verification Scenario
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => mockDb.resetToDefaults()}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            title="Reset dataset to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Steps bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 mt-3">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = currentStep === st.num;
          const isPassed = currentStep > st.num;

          return (
            <button
              key={st.num}
              type="button"
              onClick={() => {
                mockDb.executeDemoStep(st.num);
                onNavigateToModule(st.targetModule, 'asset-rd-042');
              }}
              className={`p-2.5 rounded-lg border text-left transition-all relative group flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500 text-slate-100 shadow-lg shadow-amber-500/10'
                  : isPassed
                  ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-amber-500 text-slate-950'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPassed ? '✓ Done' : st.badge}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-amber-400' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  />
                </div>
                <div className="text-xs font-semibold text-slate-200 line-clamp-1">{st.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {st.desc}
                </div>
              </div>

              <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex flex-col gap-0.5 text-[10px]">
                <div className="text-amber-400 group-hover:text-amber-300 flex items-center gap-1 font-semibold">
                  <span>{isActive ? 'Current Phase' : 'Trigger Step'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-slate-500 font-mono text-[9px] truncate">{st.targetModule}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
