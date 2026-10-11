import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CollaborationRequest } from '../types/civic';
import {
  Users,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Filter,
  PlusCircle,
  Mail,
  Send,
} from 'lucide-react';

interface CollaborationViewProps {
  onSelectIssue?: (issueId: string) => void;
}

export const CollaborationView: React.FC<CollaborationViewProps> = ({
  onSelectIssue,
}) => {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  const fetchCollabs = async () => {
    try {
      const res = await api.getCollaborationRequests();
      setRequests(res.requests);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollabs();
  }, []);

  const assistanceTypes = [
    'All',
    'Volunteer support',
    'Technical expertise',
    'Research and evidence collection',
    'NGO collaboration',
    'Community awareness',
  ];

  const filtered = requests.filter((r) => {
    if (filterType !== 'All' && r.assistance_type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Card */}
      <div className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#F97316]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316]">
            COMMUNITY ACTION & COLLABORATION REGISTRY
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#047857] tracking-tight">
          Active Citizen, NGO & Volunteer Initiatives
        </h1>
        <p className="text-xs sm:text-sm text-[#047857]/80 max-w-4xl leading-relaxed">
          Turning documentary evidence into collaborative action. All submissions below are actively persisted to the Kartavya community database.
          Stakeholders and volunteer groups coordinate ground visits, legal representations, and water/air quality testing.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="bg-white border border-[#047857]/15 rounded-xs p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-[#047857]/60 mr-1">Assistance Type:</span>
          {assistanceTypes.map((t) => (
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

        <div className="text-xs text-[#047857]/70 font-semibold">
          Total Persisted Requests: <strong>{requests.length}</strong>
        </div>
      </div>

      {/* Requests Feed */}
      {loading ? (
        <div className="text-center py-12 text-xs text-[#047857]/70">Loading collaboration records...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#047857]/15 rounded-xs p-12 text-center space-y-3">
          <Users className="w-8 h-8 text-[#047857]/40 mx-auto" />
          <h3 className="text-sm font-bold text-[#047857]">No requests under this filter</h3>
          <p className="text-xs text-[#047857]/70">
            Open any documented issue card to submit a new expression of interest or collaboration proposal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#047857]/10 text-[#047857] rounded-xs">
                  {req.assistance_type}
                </span>

                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Status: {req.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] text-[#047857]/60 font-medium">Related Issue:</div>
                <h4
                  onClick={() => onSelectIssue && onSelectIssue(req.issue_id)}
                  className={`text-sm font-bold text-[#047857] leading-snug ${
                    onSelectIssue ? 'hover:underline cursor-pointer' : ''
                  }`}
                >
                  {req.issue_title}
                </h4>
              </div>

              <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs text-xs text-[#047857]/90 leading-relaxed italic">
                "{req.message}"
              </div>

              <div className="pt-2 border-t border-[#047857]/10 flex flex-wrap items-center justify-between text-[11px] text-[#047857]/70 gap-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#047857]">{req.requester_name}</span>
                  {req.organization && (
                    <span className="text-[#047857]/60 ml-1">({req.organization})</span>
                  )}
                  <div className="text-[10px] text-[#047857]/50">{req.requester_email}</div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[#047857]/60">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(req.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborationView;
