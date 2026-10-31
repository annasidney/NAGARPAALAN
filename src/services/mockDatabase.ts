import {
  Asset,
  Complaint,
  Contractor,
  DashcamVehicle,
  Issue,
  NormalizedAIDetection,
  RepairWorkOrder,
} from '../types';
import { calculateAssetRiskScore, evaluateDuplicateMatch, normalizeAIDetection } from '../utils/cityMemoryEngine';

// Initial pre-seeded assets
export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'asset-rd-042',
    assetCode: 'RD-BLR-042',
    name: 'MG Road Corridor - Sector 4 (Metro Pillar 38-46)',
    category: 'road',
    ward: 'Ward 111 (Shantalanagar)',
    zone: 'East Zone',
    latitude: 12.9756,
    longitude: 77.6066,
    coordinates: [
      [12.9762, 77.6050],
      [12.9756, 77.6066],
      [12.9750, 77.6082]
    ],
    installedYear: 2021,
    specifications: '4-Lane Heavy Bituminous Surface, 1.4km Corridor',
    conditionScore: 54,
    currentRiskScore: 78,
    lastInspectionDate: '2026-10-18',
    contractorAssigned: 'Apex Urban Infra Ltd',
    warrantyUntil: '2026-12-31',
    totalRepairsCost: 184500,
    lifetimeComplaintsCount: 16,
    recurrenceCount: 2,
    notes: 'Chronic monsoon subsurface water ingress under Metro viaduct.'
  },
  {
    id: 'asset-rd-089',
    assetCode: 'RD-BLR-089',
    name: 'Indiranagar 100 Feet Road (12th Main to 6th Main)',
    category: 'road',
    ward: 'Ward 80 (Hoysalanagar)',
    zone: 'East Zone',
    latitude: 12.9719,
    longitude: 77.6412,
    installedYear: 2022,
    specifications: 'Urban Commercial Arterial, Dual 2-Lane, 1.8km',
    conditionScore: 82,
    currentRiskScore: 32,
    lastInspectionDate: '2026-10-24',
    contractorAssigned: 'Karnataka Civic Civil Works',
    warrantyUntil: '2027-05-15',
    totalRepairsCost: 45000,
    lifetimeComplaintsCount: 5,
    recurrenceCount: 0,
    notes: 'Recent micro-surfacing holding well despite high bus volume.'
  },
  {
    id: 'asset-rd-114',
    assetCode: 'RD-BLR-114',
    name: 'Koramangala 80 Feet Road (Sony World Junction)',
    category: 'road',
    ward: 'Ward 151 (Koramangala)',
    zone: 'South Zone',
    latitude: 12.9352,
    longitude: 77.6245,
    installedYear: 2020,
    specifications: '6-Lane Divided Boulevard, High Commercial Load',
    conditionScore: 48,
    currentRiskScore: 84,
    lastInspectionDate: '2026-10-20',
    contractorAssigned: 'Shirdi Roadways Consortium',
    warrantyUntil: '2025-06-30',
    totalRepairsCost: 310000,
    lifetimeComplaintsCount: 28,
    recurrenceCount: 4,
    notes: 'Severe utility trenching cuts by telecom agencies weakened subbase.'
  },
  {
    id: 'asset-sl-031',
    assetCode: 'SL-BLR-031',
    name: 'Brigade Road Pedestrian Luminaire Grid B4',
    category: 'streetlight',
    ward: 'Ward 111 (Shantalanagar)',
    zone: 'East Zone',
    latitude: 12.9735,
    longitude: 77.6075,
    installedYear: 2023,
    specifications: 'Smart LED 120W Pole Array, Central DALI Dimming',
    conditionScore: 89,
    currentRiskScore: 18,
    lastInspectionDate: '2026-10-22',
    contractorAssigned: 'Karnataka Civic Civil Works',
    warrantyUntil: '2028-03-31',
    totalRepairsCost: 12000,
    lifetimeComplaintsCount: 3,
    recurrenceCount: 0
  },
  {
    id: 'asset-dr-019',
    assetCode: 'DR-BLR-019',
    name: 'Commercial Street Stormwater Drain Channel 2',
    category: 'drainage',
    ward: 'Ward 110 (Sampangiramanagar)',
    zone: 'East Zone',
    latitude: 12.9818,
    longitude: 77.6083,
    installedYear: 2019,
    specifications: 'Box RCC Culvert with Precast Silt Trap Slabs, 950m',
    conditionScore: 61,
    currentRiskScore: 65,
    lastInspectionDate: '2026-10-15',
    contractorAssigned: 'Apex Urban Infra Ltd',
    warrantyUntil: '2026-09-30',
    totalRepairsCost: 92000,
    lifetimeComplaintsCount: 9,
    recurrenceCount: 1,
    notes: 'Prone to commercial plastic packaging blockages.'
  },
  {
    id: 'asset-fl-007',
    assetCode: 'FL-BLR-007',
    name: 'Outer Ring Road Flyover Span 12-14 (Bellandur)',
    category: 'bridge',
    ward: 'Ward 150 (Bellandur)',
    zone: 'Mahadevapura',
    latitude: 12.9304,
    longitude: 77.6784,
    installedYear: 2017,
    specifications: 'Pre-stressed Concrete Elevated Viaduct, Expansion Joint Bay',
    conditionScore: 71,
    currentRiskScore: 49,
    lastInspectionDate: '2026-09-29',
    contractorAssigned: 'Vayuputra Asphalt Systems',
    warrantyUntil: '2027-11-20',
    totalRepairsCost: 240000,
    lifetimeComplaintsCount: 7,
    recurrenceCount: 1
  }
];

