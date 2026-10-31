import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistanceMeters,
  computeSemanticSimilarity,
  evaluateDuplicateMatch,
  calculateAssetRiskScore,
  normalizeAIDetection
} from './cityMemoryEngine';
import { Asset, Issue, RepairWorkOrder } from '../types';

test('calculateDistanceMeters accurately computes spatial separation', () => {
  // Distance between two points in Bengaluru (MG Road Metro to Brigade Road junction ~ 350m)
  const d = calculateDistanceMeters(12.9756, 77.6066, 12.9734, 77.6075);
  assert.ok(d > 200 && d < 400, `Expected distance ~260m, got ${d}`);

  // Zero distance for identical coordinates
  assert.equal(calculateDistanceMeters(12.9756, 77.6066, 12.9756, 77.6066), 0);
});

test('computeSemanticSimilarity handles civic synonyms and vocabulary expansion', () => {
  // Pothole and crater synonym matching
  const score1 = computeSemanticSimilarity(
    'Huge deep pothole in front of supermarket',
    'Dangerous deep crater near grocery store road'
  );
  assert.ok(score1 >= 40, `Expected high similarity for pothole/crater, got ${score1}`);

  // Disjoint descriptions
  const score2 = computeSemanticSimilarity(
    'Streetlight pole dead at corner',
    'Sewage overflowing into open ditch'
  );
  assert.ok(score2 < 20, `Expected low similarity for unrelated issues, got ${score2}`);
});

test('evaluateDuplicateMatch scores proximity, semantics and generates explainable breakdown', () => {
  const existingIssue: Issue = {
    id: 'iss-101',
    issueCode: 'ISS-2026-001',
    assetId: 'asset-rd-01',
    title: 'Severe Asphalt Pothole on Right Lane',
    description: 'Deep pothole causing two-wheelers to swerve dangerously near metro pillar 42',
    category: 'road',
    severity: 'high',
    status: 'reported',
    firstDetectedAt: '2026-10-25T10:00:00Z',
    lastDetectedAt: '2026-10-25T10:00:00Z',
    recurrenceCount: 0,
    locationDescription: 'MG Road near pillar 42',
    latitude: 12.9756,
    longitude: 77.6066,
    estimatedCost: 35000,
    linkedComplaintIds: ['cmp-1'],
    observationIds: [],
    isRecurrent: false
  };

  const incomingComplaint = {
    description: 'Big hole in the road by metro pillar 42, bikes falling',
    latitude: 12.97565, // ~6 meters away
    longitude: 77.60662,
    category: 'road',
    assetId: 'asset-rd-01'
  };

  const result = evaluateDuplicateMatch(incomingComplaint, existingIssue);
  assert.equal(result.isPotentialDuplicate, true);
  assert.ok(result.overallScore >= 70, `Expected high duplicate score, got ${result.overallScore}`);
  assert.ok(result.proximityMeters <= 10, 'Expected close proximity');
  assert.ok(result.explanation.includes('Geographic distance'), 'Expected explainable summary');
});

test('calculateAssetRiskScore elevates score upon recurring failure and warranty breach', () => {
  const asset: Asset = {
    id: 'asset-rd-01',
    assetCode: 'RD-BLR-042',
    name: 'MG Road Corridor Section 4',
    category: 'road',
    ward: 'Ward 111 (Shantalanagar)',
    zone: 'East Zone',
    latitude: 12.9756,
    longitude: 77.6066,
    installedYear: 2019,
    specifications: '4-Lane Bituminous Concrete, 1.2km',
    conditionScore: 42, // poor condition
    currentRiskScore: 0,
    lastInspectionDate: '2026-10-01',
    contractorAssigned: 'Apex Urban Infra Ltd',
    warrantyUntil: '2027-01-01',
    totalRepairsCost: 145000,
    lifetimeComplaintsCount: 14,
    recurrenceCount: 3
  };

  const issues: Issue[] = [
    {
      id: 'iss-1',
      issueCode: 'ISS-01',
      assetId: 'asset-rd-01',
      title: 'Pothole recurrence',
      description: 'Repeat pothole at same spot',
      category: 'road',
      severity: 'critical',
      status: 'recurring',
      firstDetectedAt: '2026-08-10',
      lastDetectedAt: '2026-10-30',
      recurrenceCount: 3,
      locationDescription: 'Near Pillar 42',
      latitude: 12.9756,
      longitude: 77.6066,
      estimatedCost: 45000,
      linkedComplaintIds: [],
      observationIds: [],
      isRecurrent: true
    }
  ];

  const repairs: RepairWorkOrder[] = [
    {
      id: 'wo-1',
      workOrderNumber: 'WO-882',
      issueId: 'iss-1',
      assetId: 'asset-rd-01',
      contractorId: 'c-1',
      contractorName: 'Apex Urban Infra Ltd',
      description: 'Cold mix pothole patching',
      materialUsed: 'Bitumen Cold Mix Emulsion',
      cost: 48500,
      startDate: '2026-08-15',
      completionDate: '2026-08-18',
      status: 'warranty_breached',
      warrantyMonths: 12,
      warrantyExpiry: '2027-08-18',
      isRecurrenceFailure: true
    }
  ];

  const assessment = calculateAssetRiskScore(asset, issues, repairs);
  assert.ok(assessment.score >= 70, `Expected elevated risk score for recurring asset, got ${assessment.score}`);
  assert.ok(assessment.level === 'High' || assessment.level === 'Critical');
  assert.ok(assessment.factors.some((f) => f.name.includes('Recurring')));
});

test('normalizeAIDetection normalizes raw model data and distinguishes defect from object', () => {
  const rawModelDetection = {
    category: 'pothole',
    confidence: 0.92,
    bbox: [22, 45, 18, 14] as [number, number, number, number],
    model: 'iWatchRoad-v2.1',
    version: '2.1.0',
    lat: 12.9756,
    lng: 77.6066
  };

  const normalized = normalizeAIDetection(rawModelDetection);
  assert.equal(normalized.category, 'pothole');
  assert.equal(normalized.confidence, 0.92);
  assert.equal(normalized.model_name, 'iWatchRoad-v2.1');
  assert.equal(normalized.is_verified_defect, true);
  assert.equal(normalized.bounding_box.x, 22);
});
