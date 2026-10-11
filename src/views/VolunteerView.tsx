import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Wrench,
  Users,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Megaphone,
} from 'lucide-react';
import { VolunteeringDrive } from '../data/civicData';

interface VolunteerViewProps {
  drives: VolunteeringDrive[];
  onSelectDriveToJoin: (drive: VolunteeringDrive) => void;
  onOpenProposalModal: () => void;
}

export const VolunteerView: React.FC<VolunteerViewProps> = ({
  drives,
  onSelectDriveToJoin,
  onOpenProposalModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [selectedSchedule, setSelectedSchedule] = useState('This Weekend');
  const [selectedZone, setSelectedZone] = useState('Bengaluru');

  const skills = [
    'All Skills',
    'Ground Action / Clean-up',
    'Legal & RTI Assistance',
    'Data Collection / Survey',
    'Logistics & Tech',
  ];

  const schedules = ['This Weekend', 'Upcoming Week', 'Ongoing / Flexible'];
  const zones = ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Pune', 'Hyderabad'];

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill =
      selectedSkill === 'All Skills' || drive.category === selectedSkill;

    const matchesSchedule =
      !selectedSchedule || drive.scheduleType === selectedSchedule || selectedSchedule === 'Ongoing / Flexible';

    const matchesZone =
      !selectedZone || drive.cityZone === selectedZone;

    return matchesSearch && matchesSkill && matchesSchedule && matchesZone;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-8">
      {/* Top Banner Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 text-xs font-semibold text-[#047857]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#047857]" />
          <span className="uppercase tracking-wider">VERIFIED CITIZEN MOBILIZATION PORTAL</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase border border-[#047857] px-2 py-0.5 rounded-xs">
          MUNICIPAL WARD DEPLOYMENT UNIT
        </span>
      </div>

      {/* Main Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#047857] tracking-tight">
          Civic Volunteering Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-[#047857]/80 max-w-3xl leading-relaxed">
          Connect directly with verified community initiatives, environmental restorations, and neighborhood improvement drives. Every action counts.
        </p>
      </div>

      {/* 4 Stat Metric Blocks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#047857]/20 rounded-xs p-4 shadow-2xs">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#047857]">88</div>
          <div className="text-xs font-semibold text-[#047857]/70 mt-0.5">
            Active Volunteering Drives
          </div>
        </div>
        <div className="bg-white border border-[#047857]/20 rounded-xs p-4 shadow-2xs">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#047857]">2,410</div>
          <div className="text-xs font-semibold text-[#047857]/70 mt-0.5">
            Registered Volunteers
          </div>
        </div>
        <div className="bg-white border border-[#047857]/20 rounded-xs p-4 shadow-2xs">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#047857]">45</div>
          <div className="text-xs font-semibold text-[#047857]/70 mt-0.5">
            Partner NGOs & Citizen Collectives
          </div>
        </div>
        <div className="bg-white border border-[#047857]/20 rounded-xs p-4 shadow-2xs">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#047857]">100%</div>
          <div className="text-xs font-semibold text-[#047857]/70 mt-0.5">
            Non-Commercial Guarantee
          </div>
        </div>
      </div>

      {/* Search and Filter Panel */}
      <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-4 shadow-2xs">
        {/* Search bar with Apply Filters button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#047857]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drives by neighborhood, ward code, or initiative keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#047857]/30 rounded-xs text-[#047857] placeholder-[#047857]/45 focus:border-[#F97316] focus:outline-hidden"
            />
          </div>
          <button
            onClick={() => {}}
            className="px-5 py-2.5 bg-[#047857] hover:bg-[#065F46] text-white text-xs sm:text-sm font-semibold rounded-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>

        {/* Filter Rows */}
        <div className="space-y-3 pt-1 text-xs">
          {/* Row 1: Skill Required */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#047857] w-28 shrink-0">
              SKILL REQUIRED:
            </span>
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-3 py-1 rounded-xs border transition-colors cursor-pointer ${
                  selectedSkill === skill
                    ? 'bg-[#047857] border-[#047857] text-white font-semibold'
                    : 'bg-white border-[#047857]/25 text-[#047857] hover:border-[#047857]'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Row 2: Schedule */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#047857] w-28 shrink-0">
              SCHEDULE:
            </span>
            {schedules.map((sch) => (
              <button
                key={sch}
                onClick={() => setSelectedSchedule(sch)}
                className={`px-3 py-1 rounded-xs border transition-colors cursor-pointer ${
                  selectedSchedule === sch
                    ? 'bg-[#047857] border-[#047857] text-white font-semibold'
                    : 'bg-white border-[#047857]/25 text-[#047857] hover:border-[#047857]'
                }`}
              >
                {sch}
              </button>
            ))}
          </div>

          {/* Row 3: Municipal Zone */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#047857] w-28 shrink-0">
              MUNICIPAL ZONE:
            </span>
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3 py-1 rounded-xs border transition-colors cursor-pointer ${
                  selectedZone === zone
                    ? 'bg-[#F97316] border-[#F97316] text-white font-semibold'
                    : 'bg-white border-[#047857]/25 text-[#047857] hover:border-[#047857]'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Opportunities Section Header */}
      <div className="flex items-center justify-between pb-1 text-xs">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-[#047857]">Active Opportunities</h2>
          <span className="text-[10px] font-bold px-1.5 py-0.5 border border-[#047857] text-[#047857] rounded-xs uppercase">
            {filteredDrives.length} Ready For Intake
          </span>
        </div>
        <span className="text-xs text-[#047857]/70 font-medium">Sorted by Nearest Event Date</span>
      </div>

      {/* Opportunities 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDrives.map((drive) => {
          const percent = Math.min(
            100,
            Math.round((drive.volunteersRegistered / drive.volunteersNeeded) * 100)
          );

          return (
            <div
              key={drive.id}
              className="bg-white border border-[#047857]/20 rounded-xs p-6 flex flex-col justify-between hover:border-[#047857] transition-all shadow-2xs"
            >
              <div className="space-y-4">
                {/* Card Top: Organizer Type badge + Needed badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 border border-[#047857] text-[#047857] rounded-xs uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{drive.organizerType}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F97316] border border-[#F97316] px-2 py-0.5 rounded-xs">
                    {drive.volunteersRegistered} / {drive.volunteersNeeded} Needed
                  </span>
                </div>

                {/* Title and Organizer */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#047857] leading-snug">
                    {drive.title}
                  </h3>
                  <div className="text-xs text-[#047857]/75 mt-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#047857]" />
                    <span>{drive.organizer}</span>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-1.5 text-xs text-[#047857]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#F97316] shrink-0" />
                    <span className="font-semibold">{drive.date} • {drive.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#047857] shrink-0" />
                    <span>{drive.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Wrench className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#047857]">Skills:</strong> {drive.skills}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#047857]/80 leading-relaxed">
                  {drive.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#047857]/15 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#F97316] h-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-[#047857]/15 flex items-center justify-between">
                <span className="text-xs text-[#047857]/70">
                  Deployment Ward: <span className="font-semibold text-[#047857]">{drive.ward}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectDriveToJoin(drive)}
                    className="px-3 py-1.5 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                  >
                    {drive.id === 'VOL-BLR-01'
                      ? 'View Schedule'
                      : drive.id === 'VOL-BLR-02'
                      ? 'View Protocol'
                      : drive.id === 'VOL-BLR-03'
                      ? 'View Route'
                      : 'View Details'}
                  </button>
                  <button
                    onClick={() => onSelectDriveToJoin(drive)}
                    className="px-4 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xs transition-colors shadow-xs cursor-pointer"
                  >
                    Join Opportunity
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Organize a Volunteering Drive Proposal Banner */}
      <div className="bg-white border border-[#047857]/20 rounded-xs p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#F97316]" />
            <h3 className="text-base sm:text-lg font-bold text-[#047857]">
              Organize a Volunteering Drive with Kartavya
            </h3>
          </div>
          <p className="text-xs text-[#047857]/80 max-w-2xl leading-relaxed">
            Registered Resident Welfare Associations (RWAs), civic forums, and non-profit foundations can list verified public welfare operations, mobilize local citizens, and submit direct field audits to administrative desks.
          </p>
        </div>
        <button
          onClick={onOpenProposalModal}
          className="px-5 py-2.5 bg-white border border-[#047857] hover:bg-[#047857]/5 text-[#047857] text-xs font-bold rounded-xs transition-colors shrink-0 cursor-pointer"
        >
          Submit Opportunity Proposal
        </button>
      </div>

      {/* Footer Status Indicators */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#047857]/70 gap-2 border-t border-[#047857]/15">
        <span>Demonstration listings verified for civic-tech prototyping.</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold text-[#047857]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#047857]"></span>
            <span>LIVE REGISTRY</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-[#F97316]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
            <span>PUBLIC DOMAIN DATA</span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default VolunteerView;
