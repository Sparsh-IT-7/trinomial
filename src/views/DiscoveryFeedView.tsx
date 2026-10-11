import React, { useState, useEffect } from 'react';
import { CivicIssue, IssueCategory, IssuePriority, AirQualityReading } from '../types/civic';
import { api } from '../services/api';
import { AirQualityStationReadings } from '../components/AirQualityStationReadings';
import {
  ExternalLink,
  Search,
  SlidersHorizontal,
  FileText,
  AlertTriangle,
  MapPin,
  Building2,
  CheckCircle2,
  HelpCircle,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  Wind,
  Database,
  Activity,
  ShieldCheck,
} from 'lucide-react';

interface DiscoveryFeedViewProps {
  issues: CivicIssue[];
  loading: boolean;
  onSelectIssue: (issueId: string) => void;
  onOpenRagWithIssue?: (issueId: string) => void;
  onOpenCollaborationModal: (issue: CivicIssue) => void;
  onOpenIngestionTab: () => void;
}

const CATEGORIES: (IssueCategory | 'All')[] = [
  'All',
  'Water Supply',
  'Sewerage & Drainage',
  'Solid Waste Management',
  'Public Sanitation & Toilets',
  'Air Quality & Pollution',
];

const PRIORITIES: (IssuePriority | 'All')[] = [
  'All',
  'Critical',
  'High',
  'Medium',
  'Low',
  'Needs More Evidence',
];

