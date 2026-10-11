import React, { useState } from 'react';
import {
  Bell,
  FilePlus,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
  User,
  Users,
  Compass,
  Building,
  BarChart2,
  ChevronRight,
  BookmarkCheck,
  Award,
} from 'lucide-react';
import { USER_PROFILE, IMAGES } from '../data/civicData';
import { ActiveTab } from '../components/Header';
import { KartavyaLogo } from '../components/KartavyaLogo';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenReportModal: () => void;
  onOpenWardAlerts: () => void;
  onOpenFileGrievance: () => void;
  onSelectIssue: (issueId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenReportModal,
  onOpenWardAlerts,
  onOpenFileGrievance,
  onSelectIssue,
}) => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<
    'upcoming' | 'tracked' | 'escalation'
  >('upcoming');
  const [calendarAdded, setCalendarAdded] = useState<string | null>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);

  const handleAddToCalendar = (id: string) => {
    setCalendarAdded(id);
    setTimeout(() => setCalendarAdded(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-[#047857]/20 rounded-xs p-4 space-y-4 shadow-2xs">
            {/* Logo in sidebar */}
            <div className="pb-3 border-b border-[#047857]/15">
              <KartavyaLogo size={32} showText={true} textSize="sm" />
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1">
              <button
                onClick={() => {}}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xs bg-[#047857] text-white cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xs text-[#047857] hover:bg-[#047857]/8 transition-colors cursor-pointer text-left"
              >
                <FileText className="w-4 h-4" />
                <span>Issues Ledger</span>
              </button>
              <button
                onClick={() => onNavigate('volunteer')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xs text-[#047857] hover:bg-[#047857]/8 transition-colors cursor-pointer text-left"
              >
                <Users className="w-4 h-4" />
                <span>Volunteer Registry</span>
              </button>
              <button
                onClick={() => onNavigate('insights')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xs text-[#047857] hover:bg-[#047857]/8 transition-colors cursor-pointer text-left"
              >
                <BarChart2 className="w-4 h-4" />
                <span>AI Analytics</span>
              </button>
              <button
                onClick={() => onNavigate('organizations')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xs text-[#047857] hover:bg-[#047857]/8 transition-colors cursor-pointer text-left"
              >
                <Building className="w-4 h-4" />
                <span>Partner Authorities</span>
              </button>
            </nav>

            {/* Municipal verification badge & exit */}
            <div className="pt-4 border-t border-[#047857]/15 space-y-3">
              <div className="p-3 bg-emerald-50/50 border border-[#047857]/20 rounded-xs text-[11px] text-[#047857] space-y-0.5">
                <span className="font-bold block uppercase text-[10px]">
                  MUNICIPAL VERIFICATION
                </span>
                <span>Certified audit trail active.</span>
              </div>
              <button
                onClick={() => onNavigate('home')}
                className="text-xs font-semibold text-[#047857] hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Exit to Public Portal
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-8">
          {/* Welcome Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#047857] tracking-tight">
                Welcome back, {USER_PROFILE.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 border border-[#047857] text-[#047857] rounded-xs uppercase">
                  {USER_PROFILE.role} • {USER_PROFILE.ward}
                </span>
              </div>
              <p className="text-xs text-[#047857]/70 font-mono pt-0.5">
                Citizen Ledger ID: {USER_PROFILE.ledgerId} • {USER_PROFILE.trustRegistry}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={onOpenWardAlerts}
                className="px-3.5 py-2 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Ward Alerts (2)</span>
              </button>
              <button
                onClick={onOpenFileGrievance}
                className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FilePlus className="w-4 h-4" />
                <span>File Civic Grievance</span>
              </button>
            </div>
          </div>

          {/* 4 Stat KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#047857]/20 rounded-xs p-4 flex justify-between items-start shadow-2xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] block">
                  VOLUNTEERING MOBILIZATION
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#047857] mt-1">
                  {USER_PROFILE.stats.joinedDrives}
                </div>
                <div className="text-xs text-[#047857]/70 mt-0.5">Joined Volunteering Drives</div>
              </div>
              <Users className="w-5 h-5 text-[#F97316]/80 shrink-0" />
            </div>

            <div className="bg-white border border-[#047857]/20 rounded-xs p-4 flex justify-between items-start shadow-2xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70 block">
                  PUBLIC OVERSIGHT
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#047857] mt-1">
                  {USER_PROFILE.stats.trackedIssues}
                </div>
                <div className="text-xs text-[#047857]/70 mt-0.5">Tracked Civic Issues</div>
              </div>
              <AlertTriangle className="w-5 h-5 text-[#047857]/60 shrink-0" />
            </div>

            <div className="bg-white border border-[#047857]/20 rounded-xs p-4 flex justify-between items-start shadow-2xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70 block">
                  MUNICIPAL REMEDIATION
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#047857] mt-1">
                  {USER_PROFILE.stats.resolvedIssues}
                </div>
                <div className="text-xs text-[#047857]/70 mt-0.5">Issues Resolved by Authorities</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#047857] shrink-0" />
            </div>

            <div className="bg-white border border-[#047857]/20 rounded-xs p-4 flex justify-between items-start shadow-2xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] block">
                  GRASSROOTS ACTION
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#F97316] mt-1">
                  {USER_PROFILE.stats.serviceHours} hrs
                </div>
                <div className="text-xs text-[#047857]/70 mt-0.5">Civic Service Contribution</div>
              </div>
              <Clock className="w-5 h-5 text-[#F97316] shrink-0" />
            </div>
          </div>

          {/* Navigation Tab bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#047857]/20 pb-2">
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setActiveDashboardTab('upcoming')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                  activeDashboardTab === 'upcoming'
                    ? 'border-b-2 border-[#F97316] text-[#F97316] font-bold'
                    : 'text-[#047857] hover:bg-[#047857]/5'
                }`}
              >
                Upcoming Activities & Drives
              </button>
              <button
                onClick={() => setActiveDashboardTab('tracked')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                  activeDashboardTab === 'tracked'
                    ? 'border-b-2 border-[#F97316] text-[#F97316] font-bold'
                    : 'text-[#047857] hover:bg-[#047857]/5'
                }`}
              >
                My Tracked & Reported Issues
              </button>
              <button
                onClick={() => setActiveDashboardTab('escalation')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors cursor-pointer ${
                  activeDashboardTab === 'escalation'
                    ? 'border-b-2 border-[#F97316] text-[#F97316] font-bold'
                    : 'text-[#047857] hover:bg-[#047857]/5'
                }`}
              >
                Escalation Status & Official Responses
              </button>
            </div>

            <button
              onClick={() => {}}
              className="text-xs font-semibold text-[#047857] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Citizen Badges & Certificates</span>
            </button>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Center / Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Upcoming Joined Volunteering Activities */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#F97316]" />
                    <h3 className="text-base font-bold text-[#047857]">
                      Upcoming Joined Volunteering Activities
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('volunteer')}
                    className="text-xs font-semibold text-[#F97316] hover:underline cursor-pointer"
                  >
                    View All Drives →
                  </button>
                </div>

                {/* Drive 1 Card */}
                <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#047857]/70">
                      WATER QUALITY OVERSIGHT • FIELD TESTING
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 border border-[#F97316] text-[#F97316] rounded-xs">
                      In 3 Days
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#047857]">
                    Community Water Audit & Heavy Metal Field Test
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#047857]">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#047857]/70 block">
                        SCHEDULED SLOT
                      </span>
                      <span className="font-semibold">Sunday, Oct 27 • 08:30 AM</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#047857]/70 block">
                        DESIGNATED ROLE
                      </span>
                      <span className="font-semibold">Field Sample Collector (Station B)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#047857]/70 block">
                        ASSEMBLY POINT
                      </span>
                      <span className="font-semibold">Mahadevapura Water Tank Gate</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#047857]/15">
                    <button
                      onClick={() => setBriefingOpen(true)}
                      className="px-3 py-1.5 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                    >
                      View Briefing Doc
                    </button>
                    <a
                      href="mailto:ananya.r@cleanwaters.org"
                      className="px-3 py-1.5 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                    >
                      Contact Coordinator (Ananya R.)
                    </a>
                    <button
                      onClick={() => handleAddToCalendar('drive-1')}
                      className="px-3 py-1.5 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{calendarAdded === 'drive-1' ? 'Added!' : 'Add to Calendar'}</span>
                    </button>
                  </div>
                </div>

                {/* Drive 2 Card */}
                <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#047857]/70">
                      URBAN ECOLOGY • FORESTRY CELL
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 border border-[#047857] text-[#047857] rounded-xs">
                      Attendance Confirmed
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#047857]">
                    Cubbon Park Native Sapling Plantation
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#047857]">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#047857]/70 block">
                        SCHEDULED SLOT
                      </span>
                      <span className="font-semibold">Saturday, Nov 09 • 07:00 AM</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#047857]/70 block">
                        DESIGNATED ROLE
                      </span>
                      <span className="font-semibold">Logistics & Sapling Staging</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#047857]/70 block">
                        ASSEMBLY POINT
                      </span>
                      <span className="font-semibold">East Gate Bandstand</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#047857]/80">
                    <span className="font-semibold text-[#047857]">Equipment provided:</span> Gloves, Digging Spades, Identification Tags
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#047857]/15">
                    <button
                      onClick={() => alert('Invite link copied for WhatsApp/Signal group!')}
                      className="px-3 py-1.5 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                    >
                      Invite Neighbor
                    </button>
                    <button
                      onClick={() => handleAddToCalendar('drive-2')}
                      className="px-3 py-1.5 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{calendarAdded === 'drive-2' ? 'Added!' : 'Add to Calendar'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Civic Issues You Are Following */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookmarkCheck className="w-4 h-4 text-[#047857]" />
                    <h3 className="text-base font-bold text-[#047857]">Civic Issues You Are Following</h3>
                  </div>
                  <span className="text-xs text-[#047857]/70">Filter: Active Watchlist</span>
                </div>

                {/* Following Card 1 */}
                <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#F97316]">#KTV-2024-8841</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 border border-[#047857] text-[#047857] rounded-xs">
                      Authority Responded
                    </span>
                  </div>

                  <h4
                    onClick={() => onSelectIssue('KTV-2024-8841')}
                    className="text-base font-bold text-[#047857] hover:text-[#F97316] transition-colors cursor-pointer"
                  >
                    Severe Industrial Effluent Discharge in Bellandur
                  </h4>

                  <div className="p-3 bg-emerald-50/50 border border-[#047857]/15 rounded text-xs text-[#047857] space-y-1">
                    <div className="font-bold">Latest Official Update:</div>
                    <p className="leading-relaxed">
                      KSPCB issued show-cause notice to industrial units in Doddakannelli (2 days ago). Air & water monitoring teams deployed for spot sampling.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-[#047857]/70">
                    <div className="flex items-center gap-3">
                      <span>Bellandur Outer Ring Outlet</span>
                      <span>•</span>
                      <span>342 Co-signers</span>
                    </div>
                    <button
                      onClick={() => onSelectIssue('KTV-2024-8841')}
                      className="font-bold text-[#047857] hover:underline cursor-pointer"
                    >
                      View Full Timeline →
                    </button>
                  </div>
                </div>

                {/* Following Card 2 */}
                <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#047857]">#KTV-2024-7120</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 border border-[#047857] text-[#047857] rounded-xs">
                      Work Order Issued
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#047857]">
                    Dangerous Potholes at Sarjapur-ORR Junction
                  </h4>

                  <div className="p-3 bg-emerald-50/50 border border-[#047857]/15 rounded text-xs text-[#047857] space-y-1">
                    <div className="font-bold">Latest Official Update:</div>
                    <p className="leading-relaxed">
                      BBMP Road Infrastructure Division accepted work order #BBMP-WO-902. Milling and wet mix macadam scheduled for overnight execution.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-[#047857]/70">
                    <div className="flex items-center gap-3">
                      <span>Iblur Flyover Down-ramp</span>
                      <span>•</span>
                      <span>128 Co-signers</span>
                    </div>
                    <button
                      onClick={() => {}}
                      className="font-bold text-[#047857] hover:underline cursor-pointer"
                    >
                      Inspect Resolution →
                    </button>
                  </div>
                </div>

                {/* Following Card 3 */}
                <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#F97316]">#KTV-2024-6502</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 border border-[#F97316] text-[#F97316] rounded-xs">
                      Citizen Escalation In Progress
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#047857]">
                    Non-Functional Streetlights on Kasavanahalli Main Road
                  </h4>

                  <div className="p-3 bg-orange-50/50 border border-[#F97316]/20 rounded text-xs text-[#047857] space-y-1">
                    <div className="font-bold text-[#F97316]">Pending Action:</div>
                    <p className="leading-relaxed">
                      BESCOM and Ward Engineering desk missed statutory 72-hour SLA. Automatic grievance ticket dispatched to Mahadevapura Joint Commissioner.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-[#047857]/70">
                    <div className="flex items-center gap-3">
                      <span>Stretch from Hosa Road Jn to Lake Gate</span>
                      <span>•</span>
                      <span>512 Co-signers</span>
                    </div>
                    <button
                      onClick={() => {}}
                      className="font-bold text-[#047857] hover:underline cursor-pointer"
                    >
                      View Ward Minutes →
                    </button>
                  </div>
                </div>
              </div>

              {/* Latest On-Site Verification Submissions */}
              <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#047857]">
                      Latest On-Site Verification Submissions
                    </h3>
                    <p className="text-xs text-[#047857]/70">
                      High-resolution geotagged evidence uploaded by local verified volunteers
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#047857] px-2 py-0.5 border border-[#047857] rounded-xs uppercase">
                    Cryptographically Timestamped
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {USER_PROFILE.recentSubmissions.map((sub) => (
                    <div key={sub.id} className="space-y-1.5 border border-[#047857]/15 rounded-xs p-2 bg-[#fdfdfd]">
                      <div className="aspect-16/10 rounded-xs overflow-hidden bg-slate-100">
                        <img
                          src={sub.image}
                          alt={sub.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="pt-1 text-xs">
                        <div className="flex justify-between items-center font-bold text-[#047857]">
                          <span>{sub.title}</span>
                          <span className="text-[#F97316] font-mono">{sub.metric}</span>
                        </div>
                        <div className="text-[11px] text-[#047857]/70 mt-0.5">
                          {sub.submitter} • {sub.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar, 4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Direct Civic Actions Box */}
              <div className="bg-white border border-[#047857]/25 rounded-xs p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#F97316]" />
                  <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#047857]">
                    DIRECT CIVIC ACTIONS
                  </h3>
                </div>

                <p className="text-xs text-[#047857]/80 leading-relaxed">
                  Exercise your constitutional citizen rights with verified institutional escalation tools.
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={onOpenReportModal}
                    className="w-full py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Report a New Local Issue</span>
                  </button>
                  <button
                    onClick={onOpenFileGrievance}
                    className="w-full py-2 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Draft RTI or Ward Letter</span>
                  </button>
                  <a
                    href="#directory"
                    className="block text-center py-1.5 text-xs text-[#047857] hover:underline flex items-center justify-center gap-1.5"
                  >
                    <span>Ward Officer Contact Directory</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Ward 150 Governance Desk */}
              <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-[#047857]/15">
                  <Building className="w-4 h-4 text-[#047857]" />
                  <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#047857]">
                    WARD 150 GOVERNANCE DESK
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-[#047857]">
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-[11px] px-1.5 py-0.5 border border-[#047857] rounded-xs shrink-0">
                      BBMP
                    </span>
                    <div>
                      <div className="font-bold">Assistant Executive Engineer</div>
                      <div className="text-[11px] text-[#047857]/80">
                        {USER_PROFILE.assignedWardDesk.bbmpEngineer}
                      </div>
                      <div className="text-[10px] font-mono text-[#047857]/70">
                        {USER_PROFILE.assignedWardDesk.bbmpEmail}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-[11px] px-1.5 py-0.5 border border-[#047857] rounded-xs shrink-0">
                      KSPCB
                    </span>
                    <div>
                      <div className="font-bold">Environmental Inspector</div>
                      <div className="text-[11px] text-[#047857]/80">
                        {USER_PROFILE.assignedWardDesk.kspcbInspector}
                      </div>
                      <div className="text-[10px] font-mono text-[#047857]/70">
                        {USER_PROFILE.assignedWardDesk.kspcbEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#047857]/15 text-xs text-[#047857]">
                  <span className="font-bold block text-[11px]">Next Ward Committee Meeting</span>
                  <div className="text-[11px] text-[#047857]/80 mt-0.5">
                    {USER_PROFILE.assignedWardDesk.nextMeeting}
                  </div>
                  <div className="text-[10px] text-[#047857]/60">
                    {USER_PROFILE.assignedWardDesk.meetingLocation}
                  </div>
                </div>
              </div>

              {/* Citizen Standing Card */}
              <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#047857]/15">
                  <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#047857]">
                    Citizen Standing
                  </h3>
                  <span className="text-[10px] font-bold text-[#F97316] uppercase">
                    {USER_PROFILE.stats.topPercent}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-[#047857] flex items-center justify-center font-extrabold font-mono text-2xl text-[#047857] shrink-0">
                    {USER_PROFILE.stats.standingScore}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#047857]">
                      {USER_PROFILE.stats.standingLevel}
                    </h4>
                    <p className="text-[11px] text-[#047857]/70 mt-0.5">
                      {USER_PROFILE.stats.reportsVerified} reports verified without dispute. {USER_PROFILE.stats.falseFlags} false flags.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#047857]/15 flex flex-wrap gap-1.5">
                  {USER_PROFILE.badges.map((badge, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 border border-[#047857] text-[#047857] rounded-xs bg-[#047857]/5 flex items-center gap-1"
                    >
                      <Award className="w-3 h-3 text-[#F97316]" />
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Briefing Doc Modal */}
      {briefingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border-2 border-[#047857] rounded-sm p-6 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#047857] mb-2">
              Volunteer Field Briefing Doc: Water Audit
            </h3>
            <div className="text-xs text-[#047857]/80 space-y-2 leading-relaxed">
              <p>
                <strong>Date & Time:</strong> Sunday, Oct 27, 08:30 AM – 01:00 PM
              </p>
              <p>
                <strong>Assembly Point:</strong> Mahadevapura Water Tank Gate. Look for Kartavya Green Brigade flag.
              </p>
              <p>
                <strong>Equipment Provided:</strong> Sterile glass sample vials, pH test strips, digital dissolved oxygen probe, high-visibility volunteer bibs.
              </p>
              <p>
                <strong>Safety Protocol:</strong> Do not touch effluent foam directly. Maintain 2-meter buffer from canal retaining wall during rain events.
              </p>
            </div>
            <button
              onClick={() => setBriefingOpen(false)}
              className="mt-4 px-4 py-2 bg-[#047857] text-white text-xs font-semibold rounded"
            >
              Close Briefing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardView;