// Initial issues
export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss-1049',
    issueCode: 'ISS-2026-1049',
    assetId: 'asset-rd-042',
    title: 'Severe Asphalt Cavity & Subbase Depression',
    description: 'Deep pothole (approx 65cm x 40cm, 8cm deep) on the right lane directly opposite Metro Pillar 42. Causes severe hazard to two-wheelers during evening peak traffic.',
    category: 'road',
    severity: 'critical',
    status: 'reported',
    firstDetectedAt: '2026-10-27T08:30:00Z',
    lastDetectedAt: '2026-10-30T10:15:00Z',
    recurrenceCount: 1,
    locationDescription: 'MG Road Westbound, adjacent to Metro Pillar 42',
    latitude: 12.9756,
    longitude: 77.6066,
    estimatedCost: 48500,
    linkedComplaintIds: ['cmp-101'],
    observationIds: ['obs-01'],
    isRecurrent: true,
    recurrenceExplanation: 'Same coordinates patched 72 days ago under WO-731. Bitumen cold-mix disintegrated after pre-monsoon showers.'
  },
  {
    id: 'iss-1033',
    issueCode: 'ISS-2026-1033',
    assetId: 'asset-rd-114',
    title: 'Multiple Alligator Cracks and Surface Slump',
    description: 'Extensive longitudinal fatigue cracking spanning 12 meters across middle and curbside lanes near Sony World Junction signal.',
    category: 'road',
    severity: 'high',
    status: 'in_progress',
    firstDetectedAt: '2026-10-12T14:20:00Z',
    lastDetectedAt: '2026-10-28T16:00:00Z',
    recurrenceCount: 3,
    locationDescription: 'Sony World Junction North approach',
    latitude: 12.9352,
    longitude: 77.6245,
    estimatedCost: 125000,
    linkedComplaintIds: ['cmp-102', 'cmp-103'],
    observationIds: ['obs-02'],
    isRecurrent: true,
    recurrenceExplanation: 'Fourth failure at same junction within 18 months. Heavy water stagnation from blocked side culvert.'
  },
  {
    id: 'iss-1021',
    issueCode: 'ISS-2026-1021',
    assetId: 'asset-dr-019',
    title: 'Silt Blockage and Broken Precast Manhole Cover',
    description: 'Broken precast slab exposing stormwater culvert; silt accumulation impeding discharge by 70%.',
    category: 'drainage',
    severity: 'high',
    status: 'verified',
    firstDetectedAt: '2026-10-19T09:00:00Z',
    lastDetectedAt: '2026-10-29T11:45:00Z',
    recurrenceCount: 1,
    locationDescription: 'Opposite Cauvery Emporium corner',
    latitude: 12.9818,
    longitude: 77.6083,
    estimatedCost: 35000,
    linkedComplaintIds: ['cmp-104'],
    observationIds: [],
    isRecurrent: false
  }
];

