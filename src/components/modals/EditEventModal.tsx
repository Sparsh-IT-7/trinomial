import React, { useState, useEffect } from 'react';
import { CivicEvent, EventCategory, EventStatus } from '../../types/civic';
import { api } from '../../services/api';
import { X, Calendar, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CivicEvent;
  onEventUpdated: (updatedEvent: CivicEvent) => void;
}

const EVENT_CATEGORIES: EventCategory[] = [
  'Cleanliness & Clean-up Drive',
  'Water Conservation & Testing',
  'Sewerage & Drain Audit',
  'Solid Waste Segregation Workshop',
  'Sanitation Facility Inspection',
  'Air Quality & Tree Plantation',
  'Road Safety & Pothole Survey',
  'Community Awareness & RTI Campaign',
  'Other Civic Action',
];

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onEventUpdated,
}) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [category, setCategory] = useState<EventCategory>(event.category);
  const [activityType, setActivityType] = useState(event.activity_type);
  const [date, setDate] = useState(event.date);
  const [startTime, setStartTime] = useState(event.start_time);
  const [durationHours, setDurationHours] = useState(event.duration_hours);
  const [locationName, setLocationName] = useState(event.location_name);
  const [meetingPoint, setMeetingPoint] = useState(event.meeting_point);
  const [ward, setWard] = useState(event.ward || '');
  const [city, setCity] = useState(event.city);
  const [instructions, setInstructions] = useState(event.participation_instructions);
  const [maxVolunteers, setMaxVolunteers] = useState(event.max_volunteers);
  const [deadline, setDeadline] = useState(event.registration_deadline);
  const [status, setStatus] = useState<EventStatus>(event.status);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setCategory(event.category);
      setActivityType(event.activity_type);
      setDate(event.date);
      setStartTime(event.start_time);
      setDurationHours(event.duration_hours);
      setLocationName(event.location_name);
      setMeetingPoint(event.meeting_point);
      setWard(event.ward || '');
      setCity(event.city);
      setInstructions(event.participation_instructions);
      setMaxVolunteers(event.max_volunteers);
      setDeadline(event.registration_deadline);
      setStatus(event.status);
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.updateEvent(event.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        activity_type: activityType.trim(),
        date,
        start_time: startTime.trim(),
        duration_hours: Number(durationHours) || 3,
        location_name: locationName.trim(),
        meeting_point: meetingPoint.trim(),
        ward: ward.trim() || undefined,
        city: city.trim() || 'Mumbai',
        participation_instructions: instructions.trim(),
        max_volunteers: Number(maxVolunteers) || event.max_volunteers,
        registration_deadline: deadline,
        status,
      });

      if (res.success && res.event) {
        onEventUpdated(res.event);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update event details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this event? Registered volunteers will see that it is cancelled.'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.updateEvent(event.id, { status: 'Cancelled' });
      if (res.success && res.event) {
        onEventUpdated(res.event);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to cancel event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#047857]/20 rounded-xs w-full max-w-2xl shadow-xl overflow-hidden p-6 space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#047857]" />
            <div>
              <h3 className="text-sm font-bold text-[#047857] uppercase tracking-wider">
                Edit Civic Action Event
              </h3>
              <span className="text-[10px] text-[#047857]/60 block">
                Update Schedule, Location, or Manage Status
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#047857]/60 hover:text-[#047857] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xs text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <label className="font-semibold text-[#047857]">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              >
                <option value="Open for Registration">Open for Registration</option>
                <option value="Full">Full (Waitlist Closed)</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Start Time *</label>
              <input
                type="text"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Duration (Hours)</label>
              <input
                type="number"
                min={1}
                max={12}
                step={0.5}
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Location Name *</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Meeting Point *</label>
              <input
                type="text"
                required
                value={meetingPoint}
                onChange={(e) => setMeetingPoint(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#047857]">Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#047857]">Participation Instructions</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Volunteer Capacity *</label>
              <input
                type="number"
                min={1}
                max={500}
                required
                value={maxVolunteers}
                onChange={(e) => setMaxVolunteers(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Registration Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#047857]/15">
            <button
              type="button"
              onClick={handleCancelEvent}
              disabled={loading || status === 'Cancelled'}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel Event</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#047857]/20 text-[#047857] font-semibold rounded-xs hover:bg-[#047857]/5 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#047857] hover:bg-[#035f44] text-white font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
