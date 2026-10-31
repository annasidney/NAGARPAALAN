import {
  Asset,
  AssetRiskAssessment,
  BoundingBox,
  Complaint,
  DuplicateCheckResult,
  Issue,
  NormalizedAIDetection,
  RepairWorkOrder,
} from '../types';

/**
 * Calculates geographic distance in meters between two lat/lng points using Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Stopwords list for semantic similarity computation
 */
const CIVIC_STOPWORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'near',
  'to', 'for', 'of', 'with', 'there', 'very', 'here', 'please', 'fix',
  'bad', 'huge', 'road', 'street', 'area', 'opposite', 'beside', 'front'
]);

/**
 * Domain-specific civic synonym mapping
 */
const CIVIC_SYNONYMS: Record<string, string[]> = {
  pothole: ['crater', 'pit', 'cavity', 'hole', 'depression', 'damage', 'chasm'],
  broken: ['damaged', 'cracked', 'shattered', 'faulty', 'dead', 'dark', 'nonfunctional'],
  streetlight: ['light', 'lamp', 'pole', 'luminaire', 'lantern'],
  garbage: ['trash', 'waste', 'dump', 'debris', 'litter', 'rubbish', 'muck'],
  drain: ['gutter', 'culvert', 'sewer', 'manhole', 'drainage', 'nullah'],
  flooding: ['waterlogging', 'overflow', 'stagnant', 'puddle', 'submerged']
};

/**
 * Computes semantic similarity between two civic descriptions (0 to 100)
 */
export function computeSemanticSimilarity(text1: string, text2: string): number {
  const tokenize = (txt: string) => {
    return txt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !CIVIC_STOPWORDS.has(w));
  };

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  // Expand with synonyms
  const expandTokens = (tokens: string[]) => {
    const set = new Set<string>(tokens);
    for (const t of tokens) {
      for (const [key, syns] of Object.entries(CIVIC_SYNONYMS)) {
        if (t === key || syns.includes(t)) {
          set.add(key);
          syns.forEach((s) => set.add(s));
        }
      }
    }
    return set;
  };

  const set1 = expandTokens(tokens1);
  const set2 = expandTokens(tokens2);

  // Jaccard similarity with domain expansion
  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }

  const union = set1.size + set2.size - intersection;
  if (union === 0) return 0;

  const score = Math.round((intersection / union) * 100);
  return Math.min(100, score);
}

/**
 * Evaluates duplicate matching between an incoming complaint and existing issues
 */
export function evaluateDuplicateMatch(
  complaint: { description: string; latitude: number; longitude: number; category: string; assetId?: string },
  existingIssue: Issue,
  associatedAsset?: Asset
): DuplicateCheckResult {
  const distanceMeters = calculateDistanceMeters(
    complaint.latitude,
    complaint.longitude,
    existingIssue.latitude,
    existingIssue.longitude
  );

  // Proximity scoring: 100% within 15m, down to 0% beyond 150m
  let proximityScore = 0;
  if (distanceMeters <= 15) {
    proximityScore = 100;
  } else if (distanceMeters <= 50) {
    proximityScore = Math.round(100 - ((distanceMeters - 15) / 35) * 30); // 100 -> 70
  } else if (distanceMeters <= 150) {
    proximityScore = Math.round(70 - ((distanceMeters - 50) / 100) * 70); // 70 -> 0
  } else {
    proximityScore = 0;
  }

  const semanticScore = computeSemanticSimilarity(
    complaint.description,
    `${existingIssue.title} ${existingIssue.description}`
  );

  const categoryMatch = complaint.category.toLowerCase() === existingIssue.category.toLowerCase();
  const visualCategoryScore = categoryMatch ? 100 : 25;

  const assetMatch = Boolean(
    complaint.assetId && complaint.assetId === existingIssue.assetId
  ) || distanceMeters <= 40;

  // Weighted score: Proximity (40%), Semantic (35%), Category (15%), Asset (10%)
  const overallScore = Math.round(
    proximityScore * 0.4 +
    semanticScore * 0.35 +
    visualCategoryScore * 0.15 +
    (assetMatch ? 10 : 0)
  );

  const isPotentialDuplicate = overallScore >= 65 || (distanceMeters <= 25 && semanticScore >= 50);

  const explanation = [
    `Geographic distance: ${distanceMeters}m (${proximityScore}% spatial match).`,
    `Semantic language overlap: ${semanticScore}%.`,
    categoryMatch ? 'Identical category match.' : 'Different primary categories.',
    assetMatch ? `Correlated to physical asset (${associatedAsset?.name || existingIssue.assetId}).` : 'Not linked to exact same asset segment.'
  ].join(' ');

  return {
    isPotentialDuplicate,
    matchedIssueId: existingIssue.id,
    matchedIssueTitle: existingIssue.title,
    overallScore,
    semanticScore,
    proximityMeters: distanceMeters,
    proximityScore,
    assetMatch,
    visualScore: visualCategoryScore,
    explanation
  };
}

/**
 * Predicts and calculates explainable risk score for a physical civic asset (0-100)
 */
