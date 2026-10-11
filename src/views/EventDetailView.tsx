import React, { useState, useEffect } from 'react';
import { CivicEvent, CivicIssue, EventRegistration } from '../types/civic';
import { api } from '../services/api';
import EditEventModal from '../components/modals/EditEventModal';
import EventRegistrationsModal from '../components/modals/EventRegistrationsModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowLeft,
  Wrench,
  Sparkles,
  Edit3,
  ListFilter,
  Check,
  Send,
  ExternalLink,
} from 'lucide-react';

interface EventDetailViewProps {
  eventId: string;
  onBack: () => void;
  onSelectIssue?: (issueId: string) => void;
  onNavigateToMyRegistrations?: () => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  eventId,
  onBack,
  onSelectIssue,
  onNavigateToMyRegistrations,
}) => {
  const [event, setEvent] = useState<CivicEvent | null>(null);
  const [relatedIssues, setRelatedIssues] = useState<CivicIssue[]>([]);
  const [availableSlots, setAvailableSlots] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Volunteer registration form states
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<EventRegistration | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // Organizer controls
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchEventData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEventById(eventId);
      setEvent(data.event);
      setRelatedIssues(data.relatedIssues || []);
      setAvailableSlots(data.availableSlots);
    } catch (err: any) {
      setError(err?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const shareableUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#event=${event?.id || eventId}`
    : '';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (!volunteerName.trim() || !volunteerEmail.trim()) {
      setRegistrationError('Please enter your full name and valid email address.');
      return;
    }

    setRegistering(true);
    setRegistrationError(null);

    try {
      const res = await api.registerForEvent(event.id, {
        volunteer_name: volunteerName.trim(),
        volunteer_email: volunteerEmail.trim(),
        phone: phone.trim() || undefined,
        skills_or_interests: skills.trim() || undefined,
        emergency_contact: emergencyContact.trim() || undefined,
      });

      if (res.success && res.registration) {
        setRegistrationSuccess(res.registration);
        setEvent(res.event);
        setAvailableSlots(Math.max(0, res.event.max_volunteers - res.event.registered_volunteers_count));
      }
    } catch (err: any) {
      setRegistrationError(err?.message || 'Failed to register for this event.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-[#047857]/70">
        Loading civic action event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-[#047857]">Civic Action Event Not Found</h2>
        <p className="text-xs text-[#047857]/80">{error || 'The requested event could not be found.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#047857] text-white text-xs font-semibold rounded-xs cursor-pointer shadow-2xs"
        >
          Return to Events Hub
        </button>
      </div>
    );
  }

  const isFull = event.status === 'Full' || availableSlots <= 0;
  const isCancelled = event.status === 'Cancelled';
  const isCompleted = event.status === 'Completed';
  const isOpenForReg = event.status === 'Open for Registration' && !isFull && !isCancelled;
  const progressPercent = Math.min(
    100,
    Math.round((event.registered_volunteers_count / event.max_volunteers) * 100)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Share Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-white border border-[#047857]/20 hover:border-[#047857] text-[#047857] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-white border border-[#047857]/20 hover:border-[#047857] text-[#047857] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Copy unique registration link to share"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Share Registration Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Event Header Card */}
      <div className="bg-white border border-[#047857]/20 rounded-xs p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-[#047857]/10 text-[#047857] rounded-xs">
              {event.category}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-xs uppercase tracking-wider ${
                isOpenForReg
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : isFull
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : isCancelled
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {event.status}
            </span>
            <span className="text-xs font-mono text-[#047857]/60">
              Ref: {event.id}
            </span>
          </div>

          <span className="text-xs text-[#047857]/70 font-semibold">
            Registration Deadline: {event.registration_deadline || event.date}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#047857] leading-tight">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#047857]/80 mt-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Shareable Link Display */}
        <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-[#047857] text-[11px] uppercase tracking-wider shrink-0">
              Shareable Event Link:
            </span>
            <span className="font-mono text-[11px] text-[#047857]/80 truncate bg-white px-2 py-0.5 rounded-xs border border-[#047857]/10">
              {shareableUrl}
            </span>
          </div>
          <button
            onClick={handleCopyLink}
            className="text-[11px] font-bold text-[#F97316] hover:underline cursor-pointer shrink-0 text-left"
          >
            {copiedLink ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>

        {/* 4 Metric / Key Info Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#047857]/70">
              <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Date & Time</span>
            </div>
            <div className="font-bold text-xs text-[#047857] mt-1">{event.date}</div>
            <div className="text-[11px] text-[#047857]/70">{event.start_time} ({event.duration_hours} hrs)</div>
          </div>

          <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#047857]/70">
              <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Location & Ward</span>
            </div>
            <div className="font-bold text-xs text-[#047857] mt-1 truncate">{event.location_name}</div>
            <div className="text-[11px] text-[#047857]/70">{event.ward ? `${event.ward}, ` : ''}{event.city}</div>
          </div>

          <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#047857]/70">
              <Shield className="w-3.5 h-3.5 text-[#047857]" />
              <span>Organizer</span>
            </div>
            <div className="font-bold text-xs text-[#047857] mt-1 truncate">{event.organizer_organization}</div>
            <div className="text-[11px] text-[#047857]/70 truncate">{event.organizer_name} ({event.organizer_type})</div>
          </div>

          <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-[#047857]/70">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#047857]" />
                <span>Capacity</span>
              </span>
              <span className="font-mono text-xs font-bold text-[#047857]">
                {event.registered_volunteers_count} / {event.max_volunteers}
              </span>
            </div>
            <div className="w-full bg-[#047857]/10 h-2 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full transition-all duration-300 ${
                  progressPercent >= 100 ? 'bg-amber-600' : 'bg-[#047857]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-[#047857]/70 mt-1 font-semibold">
              {availableSlots > 0 ? `${availableSlots} slots remaining` : 'Full capacity'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Logistics, Instructions & Connected Civic Issues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assembly & Instructions */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#047857] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#047857]/15">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              Assembly Details & Participation Guidelines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#fcfdfc] border border-[#047857]/10 rounded-xs space-y-1">
                <div className="font-bold text-[#047857]">Meeting Point</div>
                <div className="text-[#047857]/90">{event.meeting_point}</div>
                <div className="text-[11px] text-[#047857]/60">
                  Please arrive 10-15 minutes prior to start time ({event.start_time}).
                </div>
              </div>

              <div className="p-3 bg-[#fcfdfc] border border-[#047857]/10 rounded-xs space-y-1">
                <div className="font-bold text-[#047857]">Activity Format</div>
                <div className="text-[#047857]/90">{event.activity_type}</div>
                <div className="text-[11px] text-[#047857]/60">
                  Expected duration: ~{event.duration_hours} hours.
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-[#047857]">Participation Instructions</div>
              <p className="text-[#047857]/80 leading-relaxed bg-[#fcfdfc] p-3 rounded-xs border border-[#047857]/10">
                {event.participation_instructions}
              </p>
            </div>

            {/* Volunteer Tasks */}
            {event.required_skills_or_tasks && event.required_skills_or_tasks.length > 0 && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-[#047857]">Volunteer Tasks & Required Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {event.required_skills_or_tasks.map((task, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#047857]/10 text-[#047857] font-semibold text-[11px] rounded-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#047857]" />
                      {task}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              {event.equipment_provided && event.equipment_provided.length > 0 && (
                <div className="p-3 bg-[#fcfdfc] border border-[#047857]/10 rounded-xs space-y-1.5">
                  <div className="font-bold text-[#047857] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#047857]" />
                    Provided by Organizer:
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-[#047857]/80 space-y-0.5">
                    {event.equipment_provided.map((eq, i) => (
                      <li key={i}>{eq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.equipment_needed_from_volunteer &&
                event.equipment_needed_from_volunteer.length > 0 && (
                  <div className="p-3 bg-[#fcfdfc] border border-[#047857]/10 rounded-xs space-y-1.5">
                    <div className="font-bold text-[#F97316] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                      Volunteers Should Bring:
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-[#047857]/80 space-y-0.5">
                      {event.equipment_needed_from_volunteer.map((eq, i) => (
                        <li key={i}>{eq}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>

          {/* Connected Civic Problems */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-[#047857] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#047857]/15">
              <Sparkles className="w-4 h-4 text-[#047857]" />
              Civic Purpose: Ground Action for Documented Municipal Problems
            </h3>
            <p className="text-xs text-[#047857]/80 leading-relaxed">
              This event is explicitly linked to real urban audit records from OpenCity India and citizen monitoring feeds. By joining, volunteers generate verifiable ground evidence to hold municipal agencies accountable.
            </p>

            {relatedIssues.length > 0 ? (
              <div className="space-y-3">
                {relatedIssues.map((iss) => (
                  <div
                    key={iss.id}
                    className="p-3.5 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#047857]/10 text-[#047857] rounded-xs uppercase">
                          {iss.category}
                        </span>
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-xs">
                          {iss.priority} Priority
                        </span>
                      </div>
                      <div className="font-bold text-[#047857] text-xs">{iss.title}</div>
                      <div className="text-[11px] text-[#047857]/70">
                        {iss.location_text} • Verified against: {iss.source_dataset_title}
                      </div>
                    </div>

                    {onSelectIssue && (
                      <button
                        onClick={() => onSelectIssue(iss.id)}
                        className="px-3 py-1 bg-[#047857]/10 hover:bg-[#047857]/20 text-[#047857] font-bold rounded-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1 text-[11px]"
                      >
                        <span>View Issue Audit</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#047857]/60 italic">
                General civic initiative serving public neighborhood well-being.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Registration Form & Organizer Panel */}
        <div className="space-y-6">
          {/* Volunteer Registration Card */}
          <div className="bg-white border-2 border-[#047857] rounded-xs p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#047857]/15">
              <Users className="w-4 h-4 text-[#F97316]" />
              <h3 className="text-xs font-bold text-[#047857] uppercase tracking-wider">
                Register as Volunteer
              </h3>
            </div>

            {registrationSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xs space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>You Are Confirmed!</span>
                </div>
                <p className="text-emerald-900 leading-relaxed">
                  Thank you, <strong>{registrationSuccess.volunteer_name}</strong>. Your registration for{' '}
                  <strong>{event.title}</strong> has been confirmed and stored in the database.
                </p>
                <div className="p-2.5 bg-white border border-emerald-200 rounded-xs space-y-1 text-[11px]">
                  <div><strong>Registration Ref:</strong> <span className="font-mono">{registrationSuccess.id}</span></div>
                  <div><strong>Meeting Point:</strong> {event.meeting_point}</div>
                  <div><strong>Date & Time:</strong> {event.date} at {event.start_time}</div>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  {onNavigateToMyRegistrations && (
                    <button
                      onClick={onNavigateToMyRegistrations}
                      className="w-full py-1.5 bg-[#047857] text-white font-bold rounded-xs text-xs hover:bg-[#035f44] cursor-pointer"
                    >
                      View in My Registrations
                    </button>
                  )}
                  <button
                    onClick={() => setRegistrationSuccess(null)}
                    className="text-[11px] text-[#047857] font-semibold underline text-center cursor-pointer"
                  >
                    Register another participant
                  </button>
                </div>
              </div>
            ) : isCancelled ? (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xs text-xs space-y-1">
                <div className="font-bold">Event Cancelled</div>
                <p>This event has been cancelled by the organizing team and is not accepting registrations.</p>
              </div>
            ) : isFull ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xs text-xs space-y-1">
                <div className="font-bold">Volunteer Capacity Reached</div>
                <p>All {event.max_volunteers} volunteer positions for this drive have been filled. Please check other upcoming civic drives in this category.</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                {registrationError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xs text-[11px]">
                    {registrationError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-[#047857]">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    placeholder="e.g. Anand Joshi"
                    className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#047857]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={volunteerEmail}
                    onChange={(e) => setVolunteerEmail(e.target.value)}
                    placeholder="e.g. anand@volunteer.org"
                    className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#047857]">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#047857]">Relevant Skills or Interests</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Water testing, First aid, Photography"
                    className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#047857]">Emergency Contact (Optional)</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Name & Contact number"
                    className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full py-2.5 bg-[#047857] hover:bg-[#035f44] text-white font-bold rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{registering ? 'Confirming...' : 'Register as Volunteer'}</span>
                  </button>
                </div>

                <div className="text-[10px] text-[#047857]/60 text-center">
                  Registration is free & non-commercial. Verified civic community action.
                </div>
              </form>
            )}
          </div>

          {/* Organizer Controls Panel */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#047857]/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70">
                Authorized Organizer Controls
              </span>
              <span className="text-[9px] font-bold bg-[#047857]/10 text-[#047857] px-1.5 py-0.2 rounded-xs">
                Admin
              </span>
            </div>

            <p className="text-[11px] text-[#047857]/80">
              Manage this scheduled event, review the live participant roster, or adjust timings and capacity.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <button
                onClick={() => setIsRosterModalOpen(true)}
                className="w-full py-1.5 px-3 bg-[#fcfdfc] border border-[#047857]/20 hover:border-[#047857] text-[#047857] font-semibold rounded-xs transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <ListFilter className="w-3.5 h-3.5 text-[#047857]" />
                  <span>View Volunteer Roster</span>
                </span>
                <span className="font-mono text-[11px] font-bold bg-[#047857]/10 px-1.5 py-0.2 rounded-xs">
                  {event.registered_volunteers_count}
                </span>
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-1.5 px-3 bg-[#fcfdfc] border border-[#047857]/20 hover:border-[#047857] text-[#047857] font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#047857]" />
                <span>Edit Schedule & Capacity</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit & Roster Modals */}
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        onEventUpdated={(updated) => {
          setEvent(updated);
          setAvailableSlots(Math.max(0, updated.max_volunteers - updated.registered_volunteers_count));
        }}
      />

      <EventRegistrationsModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        event={event}
        onRegistrationCancelled={() => {
          fetchEventData();
        }}
      />
    </div>
  );
};

export default EventDetailView;