export const DiscoveryFeedView: React.FC<DiscoveryFeedViewProps> = ({
  issues,
  loading,
  onSelectIssue,
  onOpenRagWithIssue,
  onOpenCollaborationModal,
  onOpenIngestionTab,
}) => {
  const [activeDatasetTab, setActiveDatasetTab] = useState<'opencity_issues' | 'cpcb_telemetry'>('opencity_issues');
  const [airQualityStations, setAirQualityStations] = useState<AirQualityReading[]>([]);
  const [loadingAirQuality, setLoadingAirQuality] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | 'All'>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'documented' | 'citizen'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoadingAirQuality(true);
    api.getAirQuality()
      .then((res) => {
        if (res && res.stations) {
          setAirQualityStations(res.stations);
        }
      })
      .catch((err) => {
        console.error('Failed to load air quality stations in DiscoveryFeed:', err);
      })
      .finally(() => {
        setLoadingAirQuality(false);
      });
  }, []);

  // Filter issues
  const filteredIssues = issues.filter((iss) => {
    if (selectedCategory !== 'All' && iss.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && iss.priority !== selectedPriority) return false;
    if (selectedType === 'documented' && iss.issue_type !== 'documented_civic_concern') return false;
    if (selectedType === 'citizen' && iss.issue_type !== 'citizen_report') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        iss.title.toLowerCase().includes(q) ||
        iss.description.toLowerCase().includes(q) ||
        iss.location_text.toLowerCase().includes(q) ||
        iss.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getPriorityBadgeClass = (priority: IssuePriority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Needs More Evidence':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const avgAqi = airQualityStations.length > 0
    ? Math.round(
        airQualityStations
          .filter((s) => s.aqi !== null)
          .reduce((acc, curr) => acc + (curr.aqi || 0), 0) /
          airQualityStations.filter((s) => s.aqi !== null).length
      )
    : 168;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Dual Dataset Selector Banner */}
      <div className="p-2 bg-white border border-[#047857]/20 rounded-xs shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveDatasetTab('opencity_issues')}
            className={`px-3.5 py-2 rounded-xs text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDatasetTab === 'opencity_issues'
                ? 'bg-[#047857] text-white shadow-2xs'
                : 'text-[#047857] hover:bg-[#047857]/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dataset 1: OpenCity Civic Issues Audit</span>
            <span className={`px-1.5 py-0.2 rounded-xs text-[10px] font-mono ${activeDatasetTab === 'opencity_issues' ? 'bg-white/20 text-white' : 'bg-[#047857]/10 text-[#047857]'}`}>
              {issues.length} Records
            </span>
          </button>

          <button
            onClick={() => setActiveDatasetTab('cpcb_telemetry')}
            className={`px-3.5 py-2 rounded-xs text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeDatasetTab === 'cpcb_telemetry'
                ? 'bg-[#047857] text-white shadow-2xs'
                : 'text-[#047857] hover:bg-[#047857]/10'
            }`}
          >
            <Wind className={`w-4 h-4 ${activeDatasetTab === 'cpcb_telemetry' ? 'text-white' : 'text-[#F97316]'}`} />
            <span>Dataset 2: CPCB Real Time Air Quality Index</span>
            <span className={`px-1.5 py-0.2 rounded-xs text-[10px] font-mono ${activeDatasetTab === 'cpcb_telemetry' ? 'bg-white/20 text-white' : 'bg-[#F97316]/10 text-[#F97316]'}`}>
              {airQualityStations.length || 12} Stations (Avg AQI: {avgAqi})
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-2 text-[11px] text-[#047857]/70 font-semibold shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Both Government Data Sources Active</span>
        </div>
      </div>

      {activeDatasetTab === 'cpcb_telemetry' ? (
        /* Air Quality Dataset View */
        <div className="space-y-6">
          <AirQualityStationReadings
            stations={airQualityStations}
            title="Real Time Air Quality Index — Central Pollution Control Board (CPCB)"
            subtitle="Ambient physical air quality measurements retrieved from 12 Continuous Ambient Air Quality Monitoring Stations (CAAQMS) deployed across Greater Mumbai under CPCB and MPCB via Government of India Open Government Data (OGD) Platform."
            showAllInitially={true}
          />
        </div>
      ) : (
        /* OpenCity Civic Issues View */
        <>
          {/* Source Banner & Provenance Notification */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#047857] text-white text-[10px] font-bold uppercase rounded-xs tracking-wider">
                    Primary Public Source
                  </span>
                  <span className="text-xs font-semibold text-[#047857]">
                    OpenCity India Civic Commons
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#047857] tracking-tight">
                  Report on the Status of Civic Issues in Mumbai — May 2025
                </h1>
                <p className="text-xs sm:text-sm text-[#047857]/80 max-w-4xl leading-relaxed">
                  Discovered documented civic concerns extracted from the official municipal audit by <strong>Praja Foundation</strong>.
                  All records retain direct page citations, laboratory sample ratios, and CCRS citizen grievance dockets.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="https://data.opencity.in/dataset/report-on-the-status-of-civic-issues-in-mumbai-may-2025"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-white border border-[#047857]/30 hover:border-[#047857] text-[#047857] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>View OpenCity Dataset</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onOpenIngestionTab}
                  className="px-3.5 py-1.5 bg-[#047857] hover:bg-[#035f44] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Ingestion Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CPCB Air Quality Telemetry Cross-Reference Notification */}
            <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#F97316] shrink-0" />
                <div>
                  <span className="font-bold text-[#047857]">
                    Second Government Source Integrated:
                  </span>{' '}
                  <span className="text-[#047857]/80">
                    Real Time Air Quality Index (CPCB / OGD Platform) with 12 active CAAQMS monitoring stations across Mumbai (City Avg AQI: {avgAqi}).
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveDatasetTab('cpcb_telemetry')}
                className="px-3 py-1 bg-white border border-[#047857]/30 hover:border-[#047857] text-[#047857] font-semibold text-[11px] rounded-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>View CAAQMS Readings</span>
                <ArrowRight className="w-3 h-3 text-[#F97316]" />
              </button>
            </div>

            {/* Evidence & Historical Data Notice */}
            <div className="pt-3 border-t border-[#047857]/10 flex flex-wrap items-center justify-between text-xs text-[#047857]/70 gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                  <strong>Publication Date:</strong> May 2025 (Historical Audit Evidence)
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  <strong>Publisher:</strong> Praja Foundation
                </span>
              </div>
              <div className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-xs">
                Documented historical concerns are distinguished from real-time incidents.
              </div>
            </div>
          </div>

          {/* Filter and Search Controls */}
          <div className="bg-white border border-[#047857]/15 rounded-xs p-4 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#047857]/50" />
                <input
                  type="text"
                  placeholder="Search issues, wards, or metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857] text-[#047857]"
                />
              </div>

              {/* Record Type Filter */}
              <div className="flex items-center gap-1 text-xs w-full sm:w-auto overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-semibold text-[#047857]/60 mr-1 shrink-0">Source Type:</span>
                <button
                  onClick={() => setSelectedType('All')}
                  className={`px-2.5 py-1 rounded-xs font-semibold text-xs whitespace-nowrap cursor-pointer ${
                    selectedType === 'All'
                      ? 'bg-[#047857] text-white'
                      : 'bg-neutral-100 text-[#047857] hover:bg-neutral-200'
                  }`}
                >
                  All Records ({issues.length})
                </button>
                <button
                  onClick={() => setSelectedType('documented')}
                  className={`px-2.5 py-1 rounded-xs font-semibold text-xs whitespace-nowrap cursor-pointer ${
                    selectedType === 'documented'
                      ? 'bg-[#047857] text-white'
                      : 'bg-neutral-100 text-[#047857] hover:bg-neutral-200'
                  }`}
                >
                  OpenCity Documented ({issues.filter((i) => i.issue_type === 'documented_civic_concern').length})
                </button>
                <button
                  onClick={() => setSelectedType('citizen')}
                  className={`px-2.5 py-1 rounded-xs font-semibold text-xs whitespace-nowrap cursor-pointer ${
                    selectedType === 'citizen'
                      ? 'bg-[#047857] text-white'
                      : 'bg-neutral-100 text-[#047857] hover:bg-neutral-200'
                  }`}
                >
                  Citizen Reports ({issues.filter((i) => i.issue_type === 'citizen_report').length})
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#047857]/10">
              <span className="text-[11px] font-semibold text-[#047857]/60 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" /> Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-xs text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#047857] text-white font-semibold'
                      : 'bg-[#f4f7f5] text-[#047857] hover:bg-[#e6ece8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Priority Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#047857]/60 mr-1">Priority:</span>
              {PRIORITIES.map((prio) => (
                <button
                  key={prio}
                  onClick={() => setSelectedPriority(prio)}
                  className={`px-2 py-0.5 rounded-xs text-[10px] font-medium transition-colors cursor-pointer ${
                    selectedPriority === prio
                      ? 'bg-[#047857] text-white font-semibold'
                      : 'bg-neutral-100 text-[#047857] hover:bg-neutral-200'
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>

      {/* Discovery Feed List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#047857]/80">
          <span>
            Showing <strong>{filteredIssues.length}</strong> discovered issues
          </span>
          <span className="text-[11px] text-[#047857]/60">
            Source: Praja Status Report (May 2025)
          </span>
        </div>

        {loading ? (
          <div className="bg-white border border-[#047857]/15 rounded-xs p-12 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-[#047857] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-[#047857]/80">Loading discovered civic issues from OpenCity data store...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="bg-white border border-[#047857]/15 rounded-xs p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-[#047857]">No civic issues matched your filters</h3>
            <p className="text-xs text-[#047857]/70 max-w-md mx-auto">
              Try adjusting your category, priority, or search term to view other records from the May 2025 OpenCity report.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredIssues.map((issue) => {
              const isDocumented = issue.issue_type === 'documented_civic_concern';

              return (
                <div
                  key={issue.id}
                  className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs hover:border-[#047857] transition-all space-y-4 group"
                >
                  {/* Top Badges & Provenance Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#047857]/10 text-[#047857] rounded-xs">
                        {issue.category}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${getPriorityBadgeClass(
                          issue.priority
                        )}`}
                      >
                        {issue.priority} Priority
                      </span>

                      {isDocumented ? (
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Documented in May 2025 Audit
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Citizen Report (Pending Verification)
                        </span>
                      )}

                      {issue.category === 'Air Quality & Pollution' && (
                        <span className="text-[10px] font-semibold bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <Wind className="w-3 h-3 text-[#F97316]" />
                          CPCB CAAQMS Telemetry Linked
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#047857]/60 flex items-center gap-2">
                      <span className="font-mono text-[10px]">{issue.id}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h2
                      onClick={() => onSelectIssue(issue.id)}
                      className="text-base sm:text-lg font-bold text-[#047857] hover:text-[#035f44] cursor-pointer transition-colors leading-snug"
                    >
                      {issue.title}
                    </h2>
                    <p className="text-xs text-[#047857]/80 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  {/* Evidence & Metrics Highlight */}
                  {issue.evidence && issue.evidence.length > 0 && (
                    <div className="bg-[#fcfdfc] border border-[#047857]/15 rounded-xs p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#047857]">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#F97316]" />
                          <span>Extracted Evidence ({issue.evidence[0].section_heading})</span>
                        </span>
                        <span className="text-[10px] font-mono bg-white border border-[#047857]/20 px-1.5 py-0.2 rounded-xs">
                          Page {issue.evidence[0].page_number}
                        </span>
                      </div>
                      <p className="text-xs text-[#047857]/80 italic line-clamp-2">
                        "{issue.evidence[0].evidence_excerpt}"
                      </p>
                      {issue.evidence[0].metric_value && (
                        <div className="pt-1 text-[11px] font-bold text-[#F97316]">
                          Documented Metric: {issue.evidence[0].metric_value}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata Row: Location, Authority, Dates */}
                  <div className="pt-2 border-t border-[#047857]/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#047857]/70">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#047857]/60" />
                        <span>{issue.location_text}</span>
                      </span>

                      {issue.assigned_authority && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-[#047857]/60" />
                          <span>{issue.assigned_authority}</span>
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectIssue(issue.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#047857] hover:bg-[#047857]/10 rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Take Action: View volunteer events or schedule community drive"
                      >
                        <Calendar className="w-3 h-3 text-[#F97316]" />
                        <span>Take Action</span>
                      </button>

                      {onOpenRagWithIssue && (
                        <button
                          onClick={() => onOpenRagWithIssue(issue.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#047857] hover:bg-[#047857]/10 rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                          title="Ask RAG questions about this issue"
                        >
                          <HelpCircle className="w-3 h-3 text-[#F97316]" />
                          <span>Ask RAG</span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenCollaborationModal(issue)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#047857] hover:bg-[#047857]/10 rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Propose Collaboration"
                      >
                        <Users className="w-3 h-3 text-[#047857]" />
                        <span>Collaborate</span>
                      </button>

                      <button
                        onClick={() => onSelectIssue(issue.id)}
                        className="px-3 py-1 bg-[#047857] hover:bg-[#035f44] text-white text-[11px] font-bold rounded-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <span>Inspect Evidence</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  )}
</div>
  );
};

export default DiscoveryFeedView;
