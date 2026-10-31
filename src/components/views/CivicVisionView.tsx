import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  FileCode,
  Image as ImageIcon,
  Layers,
  MapPin,
  Sparkles,
  Upload
} from 'lucide-react';
import { Asset, NormalizedAIDetection } from '../../types';
import {
  PRESET_VISION_SAMPLES,
  PresetVisionSample,
  REGISTERED_AI_MODELS,
  runInferenceThroughAdapter
} from '../../services/aiAdapter';
import { mockDb } from '../../services/mockDatabase';

interface CivicVisionViewProps {
  assets: Asset[];
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const CivicVisionView: React.FC<CivicVisionViewProps> = ({
  assets,
  onNavigateToModule
}) => {
  const [selectedSample, setSelectedSample] = useState<PresetVisionSample>(
    PRESET_VISION_SAMPLES[0]
  );
  const [isInferring, setIsInferring] = useState(false);
  const [normalizedResults, setNormalizedResults] = useState<NormalizedAIDetection[]>([]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const activeModel = REGISTERED_AI_MODELS.find((m) => m.id === selectedSample.modelId) || REGISTERED_AI_MODELS[0];

  const handleRunInference = async () => {
    setIsInferring(true);
    setSaveSuccessMessage(null);
    try {
      const results = await runInferenceThroughAdapter(selectedSample);
      setNormalizedResults(results);
    } finally {
      setIsInferring(false);
    }
  };

  const handleSaveToCityMemory = (detection: NormalizedAIDetection) => {
    mockDb.addObservation(detection);
    setSaveSuccessMessage(`Observation logged into City Memory and correlated with nearby asset.`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

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
              Module 3
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Civic Vision &amp; AI Adapter Playground
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test candidate models (iWatchRoad, TrashMonkey, YOLOR-Streetlights) with normalized schema output and defect classification.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunInference}
          disabled={isInferring}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all self-start sm:self-center disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isInferring ? 'Running Inference...' : 'Run Adapter Inference'}</span>
        </button>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Preset Sample Picker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESET_VISION_SAMPLES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => {
              setSelectedSample(sample);
              setNormalizedResults([]);
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
              selectedSample.id === sample.id
                ? 'bg-amber-500/10 border-amber-500 text-slate-100'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <img
              src={sample.imageUrl}
              alt={sample.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-800"
            />
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">
                {sample.modelId}
              </span>
              <div className="text-xs font-semibold text-slate-200 line-clamp-1">{sample.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-1">{sample.location}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Inspection Canvas & JSON Schema Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Canvas with Overlays */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" />
              Vision Inspection Viewport
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              GPS: {selectedSample.lat}, {selectedSample.lng}
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
            <img
              src={selectedSample.imageUrl}
              alt={selectedSample.title}
              className="w-full h-full object-cover"
            />

            {/* Render bounding boxes if inference has run or preset sample active */}
            {(normalizedResults.length > 0 ? normalizedResults : selectedSample.simulatedDetections).map(
              (det: any, idx: number) => {
                const box = det.bounding_box || {
                  x: det.bbox[0],
                  y: det.bbox[1],
                  width: det.bbox[2],
                  height: det.bbox[3]
                };
                const isDefect = det.is_verified_defect ?? det.is_defect;

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`
                    }}
                    className={`border-2 rounded transition-all ${
                      isDefect
                        ? 'border-rose-500 bg-rose-500/15'
                        : 'border-emerald-500 bg-emerald-500/15'
                    }`}
                  >
                    <div
                      className={`absolute -top-5 left-0 text-[10px] font-mono font-bold px-1 py-0.2 rounded ${
                        isDefect ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {det.category || det.defect_type} ({(det.confidence * 100).toFixed(0)}%)
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Defect vs Object Distinction:</span>
              <span className="text-[11px] font-mono text-amber-400">Section 5 Principle</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Detecting an object (e.g. Streetlight pole or manhole) does not prove a failure.
              The AI Adapter classifies failure states distinctly from general infrastructure detection.
            </p>
          </div>
        </div>

        {/* Normalized AI Adapter JSON Output */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              Standardized AI Adapter Schema
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded">
              Normalized DTO
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[380px] leading-relaxed">
            <pre>
              {JSON.stringify(
                normalizedResults.length > 0
                  ? normalizedResults
                  : {
                      note: 'Click "Run Adapter Inference" above to execute model pipeline and generate normalized structure.',
                      expected_fields: [
                        'category',
                        'confidence',
                        'bounding_box: { x, y, width, height }',
                        'frame_reference',
                        'timestamp',
                        'latitude',
                        'longitude',
                        'model_name',
                        'model_version',
                        'is_verified_defect',
                        'severity_estimate'
                      ]
                    },
                null,
                2
              )}
            </pre>
          </div>

          {normalizedResults.length > 0 && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSaveToCityMemory(normalizedResults[0])}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                <span>Save to City Memory &amp; Correlate Asset</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
