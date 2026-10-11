import React, { useState } from 'react';
import { X, MapPin, AlertTriangle, CheckCircle2, Send, PlusCircle } from 'lucide-react';
import { api } from '../../services/api';
import { IssueCategory } from '../../types/civic';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated?: () => void;
}

const CATEGORIES: IssueCategory[] = [
  'Water Supply',
  'Sewerage & Drainage',
  'Solid Waste Management',
  'Public Sanitation & Toilets',
  'Air Quality & Pollution',
  'Roads & Infrastructure',
  'Traffic & Public Safety',
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onReportCreated,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Water Supply');
  const [locationText, setLocationText] = useState('Dadar West, Ward G-North');
  const [ward, setWard] = useState('Ward G-North');
  const [city, setCity] = useState('Mumbai');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('19.0178');
  const [longitude, setLongitude] = useState('72.8478');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateGPS = () => {
    // Generate slight random jitter around Mumbai
    const lat = (19.01 + Math.random() * 0.08).toFixed(4);
    const lng = (72.84 + Math.random() * 0.06).toFixed(4);
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !locationText.trim()) {
      setError('Please provide title, location, and description.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.submitCitizenReport({
        title: title.trim(),
        description: description.trim(),
        category,
        location_text: locationText.trim(),
        ward: ward.trim() || undefined,
        city: city.trim() || 'Mumbai',
        latitude: parseFloat(latitude) || undefined,
        longitude: parseFloat(longitude) || undefined,
      });

      setSuccess(true);
      if (onReportCreated) onReportCreated();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit citizen report.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-[#047857]/20 rounded-xs w-full max-w-lg shadow-xl overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#F97316]" />
            <div>
              <h3 className="text-sm font-bold text-[#047857] uppercase tracking-wider">
                Submit Citizen Civic Report
              </h3>
              <span className="text-[10px] text-[#047857]/60 block">
                Secondary feature • Labelled as Pending Verification
              </span>
            </div>
          </div>
          <button onClick={handleClose} className="text-[#047857]/60 hover:text-[#047857] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-[#047857]">Citizen Report Recorded</h4>
            <p className="text-[#047857]/80 max-w-sm mx-auto">
              Your submission has been saved to the database. It will appear on the feed clearly labelled as{' '}
              <strong>Citizen Report (Pending Verification)</strong> to preserve provenance distinction.
            </p>
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-[#047857] hover:bg-[#035f44] text-white font-bold rounded-xs cursor-pointer shadow-2xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xs">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Issue Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Major water distribution pipe rupture leaking on SV Road"
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#047857]">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#047857]">Ward / Zone</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Ward G-North or Ward L"
                  className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Location Description *</label>
              <input
                type="text"
                required
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="e.g. Near Dadar Kabutarkhana & Railway Station"
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>

            <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#047857]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Geo-Coordinates (Simulated / GPS)</span>
                </span>
                <button
                  type="button"
                  onClick={handleSimulateGPS}
                  className="text-[10px] text-[#047857] hover:underline font-bold cursor-pointer"
                >
                  Acquire GPS Pin
                </button>
              </div>
              <div className="text-[11px] font-mono text-[#047857]/70">
                {latitude}, {longitude} (Mumbai)
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Detailed Incident Description *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible impact, hazard level, and observed timeline..."
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>

            <div className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xs text-[10px] leading-relaxed">
              <strong>Notice:</strong> Citizen submissions are recorded separately from the OpenCity historical audit records and remain tagged as pending ground verification.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#047857]/15">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-[#047857]/20 text-[#047857] font-semibold rounded-xs hover:bg-[#047857]/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Record Citizen Issue'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportIssueModal;
