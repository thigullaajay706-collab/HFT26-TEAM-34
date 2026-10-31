import React, { useState } from 'react';
import { X, Plus, Trash2, ShieldAlert, Car, Calendar, MapPin, Gauge, Users } from 'lucide-react';
import { CaseItem, Vehicle } from '../types';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: CaseItem) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated
}) => {
  const [title, setTitle] = useState('');
  const [accidentDate, setAccidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [accidentTime, setAccidentTime] = useState('18:30 EDT');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [weather, setWeather] = useState('Clear');
  const [roadCondition, setRoadCondition] = useState('Dry Asphalt');
  const [speedLimit, setSpeedLimit] = useState(35);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 'veh_1',
      make_model: '',
      color: '',
      license_plate: '',
      driver_name: '',
      vehicle_type: 'Sedan'
    },
    {
      id: 'veh_2',
      make_model: '',
      color: '',
      license_plate: '',
      driver_name: '',
      vehicle_type: 'Motorcycle'
    }
  ]);

  if (!isOpen) return null;

  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        id: `veh_${vehicles.length + 1}`,
        make_model: '',
        color: '',
        license_plate: '',
        driver_name: '',
        vehicle_type: 'Sedan'
      }
    ]);
  };

  const removeVehicle = (index: number) => {
    if (vehicles.length <= 1) return;
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const updateVehicle = (index: number, field: keyof Vehicle, val: string) => {
    const updated = [...vehicles];
    updated[index] = { ...updated[index], [field]: val };
    setVehicles(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const preparedVehicles = vehicles.map(v => ({
        ...v,
        participant_type: v.vehicle_type,
        make_model: v.vehicle_type === 'Pedestrian' && !v.make_model ? 'Pedestrian' : v.make_model,
        movement_state: v.movement_state || (v.vehicle_type === 'Pedestrian' ? 'Crossing the road' : 'Normal')
      }));

      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          accident_date: accidentDate,
          accident_time: accidentTime,
          location,
          description,
          vehicles: preparedVehicles,
          weather,
          road_condition: roadCondition,
          speed_limit_mph: Number(speedLimit)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to create case');

      // Fetch newly created case
      const caseRes = await fetch(`/api/cases/${data.id}`);
      const caseData = await caseRes.json();
      onCaseCreated(caseData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating case');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/60 to-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-white">Create New Accident Case</h2>
              <p className="text-xs text-slate-400 font-mono">Case ID will be automatically generated with forensic metadata</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Incident Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-400 text-sm text-white focus:outline-none"
              placeholder="e.g. 4-Way Signalized Collision at 5th and Main"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Accident Date *</span>
              </label>
              <input
                type="date"
                required
                value={accidentDate}
                onChange={(e) => setAccidentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Approximate Time *</label>
              <input
                type="text"
                required
                value={accidentTime}
                onChange={(e) => setAccidentTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                placeholder="19:42:15 EDT"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center space-x-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Speed Limit (MPH)</span>
              </label>
              <input
                type="number"
                value={speedLimit}
                onChange={(e) => setSpeedLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Location *</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                placeholder="e.g. Broadway & 4th Avenue"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Weather</label>
                <select
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="Clear">Clear</option>
                  <option value="Rain / Wet">Rain / Wet</option>
                  <option value="Dusk / Night">Dusk / Night</option>
                  <option value="Fog">Fog</option>
                  <option value="Snow / Ice">Snow / Ice</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Road Condition</label>
                <select
                  value={roadCondition}
                  onChange={(e) => setRoadCondition(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="Dry Asphalt">Dry Asphalt</option>
                  <option value="Wet Asphalt">Wet Asphalt</option>
                  <option value="Gravel">Gravel</option>
                  <option value="Icy">Icy</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Incident Brief & Preliminary Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
              placeholder="Initial reporting notes from patrol unit or 911 dispatch..."
            />
          </div>

          {/* Road Users / Participants Involved */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center space-x-1.5 uppercase">
                <Users className="w-4 h-4" />
                <span>Road Users / Participants Involved ({vehicles.length})</span>
              </span>
              <button
                type="button"
                onClick={addVehicle}
                className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono hover:bg-cyan-900 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Participant</span>
              </button>
            </div>

            <div className="space-y-3">
              {vehicles.map((v, i) => {
                const isPedestrian = v.vehicle_type === 'Pedestrian';
                return (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400">
                          {isPedestrian ? 'Participant / Clothing' : 'Make & Model *'}
                        </label>
                        <input
                          type="text"
                          required={!isPedestrian}
                          value={v.make_model}
                          onChange={(e) => updateVehicle(i, 'make_model', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                          placeholder={isPedestrian ? 'e.g. Pedestrian (Yellow coat)' : 'e.g. 2023 Honda Civic'}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400">Color</label>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => updateVehicle(i, 'color', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                          placeholder="Red / Yellow"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400">
                          {isPedestrian ? 'License / ID' : 'License Plate'}
                        </label>
                        <input
                          type="text"
                          value={v.license_plate}
                          onChange={(e) => updateVehicle(i, 'license_plate', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                          placeholder={isPedestrian ? 'N/A' : '7XYZ892'}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400">
                          {isPedestrian ? 'Person Name' : 'Driver Name'}
                        </label>
                        <input
                          type="text"
                          value={v.driver_name}
                          onChange={(e) => updateVehicle(i, 'driver_name', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                          placeholder={isPedestrian ? 'e.g. Priya Sharma' : 'John Doe'}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-3 sm:pt-0">
                        <select
                          value={v.vehicle_type}
                          onChange={(e) => updateVehicle(i, 'vehicle_type', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                        >
                          <option value="Sedan">Car / Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Motorcycle">Motorcycle</option>
                          <option value="Truck">Truck</option>
                          <option value="Bus">Bus</option>
                          <option value="Auto Rickshaw">Auto Rickshaw</option>
                          <option value="Van">Van</option>
                          <option value="Bicycle">Bicycle</option>
                          <option value="Pedestrian">Pedestrian</option>
                          <option value="Other">Other</option>
                        </select>
                        {vehicles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVehicle(i)}
                            className="p-1.5 text-slate-500 hover:text-red-400"
                            title="Remove participant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pedestrian-Specific Movement State */}
                    {isPedestrian && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center space-x-3 text-xs">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase">Movement State:</span>
                        <select
                          value={v.movement_state || 'Crossing the road'}
                          onChange={(e) => updateVehicle(i, 'movement_state' as any, e.target.value)}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200"
                        >
                          <option value="Crossing the road">Crossing the road (Zebra / Crosswalk)</option>
                          <option value="Walking along shoulder">Walking along shoulder</option>
                          <option value="Standing on sidewalk">Standing on sidewalk</option>
                          <option value="Standing in roadway">Standing in roadway</option>
                          <option value="Running across street">Running across street</option>
                          <option value="Unknown movement">Unknown movement</option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-sm transition-all shadow-neon-cyan"
            >
              {isLoading ? 'Creating Case...' : 'Initialize Investigation Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
