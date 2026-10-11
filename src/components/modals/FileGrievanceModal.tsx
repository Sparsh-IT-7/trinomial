import React, { useState } from 'react';
import { X, FileText, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { USER_PROFILE } from '../../data/civicData';

interface FileGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileGrievanceModal: React.FC<FileGrievanceModalProps> = ({ isOpen, onClose }) => {
  const [department, setDepartment] = useState('BBMP Engineering & Health Desk');
  const [actSection, setActSection] = useState('Section 133 CrPC (Public Nuisance & Hazard)');
  const [subject, setSubject] = useState('Emergency Grievance: Toxic Effluent Flooding into Stormwater Drainage');
  const [ward, setWard] = useState('Ward 150 (Bellandur)');
  const [narrative, setNarrative] = useState(
    'Formal statutory complaint regarding continuous illegal nocturnal toxic dumping at Yamalur Canal culverts #4 and #7. Air quality and smell pose severe hazard to surrounding residential colonies. Immediate joint inspection and effluent seal requested.'
  );
  const [isSent, setIsSent] = useState(false);
  const [docketNo, setDocketNo] = useState('');

  if (!isOpen) return null;

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const docket = `BBMP-BELL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    setDocketNo(docket);
    setIsSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white border-2 border-[#047857] rounded-sm p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#047857]/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 text-[#F97316] rounded">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#F97316] uppercase">
                FORMAL STATUTORY DOCKETING
              </span>
              <h2 className="text-lg font-bold text-[#047857]">File Official Civic Grievance</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#047857] hover:text-[#065F46] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-[#047857] border border-[#047857] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#047857]">Docket Dispatched to Municipal Desk</h3>
            <p className="text-xs text-[#047857]/80 max-w-sm mx-auto">
              Your formal legal docket has been dispatched to Executive Engineer & Nodal Health Officer with statutory time counter.
            </p>
            <div className="p-3 bg-emerald-50/50 border border-[#047857]/20 rounded text-left font-mono text-xs text-[#047857] space-y-1">
              <div><span className="font-semibold">Docket Reference:</span> {docketNo}</div>
              <div><span className="font-semibold">Recipient:</span> {USER_PROFILE.assignedWardDesk.bbmpEngineer}</div>
              <div><span className="font-semibold">Statutory SLA:</span> 7 Business Days (Mandatory Written Response)</div>
            </div>
            <button
              onClick={() => {
                setIsSent(false);
                onClose();
              }}
              className="mt-2 px-6 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold rounded"
            >
              Done & Track in Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="mt-4 space-y-4">
            <div className="p-3 bg-orange-50/50 border border-[#F97316]/30 rounded text-xs text-[#047857] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#F97316]">
                <ShieldAlert className="w-4 h-4" />
                <span>Statutory Authority Binding</span>
              </div>
              Dispatched under Karnataka Municipalities Act & RTI framework. Formally copies Ward Committee agenda for public record.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Designated Body
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#047857]/30 rounded text-[#047857] bg-white"
                >
                  <option value="BBMP Engineering & Health Desk">BBMP Engineering Desk</option>
                  <option value="KSPCB Mahadevapura Regional Office">KSPCB Regional Office</option>
                  <option value="BWSSB Sewerage Division">BWSSB Sewerage Division</option>
                  <option value="Ward 150 Ward Committee">Ward 150 Committee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Legal Statutory Section
                </label>
                <select
                  value={actSection}
                  onChange={(e) => setActSection(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#047857]/30 rounded text-[#047857] bg-white"
                >
                  <option value="Section 133 CrPC (Public Nuisance & Hazard)">Section 133 CrPC</option>
                  <option value="KMC Act Sec 288 (Footpath Obstruction)">KMC Act Sec 288</option>
                  <option value="Water Act 1974 Sec 24 (Pollution Prohibition)">Water Act 1974 Sec 24</option>
                  <option value="Right to Information Act (RTI 2005)">RTI Act 2005</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                Grievance Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                Factual Docket Brief *
              </label>
              <textarea
                required
                rows={4}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-[#047857]/20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#047857] text-[#047857] text-xs font-semibold rounded hover:bg-[#047857]/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold rounded flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Statutory Docket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default FileGrievanceModal;
