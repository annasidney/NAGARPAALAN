import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Database,
  Globe,
  Key,
  RotateCcw,
  Save,
  Server,
  Settings as SettingsIcon,
  Sliders,
  Sparkles
} from 'lucide-react';
import { mockDb } from '../../services/mockDatabase';

export const SettingsView: React.FC = () => {
  const [cityName, setCityName] = useState('Bruhat Bengaluru Mahanagara Palike (BBMP)');
  const [semanticThreshold, setSemanticThreshold] = useState(65);
  const [proximityDistanceMeters, setProximityDistanceMeters] = useState(50);
  const [autoFlagRecurrence, setAutoFlagRecurrence] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
              Module 13
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            System Administration &amp; City Memory Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure municipal jurisdiction boundaries, AI deduplication thresholds, and risk scoring weights.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Configuration Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Civic Jurisdiction & Municipal Metadata */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            Civic Jurisdiction &amp; Administrative Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Municipal Corporation Name</label>
              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2.5 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">State / Province Jurisdiction</label>
              <input
                type="text"
                defaultValue="Karnataka, India"
                disabled
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-400 rounded-lg p-2.5"
              />
            </div>
          </div>
        </div>

        {/* AI Deduplication & Matching Parameters */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            City Memory AI Deduplication &amp; Proximity Thresholds
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Semantic Match Threshold:</label>
                <span className="font-mono font-bold text-amber-400">{semanticThreshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                value={semanticThreshold}
                onChange={(e) => setSemanticThreshold(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-[11px] text-slate-500">
                Minimum semantic similarity score required to propose duplicate linking for human review.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Geographic Radius for Merging:</label>
                <span className="font-mono font-bold text-sky-400">{proximityDistanceMeters} meters</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={proximityDistanceMeters}
                onChange={(e) => setProximityDistanceMeters(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <p className="text-[11px] text-slate-500">
                Maximum distance between complaints to correlate against the same physical asset segment.
              </p>
            </div>
          </div>
        </div>

        {/* Persistence & Database Administration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Database &amp; Demonstration State Management
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <div>
              <div className="font-semibold text-slate-200">Reset Demo State to Initial State</div>
              <div className="text-[11px] text-slate-400">
                Restores pre-seeded assets, complaints, and contractor histories for testing the 5-step scenario.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                mockDb.resetToDefaults();
                alert('Database successfully reset to initial seed state.');
              }}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-2 shrink-0 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Seed State</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
