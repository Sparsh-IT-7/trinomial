import React from 'react';
import { ExternalLink, Database, ShieldCheck, Clock, MapPin, AlertCircle, Info } from 'lucide-react';

export interface SourceInformationCardProps {
  source: string; // e.g. "CPCB via India's OGD Platform"
  datasetName: string; // e.g. "Real Time Air Quality Index"
  stationName?: string;
  observationTime?: string;
  sourceUrl: string;
  lastRetrievalTime?: string;
  freshnessStatus?: 'recent_observation' | 'historical_or_stale' | 'unavailable';
  isChecked?: boolean; // Do not display a verified badge unless source and retrieved data have actually been checked
  integrityNotice?: string;
  variant?: 'compact' | 'detailed';
}

export const SourceInformationCard: React.FC<SourceInformationCardProps> = ({
  source,
  datasetName,
  stationName,
  observationTime,
  sourceUrl,
  lastRetrievalTime,
  freshnessStatus = 'recent_observation',
  isChecked = false,
  integrityNotice,
  variant = 'detailed',
}) => {
  const getFreshnessBadge = () => {
    switch (freshnessStatus) {
      case 'recent_observation':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Recent Observation
          </span>
        );
      case 'historical_or_stale':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Historical / Stale Snapshot
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            Reading Unavailable
          </span>
        );
    }
  };

  if (variant === 'compact') {
    return (
      <div className="p-3 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[#047857] font-semibold">
            <Database className="w-3.5 h-3.5 text-[#F97316]" />
            <span>{source}</span>
          </div>
          {getFreshnessBadge()}
        </div>

        <div className="text-[11px] text-[#047857]/80 flex flex-wrap items-center justify-between gap-1">
          <span>Dataset: <strong>{datasetName}</strong></span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#047857] hover:underline flex items-center gap-0.5 font-medium"
          >
            <span>Original Source</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#047857]/20 rounded-xs p-4 shadow-2xs space-y-3 text-xs">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#047857]/10">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#F97316]" />
          <div>
            <span className="text-[10px] font-bold text-[#047857]/60 uppercase tracking-wider block">
              AUTHORITATIVE DATA SOURCE
            </span>
            <span className="font-bold text-[#047857] text-xs sm:text-sm">{source}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isChecked && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold bg-[#047857]/10 text-[#047857]">
              <ShieldCheck className="w-3 h-3 text-[#047857]" />
              Verified Feed
            </span>
          )}
          {getFreshnessBadge()}
        </div>
      </div>

      {/* Grid: Dataset info, station, timestamps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px]">
        <div className="space-y-0.5">
          <span className="text-[#047857]/60 block font-semibold">Dataset Name</span>
          <span className="font-semibold text-[#047857]">{datasetName}</span>
        </div>

        {stationName && (
          <div className="space-y-0.5">
            <span className="text-[#047857]/60 block font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#047857]/60" />
              Monitoring Station
            </span>
            <span className="font-medium text-[#047857]">{stationName}</span>
          </div>
        )}

        {observationTime && (
          <div className="space-y-0.5">
            <span className="text-[#047857]/60 block font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#047857]/60" />
              Observation Time
            </span>
            <span className="font-mono text-[#047857]">
              {new Date(observationTime).toLocaleString()}
            </span>
          </div>
        )}

        {lastRetrievalTime && (
          <div className="space-y-0.5">
            <span className="text-[#047857]/60 block font-semibold">Last Ingestion / Retrieval</span>
            <span className="font-mono text-[#047857]/80">
              {new Date(lastRetrievalTime).toLocaleString()}
            </span>
          </div>
        )}

        <div className="space-y-0.5 sm:col-span-2 lg:col-span-1">
          <span className="text-[#047857]/60 block font-semibold">Official Resource Link</span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#047857] hover:underline flex items-center gap-1 font-semibold break-all"
          >
            <span>data.gov.in Catalog</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      </div>

      {/* Integrity Disclaimer */}
      {integrityNotice && (
        <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xs text-[11px] text-neutral-600 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{integrityNotice}</p>
        </div>
      )}
    </div>
  );
};