export function calculateAssetRiskScore(
  asset: Asset,
  issues: Issue[],
  repairs: RepairWorkOrder[]
): AssetRiskAssessment {
  const assetIssues = issues.filter((i) => i.assetId === asset.id);
  const assetRepairs = repairs.filter((r) => r.assetId === asset.id);

  const recurrenceCount = assetIssues.reduce((sum, issue) => sum + (issue.recurrenceCount || 0), 0);
  const activeUnresolvedIssues = assetIssues.filter((i) => i.status !== 'repaired' && i.status !== 'closed').length;

  const currentYear = 2026;
  const ageYears = Math.max(1, currentYear - asset.installedYear);

  // Check for warranty premature failures
  const prematureFailures = assetRepairs.filter((r) => r.isRecurrenceFailure || r.status === 'warranty_breached').length;

  const factors: AssetRiskAssessment['factors'] = [];

  // Factor 1: Recurrence Frequency (Max weight 30)
  let recurrenceImpact: 'positive' | 'neutral' | 'negative' | 'critical' = 'positive';
  let recurrencePoints = 0;
  if (recurrenceCount >= 3) {
    recurrencePoints = 30;
    recurrenceImpact = 'critical';
  } else if (recurrenceCount >= 1) {
    recurrencePoints = 18;
    recurrenceImpact = 'negative';
  } else {
    recurrencePoints = 4;
    recurrenceImpact = 'positive';
  }
  factors.push({
    name: 'Recurring Failure Events',
    weight: 30,
    value: `${recurrenceCount} repeat failure cycles detected`,
    impact: recurrenceImpact
  });

  // Factor 2: Active Open Issues (Max weight 25)
  let activePoints = Math.min(25, activeUnresolvedIssues * 10);
  factors.push({
    name: 'Active Unresolved Defects',
    weight: 25,
    value: `${activeUnresolvedIssues} open defect(s) on asset`,
    impact: activeUnresolvedIssues > 1 ? 'critical' : activeUnresolvedIssues === 1 ? 'negative' : 'positive'
  });

  // Factor 3: Asset Physical Condition Score (Max weight 20)
  // Lower condition score -> higher risk
  const conditionDeficit = Math.max(0, 100 - asset.conditionScore);
  const conditionPoints = Math.round((conditionDeficit / 100) * 20);
  factors.push({
    name: 'Physical Surface Condition',
    weight: 20,
    value: `${asset.conditionScore}/100 structural index`,
    impact: asset.conditionScore < 50 ? 'critical' : asset.conditionScore < 75 ? 'negative' : 'positive'
  });

  // Factor 4: Premature Warranty Failures / Contractor Quality (Max weight 15)
  let warrantyPoints = prematureFailures > 0 ? 15 : 2;
  factors.push({
    name: 'Contractor Work Quality & Warranty Recurrence',
    weight: 15,
    value: prematureFailures > 0 ? `${prematureFailures} premature post-repair failure(s)` : 'No warranty breaches reported',
    impact: prematureFailures > 0 ? 'critical' : 'positive'
  });

  // Factor 5: Asset Age & Fatigue (Max weight 10)
  let agePoints = Math.min(10, Math.round(ageYears * 1.5));
  factors.push({
    name: 'Asset Age & Fatigue Life',
    weight: 10,
    value: `${ageYears} years in service (Built ${asset.installedYear})`,
    impact: ageYears > 7 ? 'negative' : 'neutral'
  });

  const totalScore = Math.min(100, Math.round(
    recurrencePoints + activePoints + conditionPoints + warrantyPoints + agePoints
  ));

  let level: AssetRiskAssessment['level'] = 'Low';
  let recommendation = 'Asset is stable. Routine periodic monitoring advised.';

  if (totalScore >= 80) {
    level = 'Critical';
    recommendation = 'IMMEDIATE INTERVENTION REQUIRED: Chronic recurrence corridor. Blacklist contractor review, full pavement mill-and-pave needed.';
  } else if (totalScore >= 60) {
    level = 'High';
    recommendation = 'ELEVATED RISK: Asset shows premature breakdown pattern. Schedule structural ultrasound & deep drainage inspection.';
  } else if (totalScore >= 40) {
    level = 'Moderate';
    recommendation = 'MODERATE FATIGUE: Perform targeted patch maintenance and verify contractor compliance within 14 days.';
  }

  return {
    assetId: asset.id,
    score: totalScore,
    level,
    factors,
    recommendation
  };
}

/**
 * Normalizes any external CV model output into the standardized NagarPaalan AI Adapter structure
 */
export function normalizeAIDetection(
  raw: {
    category: string;
    defect_type?: string;
    confidence: number;
    bbox: [number, number, number, number]; // [x, y, w, h] in %
    frame_ref?: string;
    timestamp?: string;
    lat?: number | null;
    lng?: number | null;
    model: string;
    version: string;
    is_defect?: boolean;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  }
): NormalizedAIDetection {
  // Distinguish raw object detection from actual defect classification
  const isDefect = raw.is_defect ?? (
    raw.category.toLowerCase().includes('pothole') ||
    raw.category.toLowerCase().includes('damage') ||
    raw.category.toLowerCase().includes('crack') ||
    raw.category.toLowerCase().includes('overflow') ||
    raw.defect_type === 'damaged_luminaire' ||
    raw.defect_type === 'pothole_deep'
  );

  let severity = raw.severity || 'medium';
  if (!severity) {
    if (raw.confidence > 0.85 && (raw.bbox[2] > 25 || raw.bbox[3] > 25)) {
      severity = 'high';
    } else {
      severity = 'medium';
    }
  }

  return {
    id: `det-${Math.random().toString(36).substring(2, 9)}`,
    category: raw.category,
    defect_type: raw.defect_type || raw.category,
    confidence: Math.round(raw.confidence * 100) / 100,
    bounding_box: {
      x: raw.bbox[0],
      y: raw.bbox[1],
      width: raw.bbox[2],
      height: raw.bbox[3]
    },
    frame_reference: raw.frame_ref || 'LIVE_DASHCAM_STREAM_01',
    timestamp: raw.timestamp || new Date().toISOString(),
    latitude: raw.lat ?? null,
    longitude: raw.lng ?? null,
    model_name: raw.model,
    model_version: raw.version,
    is_verified_defect: isDefect,
    severity_estimate: severity
  };
}
