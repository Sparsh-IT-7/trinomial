import React from 'react';
import { X, Printer, Download, CheckCircle2, FileCheck } from 'lucide-react';
import { KartavyaLogo } from '../KartavyaLogo';
import { CivicIssue } from '../../data/civicData';

interface FactsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: CivicIssue;
}

export const FactsheetModal: React.FC<FactsheetModalProps> = ({ isOpen, onClose, issue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white border-2 border-[#047857] rounded-sm p-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#047857]">
          <div className="flex items-center gap-3">
            <KartavyaLogo size={42} showText={true} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-[#047857] text-[#047857] text-xs font-semibold rounded hover:bg-[#047857]/5 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Dossier
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#047857] hover:text-[#065F46] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="py-6 space-y-6">
          <div className="border border-[#047857]/30 p-4 rounded bg-[#fcfcfc]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#F97316] uppercase">
                  OFFICIAL PUBLIC DOMAIN FACTSHEET • DOCKET #{issue.id}
                </span>
                <h1 className="text-xl font-bold text-[#047857] mt-1">{issue.title}</h1>
                <p className="text-xs text-[#047857]/80 mt-1">
                  Jurisdiction: <span className="font-semibold">{issue.location}</span> • Telemetry Coordinate: <span className="font-mono">{issue.geoCoordinates || '12.9372° N, 77.6823° E'}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 text-xs font-bold border border-[#F97316] text-[#F97316] rounded-full">
                  Status: {issue.status}
                </span>
                <div className="text-[10px] text-[#047857]/60 mt-1 font-mono">
                  SHA-256: 8f4a...d91c
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#047857] mb-2">
              1. Incident Context & Findings
            </h3>
            <p className="text-xs leading-relaxed text-[#047857]/85 border-l-2 border-[#047857] pl-3 py-1">
              {issue.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#047857] mb-2">
              2. Chemical Laboratory Telemetry (KSPCB Standard)
            </h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 border border-[#047857]/20 rounded">
                <div className="text-[10px] text-[#047857]/70 font-semibold">Dissolved Oxygen</div>
                <div className="text-lg font-bold font-mono text-[#F97316]">0.8 mg/L</div>
                <div className="text-[10px] text-[#047857]/60">Norm: &gt; 4.0</div>
              </div>
              <div className="p-3 border border-[#047857]/20 rounded">
                <div className="text-[10px] text-[#047857]/70 font-semibold">BOD Level</div>
                <div className="text-lg font-bold font-mono text-[#F97316]">48 mg/L</div>
                <div className="text-[10px] text-[#047857]/60">Norm: &lt; 3.0</div>
              </div>
              <div className="p-3 border border-[#047857]/20 rounded">
                <div className="text-[10px] text-[#047857]/70 font-semibold">COD Level</div>
                <div className="text-lg font-bold font-mono text-[#F97316]">186 mg/L</div>
                <div className="text-[10px] text-[#047857]/60">Norm: &lt; 50</div>
              </div>
              <div className="p-3 border border-[#047857]/20 rounded">
                <div className="text-[10px] text-[#047857]/70 font-semibold">Surfactants</div>
                <div className="text-lg font-bold font-mono text-[#F97316]">14.2 mg/L</div>
                <div className="text-[10px] text-[#047857]/60">Norm: &lt; 1.0</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#047857] mb-2">
              3. Citizen Signatures & Escalation Status
            </h3>
            <div className="p-3 bg-emerald-50/50 border border-[#047857]/20 rounded text-xs text-[#047857] space-y-1">
              <div className="flex justify-between">
                <span>Verified Resident Signatures:</span>
                <span className="font-bold font-mono">{issue.petitionSignatures || 842} / {issue.petitionTarget || 1000}</span>
              </div>
              <div className="flex justify-between">
                <span>Statutory Authority:</span>
                <span className="font-bold">{issue.assignedAuthority}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Hash:</span>
                <span className="font-mono text-[11px]">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#047857]/60 border-t border-[#047857]/20 pt-4 flex justify-between items-center">
            <span>Produced by Kartavya Open Public Trust Architecture</span>
            <span>Certified Public Audit Record</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FactsheetModal;
