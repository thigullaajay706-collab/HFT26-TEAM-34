import React from 'react';
import { 
  ShieldAlert, 
  PlayCircle, 
  ArrowRight, 
  Cpu, 
  Clock, 
  GitCompare, 
  Compass, 
  BarChart3, 
  FileCheck2, 
  UploadCloud, 
  Layers, 
  Sparkles,
  ChevronRight,
  Video,
  FileText,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface LandingViewProps {
  onLaunchInvestigation: () => void;
  onExploreDemo: () => void;
  isLoadingDemo: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onLaunchInvestigation,
  onExploreDemo,
  isLoadingDemo
}) => {
  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-8 backdrop-blur-md shadow-neon-cyan animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold tracking-wider uppercase">Forensic Intelligence Engine v2.4</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Law Enforcement & Reconstruction Grade</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-heading leading-tight md:leading-none mb-6">
            <span className="text-white">Reconstruct the Incident.</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Reveal the Evidence.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-normal leading-relaxed">
            An AI-powered forensic intelligence platform that transforms fragmented dashcam videos, eyewitness statements, and vehicle CAN-bus telemetry into interactive timelines, explainable contradiction matrices, and traceable 2D trajectory reconstructions.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onLaunchInvestigation}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-black bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-neon-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 font-heading"
            >
              <span>Launch Investigation</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>

            <button
              onClick={onExploreDemo}
              disabled={isLoadingDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-cyan-300 glass-card border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all flex items-center justify-center space-x-2 font-heading shadow-lg"
            >
              <PlayCircle className={`w-5 h-5 text-cyan-400 ${isLoadingDemo ? 'animate-spin' : ''}`} />
              <span>{isLoadingDemo ? 'Loading Crash Scenario...' : 'Explore Crash Demo (Sedan vs Bike)'}</span>
            </button>
          </div>

          {/* Key Assurance Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
            <div className="flex items-center justify-center space-x-2 py-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cryptographic Hash Integrity</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-1">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Zero-Fabrication Guardrails</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-1">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              <span>Explainable AI Tracing</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-1">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Standard 12-Section PDF</span>
            </div>
          </div>
        </div>

        {/* Hero Cinematic Interactive Mockup Banner */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-4 sm:p-6 border border-cyan-500/30 shadow-2xl relative overflow-hidden group">
            {/* Top Scanning Line */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline" />

            {/* Mock Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/70 inline-block" />
                <span className="text-cyan-300 font-semibold ml-2">INCIDENT MONITOR · CASE: CRASH-2026-0849X</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-emerald-400">● 4 SENSORS SYNCED</span>
                <span className="hidden sm:inline text-slate-500">19:42:15.400 EDT</span>
              </div>
            </div>

            {/* Visual Grid: Radar Intersection + Timeline Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-center">
              {/* Left: Top Down Radar Visual */}
              <div className="lg:col-span-7 bg-[#070b18] rounded-xl p-4 border border-cyan-500/20 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2">
                  <span>TOP-DOWN INTERSECTION MODEL</span>
                  <span className="text-red-400 animate-pulse font-bold">POI (420, 430) IMPACT DETECTED</span>
                </div>
                
                {/* SVG Intersection Radar */}
                <div className="relative w-full aspect-[16/9] bg-[#03060f] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 cyber-grid-cyan opacity-40" />

                  {/* Road Layout */}
                  <svg className="w-full h-full" viewBox="0 0 600 340">
                    {/* Asphalt Roads */}
                    <rect x="0" y="110" width="600" height="120" fill="#0d1326" />
                    <rect x="230" y="0" width="140" height="340" fill="#0d1326" />
                    
                    {/* Intersection Box */}
                    <rect x="230" y="110" width="140" height="120" fill="#111a33" />
                    
                    {/* Lane Lines */}
                    <line x1="0" y1="170" x2="600" y2="170" stroke="#f5a623" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
                    <line x1="300" y1="0" x2="300" y2="340" stroke="#f5a623" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />

                    {/* Vehicle A (Red Sedan) Trajectory Arc */}
                    <path 
                      d="M 120 200 L 250 200 Q 300 200 310 150 L 310 40" 
                      fill="none" 
                      stroke="#ff3366" 
                      strokeWidth="2.5" 
                      strokeDasharray="4 3" 
                      opacity="0.85" 
                    />
                    {/* Vehicle B (Motorcycle) Straight Path */}
                    <line 
                      x1="520" y1="140" x2="160" y2="140" 
                      stroke="#00f2fe" 
                      strokeWidth="2.5" 
                      opacity="0.9" 
                    />

                    {/* Collision Impact Point */}
                    <circle cx="310" cy="140" r="14" fill="rgba(255, 51, 102, 0.25)" className="animate-ping" />
                    <circle cx="310" cy="140" r="6" fill="#ff3366" />
                    
                    {/* Vehicle Markers */}
                    {/* Red Sedan */}
                    <rect x="295" y="148" width="30" height="16" rx="4" fill="#ff3366" transform="rotate(-35 310 156)" />
                    {/* Blue Motorcycle */}
                    <rect x="330" y="136" width="18" height="8" rx="2" fill="#00f2fe" />

                    {/* Labels */}
                    <text x="325" y="125" fill="#ff3366" fontSize="10" fontFamily="monospace" fontWeight="bold">POI: 28.4 MPH</text>
                    <text x="390" y="160" fill="#00f2fe" fontSize="9" fontFamily="monospace">VEH B: Yamaha MT-09</text>
                    <text x="140" y="220" fill="#ff3366" fontSize="9" fontFamily="monospace">VEH A: Honda Civic</text>
                  </svg>

                  {/* Radar sweep effect */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-56 h-56 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
                  </div>
                </div>
              </div>

              {/* Right: Real-time Telemetry & Contradiction Alert */}
              <div className="lg:col-span-5 space-y-3">
                {/* Contradiction Callout */}
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 shadow-neon-red">
                  <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>CRITICAL CONTRADICTION DETECTED</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Driver claims motorcycle speed was <strong className="text-red-300">65-70 mph</strong>. Telemetry proves <strong className="text-cyan-300">46.8 mph</strong> entry, braking to <strong className="text-emerald-300">28.4 mph</strong> at impact.
                  </p>
                </div>

                {/* Micro Telemetry Stats */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Signal Phasing:</span>
                    <span className="text-yellow-400 font-semibold">Amber / Permissive Yellow</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Motorcycle Braking:</span>
                    <span className="text-cyan-300 font-semibold">-0.82g @ 154 PSI Pressure</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Headlight State:</span>
                    <span className="text-emerald-400 font-semibold">ACTIVE (Verified in Frame #126)</span>
                  </div>
                </div>

                {/* Inspect Action */}
                <button
                  onClick={onExploreDemo}
                  className="w-full py-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Open Full Trajectory & Evidence Workspace</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
            Purpose-Built for Law Enforcement & Forensic Reconstructionists
          </h2>
          <p className="text-slate-400 text-base">
            AccidentIQ eliminates conjecture by linking every analytical finding, velocity estimate, and timeline event directly back to verifiable digital evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-5">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Multi-Source Evidence Fusion</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ingest MP4 dashcam clips, typed witness transcripts, and vehicle CAN-bus/GPS CSV telemetry. Each file receives a cryptographic SHA-256 integrity hash.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-violet-500/20">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300 mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Chronological Reconstruction</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              AI normalizes disparate source clocks into a synchronized microsecond timeline. Color-coded markers distinguish direct video observations from claims and telemetry.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-red-500/20">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-300 mb-5">
              <GitCompare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Contradiction & Gap Detection</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Automated comparison algorithms flag discrepancies in speed, signal state, and actions between eyewitness claims and physical telemetry ground truth.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-emerald-500/20">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">2D Trajectory Kinematics</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Interactive top-down intersection animation models vehicle paths, deceleration curves, and point-of-impact coordinates with uncertainty bounds.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-amber-500/20">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Confidence & Uncertainty Metrics</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transparent reliability scoring distinguishes verified electronic records from human perception variance, highlighting unmonitored blind spots.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 border border-blue-500/20">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 mb-5">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-white mb-2">Forensic PDF Reports</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Generate standardized 12-section accident investigation reports with verifiable evidence citations, methodology notes, and official disclaimers.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive How It Works Flow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono font-semibold text-cyan-400 tracking-wider">
            Reconstruction Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-2 mb-4">
            From Evidence Fragment to Court-Ready Analysis
          </h2>
          <p className="text-slate-400 text-base">
            A structured, explainable 6-stage analytical pipeline engineered for forensic integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Ingest Evidence',
              desc: 'Upload dashcam video, officer witness interview transcripts, and ECU sensor logs with cryptographic hashing.',
              icon: UploadCloud,
              color: 'text-cyan-400'
            },
            {
              step: '02',
              title: 'AI Multi-Modal Extraction',
              desc: 'Computer vision samples frames for YOLO vehicle detection; NLP parses witness claims and speed estimates.',
              icon: Cpu,
              color: 'text-blue-400'
            },
            {
              step: '03',
              title: 'Chronological Normalization',
              desc: 'Algorithms synchronize timestamps, organizing events onto a high-resolution interactive timeline.',
              icon: Clock,
              color: 'text-violet-400'
            },
            {
              step: '04',
              title: 'Contradiction Flagging',
              desc: 'Cross-evidence matrix compares witness perceptions against CAN-bus speed and traffic signal records.',
              icon: GitCompare,
              color: 'text-red-400'
            },
            {
              step: '05',
              title: '2D Trajectory Modeling',
              desc: 'Synthesize animated top-down vehicle movement, deceleration arcs, and collision points with uncertainty hulls.',
              icon: Compass,
              color: 'text-emerald-400'
            },
            {
              step: '06',
              title: 'Evidence-Linked Report',
              desc: 'Generate a comprehensive 12-section forensic report with evidence citations ready for investigator review.',
              icon: FileCheck2,
              color: 'text-amber-400'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-800 relative group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-cyan-300">
                    STAGE {item.step}
                  </span>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="text-base font-bold font-heading text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Forensic Disclaimer Footer */}
      <footer className="py-12 border-t border-slate-800 bg-[#03050c] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span className="font-heading font-bold text-slate-200 text-sm">
                Accident<span className="text-cyan-400">IQ</span>
              </span>
              <span className="text-slate-600">|</span>
              <span>Major Collision Intelligence & Timeline Reconstruction</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-400">
              <button onClick={onLaunchInvestigation} className="hover:text-cyan-300">Dashboard</button>
              <button onClick={onExploreDemo} className="hover:text-cyan-300">Crash Demo</button>
              <span>National AI Hackathon Edition</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] leading-relaxed text-slate-400">
            <strong className="text-slate-300">Legal & Evidentiary Disclaimer:</strong> AccidentIQ is an AI-assisted investigative tool intended to assist qualified law enforcement officers and collision reconstructionists. The platform does not establish legal liability, assign fault, or determine criminal responsibility. All findings are provisional and must be verified in accordance with statutory and judicial evidence rules.
          </div>
        </div>
      </footer>
    </div>
  );
};
