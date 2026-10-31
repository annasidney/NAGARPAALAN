import React from 'react';
import {
  Code2,
  Cpu,
  Database,
  ExternalLink,
  FileCode,
  Layers,
  Server,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { REGISTERED_AI_MODELS } from '../../services/aiAdapter';

export const DataModelsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 font-mono">
              Pillar B: AI Intelligence
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Module 12
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Data, Pretrained Model Registry &amp; Adapter Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Decoupled AI integration layer conforming to Section 5: normalized DTO contract for pluggable detection candidates.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
          <span>3 Pluggable Adapters Active</span>
        </div>
      </div>

      {/* Model Registry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {REGISTERED_AI_MODELS.map((model) => (
          <div
            key={model.id}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded">
                  {model.category.toUpperCase()}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {model.accuracyMetric}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100">{model.name}</h3>
                <span className="text-xs font-mono text-slate-400">{model.version}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{model.description}</p>

              {/* Defect vs Object Classes */}
              <div className="space-y-2 pt-2 border-t border-slate-850 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-rose-400 block mb-1">
                    Defect Classes Classified:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {model.defectClasses.map((cls) => (
                      <span
                        key={cls}
                        className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded font-mono"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    Object Background Classes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {model.objectClasses.map((cls) => (
                      <span
                        key={cls}
                        className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono">License: {model.license}</span>
              <a
                href={model.candidateRepo}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <span>Repo Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Normalized AI Adapter DTO Contract Specification */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Normalized AI Adapter Contract (Prompt Section 5 Specification)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Pydantic / TypeScript Schema</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The core application does not depend directly on any specific detection library. Every CV adapter converts its inference output into this standardized format:
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
          <pre>{`interface NormalizedAIDetection {
  id: string;                     // Unique detection tracking UUID
  category: string;               // High-level category ('pothole', 'garbage', 'streetlight')
  defect_type: string;            // Granular defect class
  confidence: number;             // Confidence probability 0.00 - 1.00
  bounding_box: {                 // Normalized frame coordinate box
    x: number;                    // Left offset (percentage 0-100)
    y: number;                    // Top offset (percentage 0-100)
    width: number;                // Width percentage
    height: number;               // Height percentage
  };
  frame_reference: string;        // Video timestamp or JPEG frame hash
  timestamp: string;              // ISO-8601 UTC timestamp
  latitude: number | null;        // Embedded GPS latitude
  longitude: number | null;       // Embedded GPS longitude
  model_name: string;             // Identification of source neural network
  model_version: string;          // Model checkpoint/weights version
  is_verified_defect: boolean;    // Defect vs general object distinction
  severity_estimate: 'low' | 'medium' | 'high' | 'critical';
}`}</pre>
        </div>
      </div>
    </div>
  );
};
