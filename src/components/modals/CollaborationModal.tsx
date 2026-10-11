import React, { useState } from 'react';
import { CivicIssue, Stakeholder } from '../../types/civic';
import { api } from '../../services/api';
import { X, Send, CheckCircle2, AlertCircle, Users } from 'lucide-react';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: CivicIssue | null;
  stakeholder?: Stakeholder | null;
  onSuccess?: () => void;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  issue,
  stakeholder,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [assistanceType, setAssistanceType] = useState('Volunteer support');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !issue) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please provide your name, email, and message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.submitCollaborationRequest({
        issue_id: issue.id,
        issue_title: issue.title,
        stakeholder_id: stakeholder?.id,
        stakeholder_name: stakeholder?.name,
        requester_name: name.trim(),
        requester_email: email.trim(),
        organization: org.trim() || undefined,
        assistance_type: assistanceType,
        message: message.trim(),
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit collaboration request.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-[#047857]/20 rounded-xs w-full max-w-lg shadow-xl overflow-hidden space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#047857]/15">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#F97316]" />
            <h3 className="text-sm font-bold text-[#047857] uppercase tracking-wider">
              Initiate Collaboration Request
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-[#047857]/60 hover:text-[#047857] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Issue & Stakeholder Banner */}
        <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs text-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#047857]/60">Target Civic Issue:</div>
          <div className="font-bold text-[#047857]">{issue.title}</div>
          {stakeholder && (
            <div className="text-[11px] text-[#047857]/70 pt-1 border-t border-[#047857]/10">
              <strong>Coordinating Entity:</strong> {stakeholder.name}
            </div>
          )}
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-[#047857]">Request Persisted to Database</h4>
            <p className="text-[#047857]/80 max-w-sm mx-auto">
              Your expression of interest has been officially recorded. You can view it in the Community Action registry.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#047857]">Your Name / Alias *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Kulkarni"
                  className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#047857]">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. anand@almmumbai.org"
                  className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#047857]">Organization / Group (Optional)</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="e.g. Chembur Citizens Forum"
                  className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#047857]">Assistance Type *</label>
                <select
                  value={assistanceType}
                  onChange={(e) => setAssistanceType(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
                >
                  <option value="Volunteer support">Volunteer support (Field visits)</option>
                  <option value="Technical expertise">Technical expertise (GIS / Data)</option>
                  <option value="Research and evidence collection">Research & evidence collection</option>
                  <option value="NGO collaboration">NGO collaboration</option>
                  <option value="Community awareness">Community awareness & mobilization</option>
                  <option value="Resource or equipment support">Resource or equipment support</option>
                  <option value="Professional consultation">Professional consultation (Legal / Policy)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#047857]">Proposed Contribution *</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe how you or your team plan to participate in solving or escalating this documented issue..."
                className="w-full px-3 py-1.5 bg-[#fbfbfb] border border-[#047857]/20 rounded-xs focus:outline-hidden focus:border-[#047857]"
              />
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
                disabled={loading}
                className="px-5 py-2 bg-[#047857] hover:bg-[#035f44] disabled:opacity-50 text-white font-bold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CollaborationModal;
