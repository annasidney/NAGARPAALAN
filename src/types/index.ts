export type AssetCategory = 'road' | 'streetlight' | 'drainage' | 'bridge' | 'traffic_signal' | 'footpath';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus = 'reported' | 'verified' | 'in_progress' | 'repaired' | 'recurring' | 'closed';

export type ComplaintStatus = 'submitted' | 'under_review' | 'linked_to_issue' | 'in_progress' | 'resolved' | 'rejected';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
}

export interface NormalizedAIDetection {
  id: string;
  category: string;
  defect_type: string;
  confidence: number;
  bounding_box: BoundingBox;
  frame_reference: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
  model_name: string;
  model_version: string;
  is_verified_defect: boolean; // Distinction between object detection vs defect
  severity_estimate: IssueSeverity;
}

export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  category: AssetCategory;
  ward: string;
  zone: string;
  latitude: number;
  longitude: number;
  coordinates?: [number, number][]; // Polyline for roads
  installedYear: number;
  specifications: string; // e.g. "4-Lane Bituminous Concrete, 1.2km"
  conditionScore: number; // 0-100 (100 is pristine)
  currentRiskScore: number; // 0-100 (100 is impending failure)
  lastInspectionDate: string;
  contractorAssigned: string;
  warrantyUntil: string;
  totalRepairsCost: number;
  lifetimeComplaintsCount: number;
  recurrenceCount: number;
  notes?: string;
}

export interface Issue {
  id: string;
  issueCode: string;
  assetId: string;
  title: string;
  description: string;
  category: AssetCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  firstDetectedAt: string;
  lastDetectedAt: string;
  recurrenceCount: number;
  locationDescription: string;
  latitude: number;
  longitude: number;
  estimatedCost: number;
  actualCost?: number;
  linkedComplaintIds: string[];
  observationIds: string[];
  repairedAt?: string;
  isRecurrent: boolean;
  recurrenceExplanation?: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  citizenName: string;
  citizenPhone: string;
  description: string;
  category: AssetCategory;
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  photoUrl?: string;
  status: ComplaintStatus;
  linkedIssueId?: string;
  duplicateCandidate?: {
    issueId: string;
    issueTitle: string;
    confidenceScore: number;
    breakdown: {
      semantic: number;
      proximityMeters: number;
      proximityScore: number;
      assetMatch: boolean;
      visualCategory: number;
    };
    explanation: string;
  };
  createdAt: string;
  source: 'citizen_mobile' | 'citizen_portal' | 'official_survey' | 'ai_dashcam_flag';
}

export interface RepairWorkOrder {
  id: string;
  workOrderNumber: string;
  issueId: string;
  assetId: string;
  contractorId: string;
  contractorName: string;
  description: string;
  materialUsed: string;
  cost: number;
  startDate: string;
  completionDate?: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'inspection_passed' | 'warranty_breached';
  warrantyMonths: number;
  warrantyExpiry: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  inspectedBy?: string;
  isRecurrenceFailure?: boolean;
}

export interface Contractor {
  id: string;
  name: string;
  licenseNumber: string;
  specialization: string;
  contactPerson: string;
  phone: string;
  email: string;
  totalWorkOrders: number;
  completedOnTime: number;
  prematureRecurrenceRate: number; // percentage
  averageResolutionDays: number;
  rating: number; // 1.0 - 5.0
  penaltyPoints: number;
  status: 'active' | 'warning' | 'blacklisted';
}

export interface DashcamVehicle {
  id: string;
  vehicleId: string;
  driverName: string;
  route: string;
  status: 'live' | 'completed' | 'idle';
  totalDistanceKm: number;
  detectionsCount: number;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  lastPing: string;
}

export interface DuplicateCheckResult {
  isPotentialDuplicate: boolean;
  matchedIssueId?: string;
  matchedIssueTitle?: string;
  overallScore: number; // 0 - 100
  semanticScore: number; // 0 - 100
  proximityMeters: number;
  proximityScore: number; // 0 - 100
  assetMatch: boolean;
  visualScore: number; // 0 - 100
  explanation: string;
}

export interface AssetRiskAssessment {
  assetId: string;
  score: number; // 0 - 100
  level: 'Low' | 'Moderate' | 'High' | 'Critical';
  factors: {
    name: string;
    weight: number;
    value: string;
    impact: 'positive' | 'neutral' | 'negative' | 'critical';
  }[];
  recommendation: string;
}