// Initial complaints
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-101',
    complaintNumber: 'CMP-2026-1049',
    citizenName: 'Ramesh K. Sundaram',
    citizenPhone: '+91 98450 12891',
    description: 'Terrible deep pothole on MG Road opposite metro pillar 42. Yesterday my scooter wheel got stuck, very dangerous at night.',
    category: 'road',
    latitude: 12.97562,
    longitude: 77.60661,
    address: 'Near Metro Pillar 42, MG Road, Shantalanagar',
    ward: 'Ward 111 (Shantalanagar)',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'linked_to_issue',
    linkedIssueId: 'iss-1049',
    createdAt: '2026-10-27T08:30:00Z',
    source: 'citizen_mobile'
  },
  {
    id: 'cmp-102',
    complaintNumber: 'CMP-2026-1033',
    citizenName: 'Pooja Venkatesh',
    citizenPhone: '+91 97412 88390',
    description: 'Huge broken patch and cracks near Sony World signal Koramangala. Traffic slows down completely.',
    category: 'road',
    latitude: 12.93518,
    longitude: 77.62453,
    address: '80 Feet Rd, Sony World Signal, Koramangala 4th Block',
    ward: 'Ward 151 (Koramangala)',
    status: 'linked_to_issue',
    linkedIssueId: 'iss-1033',
    createdAt: '2026-10-12T14:20:00Z',
    source: 'citizen_portal'
  },
  {
    id: 'cmp-103',
    complaintNumber: 'CMP-2026-1038',
    citizenName: 'Anand Mohan',
    citizenPhone: '+91 99001 54721',
    description: 'Road surface sinking at Sony World junction Koramangala, uneven leveling causing car underbody scrape.',
    category: 'road',
    latitude: 12.93522,
    longitude: 77.62448,
    address: 'Sony World Signal, Koramangala',
    ward: 'Ward 151 (Koramangala)',
    status: 'linked_to_issue',
    linkedIssueId: 'iss-1033',
    createdAt: '2026-10-14T11:05:00Z',
    source: 'citizen_mobile'
  },
  {
    id: 'cmp-104',
    complaintNumber: 'CMP-2026-1021',
    citizenName: 'Mohd. Zeeshan',
    citizenPhone: '+91 96860 44102',
    description: 'Drain slab broken on Commercial street near clothing store. Foul water stagnating.',
    category: 'drainage',
    latitude: 12.9818,
    longitude: 77.6083,
    address: 'Commercial Street cross drain',
    ward: 'Ward 110 (Sampangiramanagar)',
    status: 'linked_to_issue',
    linkedIssueId: 'iss-1021',
    createdAt: '2026-10-19T09:00:00Z',
    source: 'citizen_portal'
  }
];

