import React, { useState, useEffect } from 'react';
import { EventRegistration, CivicEvent } from '../../types/civic';
import { api } from '../../services/api';
import { X, Users, Mail, Phone, Calendar, Trash2, CheckCircle2 } from 'lucide-react';

interface EventRegistrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CivicEvent;
  onRegistrationCancelled?: () => void;
}

export const EventRegistrationsModal: React.FC<EventRegistrationsModalProps> = ({
  isOpen,
  onClose,
  event,
  onRegistrationCancelled,
}) => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRoster = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getEventRegistrations(event.id);
      setRegistrations(res.registrations);
    } catch (err: any) {
      setError(err?.message || 'Failed to load volunteer registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && event) {
      fetchRoster();
    }
  }, [isOpen, event?.id]);

  if (!isOpen) return null;

  const handleCancelRegistration = async (regId: string) => {
    if (!window.confirm('Cancel this volunteer registration?')) return;
    setActionLoadingId(regId);
    try {
      await api.cancelRegistrationById(regId);
      await fetchRoster();
      if (onRegistrationCancelled) onRegistrationCancelled();
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel volunteer registration.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmed = registrations.filter((r) => r.status === 'confirmed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#047857]/20 rounded-xs w-full max-w-2xl shadow-xl overflow-hidden p-6 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#047857]" />
            <div>
              <h3 className="text-sm font-bold text-[#047857] uppercase tracking-wider">
                Registered Volunteer Roster
              </h3>
              <span className="text-[10px] text-[#047857]/60 block">
                {event.title}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#047857]/60 hover:text-[#047857] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-2.5 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs">
            <div className="text-[10px] text-[#047857]/70 font-semibold uppercase">Total Capacity</div>
            <div className="text-lg font-mono font-bold text-[#047857]">{event.max_volunteers}</div>
          </div>
          <div className="p-2.5 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs">
            <div className="text-[10px] text-[#047857]/70 font-semibold uppercase">Confirmed Volunteers</div>
            <div className="text-lg font-mono font-bold text-[#047857]">{confirmed.length}</div>
          </div>
          <div className="p-2.5 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs">
            <div className="text-[10px] text-[#047857]/70 font-semibold uppercase">Open Slots</div>
            <div className="text-lg font-mono font-bold text-[#F97316]">
              {Math.max(0, event.max_volunteers - confirmed.length)}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xs text-xs">
            {error}
          </div>
        )}

        {/* Volunteers list */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1 text-xs">
          {loading ? (
            <div className="py-8 text-center text-[#047857]/60">Loading registered volunteers...</div>
          ) : registrations.length === 0 ? (
            <div className="py-8 text-center text-[#047857]/70 border border-dashed border-[#047857]/20 rounded-xs">
              No volunteers have registered for this event yet.
            </div>
          ) : (
            registrations.map((reg) => (
              <div
                key={reg.id}
                className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#047857]">{reg.volunteer_name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase ${
                        reg.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#047857]/80">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#047857]/50" /> {reg.volunteer_email}
                    </span>
                    {reg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#047857]/50" /> {reg.phone}
                      </span>
                    )}
                  </div>
                  {reg.skills_or_interests && (
                    <div className="text-[10px] text-[#047857]/70 italic">
                      Skills/Interests: {reg.skills_or_interests}
                    </div>
                  )}
                  <div className="text-[9px] text-[#047857]/50">
                    Registered: {new Date(reg.registered_at).toLocaleString()}
                  </div>
                </div>

                {reg.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancelRegistration(reg.id)}
                    disabled={actionLoadingId === reg.id}
                    className="self-end sm:self-center px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-semibold rounded-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{actionLoadingId === reg.id ? 'Removing...' : 'Remove'}</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-[#047857]/15">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#047857] hover:bg-[#035f44] text-white text-xs font-bold rounded-xs cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationsModal;
