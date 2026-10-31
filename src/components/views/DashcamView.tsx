import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  Car,
  CheckCircle2,
  Cpu,
  Flame,
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  StopCircle,
  Video
} from 'lucide-react';
import { Asset, DashcamVehicle, Issue, NormalizedAIDetection } from '../../types';
import { REGISTERED_AI_MODELS } from '../../services/aiAdapter';
import { mockDb } from '../../services/mockDatabase';

interface DashcamViewProps {
  vehicles: DashcamVehicle[];
  assets: Asset[];
  issues: Issue[];
  observations: NormalizedAIDetection[];
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const DashcamView: React.FC<DashcamViewProps> = ({
  vehicles,
  assets,
  issues,
  observations,
  onNavigateToModule
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<DashcamVehicle>(vehicles[0]);
  const [selectedModelId, setSelectedModelId] = useState<string>('iwatchroad-v2.1');
  const [isPatrolActive, setIsPatrolActive] = useState<boolean>(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [lastFlaggedRecurrence, setLastFlaggedRecurrence] = useState<{
    asset: Asset;
    issue: Issue;
  } | null>(null);

  const activeModel = REGISTERED_AI_MODELS.find((m) => m.id === selectedModelId) || REGISTERED_AI_MODELS[0];

  // Video frames simulation dataset
  const frames = [
    {
      frameId: 'FRM-4122-0891',
      title: 'MG Road Westbound - Approaching Metro Pillar 42',
      lat: 12.97561,
      lng: 77.60662,
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
      detections: [
        {
          label: 'Pothole (Severe Cavity)',
          box: { x: 28, y: 52, w: 26, h: 20 },
          confidence: 0.94,
          isDefect: true,
          severity: 'critical' as const
        },
        {
          label: 'Lane Marking (Worn)',
          box: { x: 65, y: 68, w: 22, h: 10 },
          confidence: 0.81,
          isDefect: false,
          severity: 'low' as const
        }
      ]
    },
    {
      frameId: 'FRM-4122-0892',
      title: 'MG Road Sector 4 - Near Trinity Circle Curve',
      lat: 12.9751,
      lng: 77.6085,
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      detections: [
        {
          label: 'Longitudinal Crack',
          box: { x: 42, y: 60, w: 18, h: 24 },
          confidence: 0.89,
          isDefect: true,
          severity: 'medium' as const
        }
      ]
    },
    {
      frameId: 'FRM-4122-0893',
      title: 'Brigade Road Junction - Pedestrian Crossing',
      lat: 12.9735,
      lng: 77.6075,
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      detections: [
        {
          label: 'Damaged Luminaire Bracket',
          box: { x: 46, y: 15, w: 14, h: 22 },
          confidence: 0.87,
          isDefect: true,
          severity: 'high' as const
        }
      ]
    }
  ];

  const currentFrame = frames[currentFrameIndex];

  // Simulating patrol frame progression
  useEffect(() => {
    if (!isPatrolActive) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPatrolActive]);

  const handleTriggerDetectionToCityMemory = () => {
    const det = currentFrame.detections[0];
    const res = mockDb.registerDetection({
      category: det.label.toLowerCase().includes('pothole') ? 'pothole' : 'infrastructure_defect',
      defect_type: det.label,
      confidence: det.confidence,
      bbox: [det.box.x, det.box.y, det.box.w, det.box.h],
      frame_ref: currentFrame.frameId,
      lat: currentFrame.lat,
      lng: currentFrame.lng,
      model: activeModel.name,
      version: activeModel.version,
      is_defect: det.isDefect,
      severity: det.severity
    });

    if (res.recurrenceDetected && res.flaggedAsset && res.flaggedIssue) {
      setLastFlaggedRecurrence({
        asset: res.flaggedAsset,
        issue: res.flaggedIssue
      });
    }
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
              Module 2
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Dashcam Intelligence &amp; Autonomous CV Patrol Stream
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time video inference from municipal survey fleets feeding detections directly into City Memory.
          </p>
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:ring-1 focus:ring-amber-500"
          >
            {REGISTERED_AI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.accuracyMetric})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recurrence Flash Alert Banner if triggered */}
      {lastFlaggedRecurrence && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300">
              <Flame className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                City Memory Recurrence Detected!
              </span>
              <h4 className="text-sm font-bold text-slate-100">
                Premature Defect Recurrence at {lastFlaggedRecurrence.asset.name}
              </h4>
              <p className="text-xs text-slate-300">
                Pothole reappeared within warranty period. Contractor penalty initiated.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToModule('City Memory', lastFlaggedRecurrence.asset.id)}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-colors whitespace-nowrap"
          >
            Inspect in City Memory →
          </button>
        </div>
      )}

