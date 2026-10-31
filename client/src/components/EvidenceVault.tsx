import React, { useState } from 'react';
import { 
  Video, 
  FileText, 
  Activity, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Hash, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { EvidenceItem } from '../types';

interface EvidenceVaultProps {
  evidenceList: EvidenceItem[];
  onOpenUploadModal: () => void;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({
  evidenceList,
  onOpenUploadModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'video' | 'witness' | 'sensor'>('video');
  const [activeVideoFrameIdx, setActiveVideoFrameIdx] = useState(0);
  const [activeWitnessId, setActiveWitnessId] = useState<string | null>(null);

  // Group evidence items
  const videoItems = evidenceList.filter(e => e.evidence_type === 'video');
  const witnessItems = evidenceList.filter(e => e.evidence_type === 'witness');
  const sensorItems = evidenceList.filter(e => e.evidence_type === 'sensor');

  // Active Video Item & Frames
  const currentVideo = videoItems[0];
  const videoFrames = currentVideo?.metadata?.frames || [];
  const currentFrame = videoFrames[activeVideoFrameIdx] || videoFrames[0];

  // Active Witness Item
  const currentWitness = witnessItems.find(w => w.id === activeWitnessId) || witnessItems[0];

  // Active Sensor Item
  const currentSensor = sensorItems[0];
  const sensorChartData = currentSensor?.metadata?.chart_data || [
    { timestamp: '19:42:10.0', speed: 46.8, brake: 0, accel: -0.02 },
    { timestamp: '19:42:11.0', speed: 46.9, brake: 0, accel: -0.01 },
    { timestamp: '19:42:12.0', speed: 46.8, brake: 0, accel: -0.02 },
    { timestamp: '19:42:13.0', speed: 46.5, brake: 0, accel: -0.05 },
    { timestamp: '19:42:13.8', speed: 45.2, brake: 12, accel: -0.15 },
    { timestamp: '19:42:14.2', speed: 41.6, brake: 154, accel: -0.82 },
    { timestamp: '19:42:14.8', speed: 34.2, brake: 148, accel: -0.74 },
    { timestamp: '19:42:15.4', speed: 28.4, brake: 140, accel: -3.60 },
    { timestamp: '19:42:16.0', speed: 12.0, brake: 40, accel: -0.90 },
    { timestamp: '19:42:17.0', speed: 0.0, brake: 0, accel: 0.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Ingest Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold font-heading text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Cryptographic Evidence Vault ({evidenceList.length} Files Ingested)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-evident chain of custody with SHA-256 integrity verification and multi-modal AI feature extraction.
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-heading font-semibold text-xs tracking-wider uppercase transition-all shadow-neon-cyan flex items-center space-x-1.5 self-start sm:self-center"
        >
          <Upload className="w-4 h-4" />
          <span>+ Upload Evidence File</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedCategory('video')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedCategory === 'video'
              ? 'glass-card border-cyan-400 shadow-neon-cyan'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <Video className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950">
              {videoItems.length} CLIPS
            </span>
          </div>
          <h4 className="text-sm font-bold text-white font-heading">A. Video Footage</h4>
          <p className="text-[11px] text-slate-400">Dashcam & CCTV frame extraction</p>
        </button>

        <button
          onClick={() => setSelectedCategory('witness')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedCategory === 'witness'
              ? 'glass-card border-violet-400 shadow-neon-violet'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <FileText className="w-5 h-5 text-violet-400" />
            <span className="text-xs font-mono font-bold text-violet-300 px-2 py-0.5 rounded bg-violet-950">
              {witnessItems.length} STATEMENTS
            </span>
          </div>
          <h4 className="text-sm font-bold text-white font-heading">B. Witness Declarations</h4>
          <p className="text-[11px] text-slate-400">Verbatim transcripts & NLP claims</p>
        </button>

        <button
          onClick={() => setSelectedCategory('sensor')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedCategory === 'sensor'
              ? 'glass-card border-emerald-400 shadow-neon-emerald'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-950">
              {sensorItems.length} LOGS
            </span>
          </div>
          <h4 className="text-sm font-bold text-white font-heading">C. Sensor Telemetry</h4>
          <p className="text-[11px] text-slate-400">CAN-bus, ECU & GPS records</p>
        </button>
      </div>

      {/* SECTION A: Video Evidence Player & Frame Stepper */}
      {selectedCategory === 'video' && (
        <div className="space-y-4">
          {videoItems.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
              No video footage uploaded for this case.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Custom Video Simulation & Frame Inspector */}
              <div className="lg:col-span-8 glass-card rounded-2xl p-5 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                  <span className="text-cyan-300 font-bold">{currentVideo.source_label}</span>
                  <span className="text-slate-400">{currentVideo.metadata?.resolution || '1920x1080'} @ {currentVideo.metadata?.fps || '30'} FPS</span>
                </div>

                {/* Simulated Video Frame with YOLO Overlays */}
                <div className="relative aspect-video rounded-xl bg-[#030612] border border-slate-800 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 cyber-grid opacity-30" />
                  
                  {/* Digital Timestamp overlay */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 border border-slate-700 text-xs font-mono text-cyan-300 z-10">
                    FRAME #{currentFrame?.frame_idx || 45} · {currentFrame?.timestamp_str || '19:42:13.100 EDT'}
                  </div>

                  {/* Synthetic Dashcam Roadway View */}
                  <svg className="w-full h-full" viewBox="0 0 800 450">
                    {/* Horizon & Dusk Sky */}
                    <rect x="0" y="0" width="800" height="200" fill="#080e22" />
                    {/* Road surface */}
                    <polygon points="0,450 800,450 480,200 320,200" fill="#111827" />
                    {/* Center dash lines */}
                    <line x1="400" y1="200" x2="400" y2="450" stroke="#f5a623" strokeWidth="4" strokeDasharray="20 15" opacity="0.7" />

                    {/* Traffic Signal in distance */}
                    <rect x="520" y="80" width="16" height="42" fill="#020617" />
                    <circle cx="528" cy="101" r="5" fill="#f5a623" filter="drop-shadow(0 0 6px #f5a623)" />

                    {/* Sedan (Vehicle A) turning */}
                    <polygon points="340,290 440,290 420,240 360,240" fill="#ff3366" />
                    {/* Motorcycle (Vehicle B) approaching */}
                    <polygon points="460,300 490,300 480,270 470,270" fill="#00f2fe" />
                    {/* Headlight beam */}
                    <polygon points="475,285 580,360 420,360" fill="rgba(255,255,255,0.2)" />
                  </svg>

                  {/* YOLO Bounding Box Overlays */}
                  {currentFrame?.detections?.map((det: any, idx: number) => (
                    <div
                      key={idx}
                      className="absolute border-2 rounded pointer-events-none transition-all flex items-start justify-start p-1"
                      style={{
                        borderColor: det.color || '#00f2fe',
                        backgroundColor: `${det.color || '#00f2fe'}15`,
                        left: `${(det.bbox[0] / 1000) * 100}%`,
                        top: `${(det.bbox[1] / 600) * 100}%`,
                        width: `${((det.bbox[2] - det.bbox[0]) / 1000) * 100}%`,
                        height: `${((det.bbox[3] - det.bbox[1]) / 600) * 100}%`
                      }}
                    >
                      <span
                        className="text-[10px] font-mono text-black px-1.5 py-0.5 rounded font-bold shadow-md"
                        style={{ backgroundColor: det.color || '#00f2fe' }}
                      >
                        {det.label} ({(det.confidence * 100).toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>

                {/* Frame Scrubber Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Key Video Sample Frames:</span>
                    <span>Frame {activeVideoFrameIdx + 1} of {videoFrames.length}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {videoFrames.map((f: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVideoFrameIdx(idx)}
                        className={`p-2 rounded-lg text-left text-xs font-mono transition-all border ${
                          activeVideoFrameIdx === idx
                            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="font-bold block">Frame #{f.frame_idx}</span>
                        <span className="text-[10px] opacity-75">{f.timestamp_str}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Narrative Annotation */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-cyan-400 font-mono">Frame Observation:</strong>{' '}
                  {currentFrame?.description}
                </div>
              </div>

              {/* Right: Video Forensic Metadata & Integrity */}
              <div className="lg:col-span-4 space-y-4">
                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-xs">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">
                    Video Chain of Custody
                  </h4>
                  <div className="space-y-2 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">FILE NAME:</span>
                      <span className="font-semibold">{currentVideo.original_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">FILE SIZE:</span>
                      <span>{(currentVideo.file_size_bytes / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">SHA-256 HASH:</span>
                      <span className="text-[11px] text-cyan-300 break-all">{currentVideo.file_hash}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">CAMERA ANGLE:</span>
                      <span>Forward Fleet Telematics 140° FOV</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DETECTED OBJECTS:</span>
                      <span className="text-emerald-400 font-bold">{currentVideo.metadata?.yolo_detections_count || 482} Bounding Boxes Tracked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION B: Witness Statements & NLP Claim Extraction */}
      {selectedCategory === 'witness' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Witness Statement Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block mb-2">
              Witness Declarations:
            </span>
            {witnessItems.map((w) => (
              <div
                key={w.id}
                onClick={() => setActiveWitnessId(w.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  currentWitness?.id === w.id
                    ? 'glass-card border-violet-400 shadow-neon-violet'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white font-heading">
                    {w.metadata?.witness_name || w.source_label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300">
                    {w.metadata?.extracted_claims?.length || 4} Claims
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {w.metadata?.vantage_point || 'Witness Record'}
                </p>
              </div>
            ))}
          </div>

          {/* Statement Verbatim Text & Extracted Claims */}
          <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-violet-500/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-violet-300 font-bold">
                {currentWitness?.metadata?.witness_name} ({currentWitness?.metadata?.role || 'Eyewitness'})
              </span>
              <span className="text-slate-400">
                Taken: {currentWitness?.metadata?.statement_taken_at || 'Field Interview'}
              </span>
            </div>

            {/* Verbatim Statement Excerpt */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Verbatim Witness Transcript:
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
                {currentWitness?.id === 'evid_wit_01' ? (
                  <>
                    "I was driving east on Broadway in my red Civic on my way home. When I approached the intersection at 4th Avenue, the <mark className="bg-yellow-500/30 text-yellow-200 px-1 rounded font-semibold">left turn arrow turned yellow</mark>. I crept forward slowly past the stop line to see oncoming cars. I saw no one in the oncoming lane, so I proceeded with my turn. Suddenly, out of nowhere, this blue sports motorcycle came flying down the street at insane speed—he must have been doing <mark className="bg-red-500/30 text-red-200 px-1 rounded font-semibold">at least 65 or 70 miles per hour</mark>! Plus, his <mark className="bg-red-500/30 text-red-200 px-1 rounded font-semibold">headlights were completely off</mark>, which made him invisible in the dusk. By the time I slammed my brakes, he smashed right into my passenger side."
                  </>
                ) : (
                  <>
                    "I was standing on the northeast corner of Broadway and 4th Avenue waiting for the pedestrian walk sign. I heard the motorcycle approaching. The bike wasn't racing or revving loudly; it seemed to be traveling at a normal cruising pace, <mark className="bg-cyan-500/30 text-cyan-200 px-1 rounded font-semibold">probably around 30 to 35 mph</mark>. Its <mark className="bg-emerald-500/30 text-emerald-200 px-1 rounded font-semibold">headlight was bright white and clearly on</mark>. As the motorcycle crossed the intersection line, the traffic light was still green/yellow for Broadway. Suddenly, the red car in the oncoming lane made an <mark className="bg-red-500/30 text-red-200 px-1 rounded font-semibold">aggressive left cut directly across</mark> the bike's lane without signaling. The rider hit their brakes hard, you could hear the tire squeal, but there wasn't enough room to stop."
                  </>
                )}
              </div>
            </div>

            {/* Extracted Forensic Claims Cards */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 block">
                NLP Extracted Claims & Confidence Weighting:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentWitness?.metadata?.extracted_claims?.map((cl: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-violet-300 font-semibold">{cl.type.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{(cl.confidence * 100).toFixed(0)}% Conf</span>
                    </div>
                    <p className="text-slate-200 font-medium">{cl.claim}</p>
                    <span className="text-[10px] text-slate-500 font-mono block italic">Span: "{cl.span}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION C: Sensor CSV Log & Kinematics Chart */}
      {selectedCategory === 'sensor' && (
        <div className="space-y-6">
          {sensorItems.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
              No sensor telemetry uploaded.
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <h4 className="text-sm font-bold font-heading text-white flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>{currentSensor.source_label}</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    10Hz Synchronized GPS / CAN-Bus Micro-Telemetry Log
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-emerald-400 font-bold">PEAK: {currentSensor.metadata?.max_speed_mph || 47.4} MPH</span>
                  <span className="text-red-400 font-bold">IMPACT: {currentSensor.metadata?.impact_speed_mph || 28.4} MPH</span>
                </div>
              </div>

              {/* Interactive Speed & Deceleration Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>VELOCITY & BRAKE PRESSURE PROFILE OVER TIME:</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /><span>Speed (MPH)</span></span>
                    <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /><span>Brake Pressure (PSI)</span></span>
                  </div>
                </div>

                <div className="h-64 w-full bg-[#030612] rounded-xl p-3 border border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#090d1a', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="speed" stroke="#00f2fe" strokeWidth={2.5} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="brake" stroke="#ff3366" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detected Anomalies Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 shadow-neon-red">
                  <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ANOMALY: RAPID DECELERATION SPIKE</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    At 19:42:14.200, front hydraulic brake pressure spiked to <strong>154 PSI</strong> producing peak longitudinal deceleration of <strong>-0.82g</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
                  <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>OBJECTIVE KINEMATIC GROUND TRUTH</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Motorcycle entered intersection corridor at <strong>46.8 mph</strong> (11.8 mph over 35 mph speed limit) and dissipated 18.4 mph through emergency braking prior to contact.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