// Initial contractors
export const INITIAL_CONTRACTORS: Contractor[] = [
  {
    id: 'cont-01',
    name: 'Apex Urban Infra Ltd',
    licenseNumber: 'BBMP-CLASS-1-A89',
    specialization: 'Asphalt & Bituminous Pavement Maintenance',
    contactPerson: 'Suresh Gowda (Project Director)',
    phone: '+91 98440 33210',
    email: 'operations@apexurbaninfra.in',
    totalWorkOrders: 64,
    completedOnTime: 48,
    prematureRecurrenceRate: 24.5, // High recurrence!
    averageResolutionDays: 14.2,
    rating: 3.1,
    penaltyPoints: 42,
    status: 'warning'
  },
  {
    id: 'cont-02',
    name: 'Karnataka Civic Civil Works',
    licenseNumber: 'BBMP-CLASS-1-K12',
    specialization: 'Structural Bridges, Smart Lighting & Urban Concreting',
    contactPerson: 'Nandita Rao (Chief Engineer)',
    phone: '+91 98801 77450',
    email: 'info@karnatakacivic.org',
    totalWorkOrders: 92,
    completedOnTime: 89,
    prematureRecurrenceRate: 4.2, // Excellent!
    averageResolutionDays: 5.6,
    rating: 4.8,
    penaltyPoints: 0,
    status: 'active'
  },
  {
    id: 'cont-03',
    name: 'Vayuputra Asphalt Systems',
    licenseNumber: 'BBMP-CLASS-2-V44',
    specialization: 'Hot Mix Milling & Surface Micro-surfacing',
    contactPerson: 'K. Balaji',
    phone: '+91 94480 61129',
    email: 'vayuputra.asphalt@gmail.com',
    totalWorkOrders: 38,
    completedOnTime: 31,
    prematureRecurrenceRate: 14.1,
    averageResolutionDays: 9.8,
    rating: 3.9,
    penaltyPoints: 12,
    status: 'active'
  },
  {
    id: 'cont-04',
    name: 'Shirdi Roadways Consortium',
    licenseNumber: 'BBMP-CLASS-2-S09',
    specialization: 'Drainage Restoration & Patch Works',
    contactPerson: 'Ravi Teja',
    phone: '+91 99860 12093',
    email: 'shirdiroadways@outlook.com',
    totalWorkOrders: 45,
    completedOnTime: 26,
    prematureRecurrenceRate: 31.8, // Severe
    averageResolutionDays: 18.5,
    rating: 2.3,
    penaltyPoints: 75,
    status: 'blacklisted'
  }
];

// Initial repair work orders
export const INITIAL_REPAIRS: RepairWorkOrder[] = [
  {
    id: 'rep-731',
    workOrderNumber: 'WO-2026-731',
    issueId: 'iss-1049',
    assetId: 'asset-rd-042',
    contractorId: 'cont-01',
    contractorName: 'Apex Urban Infra Ltd',
    description: 'Cold-patch pothole repair and bitumen emulsion sealing near Metro Pillar 42.',
    materialUsed: 'Commercial Cold-mix Bitumen Emulsion (VG-30)',
    cost: 41200,
    startDate: '2026-08-14',
    completionDate: '2026-08-16',
    status: 'warranty_breached',
    warrantyMonths: 12,
    warrantyExpiry: '2027-08-16',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
    inspectedBy: 'Er. M. Narayanaswamy (Assistant Exec. BBMP)',
    isRecurrenceFailure: true
  },
  {
    id: 'rep-640',
    workOrderNumber: 'WO-2026-640',
    issueId: 'iss-1033',
    assetId: 'asset-rd-114',
    contractorId: 'cont-04',
    contractorName: 'Shirdi Roadways Consortium',
    description: 'Patch repair of fatigue cracks and surface compaction at Sony World Junction.',
    materialUsed: 'Standard Semi-Dense Bituminous Concrete',
    cost: 84000,
    startDate: '2026-06-02',
    completionDate: '2026-06-07',
    status: 'warranty_breached',
    warrantyMonths: 12,
    warrantyExpiry: '2027-06-07',
    inspectedBy: 'Er. S. Chethan (Ward 151 AE)',
    isRecurrenceFailure: true
  },
  {
    id: 'rep-805',
    workOrderNumber: 'WO-2026-805',
    issueId: 'iss-1021',
    assetId: 'asset-dr-019',
    contractorId: 'cont-02',
    contractorName: 'Karnataka Civic Civil Works',
    description: 'Replacement of damaged stormwater precast RCC cover slabs.',
    materialUsed: 'M-30 Grade Precast Reinforced Concrete Slabs',
    cost: 28500,
    startDate: '2026-10-23',
    completionDate: '2026-10-25',
    status: 'completed',
    warrantyMonths: 24,
    warrantyExpiry: '2028-10-25',
    inspectedBy: 'Er. K. Priya (Central Ward Exec. Engg)'
  }
];