      {/* Main Video Viewport & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player / Frame Canvas */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-video flex items-center justify-center">
            {/* Background frame image */}
            <img
              src={currentFrame.imageUrl}
              alt={currentFrame.title}
              className="w-full h-full object-cover"
            />

            {/* Bounding Box Overlays */}
            {currentFrame.detections.map((det, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${det.box.x}%`,
                  top: `${det.box.y}%`,
                  width: `${det.box.w}%`,
                  height: `${det.box.h}%`
                }}
                className={`border-2 rounded transition-all ${
                  det.isDefect
                    ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'border-emerald-500 bg-emerald-500/15'
                }`}
              >
                <div
                  className={`absolute -top-6 left-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                    det.isDefect ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {det.label} [{(det.confidence * 100).toFixed(0)}%]
                </div>
              </div>
            ))}

            {/* HUD Overlay Top */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                <span>REC LIVE</span>
                <span className="text-slate-500">|</span>
                <span>{selectedVehicle.vehicleId}</span>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-amber-400">
                Model: {activeModel.name} ({activeModel.version})
              </div>
            </div>

            {/* HUD Overlay Bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
              <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-slate-300">
                GPS: {currentFrame.lat.toFixed(5)}, {currentFrame.lng.toFixed(5)} | Speed: {selectedVehicle.speedKmh} km/h
              </div>

              <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-slate-300">
                Frame: {currentFrame.frameId}
              </div>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPatrolActive(!isPatrolActive)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5"
              >
                {isPatrolActive ? <StopCircle className="w-4 h-4 text-rose-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>{isPatrolActive ? 'Pause Stream' : 'Resume Patrol'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentFrameIndex((prev) => (prev + 1) % frames.length)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
              >
                Next Frame →
              </button>
            </div>

            <button
              type="button"
              onClick={handleTriggerDetectionToCityMemory}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Flame className="w-4 h-4" />
              <span>Send Frame to City Memory</span>
            </button>
          </div>
        </div>

        {/* Patrol Fleet & Detection Telemetry Panel */}
        <div className="space-y-4">
          {/* Active Vehicles Selection */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-sky-400" />
              Surveillance Fleet Status
            </h3>

            <div className="space-y-2">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicle(v)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedVehicle.id === v.id
                      ? 'bg-sky-500/15 border-sky-500 text-slate-100'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{v.vehicleId}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        v.status === 'live' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Route: {v.route}</div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between mt-2 pt-1 border-t border-slate-800/80">
                    <span>Driver: {v.driverName}</span>
                    <span className="font-mono text-amber-400">{v.detectionsCount} Detections</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Specification & Candidate Repo Card */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              Active Detector Architecture
            </h3>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{activeModel.name}</span>
                <span className="font-mono text-emerald-400 text-[11px]">{activeModel.accuracyMetric}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{activeModel.description}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Inference Latency:</span>
                <span className="font-mono text-slate-300">{activeModel.latencyMs} ms/frame</span>
              </div>
              <div className="text-[11px] text-sky-400 break-all font-mono">
                Candidate: {activeModel.candidateRepo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
