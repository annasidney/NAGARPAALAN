import React, { useState } from 'react';
import {
  Compass,
  Filter,
  Flame,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  ShieldAlert
} from 'lucide-react';
import { Asset, DashcamVehicle, Issue } from '../../types';
import { CityMapComponent } from '../CityMapComponent';

interface CityMapViewProps {
  assets: Asset[];
  issues: Issue[];
  vehicles: DashcamVehicle[];
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const CityMapView: React.FC<CityMapViewProps> = ({
  assets,
  issues,
  vehicles,
  onNavigateToModule
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(assets[0]?.id || null);
  const [filterLayer, setFilterLayer] = useState<'all' | 'critical' | 'roads' | 'streetlights'>('all');

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const selectedAssetIssues = issues.filter((i) => i.assetId === selectedAssetId);

  const displayedAssets = assets.filter((asset) => {
    if (filterLayer === 'critical') return asset.currentRiskScore >= 70 || asset.recurrenceCount > 0;
    if (filterLayer === 'roads') return asset.category === 'road';
    if (filterLayer === 'streetlights') return asset.category === 'streetlight';
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
              Module 7
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Interactive City Infrastructure Map
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geospatial layer visualization of physical assets, recurring failure clusters, and live dashcam patrols.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-center">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'critical', label: 'Critical Recurrences' },
            { id: 'roads', label: 'Road Corridors' },
            { id: 'streetlights', label: 'Streetlights' }
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setFilterLayer(l.id as any)}
              className={`px-2.5 py-1.5 rounded font-medium text-xs transition-colors ${
                filterLayer === l.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Inspection Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CityMapComponent
            assets={displayedAssets}
            issues={issues}
            vehicles={vehicles}
            selectedAssetId={selectedAssetId}
            onSelectAsset={(id) => setSelectedAssetId(id)}
            height="600px"
          />
        </div>

        {/* Selected Asset Quick Inspector */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              Asset Inspector
            </h3>

            {selectedAsset ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono text-amber-400 font-bold text-xs">{selectedAsset.assetCode}</span>
                  <h4 className="font-bold text-slate-100 text-sm mt-0.5">{selectedAsset.name}</h4>
                  <div className="text-slate-400 text-[11px]">{selectedAsset.ward}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Risk Score:</span>
                    <span
                      className={`font-mono font-bold ${
                        selectedAsset.currentRiskScore >= 70 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {selectedAsset.currentRiskScore}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Condition:</span>
                    <span className="font-mono text-slate-200">{selectedAsset.conditionScore}/100</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Recurrences:</span>
                    <span className="font-mono font-bold text-rose-400">
                      {selectedAsset.recurrenceCount} Cycles
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-400 block font-semibold">Active Issues ({selectedAssetIssues.length}):</span>
                  {selectedAssetIssues.map((iss) => (
                    <div
                      key={iss.id}
                      className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-amber-400 font-bold">{iss.issueCode}</span>
                        <span className="text-rose-400 uppercase text-[9px] font-bold">{iss.status}</span>
                      </div>
                      <div className="text-slate-300 line-clamp-1">{iss.title}</div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToModule('City Memory', selectedAsset.id)}
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition-colors"
                >
                  <span>Open Full City Memory</span>
                  <span>→</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-8 text-center">
                Click any marker on the map to inspect its digital twin and history.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
