import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { VolunteeringDrive } from '../../data/civicData';

interface VolunteerRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  drive: VolunteeringDrive | null;
  onRegistered: (driveId: string) => void;
}

export const VolunteerRegisterModal: React.FC<VolunteerRegisterModalProps> = ({
  isOpen,
  onClose,
  drive,
  onRegistered,
}) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [name, setName] = useState('Priya Sharma');
  const [phone, setPhone] = useState('+91 98450 12849');
  const [hasEquipment, setHasEquipment] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !drive) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    onRegistered(drive.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border-2 border-[#047857] rounded-sm p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#047857]/20">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#F97316] uppercase">
              CITIZEN MOBILIZATION ENROLLMENT
            </span>
            <h2 className="text-xl font-bold text-[#047857]">Register for Civic Drive</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#047857] hover:text-[#065F46] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-[#047857] border border-[#047857] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#047857]">Registration Confirmed!</h3>
            <p className="text-xs text-[#047857]/80 max-w-sm mx-auto">
              You are confirmed for <span className="font-semibold">{drive.title}</span>. Your dispatch briefing doc and on-site badge have been saved to your dashboard.
            </p>
            <div className="p-3 bg-emerald-50/50 border border-[#047857]/20 rounded text-left text-xs text-[#047857] space-y-1">
              <div><span className="font-semibold">Assembly:</span> {drive.location}</div>
              <div><span className="font-semibold">Date & Time:</span> {drive.date} • {drive.time}</div>
              <div><span className="font-semibold">Assigned Role:</span> {selectedRole || drive.roles[0]?.title || 'General Civic Volunteer'}</div>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="mt-2 px-6 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold rounded"
            >
              Back to Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="p-3 bg-[#047857]/5 border border-[#047857]/20 rounded text-xs space-y-1">
              <div className="font-bold text-[#047857]">{drive.title}</div>
              <div className="flex items-center gap-2 text-[#047857]/80">
                <Calendar className="w-3.5 h-3.5 text-[#F97316]" /> {drive.date}
                <Clock className="w-3.5 h-3.5 text-[#F97316] ml-2" /> {drive.time}
              </div>
              <div className="flex items-center gap-2 text-[#047857]/80">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" /> {drive.location}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                Select Your Field Role *
              </label>
              <div className="space-y-2">
                {drive.roles.map((r, i) => (
                  <label
                    key={i}
                    className={`flex items-center justify-between p-2.5 border rounded cursor-pointer text-xs ${
                      (selectedRole === r.title || (!selectedRole && i === 0))
                        ? 'border-[#047857] bg-emerald-50/50 text-[#047857] font-semibold'
                        : 'border-[#047857]/20 text-[#047857]/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="role"
                        value={r.title}
                        checked={selectedRole === r.title || (!selectedRole && i === 0)}
                        onChange={() => setSelectedRole(r.title)}
                        className="text-[#047857]"
                      />
                      <span>{r.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#047857]/70">
                      {r.filled} / {r.needed} slots filled
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Volunteer Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#047857] uppercase tracking-wider mb-1">
                  Mobile (For Signal Coordination)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#047857]/30 rounded text-[#047857]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-[#047857] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={hasEquipment}
                onChange={(e) => setHasEquipment(e.target.checked)}
                className="text-[#047857] rounded"
              />
              <span>I confirm attendance and will bring required walking / safety footwear</span>
            </label>

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
                className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold rounded"
              >
                Confirm Spot on Roster
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default VolunteerRegisterModal;