// Initial Dashcam Patrol Fleet
export const INITIAL_VEHICLES: DashcamVehicle[] = [
  {
    id: 'veh-01',
    vehicleId: 'KA-04-G-4122 (Civic Patrol Alpha)',
    driverName: 'Manjunath B.',
    route: 'MG Road -> Brigade Road -> Commercial St Corridor',
    status: 'live',
    totalDistanceKm: 42.4,
    detectionsCount: 14,
    currentLat: 12.9758,
    currentLng: 77.6068,
    speedKmh: 28,
    lastPing: '2026-10-30T13:10:00Z'
  },
  {
    id: 'veh-02',
    vehicleId: 'KA-01-EA-8819 (Waste Surveillance Van 3)',
    driverName: 'Govinda Raju',
    route: 'Indiranagar 100ft Rd -> CMH Road',
    status: 'live',
    totalDistanceKm: 61.2,
    detectionsCount: 8,
    currentLat: 12.9719,
    currentLng: 77.6412,
    speedKmh: 34,
    lastPing: '2026-10-30T13:08:45Z'
  },
  {
    id: 'veh-03',
    vehicleId: 'KA-05-MH-1904 (Koramangala Ward Patrol)',
    driverName: 'Santhosh Kumar',
    route: 'Koramangala 80ft Rd -> Sarjapur Signal',
    status: 'idle',
    totalDistanceKm: 33.8,
    detectionsCount: 19,
    currentLat: 12.9352,
    currentLng: 77.6245,
    speedKmh: 0,
    lastPing: '2026-10-30T12:45:00Z'
  }
];

// Global in-memory storage with pub/sub for reactive UI updates
class MockDatabase {
  private assets: Asset[] = [...INITIAL_ASSETS];
  private issues: Issue[] = [...INITIAL_ISSUES];
  private complaints: Complaint[] = [...INITIAL_COMPLAINTS];
  private contractors: Contractor[] = [...INITIAL_CONTRACTORS];
  private repairs: RepairWorkOrder[] = [...INITIAL_REPAIRS];
  private vehicles: DashcamVehicle[] = [...INITIAL_VEHICLES];
  private observations: NormalizedAIDetection[] = [];
  private listeners: (() => void)[] = [];

  // Hackathon Master Demo State (5 Steps)
  public demoStep: number = 0; // 0 = not started, 1 = reported, 2 = duplicate checked, 3 = repaired, 4 = dashcam recurrence, 5 = risk elevated

