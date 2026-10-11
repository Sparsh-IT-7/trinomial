import React, { useState } from 'react';
import { AirQualityReading } from '../types/civic';
import { SourceInformationCard } from './SourceInformationCard';
import {
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
} from 'lucide-react';

interface AirQualityStationReadingsProps {
  stations: AirQualityReading[];
  title?: string;
  subtitle?: string;
  issueContextTitle?: string;
  showAllInitially?: boolean;
}

export const AirQualityStationReadings: React.FC<AirQualityStationReadingsProps> = ({
  stations,
  title = 'CPCB Continuous Ambient Air Quality Monitoring (CAAQMS) Telemetry',
  subtitle = 'Measured ambient physical air quality readings from the nearest statutory monitoring stations operated by CPCB / MPCB.',
  issueContextTitle,
  showAllInitially = false,
}) => {
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const [showAllStations, setShowAllStations] = useState(showAllInitially);

  if (!stations || stations.length === 0) {
    return (
      <div className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#047857]">
          <Wind className="w-4 h-4 text-[#F97316]" />
          <span>CPCB Monitoring Station Telemetry</span>
        </div>
        <p className="text-xs text-[#047857]/70">
          No monitoring stations currently configured for this zone. Trigger the CPCB Ingestion Pipeline to synchronize active CAAQMS stations.
        </p>
      </div>
    );
  }

  const selectedStation = stations[selectedStationIndex] || stations[0];

  const getAqiColor = (aqi: number | null, cat?: string) => {
    if (aqi === null) return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    if (aqi <= 50) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' };
    if (aqi <= 100) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' };
    if (aqi <= 200) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' };
    if (aqi <= 300) return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' };
    if (aqi <= 400) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' };
    return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300' };
  };

  const aqiStyle = getAqiColor(selectedStation.aqi, selectedStation.aqi_category);

  return (
    <div className="bg-white border border-[#047857]/20 rounded-xs p-5 shadow-2xs space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#047857]/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#F97316]" />
            <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider">
              OFFICIAL GOVERNMENT DATA SOURCE • CPCB CAAQMS
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[#047857]">
            {title}
          </h3>
          <p className="text-xs text-[#047857]/80 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 bg-[#047857]/10 text-[#047857] text-[11px] font-semibold rounded-xs">
            {stations.length} Station{stations.length > 1 ? 's' : ''} Linked
          </span>
        </div>
      </div>

      {/* Station Selector Chips */}
      {stations.length > 1 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-[#047857]/60 uppercase tracking-wider block">
            Select Monitoring Station
          </span>
          <div className="flex flex-wrap gap-2">
            {stations.map((st, idx) => {
              const isSelected = idx === selectedStationIndex;
              const pillStyle = getAqiColor(st.aqi, st.aqi_category);
              return (
                <button
                  key={st.id || idx}
                  onClick={() => setSelectedStationIndex(idx)}
                  className={`px-3 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#047857] text-white border-[#047857] shadow-2xs'
                      : 'bg-[#fcfdfc] text-[#047857] border-[#047857]/20 hover:border-[#047857]'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#F97316]'}`} />
                  <span>{st.station_name.split(',')[0]}</span>
                  {st.aqi !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-xs font-mono font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : `${pillStyle.bg} ${pillStyle.text}`
                      }`}
                    >
                      AQI {st.aqi}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Station Telemetry Card */}
      <div className="p-4 bg-[#fcfdfc] border border-[#047857]/15 rounded-xs space-y-4">
        {/* Station Headline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#047857]/10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#047857]">
                {selectedStation.station_name}
              </h4>
            </div>
            <div className="text-xs text-[#047857]/70 flex flex-wrap items-center gap-3">
              <span>{selectedStation.ward || 'Mumbai Ward'}</span>
              <span>•</span>
              <span className="font-mono text-[11px]">
                Coordinates: {selectedStation.latitude?.toFixed(4)}, {selectedStation.longitude?.toFixed(4)}
              </span>
            </div>
          </div>

          {/* AQI Big Badge */}
          <div
            className={`px-4 py-2.5 rounded-xs border ${aqiStyle.bg} ${aqiStyle.border} ${aqiStyle.text} text-center shrink-0 shadow-2xs`}
          >
            <div className="text-[10px] uppercase font-bold tracking-wider">
              National AQI
            </div>
            <div className="text-2xl font-black font-mono leading-none my-0.5">
              {selectedStation.aqi !== null ? selectedStation.aqi : 'N/A'}
            </div>
            <div className="text-[10px] font-bold">
              {selectedStation.aqi_category || 'Uncategorized'}
            </div>
          </div>
        </div>

        {/* Detailed Pollutants Matrix */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#047857] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#F97316]" />
              Measured Criteria Pollutants (CPCB NAAQS Standards)
            </span>
            {selectedStation.prominent_pollutant && (
              <span className="text-[11px] text-[#F97316] font-semibold bg-[#F97316]/10 px-2 py-0.5 rounded-xs">
                Prominent Pollutant: {selectedStation.prominent_pollutant}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {/* PM2.5 */}
            <div className="p-2.5 bg-white border border-[#047857]/15 rounded-xs space-y-1">
              <span className="text-[10px] font-bold text-[#047857]/60 block uppercase">
                PM2.5 (Fine)
              </span>
              <div className="text-lg font-bold font-mono text-[#047857]">
                {selectedStation.pollutants.pm25?.value !== null && selectedStation.pollutants.pm25?.value !== undefined
                  ? `${selectedStation.pollutants.pm25.value}`
                  : 'N/A'}
                <span className="text-[10px] font-normal text-slate-500 ml-1">µg/m³</span>
              </div>
              <span className="text-[9px] text-[#047857]/60 block">NAAQS: 60 µg/m³</span>
            </div>

            {/* PM10 */}
            <div className="p-2.5 bg-white border border-[#047857]/15 rounded-xs space-y-1">
              <span className="text-[10px] font-bold text-[#047857]/60 block uppercase">
                PM10 (Coarse)
              </span>
              <div className="text-lg font-bold font-mono text-[#047857]">
                {selectedStation.pollutants.pm10?.value !== null && selectedStation.pollutants.pm10?.value !== undefined
                  ? `${selectedStation.pollutants.pm10.value}`
                  : 'N/A'}
                <span className="text-[10px] font-normal text-slate-500 ml-1">µg/m³</span>
              </div>
              <span className="text-[9px] text-[#047857]/60 block">NAAQS: 100 µg/m³</span>
            </div>

            {/* NO2 */}
            <div className="p-2.5 bg-white border border-[#047857]/15 rounded-xs space-y-1">
              <span className="text-[10px] font-bold text-[#047857]/60 block uppercase">
                NO2 (Dioxide)
              </span>
              <div className="text-lg font-bold font-mono text-[#047857]">
                {selectedStation.pollutants.no2?.value !== null && selectedStation.pollutants.no2?.value !== undefined
                  ? `${selectedStation.pollutants.no2.value}`
                  : 'N/A'}
                <span className="text-[10px] font-normal text-slate-500 ml-1">µg/m³</span>
              </div>
              <span className="text-[9px] text-[#047857]/60 block">NAAQS: 80 µg/m³</span>
            </div>

            {/* SO2 */}
            <div className="p-2.5 bg-white border border-[#047857]/15 rounded-xs space-y-1">
              <span className="text-[10px] font-bold text-[#047857]/60 block uppercase">
                SO2 (Sulphur)
              </span>
              <div className="text-lg font-bold font-mono text-[#047857]">
                {selectedStation.pollutants.so2?.value !== null && selectedStation.pollutants.so2?.value !== undefined
                  ? `${selectedStation.pollutants.so2.value}`
                  : 'N/A'}
                <span className="text-[10px] font-normal text-slate-500 ml-1">µg/m³</span>
              </div>
              <span className="text-[9px] text-[#047857]/60 block">NAAQS: 80 µg/m³</span>
            </div>

            {/* CO */}
            <div className="p-2.5 bg-white border border-[#047857]/15 rounded-xs space-y-1">
              <span className="text-[10px] font-bold text-[#047857]/60 block uppercase">
                CO (Monoxide)
              </span>
              <div className="text-lg font-bold font-mono text-[#047857]">
                {selectedStation.pollutants.co?.value !== null && selectedStation.pollutants.co?.value !== undefined
                  ? `${selectedStation.pollutants.co.value}`
                  : 'N/A'}
                <span className="text-[10px] font-normal text-slate-500 ml-1">mg/m³</span>
              </div>
              <span className="text-[9px] text-[#047857]/60 block">NAAQS: 2.0 mg/m³</span>
            </div>

            {/* Ozone */}
            <div className="p-2.5 bg-white border border-[#047857]/15 rounded-xs space-y-1">
              <span className="text-[10px] font-bold text-[#047857]/60 block uppercase">
                Ozone (O3)
              </span>
              <div className="text-lg font-bold font-mono text-[#047857]">
                {selectedStation.pollutants.ozone?.value !== null && selectedStation.pollutants.ozone?.value !== undefined
                  ? `${selectedStation.pollutants.ozone.value}`
                  : 'N/A'}
                <span className="text-[10px] font-normal text-slate-500 ml-1">µg/m³</span>
              </div>
              <span className="text-[9px] text-[#047857]/60 block">NAAQS: 100 µg/m³</span>
            </div>
          </div>
        </div>

        {/* Source Information & Provenance (Reusing Existing Component Standards) */}
        <SourceInformationCard
          source="CPCB via India's OGD Platform"
          datasetName="Real Time Air Quality Index"
          stationName={selectedStation.station_name}
          observationTime={selectedStation.observation_timestamp}
          sourceUrl={selectedStation.source_url}
          lastRetrievalTime={selectedStation.retrieved_at}
          freshnessStatus={selectedStation.data_freshness}
          isChecked={true}
          integrityNotice="Data Governance Policy: Physical continuous air quality monitoring readings represent ambient regional atmospheric conditions. They are preserved strictly separate from citizen-reported grievances, historical municipal audit dockets, and AI-generated syntheses. A high ambient AQI reading does not automatically constitute proof of a specific local incident or confirmed violation."
        />
      </div>
    </div>
  );
};
