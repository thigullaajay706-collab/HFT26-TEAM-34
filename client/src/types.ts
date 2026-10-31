export interface User {
  id: string;
  email: string;
  full_name: string;
  badge_number: string;
  department: string;
  role: string;
  token?: string;
}

export interface Vehicle {
  id: string;
  make_model: string;
  color: string;
  license_plate: string;
  driver_name: string;
  vehicle_type: string;
  participant_type?: string;
  movement_state?: string;
  initial_direction?: string;
  notes?: string;
  status?: string;
  color_hex?: string;
}

export interface CaseItem {
  id: string;
  case_number: string;
  title: string;
  accident_date: string;
  accident_time: string;
  location: string;
  description: string;
  vehicles: Vehicle[];
  status: string;
  weather: string;
  road_condition: string;
  speed_limit_mph: number;
  created_at: string;
  updated_at: string;
  evidence_count?: number;
  event_count?: number;
  contradiction_count?: number;
}

export interface EvidenceItem {
  id: string;
  case_id: string;
  evidence_type: 'video' | 'witness' | 'sensor';
  filename: string;
  original_name: string;
  file_hash: string;
  file_size_bytes: number;
  source_label: string;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface TimelineEventItem {
  id: string;
  case_id: string;
  evidence_id?: string;
  timestamp_str: string;
  timestamp_seconds: number;
  vehicle_id?: string;
  event_type: 'video_observation' | 'witness_claim' | 'sensor_measurement' | 'uncertain_event' | 'contradiction';
  description: string;
  observation_type: 'direct_observation' | 'sensor_telemetry' | 'witness_statement' | 'kinematic_inference';
  confidence_score: number;
  confidence_label: 'High' | 'Moderate' | 'Low' | 'Insufficient Evidence';
  supporting_ref: {
    source?: string;
    evidence_id?: string;
    data_point?: string;
    [key: string]: any;
  };
  created_at?: string;
}

export interface ContradictionItem {
  id: string;
  case_id: string;
  contradiction_code: string;
  title: string;
  claim_a: {
    source: string;
    evidence_id?: string;
    text: string;
    type: string;
    confidence_score?: number;
  };
  claim_b: {
    source: string;
    evidence_id?: string;
    text: string;
    type: string;
    confidence_score?: number;
  };
  time_interval: string;
  explanation: string;
  severity: 'Critical' | 'Major' | 'Minor';
  review_status: string;
  evidence_links: string[];
  created_at?: string;
}

export interface EvidenceGapItem {
  id: string;
  case_id: string;
  gap_type: string;
  title: string;
  description: string;
  time_interval: string;
  severity: string;
  status: string;
  created_at?: string;
}

export interface TrajectoryPointItem {
  timestamp_sec: number;
  timestamp_str: string;
  x: number;
  y: number;
  speed_mph: number;
  heading_deg: number;
  brake_active: boolean;
  is_inferred: boolean;
  uncertainty_radius_meters: number;
  evidence_source: string;
}

export interface VehicleTrajectoryItem {
  vehicle_id: string;
  vehicle_name: string;
  color_hex: string;
  points: TrajectoryPointItem[];
}

export interface TrajectoryData {
  case_id: string;
  intersection_type: string;
  collision_point: {
    x: number;
    y: number;
    timestamp: string;
    impact_speed_mph: number;
  };
  vehicles: VehicleTrajectoryItem[];
}

export interface ForensicSynthesis {
  case_id: string;
  status: 'completed' | 'insufficient_evidence';
  message?: string;
  incident_overview: {
    title: string;
    case_number: string;
    location: string;
    accident_date: string;
    accident_time: string;
    participants?: any[];
    participants_count?: number;
    weather: string;
    road_condition: string;
    speed_limit_mph: number;
    thesis?: string;
  };
  evidence_analysis_summary: {
    total_evidence: number;
    video_count: number;
    witness_count: number;
    sensor_count: number;
    event_count?: number;
    contradiction_count?: number;
    gaps_count?: number;
  };
  possible_incident_sequence: string[];
  potential_contradictions: Array<{
    code?: string;
    title: string;
    explanation: string;
    severity?: string;
  }>;
  primary_contradiction?: {
    title: string;
    explanation: string;
  };
  evidence_gaps: Array<{
    type?: string;
    title: string;
    description: string;
    severity?: string;
  }>;
  confidence_and_limitations: {
    reliability: string;
    score: number;
    notes?: string;
  };
  overall_confidence: string;
  overall_score: number;
}