  constructor() {
    this.refreshAssetRiskScores();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getAssets(): Asset[] {
    return [...this.assets];
  }

  public getAssetById(id: string): Asset | undefined {
    return this.assets.find((a) => a.id === id);
  }

  public getIssues(): Issue[] {
    return [...this.issues];
  }

  public getIssueById(id: string): Issue | undefined {
    return this.issues.find((i) => i.id === id);
  }

  public getComplaints(): Complaint[] {
    return [...this.complaints];
  }

  public getContractors(): Contractor[] {
    return [...this.contractors];
  }

  public getRepairs(): RepairWorkOrder[] {
    return [...this.repairs];
  }

  public getVehicles(): DashcamVehicle[] {
    return [...this.vehicles];
  }

  public getObservations(): NormalizedAIDetection[] {
    return [...this.observations];
  }

  public addObservation(obs: NormalizedAIDetection) {
    this.observations.unshift(obs);
    this.notify();
  }

  public refreshAssetRiskScores() {
    this.assets = this.assets.map((asset) => {
      const assessment = calculateAssetRiskScore(asset, this.issues, this.repairs);
      return {
        ...asset,
        currentRiskScore: assessment.score
      };
    });
  }

  /**
   * Submits a new citizen complaint and runs duplicate detection against active issues
   */
  public submitComplaint(data: {
    citizenName: string;
    citizenPhone: string;
    description: string;
    category: Asset['category'];
    latitude: number;
    longitude: number;
    address: string;
    ward: string;
    photoUrl?: string;
  }): { complaint: Complaint; duplicateResult?: ReturnType<typeof evaluateDuplicateMatch> } {
    const complaintNumber = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Find nearest matching asset
    let closestAsset: Asset | undefined;
    let minDistance = Infinity;

    for (const a of this.assets) {
      if (a.category === data.category || (data.category === 'road' && a.category === 'road')) {
        const d = Math.hypot(a.latitude - data.latitude, a.longitude - data.longitude) * 111000;
        if (d < minDistance) {
          minDistance = d;
          closestAsset = a;
        }
      }
    }

    // Evaluate duplicates across existing open issues
    let bestDuplicateResult: ReturnType<typeof evaluateDuplicateMatch> | undefined;

    for (const iss of this.issues) {
      if (iss.status !== 'closed') {
        const res = evaluateDuplicateMatch(
          {
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            category: data.category,
            assetId: closestAsset?.id
          },
          iss,
          closestAsset
        );

        if (!bestDuplicateResult || res.overallScore > bestDuplicateResult.overallScore) {
          bestDuplicateResult = res;
        }
      }
    }

    const complaint: Complaint = {
      id: `cmp-${Date.now()}`,
      complaintNumber,
      citizenName: data.citizenName,
      citizenPhone: data.citizenPhone,
      description: data.description,
      category: data.category,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      ward: data.ward,
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      status: bestDuplicateResult && bestDuplicateResult.isPotentialDuplicate ? 'under_review' : 'submitted',
      duplicateCandidate: bestDuplicateResult && bestDuplicateResult.isPotentialDuplicate ? {
        issueId: bestDuplicateResult.matchedIssueId!,
        issueTitle: bestDuplicateResult.matchedIssueTitle!,
        confidenceScore: bestDuplicateResult.overallScore,
        breakdown: {
          semantic: bestDuplicateResult.semanticScore,
          proximityMeters: bestDuplicateResult.proximityMeters,
          proximityScore: bestDuplicateResult.proximityScore,
          assetMatch: bestDuplicateResult.assetMatch,
          visualCategory: bestDuplicateResult.visualScore
        },
        explanation: bestDuplicateResult.explanation
      } : undefined,
      createdAt: new Date().toISOString(),
      source: 'citizen_mobile'
    };

    this.complaints.unshift(complaint);
    this.notify();

    return { complaint, duplicateResult: bestDuplicateResult };
  }

  /**
   * Admin confirms duplicate and links complaint to existing issue
   */
  public confirmDuplicate(complaintId: string, issueId: string) {
    const complaint = this.complaints.find((c) => c.id === complaintId);
    const issue = this.issues.find((i) => i.id === issueId);
    if (!complaint || !issue) return;

    complaint.status = 'linked_to_issue';
    complaint.linkedIssueId = issueId;

    if (!issue.linkedComplaintIds.includes(complaintId)) {
      issue.linkedComplaintIds.push(complaintId);
    }
    issue.lastDetectedAt = new Date().toISOString();

    this.notify();
  }

  /**
   * Logs a completed repair work order
   */
  public recordRepair(repairData: {
    issueId: string;
    assetId: string;
    contractorId: string;
    description: string;
    materialUsed: string;
    cost: number;
    warrantyMonths: number;
    beforePhotoUrl?: string;
    afterPhotoUrl?: string;
  }) {
    const contractor = this.contractors.find((c) => c.id === repairData.contractorId);
    const issue = this.issues.find((i) => i.id === repairData.issueId);
    const asset = this.assets.find((a) => a.id === repairData.assetId);

    const now = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + repairData.warrantyMonths);

    const repair: RepairWorkOrder = {
      id: `rep-${Date.now()}`,
      workOrderNumber: `WO-2026-${Math.floor(100 + Math.random() * 900)}`,
      issueId: repairData.issueId,
      assetId: repairData.assetId,
      contractorId: repairData.contractorId,
      contractorName: contractor?.name || 'Assigned Civic Contractor',
      description: repairData.description,
      materialUsed: repairData.materialUsed,
      cost: repairData.cost,
      startDate: now.toISOString().split('T')[0],
      completionDate: now.toISOString().split('T')[0],
      status: 'completed',
      warrantyMonths: repairData.warrantyMonths,
      warrantyExpiry: expiryDate.toISOString().split('T')[0],
      beforePhotoUrl: repairData.beforePhotoUrl,
      afterPhotoUrl: repairData.afterPhotoUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
      inspectedBy: 'Er. Rajesh V. (Municipal Field Inspector)'
    };

    this.repairs.unshift(repair);

    if (issue) {
      issue.status = 'repaired';
      issue.actualCost = repairData.cost;
      issue.repairedAt = now.toISOString();
    }

    if (asset) {
      asset.totalRepairsCost += repairData.cost;
      asset.conditionScore = Math.min(95, asset.conditionScore + 18);
    }

    if (contractor) {
      contractor.totalWorkOrders += 1;
      contractor.completedOnTime += 1;
    }

    this.refreshAssetRiskScores();
    this.notify();
    return repair;
  }

