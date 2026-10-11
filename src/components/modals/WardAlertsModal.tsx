import React from 'react';
import { X, Bell, AlertTriangle, ShieldCheck, Calendar, Droplets } from 'lucide-react';

interface WardAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WardAlertsModal: React.FC<WardAlertsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 'ALT-150-01',
      title: 'Scheduled Water Supply Depressurization',
      department: 'Bangalore Water Supply and Sewerage Board (BWSSB)',
      severity: 'High',
      time: 'Tomorrow, 06:00 AM – 02:00 PM',
      description: 'Pipeline rehabilitation along Yamalur main junction. High-level reservoirs in Bellandur, Haralur, and Kasavanahalli will experience low water pressure.',
      icon: Droplets,
    },
    {
      id: 'ALT-150-02',
      title: 'Monthly Ward Committee Meeting Open Notice',
      department: 'BBMP Mahadevapura Joint Commissioner Desk',
      severity: 'Civic Notice',
      time: 'Saturday, Nov 02 • 10:00 AM',
      description: 'Agenda item #4: Review of industrial outfall complaints and road resurfacing tenders. Citizen representations invited at Ward 150 office.',
      icon: Calendar,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border-2 border-[#047857] rounded-sm p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#047857]/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 text-[#F97316] rounded">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#F97316] uppercase">
                MUNICIPAL TELEMETRY
              </span>
              <h2 className="text-lg font-bold text-[#047857]">Ward 150 (Bellandur) Live Alerts</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#047857] hover:text-[#065F46] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className="p-3.5 border border-[#047857]/25 rounded bg-[#fdfdfd] hover:border-[#047857] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#F97316] shrink-0" />
                    <h3 className="text-sm font-bold text-[#047857]">{alert.title}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 border border-[#F97316] text-[#F97316] rounded-full shrink-0">
                    {alert.severity}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#047857]/80 mt-1">
                  {alert.department} • <span className="font-mono text-[#F97316]">{alert.time}</span>
                </div>
                <p className="text-xs text-[#047857]/70 mt-1.5 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-[#047857]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold rounded"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default WardAlertsModal;
