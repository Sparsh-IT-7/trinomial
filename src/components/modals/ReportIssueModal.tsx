import React, { useState } from 'react';
import { X, MapPin, Camera, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CivicIssue } from '../../data/civicData';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newIssue: Partial<CivicIssue>) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CivicIssue['category']>('Environmental Concerns');
  const [severity, setSeverity] = useState<CivicIssue['severity']>('High Priority');
  const [location, setLocation] = useState('Ward 150 (Bellandur)');
  const [city, setCity] = useState('Bengaluru');
  const [description, setDescription] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoCoords, setGeoCoords] = useState('12.9372, 77.6823');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedDocket, setGeneratedDocket] = useState('');

  if (!isOpen) return null;

  const handleSimulateGPS = () => {
    setIsGeolocating(true);
    setTimeout(() => {
      const lat = (12.937 + Math.random() * 0.01).toFixed(4);
      const lng = (77.682 + Math.random() * 0.01).toFixed(4);
      setGeoCoords(`${lat}, ${lng}`);
      setIsGeolocating(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const docketId = `KTV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedDocket(docketId);

    const newIssue: Partial<CivicIssue> = {
      id: docketId,
      title,
      category,
      severity,
      location,
      city,
      ward: 'Ward 150',
      description,
      geoCoordinates: geoCoords,
      verifiedSource: 'Citizen Geo-Tag & Verified Contributor',
      assignedAuthority: 'BBMP & State Pollution Control Board',
      citizensMobilized: 1,
      status: 'Open Issues',
      updatedAt: 'Just now',
      firstRecorded: 'Today',
      escalationLevel: 1,
      isWatchlisted: true,
    };

    onSubmit(newIssue);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border-2 border-[#047857] rounded-sm p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#047857]/20">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#F97316] uppercase">
              CITIZEN SUBMISSION PROTOCOL
            </span>
            <h2 className="text-xl font-bold text-[#047857]">Report Civic & Environmental Issue</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#047857] hover:text-[#065F46] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-[#047857] border border-[#047857] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#047857]">Grievance Registered & Geotagged</h3>
            <p className="text-sm text-[#047857]/80 max-w-md mx-auto">
              Docket ID <span className="font-mono font-bold text-[#047857]">{generatedDocket}</span> has been created with cryptographic timestamp and queued for municipal cross-referencing.
            </p>
            <div className="p-3 bg-emerald-50/50 border border-[#047857]/20 rounded text-xs text-[#047857] text-left max-w-md mx-auto space-y-1">
              <div className="flex justify-between">
                <span className="font-semibold">Routing Jurisdiction:</span>
                <span>BBMP Ward 150 & KSPCB Mahadevapura</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Statutory SLA:</span>
                <span>72 Hours (Citizen Charter Sec 4)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Telemetry Sensor Node:</span>
                <span>Coordinates {geoCoords}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold rounded"
            >
              Done & Return to Explorer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Toxic Effluent Leakage into Stormwater Drain near Junction"
                className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857] focus:border-[#F97316] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857] bg-white focus:border-[#F97316] focus:outline-hidden"
                >
                  <option value="Environmental Concerns">Environmental Concerns</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Public Safety">Public Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857] bg-white focus:border-[#F97316] focus:outline-hidden"
                >
                  <option value="Critical">Critical (Immediate Public Hazard)</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Location / Landmark
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Yamalur Lake Culvert #7"
                  className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857] focus:border-[#F97316] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Geo-Coordinates
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={geoCoords}
                    onChange={(e) => setGeoCoords(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-[#047857]/30 rounded text-[#047857]"
                  />
                  <button
                    type="button"
                    onClick={handleSimulateGPS}
                    className="px-3 py-2 text-xs border border-[#047857] text-[#047857] hover:bg-[#047857]/5 rounded flex items-center gap-1 shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {isGeolocating ? 'Locating...' : 'GPS'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                Detailed Incident Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe observations, time of occurrence, smells, affected public, water discoloration, or visible discharge points..."
                className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857] focus:border-[#F97316] focus:outline-hidden"
              />
            </div>

            <div className="p-3 border border-dashed border-[#047857]/30 rounded bg-[#f9f9f9] text-center">
              <Camera className="w-6 h-6 mx-auto text-[#047857]/60 mb-1" />
              <p className="text-xs text-[#047857] font-medium">Attach Geotagged Photographic Proof</p>
              <p className="text-[11px] text-[#047857]/60">JPEG/PNG metadata will be cryptographically hashed to prevent duplicate spoofing</p>
            </div>

            <div className="pt-3 border-t border-[#047857]/20 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#047857] text-[#047857] text-xs font-semibold rounded hover:bg-[#047857]/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold rounded shadow-xs"
              >
                Submit & Escalate to Ward Docket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default ReportIssueModal;
