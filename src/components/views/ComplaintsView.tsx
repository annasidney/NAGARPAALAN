import React, { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  FileText,
  Filter,
  GitCompare,
  Info,
  Link as LinkIcon,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Upload,
  User,
  X
} from 'lucide-react';
import { Asset, Complaint, Issue } from '../../types';
import { mockDb } from '../../services/mockDatabase';

interface ComplaintsViewProps {
  complaints: Complaint[];
  issues: Issue[];
  assets: Asset[];
  onNavigateToModule: (module: string, contextId?: string) => void;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  issues,
  assets,
  onNavigateToModule
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedDuplicateComplaint, setSelectedDuplicateComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New complaint form state
  const [citizenName, setCitizenName] = useState('Ananya Deshmukh');
  const [citizenPhone, setCitizenPhone] = useState('+91 98450 77123');
  const [category, setCategory] = useState<Asset['category']>('road');
  const [ward, setWard] = useState('Ward 111 (Shantalanagar)');
  const [address, setAddress] = useState('MG Road near Metro Pillar 42');
  const [latitude, setLatitude] = useState(12.97563);
  const [longitude, setLongitude] = useState(77.60662);
  const [description, setDescription] = useState(
    'Deep dangerous pothole right opposite Metro Pillar 42. Bikes are swerving sharply into traffic.'
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = mockDb.submitComplaint({
      citizenName,
      citizenPhone,
      category,
      ward,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
      description,
      photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    });

    setShowSubmitModal(false);

    // If duplicate candidate detected, open review dialog immediately
    if (result.duplicateResult && result.duplicateResult.isPotentialDuplicate) {
      setSelectedDuplicateComplaint(result.complaint);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (
      searchQuery &&
      !c.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.complaintNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.citizenName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
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
              Module 4
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Civic Complaint Registration &amp; AI Duplicate Detection
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingest manual reports, run explainable multi-factor deduplication against existing issues, and link to physical assets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-colors self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Complaint</span>
        </button>
      </div>

      {/* Complaints List & Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, citizen name, or description..."
              className="w-full bg-slate-950 border border-slate-800 text-xs pl-9 pr-3 py-2 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:border-amber-500"
            >
              <option value="all">All ({complaints.length})</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">AI Match Under Review</option>
              <option value="linked_to_issue">Linked to Issue</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredComplaints.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-10">
              No complaints match the specified query.
            </div>
          ) : (
            filteredComplaints.map((c) => {
              const linkedIssue = issues.find((i) => i.id === c.linkedIssueId);

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border transition-all ${
                    c.duplicateCandidate
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {c.photoUrl ? (
                        <img
                          src={c.photoUrl}
                          alt="Evidence"
                          className="w-20 h-20 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-slate-600">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {c.complaintNumber}
                          </span>
                          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded capitalize">
                            {c.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              c.status === 'linked_to_issue'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : c.status === 'under_review'
                                ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                                : 'bg-sky-500/20 text-sky-300'
                            }`}
                          >
                            {c.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed font-normal">
                          {c.description}
                        </p>

                        <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-4 pt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {c.citizenName} ({c.citizenPhone})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {c.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action & Duplicate Review Badge */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {c.duplicateCandidate && (
                        <button
                          type="button"
                          onClick={() => setSelectedDuplicateComplaint(c)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                          <span>Review AI Duplicate ({c.duplicateCandidate.confidenceScore}%)</span>
                        </button>
                      )}

                      {linkedIssue && (
                        <button
                          type="button"
                          onClick={() => onNavigateToModule('City Memory', linkedIssue.assetId)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                        >
                          <LinkIcon className="w-3 h-3" />
                          <span>Linked to {linkedIssue.issueCode} →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Explainable AI Duplicate Review Modal */}
      {selectedDuplicateComplaint && selectedDuplicateComplaint.duplicateCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedDuplicateComplaint(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <GitCompare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  Human-in-the-Loop AI Verification
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  Explainable Duplicate &amp; Recurrence Assessment
                </h3>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-300">Incoming Complaint:</div>
              <div className="font-mono text-amber-400">
                {selectedDuplicateComplaint.complaintNumber} - {selectedDuplicateComplaint.citizenName}
              </div>
              <p className="text-slate-300 italic">"{selectedDuplicateComplaint.description}"</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-300">Potential Duplicate Issue in City Memory:</div>
              <div className="font-mono text-sky-400">
                {selectedDuplicateComplaint.duplicateCandidate.issueTitle}
              </div>
            </div>

            {/* Explainable Breakdown Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Multi-Factor Explainable Scoring Breakdown</span>
                <span className="text-amber-400 font-mono text-sm">
                  {selectedDuplicateComplaint.duplicateCandidate.confidenceScore}% Match Confidence
                </span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Semantic Match</span>
                  <span className="text-base font-bold font-mono text-slate-200">
                    {selectedDuplicateComplaint.duplicateCandidate.breakdown.semantic}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Proximity</span>
                  <span className="text-base font-bold font-mono text-slate-200">
                    {selectedDuplicateComplaint.duplicateCandidate.breakdown.proximityMeters}m
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ({selectedDuplicateComplaint.duplicateCandidate.breakdown.proximityScore}%)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Category</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {selectedDuplicateComplaint.duplicateCandidate.breakdown.visualCategory}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Physical Asset</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {selectedDuplicateComplaint.duplicateCandidate.breakdown.assetMatch ? 'Matched' : 'Unlinked'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                <span className="font-bold">AI Explanation: </span>
                {selectedDuplicateComplaint.duplicateCandidate.explanation}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedDuplicateComplaint(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Reject Duplicate (Treat as Distinct Issue)
              </button>
              <button
                type="button"
                onClick={() => {
                  mockDb.confirmDuplicate(
                    selectedDuplicateComplaint.id,
                    selectedDuplicateComplaint.duplicateCandidate!.issueId
                  );
                  setSelectedDuplicateComplaint(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Match &amp; Link to Issue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Complaint Registration Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleFormSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">Register Citizen Civic Complaint</h3>
                <p className="text-xs text-slate-400">Data will be checked against City Memory</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Citizen Full Name</label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Citizen Phone / Contact</label>
                <input
                  type="text"
                  required
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Infrastructure Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Asset['category'])}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                >
                  <option value="road">Road / Pavement</option>
                  <option value="streetlight">Streetlight</option>
                  <option value="drainage">Stormwater Drain</option>
                  <option value="bridge">Bridge / Flyover</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Municipal Ward</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                >
                  <option value="Ward 111 (Shantalanagar)">Ward 111 (Shantalanagar)</option>
                  <option value="Ward 151 (Koramangala)">Ward 151 (Koramangala)</option>
                  <option value="Ward 80 (Hoysalanagar)">Ward 80 (Hoysalanagar)</option>
                  <option value="Ward 110 (Sampangiramanagar)">Ward 110 (Sampangiramanagar)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Location Address / Landmark</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">GPS Latitude</label>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 font-mono focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">GPS Longitude</label>
                <input
                  type="number"
                  step="0.00001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 font-mono focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Detailed Description of Defect</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <span>Submit &amp; Run Duplicate Check</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
