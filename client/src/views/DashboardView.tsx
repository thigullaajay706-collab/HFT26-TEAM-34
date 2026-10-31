import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FolderOpen, 
  ShieldAlert, 
  Layers, 
  FileText, 
  AlertTriangle, 
  Clock, 
  Car, 
  CheckCircle2, 
  PlayCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Trash2,
  Users
} from 'lucide-react';
import { CaseItem } from '../types';

interface DashboardViewProps {
  cases: CaseItem[];
  onSelectCase: (c: CaseItem) => void;
  onOpenNewCaseModal: () => void;
  onLoadDemo: () => void;
  isLoadingDemo: boolean;
  onRequestDeleteCase?: (c: CaseItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  onSelectCase,
  onOpenNewCaseModal,
  onLoadDemo,
  isLoadingDemo,
  onRequestDeleteCase
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Aggregated Stats
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status !== 'Report Generated').length;
  const totalEvidence = cases.reduce((acc, c) => acc + (c.evidence_count || 0), 0);
  const totalEvents = cases.reduce((acc, c) => acc + (c.event_count || 0), 0);
  const totalContradictions = cases.reduce((acc, c) => acc + (c.contradiction_count || 0), 0);
  const completedReports = cases.filter(c => c.status === 'Report Generated').length;

  // Filtered cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.case_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>OPERATIONAL FORENSIC RADAR · ACTIVE UNIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Major Collision Investigation Command
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reconstruct incidents, manage evidence chains, and inspect automated cross-modal contradictions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadDemo}
            disabled={isLoadingDemo}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-semibold tracking-wider uppercase transition-all shadow-neon-cyan flex items-center space-x-2"
          >
            <PlayCircle className={`w-4 h-4 text-cyan-400 ${isLoadingDemo ? 'animate-spin' : ''}`} />
            <span>{isLoadingDemo ? 'Loading Scenario...' : 'Load Crash Demo'}</span>
          </button>

          <button
            onClick={onOpenNewCaseModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-heading font-semibold text-xs tracking-wider uppercase transition-all shadow-neon-cyan flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Investigation Case</span>
          </button>
        </div>
      </div>

      {/* Animated Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Stat 1 */}
        <div className="glass-card rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Total Cases</span>
            <FolderOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">{totalCases}</div>
          <div className="text-[10px] text-cyan-400 mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Verified in DB</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Active Cases</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">{activeCases}</div>
          <div className="text-[10px] text-blue-300 mt-1">In Reconstruction</div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card rounded-xl p-4 border border-violet-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Evidence Files</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">{totalEvidence}</div>
          <div className="text-[10px] text-violet-300 mt-1">Videos, Texts, Telemetry</div>
        </div>

        {/* Stat 4 */}
        <div className="glass-card rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>AI Events</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">{totalEvents}</div>
          <div className="text-[10px] text-emerald-300 mt-1">Normalized Chronology</div>
        </div>

        {/* Stat 5 */}
        <div className="glass-card rounded-xl p-4 border border-red-500/30 shadow-neon-red">
          <div className="flex items-center justify-between text-red-400 text-xs font-mono mb-2">
            <span>Contradictions</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-red-300">{totalContradictions}</div>
          <div className="text-[10px] text-red-400 mt-1 font-semibold">Flagged for Review</div>
        </div>

        {/* Stat 6 */}
        <div className="glass-card rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Reports</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">{completedReports}</div>
          <div className="text-[10px] text-amber-300 mt-1">12-Section Standards</div>
        </div>
      </div>

      {/* Priority Contradiction Alert Banner */}
      {(() => {
        const flaggedCase = cases.find(c => (c.contradiction_count || 0) > 0);
        if (!flaggedCase || totalContradictions === 0) return null;

        return (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-[#180b14] to-slate-900 border border-red-500/40 shadow-neon-red flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 flex-shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono uppercase font-bold text-red-400">HIGH-PRIORITY EVIDENCE ALERT</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                    {totalContradictions} DISCREPANCIES DETECTED
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  Investigation <strong>{flaggedCase.case_number}</strong> ({flaggedCase.title}) has {flaggedCase.contradiction_count} material discrepancies flagged between witness claims and technical evidence.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectCase(flaggedCase)}
              className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap"
            >
              <span>Review Contradictions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );
      })()}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case #, Location, Title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs text-white focus:outline-none"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 font-mono text-xs">
          {['ALL', 'Analysis In Progress', 'Evidence Collection', 'Review Required', 'Report Generated'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Investigation Cases Found</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
              No cases matching your current filter. Create a new case or load the intersection collision demo.
            </p>
            <button
              onClick={onLoadDemo}
              className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold text-xs tracking-wider uppercase font-heading shadow-neon-cyan"
            >
              Load Demo Crash Case
            </button>
          </div>
        ) : (
          filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-cyan-500/20 cursor-pointer transition-all relative overflow-hidden group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Case Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {c.case_number}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      c.status === 'Review Required'
                        ? 'bg-red-950 text-red-300 border border-red-500/30'
                        : c.status === 'Analysis In Progress'
                        ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                        : c.status === 'Report Generated'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Speed Limit: {c.speed_limit_mph} MPH · {c.weather} · {c.road_condition}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{c.accident_date} at {c.accident_time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{c.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-violet-400" />
                      <span>{c.vehicles?.length || 0} Participants</span>
                    </span>
                  </div>
                </div>

                {/* Evidence Metrics & Workspace CTA */}
                <div className="flex sm:flex-col lg:flex-row items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="block text-slate-400 text-[10px]">Evidence</span>
                      <span className="font-bold text-cyan-300">{c.evidence_count || 0}</span>
                    </div>
                    <div className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="block text-slate-400 text-[10px]">Events</span>
                      <span className="font-bold text-emerald-300">{c.event_count || 0}</span>
                    </div>
                    <div className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="block text-slate-400 text-[10px]">Discrepancies</span>
                      <span className="font-bold text-red-300">{c.contradiction_count || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap">
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {onRequestDeleteCase && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestDeleteCase(c);
                        }}
                        className="p-2 rounded-xl bg-slate-900/80 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete investigation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