  /**
   * Registers a Dashcam or Civic Vision Detection.
   * If it matches a previously repaired issue on the asset, flags a RECURRENCE!
   */
  public registerDetection(rawDetection: Parameters<typeof normalizeAIDetection>[0]): {
    observation: NormalizedAIDetection;
    recurrenceDetected: boolean;
    flaggedAsset?: Asset;
    flaggedIssue?: Issue;
  } {
    const obs = normalizeAIDetection(rawDetection);
    this.observations.unshift(obs);

    let recurrenceDetected = false;
    let flaggedAsset: Asset | undefined;
    let flaggedIssue: Issue | undefined;

    // Check if within 50m of an asset with previous repaired issues
    if (obs.latitude && obs.longitude && obs.is_verified_defect) {
      for (const asset of this.assets) {
        if (asset.category === 'road' || asset.category === 'drainage') {
          const dist = Math.hypot(asset.latitude - obs.latitude, asset.longitude - obs.longitude) * 111000;
          if (dist <= 65) {
            flaggedAsset = asset;

            // Check if there are repaired issues on this asset
            const repairedIssues = this.issues.filter(
              (i) => i.assetId === asset.id && (i.status === 'repaired' || i.status === 'closed' || i.isRecurrent)
            );

            if (repairedIssues.length > 0) {
              const prevIssue = repairedIssues[0];
              recurrenceDetected = true;
              flaggedIssue = prevIssue;

              prevIssue.status = 'recurring';
              prevIssue.recurrenceCount = (prevIssue.recurrenceCount || 0) + 1;
              prevIssue.lastDetectedAt = obs.timestamp;
              prevIssue.isRecurrent = true;
              prevIssue.recurrenceExplanation = `RECURRENCE ALERT: AI Dashcam (${obs.model_name}) detected defect reappearance at exact GPS coordinates after repair.`;
              prevIssue.observationIds.push(obs.id);

              // Update asset risk and recurrence count
              asset.recurrenceCount = (asset.recurrenceCount || 0) + 1;
              asset.conditionScore = Math.max(25, asset.conditionScore - 20);

              // Find associated contractor work order and mark warranty breach
              const breachRepair = this.repairs.find((r) => r.issueId === prevIssue.id || r.assetId === asset.id);
              if (breachRepair) {
                breachRepair.status = 'warranty_breached';
                breachRepair.isRecurrenceFailure = true;

                const contractor = this.contractors.find((c) => c.id === breachRepair.contractorId);
                if (contractor) {
                  contractor.penaltyPoints += 15;
                  contractor.prematureRecurrenceRate = Math.min(50, contractor.prematureRecurrenceRate + 4.5);
                }
              }

              break;
            }
          }
        }
      }
    }

    this.refreshAssetRiskScores();
    this.notify();

    return {
      observation: obs,
      recurrenceDetected,
      flaggedAsset,
      flaggedIssue
    };
  }

