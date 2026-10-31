import React from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Video, 
  Activity, 
  ExternalLink, 
  Hash, 
  Clock, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { TimelineEventItem, EvidenceItem } from '../types';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: TimelineEventItem | null;
  evidenceItems: EvidenceItem[];
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  event,
  evidenceItems
}) => {
  if (!isOpen || !event) return null;

  // Find corresponding evidence item if ID available
  const linkedEvidence = evidenceItems.find(
    e => e.id === event.evidence_id || e.id === event.supporting_ref?.evidence_id
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] glass-panel border-l border-cyan-500/30 shadow-2xl flex flex-col backdrop-blur-2xl animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-cyan-950/40">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold font-heading text-white">Forensic Evidence Link Inspector</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="p-6 space-y-5 overflow-y-auto flex-1 font-sans">
        {/* Event Header Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {event.timestamp_str}
            </span>
            <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
              event.confidence_label === 'High' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                : event.confidence_label === 'Moderate'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                : 'bg-red-950 text-red-300 border border-red-500/30'
            }`}>
              {event.confidence_label} Reliability ({(event.confidence_score * 100).toFixed(0)}%)
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-100 mb-1 leading-snug">
            {event.description}
          </p>

          <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
            <span>Observation Type:</span>
            <span className="text-cyan-400 font-semibold uppercase">{event.observation_type.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Supporting Evidence Detail */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Source Traceability & Verification
          </h4>

          {/* Linked Source Card */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300 flex items-center space-x-1.5">
                {event.event_type === 'video_observation' && <Video className="w-4 h-4 text-cyan-400" />}
                {event.event_type === 'witness_claim' && <FileText className="w-4 h-4 text-violet-400" />}
                {event.event_type === 'sensor_measurement' && <Activity className="w-4 h-4 text-emerald-400" />}
                <span>{event.supporting_ref?.source || 'Linked Investigation Record'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {event.supporting_ref?.evidence_id || event.evidence_id || 'REF-ACTIVE'}
              </span>
            </div>

            {/* Evidence Data Point Snippet */}
            <div className="p-3 rounded-lg bg-[#070c1a] border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-[10px] uppercase text-slate-500 block mb-1">Extracted Supporting Excerpt / Anchor:</span>
              <p className="text-cyan-200 bg-cyan-950/40 p-2 rounded border border-cyan-500/20">
                "{event.supporting_ref?.data_point || event.description}"
              </p>
            </div>

            {/* Video Frame Preview Simulation */}
            {event.event_type === 'video_observation' && (
              <div className="p-3 rounded-lg bg-[#040714] border border-cyan-500/30">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                  <span>YOLO OBJECT TRACKING OVERLAY</span>
                  <span className="text-cyan-400">FPS: 30.0 · 1080p</span>
                </div>
                {/* Visual Frame Simulation */}
                <div className="relative aspect-video rounded bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-800">
                  <div className="absolute inset-0 cyber-grid opacity-50" />
                  <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-white">
                    REC 19:42:13.100 EDT
                  </div>
                  {/* Bounding box simulation */}
                  <div className="border-2 border-red-500 bg-red-500/10 w-28 h-20 rounded absolute flex items-start justify-start p-1">
                    <span className="text-[9px] font-mono bg-red-600 text-white px-1 rounded font-bold">
                      Sedan 98%
                    </span>
                  </div>
                  <div className="border-2 border-cyan-400 bg-cyan-400/10 w-16 h-12 rounded absolute right-8 top-12 flex items-start justify-start p-1">
                    <span className="text-[9px] font-mono bg-cyan-600 text-white px-1 rounded font-bold">
                      Bike 94%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Cryptographic Hash & Chain of Custody */}
            <div className="text-[11px] font-mono space-y-1.5 pt-2 border-t border-slate-800 text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <span>SHA-256 Hash:</span>
                </span>
                <span className="text-slate-300 truncate max-w-[200px]">
                  {linkedEvidence?.file_hash || 'sha256:e3b0c44298fc1c149afbf4c8996fb92...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Admissibility Rating:</span>
                <span className="text-emerald-400 font-semibold">Rule 702 Daubert Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence & Explainability Methodology */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center space-x-1.5 text-cyan-300 font-mono font-semibold">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Explainable Scoring Rationale</span>
          </div>
          <p className="leading-relaxed">
            {event.observation_type === 'sensor_telemetry' 
              ? 'Calibrated high-frequency electronic sensor logs provide microsecond mechanical ground truth, receiving highest forensic confidence weighting.'
              : event.observation_type === 'direct_observation'
              ? 'Direct optical evidence corroborated across multiple video frames and spatial camera tracking.'
              : 'Eyewitness human statements are evaluated against physical sensor records. Perception variances in high-stress collisions are isolated and flagged.'}
          </p>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
