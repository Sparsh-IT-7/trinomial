import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  FileText,
  Bookmark,
  Download,
  Zap,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CivicIssue, BELLANDUR_AUDIT_LOG, IMAGES } from '../data/civicData';
import { ActiveTab } from '../components/Header';

interface IssueDetailViewProps {
  issue: CivicIssue;
  onNavigate: (tab: ActiveTab) => void;
  onOpenSignPetition: () => void;
  onOpenRegisterVolunteer: () => void;
  onOpenFileGrievance: () => void;
  onOpenFactsheet: () => void;
}

export const IssueDetailView: React.FC<IssueDetailViewProps> = ({
  issue,
  onNavigate,
  onOpenSignPetition,
  onOpenRegisterVolunteer,
  onOpenFileGrievance,
  onOpenFactsheet,
}) => {
  const [isFollowing, setIsFollowing] = useState(issue.isWatchlisted ?? true);
  const [activeMapLayer, setActiveMapLayer] = useState<'sensors' | 'outfalls' | 'all'>('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-6">
      {/* Breadcrumb & Public Dossier header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#047857]/70">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#047857] hover:underline cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('explore')}
            className="hover:text-[#047857] hover:underline cursor-pointer"
          >
            Explore Issues
          </button>
          <span>/</span>
          <span className="font-mono font-semibold text-[#047857]">Issue #{issue.id}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-[#047857]">
            <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse"></span>
            <span>Live Public Dossier</span>
          </div>
          <span>Updated {issue.updatedAt}</span>
        </div>
      </div>

      {/* Title & Status Area */}
      <div className="space-y-4">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold border border-[#047857] text-[#047857] rounded-full bg-emerald-50/60">
            <RotateCcw className="w-3 h-3" />
            <span>Status: Action In Progress</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold border border-[#F97316] text-[#F97316] rounded-full bg-orange-50/60">
            <AlertTriangle className="w-3 h-3" />
            <span>Priority: Critical</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold border border-[#047857] text-[#047857] rounded-full bg-emerald-50/60">
            <CheckCircle className="w-3 h-3" />
            <span>Verified Source: CPCB & Resident Federation</span>
          </span>
        </div>

        {/* Title and Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-2">
          <div className="space-y-2 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#047857] tracking-tight leading-tight">
              {issue.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#047857]/80">
              <span className="flex items-center gap-1 font-semibold text-[#047857]">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                {issue.location}
              </span>
              <span>•</span>
              <span>First Recorded: {issue.firstRecorded || 'Oct 12, 2024'}</span>
              <span>•</span>
              <span className="font-bold text-[#F97316]">
                Escalation Level {issue.escalationLevel || 3}
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0">
            <button
              onClick={onOpenSignPetition}
              className="px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Take Action Now</span>
            </button>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className="px-4 py-2 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFollowing ? 'fill-[#047857]' : ''}`} />
              <span>{isFollowing ? 'Following Issue' : 'Follow Issue Updates'}</span>
            </button>
            <button
              onClick={onOpenFactsheet}
              className="px-4 py-1.5 text-xs text-[#047857] hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Factsheet (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Detailed Findings + Right Citizen Action Toolkit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Section 1: Geographic & Incident Overview */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#047857]" />
                <h2 className="text-sm font-extrabold tracking-wider uppercase text-[#047857]">
                  GEOGRAPHIC & INCIDENT OVERVIEW
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#047857]/70 uppercase">
                CENSUS BLK 14B
              </span>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 border border-[#047857]/20 rounded-xs bg-[#fdfdfd]">
                <div className="text-[10px] uppercase font-bold text-[#047857]/70">
                  AFFECTED CITIZENS
                </div>
                <div className="text-xl font-extrabold text-[#F97316] font-mono mt-0.5">
                  ~45,000
                </div>
                <div className="text-[11px] text-[#047857]/70">Yamalur & Bellandur</div>
              </div>
              <div className="p-3 border border-[#047857]/20 rounded-xs bg-[#fdfdfd]">
                <div className="text-[10px] uppercase font-bold text-[#047857]/70">
                  CULVERT SPREAD
                </div>
                <div className="text-xl font-extrabold text-[#047857] font-mono mt-0.5">
                  3 Drains
                </div>
                <div className="text-[11px] text-[#047857]/70">Storm channel #4, 7, 9</div>
              </div>
              <div className="p-3 border border-[#047857]/20 rounded-xs bg-[#fdfdfd]">
                <div className="text-[10px] uppercase font-bold text-[#047857]/70">
                  TELEMETRY INTERVAL
                </div>
                <div className="text-xl font-extrabold text-[#047857] font-mono mt-0.5">
                  15 Mins
                </div>
                <div className="text-[11px] text-[#047857]/70">Active monitoring node</div>
              </div>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-[#047857]/85 leading-relaxed">
              <p>
                Persistent accumulation of dense surfactant froth and chemical discharge documented along the Yamalur feeder canal leading into Bellandur Lake. Telemetry sensors positioned at Outflow Culvert #7 indicate heavy midnight spikes between 01:00 AM and 04:30 AM, releasing unneutralized ammonia and heavy metal byproducts into public surface water.
              </p>
              <p>
                Residents report acute respiratory irritation, sustained foul odors across an 800-meter radius, and visible mortality of local wetland bird species near the gated barrier.
              </p>
            </div>

            {/* Sensor Deployment Map Preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-[11px] text-[#047857]">
                  SENSOR DEPLOYMENT & OUTFALL COORDINATES
                </span>
                <span className="font-mono text-[11px] text-[#047857] font-bold">
                  12.9372° N, 77.6823° E
                </span>
              </div>

              {/* Vector GIS Map Representation */}
              <div className="relative border border-[#047857]/25 rounded-xs overflow-hidden bg-[#eef5ee] h-56 sm:h-64">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid Lines */}
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#047857" strokeOpacity="0.1" />
                  <line x1="0" y1="120" x2="600" y2="120" stroke="#047857" strokeOpacity="0.1" />
                  <line x1="0" y1="180" x2="600" y2="180" stroke="#047857" strokeOpacity="0.1" />
                  <line x1="150" y1="0" x2="150" y2="240" stroke="#047857" strokeOpacity="0.1" />
                  <line x1="300" y1="0" x2="300" y2="240" stroke="#047857" strokeOpacity="0.1" />
                  <line x1="450" y1="0" x2="450" y2="240" stroke="#047857" strokeOpacity="0.1" />

                  {/* Water Canal Path */}
                  <path
                    d="M 50,40 Q 180,70 280,120 T 520,180"
                    stroke="#0284c7"
                    strokeWidth="14"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.6"
                  />
                  {/* Toxic Plume Section */}
                  <path
                    d="M 280,120 Q 380,140 520,180"
                    stroke="#F97316"
                    strokeWidth="8"
                    strokeDasharray="4 4"
                    fill="none"
                  />

                  {/* Lake Area */}
                  <path
                    d="M 450,140 Q 560,130 580,210 Q 480,240 430,190 Z"
                    fill="#38bdf8"
                    opacity="0.4"
                  />
                  <text x="480" y="190" fill="#0369a1" fontSize="11" fontWeight="bold">
                    Bellandur Lake
                  </text>

                  {/* Labels on Map */}
                  <text x="70" y="45" fill="#047857" fontSize="10" fontWeight="bold">
                    Yamalur Outflow Gate
                  </text>
                  <text x="320" y="70" fill="#047857" fontSize="10">
                    Brookefield Corridor
                  </text>
                  <text x="180" y="160" fill="#047857" fontSize="10">
                    Torq03 Buffer
                  </text>

                  {/* Sensor Pin 1 */}
                  <circle cx="160" cy="65" r="5" fill="#047857" />
                  <circle cx="160" cy="65" r="9" stroke="#047857" strokeWidth="1.5" opacity="0.5" />

                  {/* Outflow Culvert #7 (Active Point Alpha) */}
                  <circle cx="280" cy="120" r="7" fill="#F97316" />
                  <circle cx="280" cy="120" r="14" stroke="#F97316" strokeWidth="2" opacity="0.6" />
                </svg>

                {/* Overlaid Badge */}
                <div className="absolute bottom-3 left-3 bg-white/95 border border-[#047857] text-[#047857] px-2.5 py-1 rounded-xs text-[11px] font-semibold flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
                  <span>Point Alpha: Active Effluent Gate #2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI Intelligence Synthesis */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F97316]" />
                <h2 className="text-sm font-extrabold tracking-wider uppercase text-[#047857]">
                  AI INTELLIGENCE SYNTHESIS
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#F97316] uppercase border border-[#F97316] px-2 py-0.5 rounded-full">
                Probabilistic Score: 94%
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#047857]/70 block">
                IDENTIFIED PRIMARY MECHANISM
              </span>
              <h3 className="text-base font-bold text-[#047857]">
                Periodic illegal bypass of CETP (Common Effluent Treatment Plant) during rain events
              </h3>
              <p className="text-xs sm:text-sm text-[#047857]/85 leading-relaxed">
                Hydro-sensor correlation indicates sudden chemical oxygen demand (COD) surges that coincide exclusively with municipal precipitation thresholds greater than 12mm/hr. Upstream industrial operators leverage high stormwater velocity to flush raw processing wastes into municipal storm channels, purposefully bypassing mandatory containment holding reservoirs.
              </p>
            </div>

            <div className="p-3 bg-orange-50/50 border border-[#F97316]/30 rounded-xs text-xs text-[#047857] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#F97316]">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>HISTORICAL PATTERN CORRELATION</span>
              </div>
              <p>
                This marks the fourth recurrence at this exact outfall culvert over past 6 months. Prior incidents on May 3, July 19, and August 28 matched identical chemical signatures.
              </p>
            </div>

            <div className="text-[11px] italic text-[#047857]/60">
              Note: Automated heuristic synthesis based on sensor logs, not a legal verdict.
            </div>
          </div>

          {/* Section 3: Verified Evidence & Public Records */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#047857]" />
                <h2 className="text-sm font-extrabold tracking-wider uppercase text-[#047857]">
                  VERIFIED EVIDENCE & PUBLIC RECORDS
                </h2>
              </div>
              <span className="text-[10px] font-bold text-[#047857] uppercase border border-[#047857] px-2 py-0.5 rounded-full">
                3 AUDITED SOURCES
              </span>
            </div>

            {/* Record 1: Water Quality Analysis */}
            <div className="border border-[#047857]/20 rounded-xs p-4 space-y-3 bg-[#fdfdfd]">
              <div className="flex flex-wrap items-center justify-between text-xs gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#047857]">RECORD #KSPCB-WQI-9921</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 border border-[#047857] text-[#047857] rounded-xs">
                    Verified Public Record
                  </span>
                </div>
                <span className="text-[#047857]/60">Sampled: Oct 14, 2024 (06:00 IST)</span>
              </div>

              <p className="text-xs text-[#047857]/80">
                Field lab analysis authenticated by Department Analytical Chemist. Dissolved Oxygen collapsed to critically lethargic levels.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2 border border-[#047857]/15 rounded bg-white">
                  <div className="text-[10px] font-semibold text-[#047857]/70">Dissolved Oxygen</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[#F97316]">0.8 mg/L</div>
                  <div className="text-[10px] text-[#047857]/60">Norm: &gt; 4.0</div>
                </div>
                <div className="p-2 border border-[#047857]/15 rounded bg-white">
                  <div className="text-[10px] font-semibold text-[#047857]/70">BOD Level</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[#F97316]">48 mg/L</div>
                  <div className="text-[10px] text-[#047857]/60">Norm: &lt; 3.0</div>
                </div>
                <div className="p-2 border border-[#047857]/15 rounded bg-white">
                  <div className="text-[10px] font-semibold text-[#047857]/70">COD Level</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[#F97316]">186 mg/L</div>
                  <div className="text-[10px] text-[#047857]/60">Norm: &lt; 50</div>
                </div>
                <div className="p-2 border border-[#047857]/15 rounded bg-white">
                  <div className="text-[10px] font-semibold text-[#047857]/70">Surfactants</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[#F97316]">14.2 mg/L</div>
                  <div className="text-[10px] text-[#047857]/60">Norm: &lt; 1.0</div>
                </div>
              </div>
            </div>

            {/* Record 2: Geotagged Photographic Audit */}
            <div className="border border-[#047857]/20 rounded-xs p-4 space-y-3 bg-[#fdfdfd]">
              <div className="flex flex-wrap items-center justify-between text-xs gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#047857]">RECORD #GEO-IMG-4048</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 border border-[#047857] text-[#047857] rounded-xs">
                    Verified Public Record
                  </span>
                </div>
                <span className="text-[#047857]/60 font-mono text-[11px]">Hash SHA-256 Verified</span>
              </div>

              <div className="text-xs text-[#047857]/80">
                <span className="font-bold text-[#047857] block mb-0.5">
                  Geotagged Photographic Audit & Foam Stratification
                </span>
                Citizen telemetry photographs registered via Kartavya Field Cam with immutable hardware timestamp and GPS location tags.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="relative aspect-16/10 rounded-xs overflow-hidden border border-[#047857]/20 bg-slate-100">
                    <img
                      src={IMAGES.chemicalFoam}
                      alt="Culvert Foam Column"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-[#047857]">Culvert #7 Outflow Foam Column</span>
                    <span className="text-[#047857]/60">Recorded Oct 15, 03:14 AM IST</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative aspect-16/10 rounded-xs overflow-hidden border border-[#047857]/20 bg-slate-100">
                    <img
                      src={IMAGES.volunteerTesting}
                      alt="Water Sample Collection"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-[#047857]">Unprocessed Chemical Sample #A</span>
                    <span className="text-[#047857]/60">Taken by Citizen Taskforce #4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Record 3: BBMP Grievance Docket */}
            <div className="border border-[#047857]/20 rounded-xs p-4 space-y-2 bg-[#fdfdfd]">
              <div className="flex flex-wrap items-center justify-between text-xs gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#047857]">RECORD #BBMP-BELL-2024-118</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 border border-[#047857] text-[#047857] rounded-xs">
                    Verified Public Record
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#F97316]">
                  Escalated to Zonal Commissioner
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#047857]">BBMP Citizen Grievance Docket</h4>
              <p className="text-xs text-[#047857]/80 leading-relaxed">
                Cross-filed under Section 133 CrPC (Public Nuisance & Environmental Hazard). Formal acknowledgment received on Oct 16, 2024. Next mandated statutory review within 7 working days.
              </p>
            </div>
          </div>

          {/* Section 4: Legal Jurisdiction & Accountable Officials */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#047857]" />
                <h2 className="text-sm font-extrabold tracking-wider uppercase text-[#047857]">
                  LEGAL JURISDICTION & ACCOUNTABLE OFFICIALS
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#F97316] uppercase">
                OFFICIAL COMPLAINT: CMP/2024/0914
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-[#047857]/15 rounded-xs space-y-2 bg-[#fdfdfd]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70 block">
                  PRIMARY DESIGNATED BODY
                </span>
                <h4 className="text-sm font-bold text-[#047857]">
                  Karnataka State Pollution Control Board
                </h4>
                <div className="text-xs text-[#047857]/80">Regional Office - Mahadevapura Division</div>
                <div className="pt-2 text-xs flex items-center justify-between">
                  <span className="text-[11px] text-[#047857]/70 font-mono">Contact: ro-mahadevapura@kspcb.gov</span>
                  <button
                    onClick={onOpenFileGrievance}
                    className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Docket →
                  </button>
                </div>
              </div>

              <div className="p-4 border border-[#047857]/15 rounded-xs space-y-2 bg-[#fdfdfd]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70 block">
                  LOCAL WARD GOVERNANCE
                </span>
                <h4 className="text-sm font-bold text-[#047857]">
                  Ward 150 Ward Committee
                </h4>
                <div className="text-xs text-[#047857]/80">Executive Engineer & Nodal Health Officer</div>
                <div className="pt-2 text-xs flex items-center justify-between">
                  <span className="text-[11px] text-[#047857]/70">Monthly Meeting: 3rd Saturday</span>
                  <a href="#agenda" className="text-xs font-bold text-[#047857] hover:underline">
                    Agenda Item #4 →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar, 5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Box 1: Citizen Action Toolkit */}
          <div className="bg-white border border-[#047857]/25 rounded-xs p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#047857]">
                  CITIZEN ACTION TOOLKIT
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#047857] uppercase">
                DIRECT CITIZEN POWER
              </span>
            </div>

            {/* Action 1: Petition */}
            <div className="p-4 border border-[#F97316]/30 rounded-xs space-y-3 bg-orange-50/20">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#F97316] uppercase text-[10px] tracking-wider">
                  ACTION 1 • LEGAL ESCALATION
                </span>
                <span className="font-mono text-xs font-bold text-[#047857]">
                  {issue.petitionSignatures || 842} / {issue.petitionTarget || 1000} Signatures
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#047857]">
                Sign Community Escalation Petition
              </h4>

              <p className="text-xs text-[#047857]/80 leading-relaxed">
                Submits collective citizen injunction to National Green Tribunal (NGT) Principal Bench requiring instant pipeline closure.
              </p>

              {/* Progress bar */}
              <div className="w-full bg-[#047857]/15 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#F97316] h-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((issue.petitionSignatures || 842) / (issue.petitionTarget || 1000)) * 100
                    )}%`,
                  }}
                />
              </div>

              <button
                onClick={onOpenSignPetition}
                className="w-full py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xs transition-colors shadow-xs cursor-pointer"
              >
                Add Verified Digital Signature
              </button>
            </div>

            {/* Action 2: Fieldwork Drive */}
            <div className="p-4 border border-[#047857]/20 rounded-xs space-y-2 bg-[#fdfdfd]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#047857] uppercase text-[10px] tracking-wider">
                  ACTION 2 • ON-GROUND FIELDWORK
                </span>
                <span className="text-[10px] font-bold text-[#047857] px-1.5 py-0.2 border border-[#047857] rounded-xs">
                  This Saturday
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#047857]">
                Join Water Sampling Volunteer Drive
              </h4>

              <p className="text-xs text-[#047857]/80 leading-relaxed">
                Scheduled for Saturday, 7:30 AM at Yamalur Lake Gate. Field kit, PPE gloves, and sterile collection vials provided by KSPCB team.
              </p>

              <button
                onClick={onOpenRegisterVolunteer}
                className="w-full py-2 mt-2 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
              >
                View Drive Details & Shift Roles
              </button>
            </div>

            {/* Action 3: Municipal Grievance */}
            <div className="p-4 border border-[#047857]/20 rounded-xs space-y-2 bg-[#fdfdfd]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#047857] uppercase text-[10px] tracking-wider">
                  ACTION 3 • MUNICIPAL PAPERWORK
                </span>
                <span className="text-[10px] font-bold text-[#047857] px-1.5 py-0.2 border border-[#047857] rounded-xs">
                  Takes 2 Mins
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#047857]">
                Lodge 1-Click Ward Officer Grievance
              </h4>

              <p className="text-xs text-[#047857]/80 leading-relaxed">
                Auto-generates official RTI (Right to Information) query & statutory complaint with your voter ward verification.
              </p>

              <button
                onClick={onOpenFileGrievance}
                className="w-full py-2 mt-2 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Preview & Dispatch Grievance
              </button>
            </div>
          </div>

          {/* Box 2: Active Volunteering Drive */}
          <div className="bg-white border border-[#047857]/25 rounded-xs p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-[#047857]" />
                <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#047857]">
                  ACTIVE VOLUNTEERING DRIVE
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#047857] uppercase border border-[#047857] px-1.5 py-0.5 rounded-full">
                5 SLOTS LEFT
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70 block">
                LEAD ORGANIZER
              </span>
              <h4 className="text-sm font-bold text-[#047857]">
                Save Bellandur Waterways Citizen Collective
              </h4>
              <div className="text-[11px] text-[#047857]/70">
                Registered Civil Society Partner #KA-NGO-8820
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#047857]/70 uppercase block">
                  Volunteers Registered
                </span>
                <span className="font-bold font-mono text-base text-[#047857]">15 / 20</span>
                <div className="text-[11px] text-[#047857]/70">Confirmed on roster</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#047857]/70 uppercase block">
                  Assembly Point
                </span>
                <span className="font-bold text-xs text-[#047857] block">Yamalur Gate</span>
                <div className="text-[11px] text-[#047857]/70">07:30 AM sharp</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#047857]/15 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70 block">
                IMMEDIATE ROLES REQUIRED:
              </span>
              <ul className="text-xs text-[#047857]/85 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#047857] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#047857]">Sample Collectors (2)</strong> — Collect sealed vials at culvert mouths
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#047857] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#047857]">Evidence Photographer (1)</strong> — Telephoto documentation of drainage pipes
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#047857] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#047857]">Citizen Desk Host (2)</strong> — Coordinate resident statements & ID verification
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenRegisterVolunteer}
              className="w-full py-2.5 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <UsersIcon className="w-3.5 h-3.5" />
              <span>Register as Volunteer</span>
            </button>
          </div>

          {/* Box 3: Community Activity Log */}
          <div className="bg-white border border-[#047857]/25 rounded-xs p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#047857]" />
                <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#047857]">
                  COMMUNITY ACTIVITY LOG
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#047857]/70 uppercase">
                AUDIT TRAIL
              </span>
            </div>

            <div className="space-y-4 divide-y divide-[#047857]/10">
              {BELLANDUR_AUDIT_LOG.map((log) => (
                <div key={log.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#047857]">{log.author}</span>
                    <span className="text-[10px] font-mono text-[#047857]/70">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#047857]/80 leading-relaxed">{log.action}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#047857]/15 text-center text-[10px] text-[#047857]/60">
              All demonstration metrics verified for design showcase.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper SVG icon for volunteer collective
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default IssueDetailView;
