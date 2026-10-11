import React, { useState, useEffect } from 'react';
import { CivicEvent, EventRegistration, CivicIssue } from '../types/civic';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Share2,
  Shield,
  Check,
  ChevronRight,
  ExternalLink,
  Trash2,
  Mail,
  Sparkles,
} from 'lucide-react';

interface VolunteerViewProps {
  onSelectEvent: (eventId: string) => void;
  onOpenCreateEventModal: () => void;
  onSelectIssue?: (issueId: string) => void;
}

export const VolunteerView: React.FC<VolunteerViewProps> = ({
  onSelectEvent,
  onOpenCreateEventModal,
  onSelectIssue,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-registrations'>('browse');
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Share link feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // My Registrations state
  const [userEmail, setUserEmail] = useState('');
  const [myRegistrations, setMyRegistrations] = useState<
    (EventRegistration & {
      event_title?: string;
      event_category?: string;
      event_date?: string;
      event_time?: string;
      event_location?: string;
      event_status?: string;
      event_slug?: string;
    })[]
  >([]);
  const [loadingMyRegs, setLoadingMyRegs] = useState(false);
  const [cancellingRegId, setCancellingRegId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data.events);
    } catch (e) {
      console.error('Failed to load events:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchMyRegistrations = async (emailToQuery?: string) => {
    const email = (emailToQuery || userEmail).trim();
    if (!email) {
      // Load all or stored registrations if email is empty
      setLoadingMyRegs(true);
      try {
        const data = await api.getRegistrations();
        setMyRegistrations(data.registrations);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMyRegs(false);
      }
      return;
    }

    setLoadingMyRegs(true);
    try {
      const data = await api.getRegistrations({ email });
      setMyRegistrations(data.registrations);
    } catch (e) {
      console.error('Failed to fetch user registrations:', e);
    } finally {
      setLoadingMyRegs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-registrations') {
      fetchMyRegistrations();
    }
  }, [activeTab]);

  const handleCopyLink = (event: CivicEvent) => {
    const url = `${window.location.origin}${window.location.pathname}#event=${event.id}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(event.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    if (!window.confirm('Are you sure you want to cancel your participation for this event?')) {
      return;
    }
    setCancellingRegId(registrationId);
    try {
      await api.cancelRegistrationById(registrationId);
      await fetchMyRegistrations();
      await fetchEvents();
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel registration.');
    } finally {
      setCancellingRegId(null);
    }
  };

  const categories = [
    'All',
    'Cleanliness & Clean-up Drive',
    'Water Conservation & Testing',
    'Sewerage & Drain Audit',
    'Solid Waste Segregation Workshop',
    'Sanitation Facility Inspection',
    'Air Quality & Tree Plantation',
    'Road Safety & Pothole Survey',
    'Community Awareness & RTI Campaign',
  ];

  const statuses = ['All', 'Open for Registration', 'Full', 'Completed', 'Cancelled'];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizer_organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.activity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.ward && evt.ward.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || evt.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' || evt.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate live stats
  const totalEvents = events.length;
  const activeOpenDrives = events.filter((e) => e.status === 'Open for Registration').length;
  const totalVolunteersConfirmed = events.reduce(
    (acc, curr) => acc + (curr.registered_volunteers_count || 0),
    0
  );
  const totalSlotsCapacity = events.reduce(
    (acc, curr) => acc + (curr.max_volunteers || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 text-xs font-semibold text-[#047857]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#047857]" />
          <span className="uppercase tracking-wider">VERIFIED CITIZEN MOBILIZATION & CIVIC ACTION HUB</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest uppercase border border-[#047857] px-2 py-0.5 rounded-xs">
            CROSS-CATEGORY CIVIC ACTION
          </span>
          <button
            onClick={onOpenCreateEventModal}
            className="px-3 py-1 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Civic Action Event</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white border border-[#047857]/20 rounded-xs p-6 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#047857] tracking-tight">
              Civic Action Events & Volunteer Drives
            </h1>
            <p className="text-xs sm:text-sm text-[#047857]/80 max-w-3xl leading-relaxed">
              Transform documented municipal problems into ground reality checks, neighborhood audits, clean-ups, and community mobilization. Every event is linked to verified civic records.
            </p>
          </div>

          {/* View Tab Switcher */}
          <div className="flex p-1 bg-[#047857]/10 rounded-xs self-start sm:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'text-[#047857] hover:bg-white/50'
              }`}
            >
              Browse Events ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('my-registrations')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-colors cursor-pointer ${
                activeTab === 'my-registrations'
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'text-[#047857] hover:bg-white/50'
              }`}
            >
              My Registrations
            </button>
          </div>
        </div>

        {/* 4 Stat Metric Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
          <div className="bg-[#fcfdfc] border border-[#047857]/15 rounded-xs p-3">
            <div className="text-2xl font-extrabold font-mono text-[#047857]">{totalEvents}</div>
            <div className="text-[11px] font-semibold text-[#047857]/70 mt-0.5">
              Total Scheduled Events
            </div>
          </div>
          <div className="bg-[#fcfdfc] border border-[#047857]/15 rounded-xs p-3">
            <div className="text-2xl font-extrabold font-mono text-[#F97316]">{activeOpenDrives}</div>
            <div className="text-[11px] font-semibold text-[#047857]/70 mt-0.5">
              Open for Registration
            </div>
          </div>
          <div className="bg-[#fcfdfc] border border-[#047857]/15 rounded-xs p-3">
            <div className="text-2xl font-extrabold font-mono text-[#047857]">
              {totalVolunteersConfirmed}
            </div>
            <div className="text-[11px] font-semibold text-[#047857]/70 mt-0.5">
              Confirmed Volunteers
            </div>
          </div>
          <div className="bg-[#fcfdfc] border border-[#047857]/15 rounded-xs p-3">
            <div className="text-2xl font-extrabold font-mono text-[#047857]">
              {totalSlotsCapacity}
            </div>
            <div className="text-[11px] font-semibold text-[#047857]/70 mt-0.5">
              Total Community Capacity
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'browse' ? (
        <div className="space-y-6">
          {/* Search and Filters Panel */}
          <div className="bg-white border border-[#047857]/20 rounded-xs p-5 space-y-4 shadow-2xs">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#047857]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search civic events by title, area, municipal ward, or organizer..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#fbfbfb] border border-[#047857]/20 rounded-xs text-[#047857] placeholder-[#047857]/45 focus:border-[#047857] focus:outline-hidden"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70">
                FILTER BY CIVIC ACTION CATEGORY:
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer text-[11px] ${
                      selectedCategory === cat
                        ? 'bg-[#047857] text-white font-bold shadow-xs'
                        : 'bg-[#f4f7f5] text-[#047857] hover:bg-[#e6ece8]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#047857]/10 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]/70 mr-1">
                STATUS:
              </span>
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer text-[11px] ${
                    selectedStatus === st
                      ? 'bg-[#F97316] text-white font-bold'
                      : 'bg-white border border-[#047857]/20 text-[#047857] hover:border-[#047857]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count & Action */}
          <div className="flex items-center justify-between pb-1 text-xs">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#047857]">Active Civic Action Drives</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 border border-[#047857] text-[#047857] rounded-xs uppercase">
                {filteredEvents.length} Available
              </span>
            </div>
            <span className="text-xs text-[#047857]/70 font-medium">Sorted by Date</span>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="text-center py-12 text-xs text-[#047857]/60">
              Loading civic events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white border border-[#047857]/20 rounded-xs p-12 text-center space-y-3">
              <Calendar className="w-10 h-10 text-[#047857]/40 mx-auto" />
              <h3 className="text-base font-bold text-[#047857]">No events found matching your filter</h3>
              <p className="text-xs text-[#047857]/70 max-w-md mx-auto">
                Try selecting "All Categories" or create a new civic action drive using the button below.
              </p>
              <button
                onClick={onOpenCreateEventModal}
                className="px-4 py-2 bg-[#047857] hover:bg-[#035f44] text-white text-xs font-bold rounded-xs cursor-pointer shadow-2xs"
              >
                Schedule Civic Action Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((evt) => {
                const percent = Math.min(
                  100,
                  Math.round((evt.registered_volunteers_count / evt.max_volunteers) * 100)
                );
                const slotsRemaining = Math.max(0, evt.max_volunteers - evt.registered_volunteers_count);
                const isFull = evt.status === 'Full' || slotsRemaining <= 0;
                const isCancelled = evt.status === 'Cancelled';

                return (
                  <div
                    key={evt.id}
                    className="bg-white border border-[#047857]/20 rounded-xs p-5 flex flex-col justify-between hover:border-[#047857] transition-all shadow-2xs space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Category & Status Header */}
                      <div className="flex items-center justify-between text-xs gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#047857]/10 text-[#047857] rounded-xs truncate">
                          {evt.category}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase ${
                              evt.status === 'Open for Registration' && !isFull
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isFull
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : isCancelled
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {isFull && evt.status === 'Open for Registration' ? 'Full' : evt.status}
                          </span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h3
                        onClick={() => onSelectEvent(evt.id)}
                        className="text-base font-bold text-[#047857] hover:underline cursor-pointer leading-snug line-clamp-2"
                      >
                        {evt.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#047857]/80 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Logistics details */}
                      <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs space-y-1.5 text-xs text-[#047857]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                          <span className="font-semibold">{evt.date} • {evt.start_time}</span>
                          <span className="text-[11px] text-[#047857]/60">({evt.duration_hours}h)</span>
                        </div>

                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                          <span className="truncate">{evt.location_name} {evt.ward ? `(${evt.ward})` : ''}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#047857]/80">
                          <Shield className="w-3.5 h-3.5 text-[#047857] shrink-0" />
                          <span className="truncate">{evt.organizer_organization}</span>
                        </div>
                      </div>

                      {/* Connected Civic Issues Tags */}
                      {evt.related_issue_ids && evt.related_issue_ids.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="font-bold text-[#047857]/60">Related Issues:</span>
                          {evt.related_issue_ids.map((issId) => (
                            <button
                              key={issId}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectIssue) onSelectIssue(issId);
                              }}
                              className="px-1.5 py-0.5 bg-[#047857]/5 hover:bg-[#047857]/15 text-[#047857] font-mono rounded-xs transition-colors cursor-pointer"
                              title="Click to view civic problem audit"
                            >
                              {issId}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Capacity Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#047857]/70 font-semibold">
                            Volunteer Slots:
                          </span>
                          <span className="font-mono font-bold text-[#047857]">
                            {evt.registered_volunteers_count} / {evt.max_volunteers} filled
                          </span>
                        </div>
                        <div className="w-full bg-[#047857]/10 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              percent >= 100 ? 'bg-amber-600' : 'bg-[#047857]'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#047857]/15">
                      <button
                        onClick={() => handleCopyLink(evt)}
                        className="px-2.5 py-1.5 bg-[#fcfdfc] border border-[#047857]/20 hover:border-[#047857] text-[#047857] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Copy unique registration link"
                      >
                        {copiedId === evt.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 text-[11px] font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-[#F97316]" />
                            <span className="text-[11px]">Share</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onSelectEvent(evt.id)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-xs transition-colors flex items-center gap-1 cursor-pointer shadow-2xs ${
                          isCancelled
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            : isFull
                            ? 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
                            : 'bg-[#047857] hover:bg-[#035f44] text-white'
                        }`}
                      >
                        <span>{isFull ? 'View Event (Full)' : 'Register as Volunteer'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* My Registrations Tab */
        <div className="bg-white border border-[#047857]/20 rounded-xs p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#047857]/15">
            <div>
              <h2 className="text-lg font-bold text-[#047857]">My Registered Civic Action Drives</h2>
              <p className="text-xs text-[#047857]/70 mt-0.5">
                Review your confirmed volunteer drives, meeting locations, or cancel participation if unable to attend.
              </p>
            </div>

            {/* Email search / filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#047857]/50" />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') fetchMyRegistrations();
                  }}
                  placeholder="Filter by your email address..."
                  className="pl-9 pr-3 py-1.5 text-xs bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857] w-64"
                />
              </div>
              <button
                onClick={() => fetchMyRegistrations()}
                className="px-3 py-1.5 bg-[#047857] text-white text-xs font-semibold rounded-xs cursor-pointer shadow-2xs hover:bg-[#035f44]"
              >
                Find
              </button>
            </div>
          </div>

          {loadingMyRegs ? (
            <div className="text-center py-12 text-xs text-[#047857]/60">
              Loading your registered events...
            </div>
          ) : myRegistrations.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="w-10 h-10 text-[#047857]/40 mx-auto" />
              <h3 className="text-base font-bold text-[#047857]">No Registrations Found</h3>
              <p className="text-xs text-[#047857]/70 max-w-sm mx-auto">
                You haven't registered for any civic drives under this email yet. Browse active drives to sign up!
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 bg-[#047857] text-white text-xs font-bold rounded-xs cursor-pointer shadow-2xs hover:bg-[#035f44]"
              >
                Browse Civic Action Drives
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-4 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#047857] text-sm">
                        {reg.event_title || 'Civic Action Drive'}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.2 rounded-xs uppercase ${
                          reg.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#047857]/80">
                      <span className="flex items-center gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#F97316]" /> {reg.event_date} at {reg.event_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F97316]" /> {reg.event_location}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#047857]/70 space-x-2">
                      <span><strong>Volunteer:</strong> {reg.volunteer_name} ({reg.volunteer_email})</span>
                      <span className="font-mono text-[#047857]/50">Ref: {reg.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onSelectEvent(reg.event_id)}
                      className="px-3 py-1.5 bg-[#047857]/10 hover:bg-[#047857]/20 text-[#047857] font-bold text-xs rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Event</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {reg.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelRegistration(reg.id)}
                        disabled={cancellingRegId === reg.id}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs rounded-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{cancellingRegId === reg.id ? 'Cancelling...' : 'Cancel'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerView;
