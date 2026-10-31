import { NormalizedAIDetection } from '../types';
import { normalizeAIDetection } from '../utils/cityMemoryEngine';

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  category: 'road_damage' | 'garbage' | 'streetlights';
  candidateRepo: string;
  description: string;
  defectClasses: string[];
  objectClasses: string[];
  accuracyMetric: string;
  latencyMs: number;
  license: string;
}

export const REGISTERED_AI_MODELS: ModelMetadata[] = [
  {
    id: 'iwatchroad-v2.1',
    name: 'iWatchRoad Pavement Inspector',
    version: '2.1.0-yolov8x',
    category: 'road_damage',
    candidateRepo: 'https://github.com/smlab-niser/iwatchroad',
    description: 'Autonomous road surface distress and pothole detection tuned on Indian road topologies and urban asphalt conditions.',
    defectClasses: ['Pothole_Severe', 'Longitudinal_Crack', 'Alligator_Fatigue_Crack', 'Subbase_Depression'],
    objectClasses: ['Manhole_Cover', 'Asphalt_Patch', 'Speed_Breaker', 'White_Striping'],
    accuracyMetric: '92.4% mAP@0.5',
    latencyMs: 38,
    license: 'Apache 2.0 / MIT Academic'
  },
  {
    id: 'trashmonkey-v1.4',
    name: 'TrashMonkey Civic Waste Detector',
    version: '1.4.2-vit',
    category: 'garbage',
    candidateRepo: 'https://github.com/tr4m0ryp/TrashMonkey',
    description: 'Dense municipal solid waste and illegal dumping detection along street curbs and stormwater drain banks.',
    defectClasses: ['Illegal_Dump_Pile', 'Overflowing_Bin', 'Plastic_Litter_Cluster', 'Drainage_Choking_Debris'],
    objectClasses: ['Municipal_Bin_Empty', 'Compost_Pit', 'Street_Sweeper_Cart'],
    accuracyMetric: '88.7% F1-Score',
    latencyMs: 44,
    license: 'GPL v3.0'
  },
  {
    id: 'yolor-streetlights-v3',
    name: 'YOLOR-Streetlights Defect Classifier',
    version: '3.0.1-yolor',
    category: 'streetlights',
    candidateRepo: 'https://huggingface.co/cpnlab/YOLOR-Streetlights',
    description: 'Dual-phase streetlight inspection: detects physical poles, evaluates luminaire damage, broken brackets, and night unlit failures.',
    defectClasses: ['Damaged_Luminaire', 'Broken_Bracket', 'Exposed_Wiring_Hazard', 'Dark_Fixture_Night'],
    objectClasses: ['Functional_LED_Pole', 'Solar_Panel_Mast', 'CCTV_Camera_Mount'],
    accuracyMetric: '94.1% Precision',
    latencyMs: 29,
    license: 'Open Access CC-BY-NC 4.0'
  }
];

export interface PresetVisionSample {
  id: string;
  title: string;
  modelId: string;
  source: 'dashcam' | 'survey_van' | 'citizen';
  location: string;
  ward: string;
  lat: number;
  lng: number;
  imageUrl: string;
  simulatedDetections: Parameters<typeof normalizeAIDetection>[0][];
}

export const PRESET_VISION_SAMPLES: PresetVisionSample[] = [
  {
    id: 'sample-pothole-mgroad',
    title: 'MG Road Sector 4 - Pothole Recurrence Cluster',
    modelId: 'iwatchroad-v2.1',
    source: 'dashcam',
    location: 'MG Road Metro Pillar 42, Bengaluru',
    ward: 'Ward 111 (Shantalanagar)',
    lat: 12.9756,
    lng: 77.6066,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
    simulatedDetections: [
      {
        category: 'pothole',
        defect_type: 'pothole_deep_cavity',
        confidence: 0.94,
        bbox: [22, 44, 26, 18],
        frame_ref: 'DASHCAM_ALPHA_SEC4_0891.JPG',
        lat: 12.9756,
        lng: 77.6066,
        model: 'iWatchRoad-v2.1',
        version: '2.1.0-yolov8x',
        is_defect: true,
        severity: 'critical'
      },
      {
        category: 'road_marking',
        defect_type: 'faded_white_stripe',
        confidence: 0.79,
        bbox: [58, 62, 34, 12],
        frame_ref: 'DASHCAM_ALPHA_SEC4_0891.JPG',
        lat: 12.9756,
        lng: 77.6066,
        model: 'iWatchRoad-v2.1',
        version: '2.1.0-yolov8x',
        is_defect: false,
        severity: 'low'
      }
    ]
  },
  {
    id: 'sample-garbage-commercialst',
    title: 'Commercial St Drain - Waste Choking Point',
    modelId: 'trashmonkey-v1.4',
    source: 'survey_van',
    location: 'Commercial Street Stormwater Culvert 2',
    ward: 'Ward 110 (Sampangiramanagar)',
    lat: 12.9818,
    lng: 77.6083,
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1000&q=80',
    simulatedDetections: [
      {
        category: 'garbage',
        defect_type: 'Drainage_Choking_Debris',
        confidence: 0.91,
        bbox: [32, 52, 38, 28],
        frame_ref: 'SURVEY_VAN_CULL_402.JPG',
        lat: 12.9818,
        lng: 77.6083,
        model: 'TrashMonkey-v1.4',
        version: '1.4.2-vit',
        is_defect: true,
        severity: 'high'
      }
    ]
  },
  {
    id: 'sample-light-brigade',
    title: 'Brigade Road - Broken Luminaire Bracket',
    modelId: 'yolor-streetlights-v3',
    source: 'citizen',
    location: 'Brigade Road Junction Pole B4',
    ward: 'Ward 111 (Shantalanagar)',
    lat: 12.9735,
    lng: 77.6075,
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    simulatedDetections: [
      {
        category: 'streetlight',
        defect_type: 'Damaged_Luminaire',
        confidence: 0.88,
        bbox: [42, 18, 16, 24],
        frame_ref: 'CITIZEN_UPLOAD_POLE_09.JPG',
        lat: 12.9735,
        lng: 77.6075,
        model: 'YOLOR-Streetlights-v3',
        version: '3.0.1-yolor',
        is_defect: true,
        severity: 'medium'
      }
    ]
  }
];

export async function runInferenceThroughAdapter(
  sample: PresetVisionSample
): Promise<NormalizedAIDetection[]> {
  // Simulate network inference latency
  await new Promise((res) => setTimeout(res, 450));
  return sample.simulatedDetections.map((det) => normalizeAIDetection(det));
}
