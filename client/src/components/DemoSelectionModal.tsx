import React, { useState } from 'react';
import { X, Cpu, Car, Users, Truck, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface DemoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDemo: (demoId: 'demo1' | 'demo2' | 'demo3') => Promise<void>;
}

export const DemoSelectionModal: React.FC<DemoSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectDemo
}) => {
  const [loadingDemoId, setLoadingDemoId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = async (demoId: 'demo1' | 'demo2' | 'demo3') => {
    setLoadingDemoId(demoId);
    try {
      await onSelectDemo(demoId);
      onClose();
    } finally {
      setLoadingDemoId(null);
    }
  };

  const demos = [
    {
      id: 'demo1' as const,
      caseNumber: 'CRASH-2026-0849X',
      title: 'Intersection Collision: Sedan vs. Motorcycle',
      scenario: 'T-Bone impact at controlled 4-way intersection (Broadway & 4th Ave). Red Honda Civic turns left across path of oncoming Blue Yamaha MT-09.',
      category: 'Vehicle vs Motorcycle',
      icon: Car,
      tagColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
      accentColor: 'hover:border-cyan-500/60',
      participants: ['2023 Honda Civic EX (Sedan)', '2024 Yamaha MT-09 SP (Motorcycle)'],
      sources: 'Trailing Fleet Dashcam, 2 Witness Statements, 10Hz CAN Telemetry',
      highlight: 'Rivera claims motorcycle exceeded 70 mph with unlit headlights; refuted by 10Hz CAN telemetry and optical frame audit.'
    },
    {
      id: 'demo2' as const,
      caseNumber: 'CRASH-2026-0219P',
      title: 'Pedestrian Impact at Signalized Zebra Crossing',
      scenario: 'Mid-block pedestrian impact on Pine Street in wet conditions. Silver Tesla Model Y strikes pedestrian crossing on illuminated walk signal.',
      category: 'Vehicle vs Pedestrian',
      icon: Users,
      tagColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
      accentColor: 'hover:border-rose-500/60',
      participants: ['2025 Tesla Model Y (Electric SUV)', 'Priya Sharma (Pedestrian in Yellow Coat)'],
      sources: 'Municipal CCTV Overhead Cam, Driver Statement, Bystander Statement, Tesla EDR Log',
      highlight: 'Driver asserts pedestrian crossed on red hand; disproven by municipal camera verifying active WALK symbol and 31.8 mph speed.'
    },
    {
      id: 'demo3' as const,
      caseNumber: 'CRASH-2026-0572M',
      title: 'Multi-Vehicle Chain Collision: Truck & 2 Cars',
      scenario: 'High-speed in-line rear-end accordion collision on State Highway 104 in dense morning fog. Freightliner Box Truck crushes stationary VW Golf into Toyota Corolla.',
      category: 'Multi-Vehicle Chain Impact',
      icon: Truck,
      tagColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
      accentColor: 'hover:border-amber-500/60',
      participants: ['Freightliner M2 Box Truck', '2024 VW Golf GTI (Middle)', '2022 Toyota Corolla (Lead)'],
      sources: 'Dual 60fps Dashcam (Rear/Front), Truck Operator Statement, Golf Driver Statement, J1939 ELD Telematics',
      highlight: 'Truck operator claimed unlit brake lights; refuted by dashcam reflection proof showing stop lamps active 3.8s before impact.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/50">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-[11px] font-mono uppercase tracking-wider font-semibold">
                Forensic Case Library
              </span>
              <span className="text-xs text-slate-400 font-mono">Select a Benchmark Investigation</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
              Load Forensic Investigation Demo
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Each pre-configured case demonstrates AccidentIQ's multi-source evidence fusion, objective kinematic modeling, and cross-modal contradiction detection.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {demos.map((d) => {
            const Icon = d.icon;
            const isLoadingThis = loadingDemoId === d.id;
            const isAnyLoading = loadingDemoId !== null;

            return (
              <div
                key={d.id}
                className={`glass-card rounded-2xl p-5 border border-slate-800/80 ${d.accentColor} transition-all duration-300 flex flex-col justify-between space-y-4 hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-semibold border ${d.tagColor}`}>
                      {d.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {d.caseNumber}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-300 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-heading leading-snug">
                      {d.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {d.scenario}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                    <div className="text-slate-400">
                      <span className="text-slate-500">PARTICIPANTS:</span> {d.participants.length}
                    </div>
                    <div className="text-slate-400 truncate">
                      <span className="text-slate-500">SOURCES:</span> {d.sources}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    <strong className="text-cyan-300 block font-mono text-[10px] mb-0.5">FORENSIC CORE:</strong>
                    {d.highlight}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelect(d.id)}
                  disabled={isAnyLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs font-mono flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-950/40 disabled:opacity-50"
                >
                  {isLoadingThis ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading Scenario...</span>
                    </>
                  ) : (
                    <>
                      <span>Load Investigation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
          <span>* All cases feature sealed SHA-256 evidence vaults and interactive 2D physics.</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