  // Execute steps of the 5-step Master Demonstration
  public executeDemoStep(step: number) {
    if (step === 1) {
      // Step 1: Citizen reports pothole
      this.demoStep = 1;
      // Ensure issue 1049 is in reported state
      const iss = this.issues.find((i) => i.id === 'iss-1049');
      if (iss) {
        iss.status = 'reported';
        iss.recurrenceCount = 0;
        iss.isRecurrent = false;
      }
    } else if (step === 2) {
      // Step 2: Differently worded report arrives -> AI flags duplicate with explainable match
      this.demoStep = 2;
      const res = this.submitComplaint({
        citizenName: 'Deepa Narayan',
        citizenPhone: '+91 94481 99014',
        description: 'Large asphalt crater near metro pillar 42 right in front of Anand Sweets MG road, cars are swerving sharply.',
        category: 'road',
        latitude: 12.97564, // ~4m away
        longitude: 77.60663,
        address: 'Opposite Anand Sweets, Pillar 42, MG Road',
        ward: 'Ward 111 (Shantalanagar)',
        photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
      });
      return res;
    } else if (step === 3) {
      // Step 3: Admin confirms and records repair
      this.demoStep = 3;
      const iss = this.issues.find((i) => i.id === 'iss-1049');
      if (iss) {
        this.recordRepair({
          issueId: 'iss-1049',
          assetId: 'asset-rd-042',
          contractorId: 'cont-01',
          description: 'Emergency bituminous cold-mix compaction and surface seal at Metro Pillar 42.',
          materialUsed: 'Standard Bitumen Cold Mix (VG-30) + 12mm crushed aggregate',
          cost: 48500,
          warrantyMonths: 12,
          beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80',
          afterPhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80'
        });
      }
    } else if (step === 4) {
      // Step 4: Dashcam CV detects the pothole again at same asset
      this.demoStep = 4;
      this.registerDetection({
        category: 'pothole',
        defect_type: 'pothole_deep_cavity',
        confidence: 0.94,
        bbox: [24, 48, 22, 16],
        frame_ref: 'DASHCAM_FRAME_KA04G4122_SEC04_0891.JPG',
        lat: 12.97561,
        lng: 77.60662,
        model: 'iWatchRoad-v2.1',
        version: '2.1.0 (YOLOv8-RoadDamage)',
        is_defect: true,
        severity: 'critical'
      });
    } else if (step === 5) {
      // Step 5: City Memory flags recurrence, elevates risk score, triggers contractor penalty
      this.demoStep = 5;
      const asset = this.assets.find((a) => a.id === 'asset-rd-042');
      if (asset) {
        asset.conditionScore = 38;
        asset.recurrenceCount = 3;
      }
      this.refreshAssetRiskScores();
    }

    this.notify();
  }

  public resetToDefaults() {
    this.assets = JSON.parse(JSON.stringify(INITIAL_ASSETS));
    this.issues = JSON.parse(JSON.stringify(INITIAL_ISSUES));
    this.complaints = JSON.parse(JSON.stringify(INITIAL_COMPLAINTS));
    this.contractors = JSON.parse(JSON.stringify(INITIAL_CONTRACTORS));
    this.repairs = JSON.parse(JSON.stringify(INITIAL_REPAIRS));
    this.vehicles = JSON.parse(JSON.stringify(INITIAL_VEHICLES));
    this.observations = [];
    this.demoStep = 0;
    this.refreshAssetRiskScores();
    this.notify();
  }
}

export const mockDb = new MockDatabase();
