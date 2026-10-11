import React from 'react';
import { Building, Users, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';

export const OrganizationsView: React.FC = () => {
  const orgs = [
    {
      id: 'ORG-01',
      name: 'Save Bellandur Waterways Citizen Collective',
      type: 'Registered Citizen Forum',
      registration: '#KA-NGO-8820',
      location: 'Ward 150 (Bellandur), Bengaluru',
      volunteersCount: 420,
      focus: 'Lake rejuvenation, chemical outfall tracking, NGT legal petitions',
      activeDrives: 2,
    },
    {
      id: 'ORG-02',
      name: 'Green Brigade Foundation',
      type: 'Ecological Non-Profit',
      registration: '#KA-SCT-1092',
      location: 'Central Bengaluru',
      volunteersCount: 860,
      focus: 'Urban forestry, native sapling plantations, soil aeration audits',
      activeDrives: 3,
    },
    {
      id: 'ORG-03',
      name: 'Safe Streets Citizen Coalition',
      type: 'Pedestrian Advocacy Group',
      registration: '#KA-CIV-5531',
      location: 'Outer Ring Road Corridor, Bengaluru',
      volunteersCount: 310,
      focus: 'Pothole geo-tagging, footpath restoration, pedestrian crossings',
      activeDrives: 1,
    },
    {
      id: 'ORG-04',
      name: 'Hasiru Dala Community Partner',
      type: 'Waste Workers Alliance',
      registration: '#KA-SOC-2011',
      location: 'Koramangala & Mahadevapura',
      volunteersCount: 1200,
      focus: 'Decentralized dry waste sorting, zero waste home composting',
      activeDrives: 2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F97316]">
          CIVIL SOCIETY NETWORK
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#047857] tracking-tight">
          Partner Civic Organizations
        </h1>
        <p className="text-xs sm:text-sm text-[#047857]/80 max-w-3xl leading-relaxed">
          Kartavya connects active citizens with vetted non-profits, Resident Welfare Associations (RWAs), and citizen collectives to turn municipal oversight into verified impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orgs.map((org) => (
          <div
            key={org.id}
            className="bg-white border border-[#047857]/20 rounded-xs p-6 space-y-4 hover:border-[#047857] transition-all shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 border border-[#047857] text-[#047857] rounded-xs uppercase">
                  {org.type}
                </span>
                <h3 className="text-lg font-bold text-[#047857] mt-2">{org.name}</h3>
                <div className="text-xs text-[#047857]/70 font-mono mt-0.5">
                  Reg ID: {org.registration}
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#F97316] border border-[#F97316] px-2 py-0.5 rounded-xs">
                {org.activeDrives} Active Drives
              </span>
            </div>

            <p className="text-xs text-[#047857]/85 leading-relaxed">
              <strong className="text-[#047857]">Core Focus:</strong> {org.focus}
            </p>

            <div className="pt-2 border-t border-[#047857]/15 flex items-center justify-between text-xs text-[#047857]/80">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{org.location}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-[#047857]">
                <Users className="w-3.5 h-3.5" />
                <span>{org.volunteersCount} Active Members</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrganizationsView;
