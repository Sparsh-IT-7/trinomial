import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SignPetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (signCount: number) => void;
  currentSignatures: number;
  targetSignatures: number;
}

export const SignPetitionModal: React.FC<SignPetitionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentSignatures,
  targetSignatures,
}) => {
  const [name, setName] = useState('Priya Sharma');
  const [voterId, setVoterId] = useState('BLR9104829');
  const [ward, setWard] = useState('Ward 150 (Bellandur)');
  const [comment, setComment] = useState('Immediate closure of toxic midnight outfalls into Yamalur feeder drain is non-negotiable.');
  const [isSigned, setIsSigned] = useState(false);
  const [signatureHash, setSignatureHash] = useState('');

  if (!isOpen) return null;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    const hash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setSignatureHash(hash);
    setIsSigned(true);
    onSuccess(currentSignatures + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border-2 border-[#047857] rounded-sm p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#047857]/20">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#F97316] uppercase">
              LEGAL ESCALATION ACTION
            </span>
            <h2 className="text-xl font-bold text-[#047857]">Sign NGT Community Escalation Petition</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#047857] hover:text-[#065F46] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSigned ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-[#047857] border border-[#047857] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#047857]">Digital Signature Authenticated</h3>
            <p className="text-xs text-[#047857]/80 max-w-sm mx-auto">
              Your signature has been appended to Citizen Injunction Petition #NGT-SZ-2024-C88 and cryptographically hashed.
            </p>
            <div className="p-3 bg-emerald-50/50 border border-[#047857]/20 rounded text-left font-mono text-[11px] text-[#047857] space-y-1">
              <div><span className="font-semibold">Signer:</span> {name} ({voterId})</div>
              <div><span className="font-semibold">Ledger Hash:</span> {signatureHash}</div>
              <div><span className="font-semibold">Cumulative Count:</span> {currentSignatures + 1} / {targetSignatures}</div>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold rounded"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSign} className="mt-4 space-y-4">
            <div className="p-3 bg-orange-50/50 border border-[#F97316]/30 rounded text-xs text-[#047857]">
              <div className="flex items-center gap-1.5 font-bold text-[#F97316] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Injunction Objective</span>
              </div>
              Submits collective citizen injunction to National Green Tribunal (NGT) Principal Bench requiring instant pipeline closure and inspection of suspected electroplating units along Yamalur feeder drain.
            </div>

            <div className="text-xs text-[#047857] flex justify-between font-semibold">
              <span>Verified Signatures Progress</span>
              <span className="font-mono">{currentSignatures} / {targetSignatures}</span>
            </div>
            <div className="w-full bg-[#047857]/15 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#F97316] h-full"
                style={{ width: `${Math.min(100, (currentSignatures / targetSignatures) * 100)}%` }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                Full Name (As on Voter/Aadhaar) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Voter EPIC / Citizen ID *
                </label>
                <input
                  type="text"
                  required
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Resident Ward
                </label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                Citizen Statement of Impact (Optional)
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#047857] text-[#047857] text-xs font-semibold rounded hover:bg-[#047857]/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold rounded"
              >
                Sign Petition Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default SignPetitionModal;
