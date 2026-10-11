import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Stakeholder } from '../types/civic';
import {
  Shield,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Users,
} from 'lucide-react';

interface StakeholdersViewProps {
  onOpenCollabForStakeholder?: (stakeholder: Stakeholder) => void;
}

export const StakeholdersView: React.FC<StakeholdersViewProps> = ({
  onOpenCollabForStakeholder,
}) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getStakeholders()
      .then((res) => setStakeholders(res.stakeholders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const types = ['All', 'Municipal Authority', 'Pollution Control Board', 'Research & Civic Audit Organization', 'Environmental Action Group', 'Civic-Tech NGO'];

  const filtered = stakeholders.filter((stk) => {
    if (filterType !== 'All' && stk.stakeholder_type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        stk.name.toLowerCase().includes(q) ||
        stk.description.toLowerCase().includes(q) ||
        stk.service_area.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#F97316]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316]">
            STAKEHOLDER & AUTHORITY DIRECTORY
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#047857] tracking-tight">
          Municipal Bodies, Research Institutes & Civic Allies
        </h1>
        <p className="text-xs sm:text-sm text-[#047857]/80 max-w-4xl leading-relaxed">
          Kartavya connects documented civic evidence with statutory authorities and ground partners.
          Entities are verified with public credentials; any synthetic test profiles are explicitly labelled as demonstration data.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#047857]/15 rounded-xs p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#047857]/50" />
          <input
            type="text"
            placeholder="Search stakeholder name or jurisdiction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857] text-[#047857]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-[#047857]/60">Type:</span>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-xs text-[11px] font-medium transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-[#047857] text-white font-semibold'
                  : 'bg-[#f4f7f5] text-[#047857] hover:bg-[#e6ece8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Stakeholders */}
      {loading ? (
        <div className="text-center py-12 text-xs text-[#047857]/70">Loading stakeholder registry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stk) => (
            <div
              key={stk.id}
              className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#047857]/10 text-[#047857] rounded-xs">
                    {stk.stakeholder_type}
                  </span>

                  {stk.is_demo_data ? (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-xs shrink-0 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      Synthetic Demo
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-xs shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Entity
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#047857]">{stk.name}</h3>
                <p className="text-xs text-[#047857]/80 leading-relaxed">{stk.description}</p>

                <div className="space-y-1 pt-2 border-t border-[#047857]/10 text-[11px] text-[#047857]/70">
                  <div><strong>Jurisdiction:</strong> {stk.service_area}</div>
                  <div><strong>Public Contact:</strong> {stk.public_contact}</div>
                  <div><strong>Core Focus:</strong> {stk.expertise.join(', ')}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#047857]/10 flex items-center justify-between text-xs">
                <a
                  href={stk.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#047857] hover:underline flex items-center gap-1 font-semibold text-[11px]"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {onOpenCollabForStakeholder && (
                  <button
                    onClick={() => onOpenCollabForStakeholder(stk)}
                    className="px-3 py-1 bg-[#047857] hover:bg-[#035f44] text-white text-[11px] font-bold rounded-xs cursor-pointer shadow-2xs"
                  >
                    Propose Collab
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StakeholdersView;
