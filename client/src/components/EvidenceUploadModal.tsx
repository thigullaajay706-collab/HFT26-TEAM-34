import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  FileText, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onEvidenceUploaded: () => void;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  isOpen,
  onClose,
  caseId,
  onEvidenceUploaded
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'witness' | 'sensor'>('video');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Video Form State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSourceLabel, setVideoSourceLabel] = useState('Civilian Dashcam (Vehicle C)');

  // Witness Form State
  const [witnessName, setWitnessName] = useState('');
  const [witnessType, setWitnessType] = useState('Independent Eyewitness');
  const [statementText, setStatementText] = useState('');
  const [statementTime, setStatementTime] = useState('19:42 EDT');
  const [locationVantage, setLocationVantage] = useState('Sidewalk corner, approx 20 meters away');

  // Sensor Form State
  const [sensorFile, setSensorFile] = useState<File | null>(null);
  const [sensorSourceLabel, setSensorSourceLabel] = useState('Motorcycle Onboard ECU & GPS Telemetry');

  if (!isOpen) return null;

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setErrorMsg('Please select a video file (MP4, MOV, WebM).');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('source_label', videoSourceLabel);

    try {
      const res = await fetch(`/api/cases/${caseId}/evidence/video`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to upload video');
      setSuccessMsg('Video evidence ingested. Running automated forensic AI analysis pipeline...');
      try {
        await fetch(`/api/cases/${caseId}/analyze`, { method: 'POST' });
      } catch (anlErr) {
        console.warn('Auto-analyze non-fatal:', anlErr);
      }
      setTimeout(() => {
        onEvidenceUploaded();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadWitness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!witnessName || !statementText) {
      setErrorMsg('Please provide witness name and statement text.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/cases/${caseId}/evidence/witness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          witness_name: witnessName,
          witness_type: witnessType,
          statement_text: statementText,
          statement_time: statementTime,
          location_vantage: locationVantage
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to process statement');
      setSuccessMsg(`Witness statement processed (${data.claims_extracted || 0} claims). Running forensic cross-analysis...`);
      try {
        await fetch(`/api/cases/${caseId}/analyze`, { method: 'POST' });
      } catch (anlErr) {
        console.warn('Auto-analyze non-fatal:', anlErr);
      }
      setTimeout(() => {
        onEvidenceUploaded();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sensorFile) {
      setErrorMsg('Please select a CSV sensor file.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', sensorFile);
    formData.append('source_label', sensorSourceLabel);

    try {
      const res = await fetch(`/api/cases/${caseId}/evidence/sensor`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to parse telemetry');
      setSuccessMsg(`Sensor telemetry ingested (${data.records_count || 0} records). Running automated cross-analysis...`);
      try {
        await fetch(`/api/cases/${caseId}/analyze`, { method: 'POST' });
      } catch (anlErr) {
        console.warn('Auto-analyze non-fatal:', anlErr);
      }
      setTimeout(() => {
        onEvidenceUploaded();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sensor upload error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/60 to-slate-900/60">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-heading text-white">Ingest Forensic Evidence</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/60">
          <button
            onClick={() => { setActiveTab('video'); setErrorMsg(null); }}
            className={`py-3 text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'video'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>A. Dashcam / Video</span>
          </button>

          <button
            onClick={() => { setActiveTab('witness'); setErrorMsg(null); }}
            className={`py-3 text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'witness'
                ? 'text-violet-400 border-b-2 border-violet-400 bg-violet-950/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>B. Witness Statement</span>
          </button>

          <button
            onClick={() => { setActiveTab('sensor'); setErrorMsg(null); }}
            className={`py-3 text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'sensor'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>C. Sensor CSV Log</span>
          </button>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="p-6">
          {/* TAB A: Video Evidence */}
          {activeTab === 'video' && (
            <form onSubmit={handleUploadVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Source Identification / Camera Vantage</label>
                <input
                  type="text"
                  required
                  value={videoSourceLabel}
                  onChange={(e) => setVideoSourceLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                  placeholder="e.g. Traffic Camera Pole #42 or Civilian Dashcam"
                />
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 text-center bg-slate-900/40 cursor-pointer">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/mp4,video/mov,video/webm"
                  onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                />
                <label htmlFor="video-upload" className="cursor-pointer block">
                  <Video className="w-10 h-10 text-cyan-400 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-semibold text-slate-200">
                    {videoFile ? videoFile.name : 'Click to select or drag video file'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Supported: MP4, MOV, WebM (Max 100MB)
                  </p>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !videoFile}
                  className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-neon-cyan disabled:opacity-50"
                >
                  {isLoading ? 'Ingesting & Analyzing...' : 'Upload Video Evidence'}
                </button>
              </div>
            </form>
          )}

          {/* TAB B: Witness Statement */}
          {activeTab === 'witness' && (
            <form onSubmit={handleUploadWitness} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Witness Full Name *</label>
                  <input
                    type="text"
                    required
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                    placeholder="e.g. Officer Miller or Dave Chen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Witness Category</label>
                  <select
                    value={witnessType}
                    onChange={(e) => setWitnessType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="Independent Eyewitness">Independent Eyewitness</option>
                    <option value="Driver (Vehicle A)">Driver (Vehicle A)</option>
                    <option value="Driver (Vehicle B)">Driver (Vehicle B)</option>
                    <option value="Passenger">Passenger</option>
                    <option value="Pedestrian">Pedestrian Bystander</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Vantage Point</label>
                  <input
                    type="text"
                    value={locationVantage}
                    onChange={(e) => setLocationVantage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                    placeholder="e.g. NE Sidewalk corner, 20m away"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Interview Time</label>
                  <input
                    type="text"
                    value={statementTime}
                    onChange={(e) => setStatementTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                    placeholder="e.g. 19:42:15 EDT"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Verbatim Statement Text *</label>
                <textarea
                  rows={5}
                  required
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                  placeholder="Paste officer field interview transcription or witness written declaration..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-neon-violet disabled:opacity-50"
                >
                  {isLoading ? 'Extracting Claims...' : 'Analyze Witness Statement'}
                </button>
              </div>
            </form>
          )}

          {/* TAB C: Sensor CSV Log */}
          {activeTab === 'sensor' && (
            <form onSubmit={handleUploadSensor} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Sensor Record Source Label</label>
                <input
                  type="text"
                  required
                  value={sensorSourceLabel}
                  onChange={(e) => setSensorSourceLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                  placeholder="e.g. Yamaha CAN-bus / Fleet Telematics / Airbag EDR"
                />
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-6 text-center bg-slate-900/40 cursor-pointer">
                <input
                  type="file"
                  id="sensor-upload"
                  accept=".csv,text/csv"
                  onChange={(e) => setSensorFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                />
                <label htmlFor="sensor-upload" className="cursor-pointer block">
                  <FileSpreadsheet className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-semibold text-slate-200">
                    {sensorFile ? sensorFile.name : 'Click to select or drag CSV telemetry file'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Expects: timestamp, speed_mph, brake_psi, throttle_pct, accel_g
                  </p>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !sensorFile}
                  className="px-5 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-neon-emerald disabled:opacity-50"
                >
                  {isLoading ? 'Parsing Telemetry...' : 'Upload & Parse Sensor CSV'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
