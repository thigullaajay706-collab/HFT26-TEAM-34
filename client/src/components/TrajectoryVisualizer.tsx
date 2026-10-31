import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Eye, 
  Info, 
  Compass, 
  Gauge, 
  ShieldAlert, 
  CheckCircle2,
  Car,
  Users
} from 'lucide-react';
import { TrajectoryData, TrajectoryPointItem } from '../types';

interface TrajectoryVisualizerProps {
  data: TrajectoryData | null;
  onInspectEvidence?: (source: string) => void;
}

export const TrajectoryVisualizer: React.FC<TrajectoryVisualizerProps> = ({
  data,
  onInspectEvidence
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showTrails, setShowTrails] = useState(true);
  const [showUncertainty, setShowUncertainty] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derive dynamic time boundaries from points
  const { minTime, maxTime } = useMemo(() => {
    if (!data || !data.vehicles || data.vehicles.length === 0) {
      return { minTime: 0, maxTime: 10 };
    }
    const allPts = data.vehicles.flatMap(v => v.points || []);
    if (allPts.length === 0) return { minTime: 0, maxTime: 10 };
    const min = Math.min(...allPts.map(p => p.timestamp_sec));
    const max = Math.max(...allPts.map(p => p.timestamp_sec));
    return { minTime: min, maxTime: max > min ? max : min + 10 };
  }, [data]);

  const [currentTimeSec, setCurrentTimeSec] = useState(minTime);

  // Sync initial selected vehicle and initial time when data loads
  useEffect(() => {
    if (data?.vehicles?.length) {
      if (!selectedVehicleId || !data.vehicles.some(v => v.vehicle_id === selectedVehicleId)) {
        setSelectedVehicleId(data.vehicles[0].vehicle_id);
      }
      setCurrentTimeSec(minTime);
    }
  }, [data, minTime]);

  // Animation loop
  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp: number | null = null;

    const animate = (time: number) => {
      if (lastTimestamp !== null && isPlaying) {
        const deltaSec = (time - lastTimestamp) / 1000;
        setCurrentTimeSec(prev => {
          const next = prev + deltaSec * playbackSpeed;
          if (next >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return next;
        });
      }
      lastTimestamp = time;
      if (isPlaying) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, playbackSpeed, maxTime]);

  // Interpolate position and heading for a vehicle at time t
  const getVehicleStateAt = (points: TrajectoryPointItem[], t: number) => {
    if (!points || points.length === 0) return null;
    if (t <= points[0].timestamp_sec) return points[0];
    if (t >= points[points.length - 1].timestamp_sec) return points[points.length - 1];

    // Find bounding segments
    let i = 0;
    while (i < points.length - 1 && points[i + 1].timestamp_sec < t) {
      i++;
    }
    const p1 = points[i];
    const p2 = points[i + 1];
    const denom = p2.timestamp_sec - p1.timestamp_sec;
    const factor = denom > 0 ? (t - p1.timestamp_sec) / denom : 0;

    return {
      timestamp_sec: t,
      timestamp_str: p1.timestamp_str,
      x: p1.x + (p2.x - p1.x) * factor,
      y: p1.y + (p2.y - p1.y) * factor,
      speed_mph: p1.speed_mph + (p2.speed_mph - p1.speed_mph) * factor,
      heading_deg: p1.heading_deg + (p2.heading_deg - p1.heading_deg) * factor,
      brake_active: p1.brake_active || p2.brake_active,
      is_inferred: p1.is_inferred || p2.is_inferred,
      uncertainty_radius_meters: (p1.uncertainty_radius_meters || 0.5) + ((p2.uncertainty_radius_meters || 0.5) - (p1.uncertainty_radius_meters || 0.5)) * factor,
      evidence_source: p1.evidence_source || 'Kinematic Trajectory Extrapolation'
    };
  };

  // Render 2D Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background & Asphalt Grid
    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, width, height);

    // Cyber grid
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const roadType = (data.intersection_type || '').toLowerCase();
    const isPedCrossing = roadType.includes('pedestrian') || roadType.includes('zebra');
    const isHighway = roadType.includes('highway') || roadType.includes('chain');

    if (isPedCrossing) {
      // 2A. Mid-Block Pedestrian Crossing Layout
      // Main East-West roadway
      ctx.fillStyle = '#0d1428';
      ctx.fillRect(0, 300, width, 240);

      // Curbs & Sidewalks
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 270, width, 30); // North sidewalk
      ctx.fillRect(0, 540, width, 30); // South sidewalk

      // Curbs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 300); ctx.lineTo(width, 300);
      ctx.moveTo(0, 540); ctx.lineTo(width, 540);
      ctx.stroke();

      // Double yellow centerline
      ctx.strokeStyle = '#f5a623';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 418); ctx.lineTo(340, 418);
      ctx.moveTo(0, 422); ctx.lineTo(340, 422);
      ctx.moveTo(420, 418); ctx.lineTo(width, 418);
      ctx.moveTo(420, 422); ctx.lineTo(width, 422);
      ctx.stroke();

      // Broken white lane lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(0, 360); ctx.lineTo(340, 360);
      ctx.moveTo(420, 360); ctx.lineTo(width, 360);
      ctx.moveTo(0, 480); ctx.lineTo(340, 480);
      ctx.moveTo(420, 480); ctx.lineTo(width, 480);
      ctx.stroke();
      ctx.setLineDash([]);

      // Marked Zebra Crosswalk
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let y = 305; y < 535; y += 22) {
        ctx.fillRect(350, y, 60, 11);
      }

      // Stop bars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(435, 305, 8, 110); // Westbound approach stop bar
      ctx.fillRect(325, 425, 8, 110); // Eastbound approach stop bar

      // Corridor labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px monospace';
      ctx.fillText('SIGNALIZED MID-BLOCK ZEBRA CROSSING', 260, 260);
      ctx.fillText('TRAVEL LANE (WESTBOUND)', 500, 345);
      ctx.fillText('TRAVEL LANE (EASTBOUND)', 80, 510);
    } else if (isHighway) {
      // 2B. Straight Multi-Lane Highway Segment
      ctx.fillStyle = '#0d1428';
      ctx.fillRect(0, 240, width, 320); // 320px wide highway corridor

      // Emergency Shoulders
      ctx.fillStyle = '#161e31';
      ctx.fillRect(0, 200, width, 40); // North shoulder
      ctx.fillRect(0, 560, width, 40); // South shoulder

      // Solid white fog line / edge line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 240); ctx.lineTo(width, 240);
      ctx.moveTo(0, 560); ctx.lineTo(width, 560);
      ctx.stroke();

      // Median barrier in center
      ctx.strokeStyle = '#f5a623';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 400); ctx.lineTo(width, 400);
      ctx.stroke();

      // Broken lane dividers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([14, 12]);
      ctx.beginPath();
      ctx.moveTo(0, 320); ctx.lineTo(width, 320);
      ctx.moveTo(0, 480); ctx.lineTo(width, 480);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highway labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px monospace';
      ctx.fillText('INTERSTATE HIGHWAY CORRIDOR · LANE 1 & 2', 40, 230);
      ctx.fillText('DENSE FOG / REDUCED VISIBILITY ZONE', 480, 230);
    } else {
      // 2C. Default 4-Way Road Intersection (Broadway & 4th Ave style)
      ctx.fillStyle = '#0d1428';
      ctx.fillRect(0, 320, width, 240);
      ctx.fillRect(320, 0, 240, height);

      // Intersection center
      ctx.fillStyle = '#111b36';
      ctx.fillRect(320, 320, 240, 240);

      // Curbs & Sidewalks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 320, 320);
      ctx.strokeRect(560, 0, 320, 320);
      ctx.strokeRect(0, 560, 320, 320);
      ctx.strokeRect(560, 560, 320, 320);

      // Crosswalk zebra stripes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let y = 330; y < 550; y += 18) {
        ctx.fillRect(295, y, 20, 9);
        ctx.fillRect(565, y, 20, 9);
      }
      for (let x = 330; x < 550; x += 18) {
        ctx.fillRect(x, 295, 9, 20);
        ctx.fillRect(x, 565, 9, 20);
      }

      // Centerlines (Double Yellow)
      ctx.strokeStyle = '#f5a623';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 438); ctx.lineTo(295, 438);
      ctx.moveTo(0, 442); ctx.lineTo(295, 442);
      ctx.moveTo(585, 438); ctx.lineTo(width, 438);
      ctx.moveTo(585, 442); ctx.lineTo(width, 442);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(438, 0); ctx.lineTo(438, 295);
      ctx.moveTo(442, 0); ctx.lineTo(442, 295);
      ctx.moveTo(438, 585); ctx.lineTo(438, height);
      ctx.moveTo(442, 585); ctx.lineTo(442, height);
      ctx.stroke();

      // Broken White Lane Dividers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(0, 380); ctx.lineTo(295, 380);
      ctx.moveTo(585, 380); ctx.lineTo(width, 380);
      ctx.moveTo(0, 500); ctx.lineTo(295, 500);
      ctx.moveTo(585, 500); ctx.lineTo(width, 500);
      ctx.stroke();
      ctx.setLineDash([]);

      // Street Names
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px monospace';
      ctx.fillText('MAIN CORRIDOR (WESTBOUND)', 580, 360);
      ctx.fillText('MAIN CORRIDOR (EASTBOUND)', 80, 520);
      ctx.fillText('CROSS STREET (NORTHBOUND)', 455, 80);
    }
    // 3. Traffic Signals Indicators (if signalized)
    const isAmber = currentTimeSec >= (minTime + 1.8) && currentTimeSec < (minTime + 5.8);
    if (!isHighway) {
      // Eastbound Signal
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(290, 565, 12, 24);
      ctx.fillStyle = isAmber ? '#f5a623' : '#00f5a0';
      ctx.beginPath();
      ctx.arc(296, 577, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Point of Impact (POI) marker
    const poi = data.collision_point;
    if (poi && (currentTimeSec >= (minTime + 4.5) || currentTimeSec >= maxTime - 2.5)) {
      ctx.beginPath();
      ctx.arc(poi.x, poi.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 51, 102, 0.2)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(poi.x, poi.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ff3366';
      ctx.fill();

      ctx.fillStyle = '#ff3366';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`COLLISION POINT (${poi.timestamp || ''})`, poi.x - 70, poi.y - 28);
      ctx.fillText(`Impact Velocity: ${poi.impact_speed_mph || 0} MPH`, poi.x - 70, poi.y - 14);
    }

    // 5. Draw Trajectory Trails
    if (showTrails) {
      data.vehicles.forEach(veh => {
        if (!veh.points || veh.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(veh.points[0].x, veh.points[0].y);
        for (let i = 1; i < veh.points.length; i++) {
          const pt = veh.points[i];
          if (pt.is_inferred) {
            ctx.setLineDash([4, 4]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = veh.color_hex;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // 6. Draw Vehicles & Participants at Current Time
    data.vehicles.forEach(veh => {
      const state = getVehicleStateAt(veh.points, currentTimeSec);
      if (!state) return;

      // Draw Positional Uncertainty Ellipse
      if (showUncertainty) {
        const radiusPx = (state.uncertainty_radius_meters || 0.5) * 18;
        ctx.beginPath();
        ctx.arc(state.x, state.y, radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = `${veh.color_hex}18`;
        ctx.strokeStyle = `${veh.color_hex}40`;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }

      // Save canvas state for vehicle rotation
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate((state.heading_deg * Math.PI) / 180);

      const idLower = (veh.vehicle_id || '').toLowerCase();
      const nameLower = (veh.vehicle_name || '').toLowerCase();
      const isMotorcycle = idLower.includes('motorcycle') || nameLower.includes('motorcycle') || nameLower.includes('bike');
      const isPedestrian = idLower.includes('ped') || nameLower.includes('pedestrian') || nameLower.includes('priya');
      const isTruck = idLower.includes('truck') || nameLower.includes('truck') || nameLower.includes('freight');

      if (isPedestrian) {
        // Pedestrian Marker (Circle with heading pointer and illuminated glow)
        ctx.fillStyle = veh.color_hex;
        ctx.shadowColor = veh.color_hex;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Head and shoulders outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.stroke();

        // Direction pointer
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(13, -3);
        ctx.lineTo(13, 3);
        ctx.closePath();
        ctx.fill();
      } else if (isMotorcycle) {
        // Motorcycle Body (Slim profile)
        ctx.fillStyle = veh.color_hex;
        ctx.shadowColor = veh.color_hex;
        ctx.shadowBlur = 12;
        ctx.fillRect(-14, -4, 28, 8); // length 28, width 8
        ctx.shadowBlur = 0;

        // Front Headlight Beam (LED active)
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(55, -16);
        ctx.lineTo(55, 16);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fill();

        // Front Wheel
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(8, -2, 8, 4);

        // Rear Brake Light (if active)
        if (state.brake_active) {
          ctx.fillStyle = '#ff3366';
          ctx.shadowColor = '#ff3366';
          ctx.shadowBlur = 10;
          ctx.fillRect(-16, -3, 3, 6);
          ctx.shadowBlur = 0;
        }
      } else if (isTruck) {
        // Commercial Heavy Truck (Extended rectangular profile)
        ctx.fillStyle = veh.color_hex;
        ctx.shadowColor = veh.color_hex;
        ctx.shadowBlur = 12;
        ctx.fillRect(-32, -14, 64, 28); // length 64, width 28
        ctx.shadowBlur = 0;

        // Cab section
        ctx.fillStyle = '#090d16';
        ctx.fillRect(14, -12, 16, 24);

        // Headlights
        ctx.fillStyle = 'rgba(255, 255, 200, 0.6)';
        ctx.fillRect(30, -12, 4, 6);
        ctx.fillRect(30, 6, 4, 6);

        // Brake lights
        if (state.brake_active) {
          ctx.fillStyle = '#ff3366';
          ctx.shadowColor = '#ff3366';
          ctx.shadowBlur = 12;
          ctx.fillRect(-34, -13, 3, 8);
          ctx.fillRect(-34, 5, 3, 8);
          ctx.shadowBlur = 0;
        }
      } else {
        // Standard Passenger Car / SUV (Rectangular profile)
        ctx.fillStyle = veh.color_hex;
        ctx.shadowColor = veh.color_hex;
        ctx.shadowBlur = 12;
        ctx.fillRect(-22, -11, 44, 22); // length 44, width 22
        ctx.shadowBlur = 0;

        // Windshield
        ctx.fillStyle = '#090d16';
        ctx.fillRect(-6, -9, 12, 18);

        // Headlights
        ctx.fillStyle = 'rgba(255, 255, 200, 0.4)';
        ctx.fillRect(18, -10, 4, 6);
        ctx.fillRect(18, 4, 4, 6);

        // Brake lights
        if (state.brake_active) {
          ctx.fillStyle = '#ff3366';
          ctx.shadowColor = '#ff3366';
          ctx.shadowBlur = 10;
          ctx.fillRect(-24, -10, 3, 6);
          ctx.fillRect(-24, 4, 3, 6);
          ctx.shadowBlur = 0;
        }
      }

      ctx.restore();

      // Vehicle Tag Label
      ctx.fillStyle = veh.color_hex;
      ctx.font = 'bold 10px monospace';
      ctx.fillText(
        `${veh.vehicle_name.split(' ')[0]}: ${state.speed_mph.toFixed(1)} MPH`,
        state.x - 30,
        state.y - (isMotorcycle || isPedestrian ? 16 : 24)
      );

      // Selected Vehicle Highlight Ring
      if (veh.vehicle_id === selectedVehicleId) {
        ctx.beginPath();
        ctx.arc(state.x, state.y, isPedestrian ? 18 : 30, 0, Math.PI * 2);
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

  }, [data, currentTimeSec, showTrails, showUncertainty, selectedVehicleId, minTime, maxTime]);

  if (!data || !data.vehicles || data.vehicles.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
        <Car className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
        <h3 className="text-base font-bold text-white font-heading">No Kinematic Trajectory Data Available</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Upload video recordings, GPS/telemetry logs, or execute the AI Analysis Pipeline to synthesize 2D spatial trajectories and perception-reaction models.
        </p>
      </div>
    );
  }

  // Selected vehicle state
  const selectedVeh = data.vehicles.find(v => v.vehicle_id === selectedVehicleId) || data.vehicles[0];
  const selectedState = selectedVeh ? getVehicleStateAt(selectedVeh.points, currentTimeSec) : null;

  const cycleVehicle = () => {
    if (!data?.vehicles?.length) return;
    const currIdx = data.vehicles.findIndex(v => v.vehicle_id === selectedVehicleId);
    const nextIdx = (currIdx + 1) % data.vehicles.length;
    setSelectedVehicleId(data.vehicles[nextIdx].vehicle_id);
  };

  return (
    <div className="space-y-4">
      {/* Visualizer Canvas Card */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        {/* Header HUD */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-white font-bold">2D KINEMATIC TRAJECTORY SIMULATION</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-300 uppercase">
              {data.intersection_type ? data.intersection_type.replace(/_/g, ' ') : 'INCIDENT CORRIDOR'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>TIMESTAMP: <strong className="text-white font-mono">{currentTimeSec.toFixed(2)}s</strong></span>
            <span>TIMELINE: <strong className="text-cyan-400 font-mono">{selectedState?.timestamp_str || `T+${currentTimeSec.toFixed(1)}s`}</strong></span>
          </div>
        </div>

        {/* Participant Selection Pills */}
        <div className="flex items-center space-x-2 pt-3 pb-1 overflow-x-auto text-xs font-mono">
          <span className="text-slate-500 text-[11px] whitespace-nowrap">Focus Participant:</span>
          {data.vehicles.map(v => (
            <button
              key={v.vehicle_id}
              onClick={() => setSelectedVehicleId(v.vehicle_id)}
              className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 transition-all text-xs ${
                selectedVehicleId === v.vehicle_id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-neon-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color_hex }} />
              <span className="truncate max-w-[140px]">{v.vehicle_name}</span>
            </button>
          ))}
        </div>

        {/* Canvas Element */}
        <div className="relative w-full aspect-[4/3] max-w-4xl mx-auto my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#050814] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full object-contain cursor-pointer"
            onClick={cycleVehicle}
            title="Click to cycle active vehicle focus"
          />
        </div>

        {/* Playback Controls & Scrubber */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-4">
          {/* Scrubber slider */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-slate-400">{minTime.toFixed(1)}s</span>
            <input
              type="range"
              min={minTime}
              max={maxTime}
              step={0.05}
              value={currentTimeSec}
              onChange={(e) => {
                setCurrentTimeSec(parseFloat(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-xs font-mono text-slate-400">{maxTime.toFixed(1)}s</span>
          </div>

          {/* Buttons bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold flex items-center space-x-1.5 transition-all shadow-neon-cyan"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY RECONSTRUCTION'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentTimeSec(minTime);
                }}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                title="Restart simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
                <span className="text-slate-400">Speed:</span>
                {[0.5, 1.0, 2.0].map(s => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${
                      playbackSpeed === s
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Overlays toggles */}
            <div className="flex items-center space-x-4 text-slate-300">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTrails}
                  onChange={(e) => setShowTrails(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span>Path Trails</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUncertainty}
                  onChange={(e) => setShowUncertainty(e.target.checked)}
                  className="accent-cyan-400 rounded"
                />
                <span>Uncertainty Hulls</span>
              </label>
            </div>
          </div>
        </div>

        {/* Selected Vehicle Live Telemetry Card */}
        {selectedVeh && selectedState && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[10px] text-slate-400">Inspected Participant:</span>
              <button
                onClick={cycleVehicle}
                className="font-bold flex items-center space-x-1 text-white hover:text-cyan-300 mt-0.5"
                title="Click to cycle"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedVeh.color_hex }} />
                <span className="truncate">{selectedVeh.vehicle_name}</span>
              </button>
            </div>

            <div>
              <span className="block text-[10px] text-slate-400">Current Velocity:</span>
              <span className="text-base font-bold text-cyan-300">{selectedState.speed_mph.toFixed(1)} MPH</span>
            </div>

            <div>
              <span className="block text-[10px] text-slate-400">Heading Angle:</span>
              <span className="text-base font-bold text-slate-200">{selectedState.heading_deg.toFixed(0)}°</span>
            </div>

            <div>
              <span className="block text-[10px] text-slate-400">Braking Decel:</span>
              <span className={`text-base font-bold ${selectedState.brake_active ? 'text-red-400' : 'text-slate-400'}`}>
                {selectedState.brake_active ? 'ACTIVE' : 'None'}
              </span>
            </div>

            <div>
              <span className="block text-[10px] text-slate-400">Supporting Ground Truth:</span>
              <span className="text-xs text-slate-300 font-semibold truncate block">
                {selectedState.evidence_source}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
