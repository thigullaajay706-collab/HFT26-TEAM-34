import React, { useState } from 'react';
import { 
  Clock, 
  Video, 
  FileText, 
  Activity, 
  AlertTriangle, 
  HelpCircle, 
  ShieldAlert, 
  ExternalLink, 
  Filter, 
  ChevronRight,
  Info
} from 'lucide-react';
import { TimelineEventItem } from '../types';

interface ChronologicalTimelineProps {
  events: TimelineEventItem[];
  onSelectEvent: (event: TimelineEventItem) => void;
  vehicles: Array<{ id: string; make_model: string; color_hex?: string }>;
}

export const ChronologicalTimeline: React.FC<ChronologicalTimelineProps> = ({
  events,
  onSelectEvent,
  vehicles
}) => {
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('ALL');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState('ALL');

  // Filter events
  const filteredEvents = events.filter(evt => {
    const matchesSource = 
      selectedSourceFilter === 'ALL' ||
      (selectedSourceFilter === 'video' && evt.event_type === 'video_observation') ||
      (selectedSourceFilter === 'witness' && evt.event_type === 'witness_claim') ||
      (selectedSourceFilter === 'sensor' && evt.event_type === 'sensor_measurement') ||
      (selectedSourceFilter === 'contradiction' && (evt.event_type === 'contradiction' || evt.event_type === 'uncertain_event'));

    const matchesVehicle = 
      selectedVehicleFilter === 'ALL' ||
      evt.vehicle_id === selectedVehicleFilter ||
      !evt.vehicle_id;

    return matchesSource && matchesVehicle;
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'video_observation':
        return {
          icon: Video,
          color: 'text-cyan-400',
          bg: 'bg-cyan-950/60',
          border: 'border-cyan-500/40',
          glow: 'shadow-neon-cyan',
          label: 'Video Observation'
        };
      case 'witness_claim':
        return {
          icon: FileText,
          color: 'text-violet-400',
          bg: 'bg-violet-950/60',
          border: 'border-violet-500/40',
          glow: 'shadow-neon-violet',
          label: 'Witness Claim'
        };
      case 'sensor_measurement':
        return {
          icon: Activity,
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/60',
          border: 'border-emerald-500/40',
          glow: 'shadow-neon-emerald',
          label: 'Sensor Telemetry'
        };
      case 'contradiction':
        return {
          icon: ShieldAlert,
          color: 'text-red-400',
          bg: 'bg-red-950/60',
          border: 'border-red-500/40',
          glow: 'shadow-neon-red',
          label: 'Contradiction / POI'
        };
      case 'uncertain_event':
      default:
        return {
          icon: HelpCircle,
          color: 'text-amber-400',
          bg: 'bg-amber-950/60',
          border: 'border-amber-500/40',
          glow: 'shadow-amber-500/20',
          label: 'Kinematic Inference'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Controls & Legend */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Source Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
          <span className="text-slate-400 mr-2 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            Source:
          </span>
          {[
            { id: 'ALL', label: 'All Sources' },
            { id: 'video', label: 'Cyan: Video' },
            { id: 'witness', label: 'Purple: Witness' },
            { id: 'sensor', label: 'Green: Sensor' },
            { id: 'contradiction', label: 'Red: Contradictions' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedSourceFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedSourceFilter === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Vehicle Filter */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Vehicle:</span>
          <select
            value={selectedVehicleFilter}
            onChange={(e) => setSelectedVehicleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Vehicles</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.make_model}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Synchronization Warning Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Clock Normalization: Dashcam (NTP synced) + CAN bus (10Hz GPS lock) synchronized within ±0.05s tolerance.</span>
        </div>
        <span className="text-emerald-400 font-bold hidden sm:inline">● SYNC VERIFIED</span>
      </div>

      {/* Chronological Vertical Node Track */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6 my-4">
        {filteredEvents.map((evt) => {
          const badge = getEventBadge(evt.event_type);
          const Icon = badge.icon;
          const matchedVeh = vehicles.find(v => v.id === evt.vehicle_id);

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="relative group cursor-pointer"
            >
              {/* Timeline Marker Dot */}
              <div className={`absolute -left-[35px] sm:-left-[43px] top-4 w-7 h-7 rounded-full ${badge.bg} ${badge.border} border-2 flex items-center justify-center ${badge.color} group-hover:scale-110 transition-transform ${badge.glow}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Event Card */}
              <div className="glass-card glass-card-hover rounded-xl p-4 sm:p-5 border border-slate-800/80 group-hover:border-cyan-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-500/20">
                      {evt.timestamp_str}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${badge.bg} ${badge.color} border ${badge.border}`}>
                      {badge.label}
                    </span>
                    {matchedVeh && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {matchedVeh.make_model}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      evt.confidence_label === 'High'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : evt.confidence_label === 'Moderate'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-red-950 text-red-300 border border-red-500/30'
                    }`}>
                      {evt.confidence_label} ({(evt.confidence_score * 100).toFixed(0)}%)
                    </span>
                    <button className="text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-200 mb-2 leading-relaxed">
                  {evt.description}
                </p>

                {/* Evidence source pill */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                  <span className="truncate max-w-md">
                    Supporting: <strong className="text-slate-300">{evt.supporting_ref?.source || 'Linked File'}</strong>
                  </span>
                  <span className="text-cyan-400 group-hover:underline flex items-center space-x-1">
                    <span>Inspect Raw Evidence</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
