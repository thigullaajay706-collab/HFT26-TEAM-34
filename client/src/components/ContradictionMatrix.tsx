import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  GitCompare, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Activity,
  Video,
  Clock
} from 'lucide-react';
import { ContradictionItem, EvidenceGapItem } from '../types';

interface ContradictionMatrixProps {
  contradictions: ContradictionItem[];
  gaps: EvidenceGapItem[];
  onInspectEvidence?: (evidenceId: string) => void;
}

export const ContradictionMatrix: React.FC<ContradictionMatrixProps> = ({
  contradictions,
  gaps,
  onInspectEvidence
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    contradictions.length > 0 ? contradictions[0].id : null
  );

  return (
    <div className="space-y-8">
      {/* Contradictions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>Cross-Modal Contradiction Matrix ({contradictions.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated correlation compares eyewitness perceptions against physical telemetry and video ground truth.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 shadow-neon-red">
            {contradictions.length} MATERIAL DISCREPANCIES
          </span>
        </div>

        <div className="space-y-4">
          {contradictions.map((ctrd) => {
            const isExpanded = expandedId === ctrd.id;

            return (
              <div
                key={ctrd.id}
                className={`glass-card rounded-2xl border transition-all overflow-hidden ${
                  ctrd.severity === 'Critical'
                    ? 'border-red-500/40 shadow-neon-red'
                    : 'border-amber-500/30'
                }`}
              >
                {/* Header Card */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : ctrd.id)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex-shrink-0 mt-0.5 sm:mt-0">
                      <GitCompare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                          {ctrd.contradiction_code}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {ctrd.severity} Severity
                        </span>
                        <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                          Interval: {ctrd.time_interval}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold font-heading text-white">
                        {ctrd.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                      {ctrd.review_status}
                    </span>
                    <button className="text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Comparison Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/60 space-y-4 animate-in fade-in duration-200">
                    {/* Side-by-Side Comparison Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {/* Claim A */}
                      <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-red-400 font-bold uppercase">Claim A (Subjective)</span>
                          <span className="text-slate-400">{ctrd.claim_a.type}</span>
                        </div>
                        <p className="text-sm text-slate-200 bg-red-950/40 p-3 rounded-lg border border-red-500/20 font-sans">
                          "{ctrd.claim_a.text}"
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                          <span>Source: <strong className="text-slate-300">{ctrd.claim_a.source}</strong></span>
                          <span>Confidence: {( (ctrd.claim_a.confidence_score || 0.35) * 100).toFixed(0)}%</span>
                        </div>
                      </div>

                      {/* Claim B */}
                      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-cyan-400 font-bold uppercase">Claim B (Sensor / Photographic Truth)</span>
                          <span className="text-slate-400">{ctrd.claim_b.type}</span>
                        </div>
                        <p className="text-sm text-slate-200 bg-cyan-950/40 p-3 rounded-lg border border-cyan-500/20 font-sans">
                          "{ctrd.claim_b.text}"
                        </p>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                          <span>Source: <strong className="text-slate-300">{ctrd.claim_b.source}</strong></span>
                          <span className="text-emerald-400 font-semibold">Confidence: {( (ctrd.claim_b.confidence_score || 0.99) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Forensic Finding & Inconsistency Explanation */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                      <span className="text-cyan-300 font-mono font-bold uppercase">
                        Forensic Explanation & Impact Assessment:
                      </span>
                      <p className="text-slate-300 leading-relaxed font-sans">
                        {ctrd.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence Gaps Section */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Evidence Blind Spots & Telemetry Gaps ({gaps.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies missing time intervals, unmonitored sensors, and packet dropouts requiring kinematic interpolation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              className="glass-card rounded-xl p-5 border border-amber-500/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                  {gap.gap_type}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {gap.time_interval}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-heading">
                {gap.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {gap.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Resolution Status:</span>
                <span className="text-cyan-300 font-semibold">{gap.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
