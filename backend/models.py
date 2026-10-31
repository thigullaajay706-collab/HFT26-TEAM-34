from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Authentication Models
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    badge_number: str
    department: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    badge_number: str
    department: str
    role: str
    token: str

# Road Users / Participants Involved Model
class ParticipantInvolved(BaseModel):
    id: Optional[str] = ""
    participant_type: str = "Car"  # Car, Motorcycle, Bus, Truck, Bicycle, Auto Rickshaw, Van, Pedestrian, Other
    make_model: Optional[str] = ""
    color: Optional[str] = ""
    license_plate: Optional[str] = ""
    driver_name: Optional[str] = ""
    vehicle_type: Optional[str] = None  # Backward compatibility alias for participant_type
    movement_state: Optional[str] = "Crossing the road"  # Walking, Running, Standing, Crossing the road, Unknown movement
    initial_direction: Optional[str] = ""
    notes: Optional[str] = ""
    status: Optional[str] = "Normal"
    color_hex: Optional[str] = "#00f2fe"

# Backward compatibility alias
VehicleInvolved = ParticipantInvolved

class CaseCreate(BaseModel):
    title: str
    accident_date: str
    accident_time: str
    location: str
    description: str
    vehicles: List[ParticipantInvolved]  # Road Users / Participants Involved
    weather: Optional[str] = "Clear"
    road_condition: Optional[str] = "Dry"
    speed_limit_mph: Optional[int] = 35

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    accident_date: Optional[str] = None
    accident_time: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    vehicles: Optional[List[ParticipantInvolved]] = None
    status: Optional[str] = None
    weather: Optional[str] = None
    road_condition: Optional[str] = None
    speed_limit_mph: Optional[int] = None

class CaseResponse(BaseModel):
    id: str
    case_number: str
    title: str
    accident_date: str
    accident_time: str
    location: str
    description: str
    vehicles: List[Dict[str, Any]]
    status: str
    weather: str
    road_condition: str
    speed_limit_mph: int
    created_at: str
    updated_at: str
    evidence_count: Optional[int] = 0
    event_count: Optional[int] = 0
    contradiction_count: Optional[int] = 0

class DemoLoadRequest(BaseModel):
    demo_id: str = "demo1"  # "demo1" | "demo2" | "demo3"

# Evidence Models
class EvidenceUploadResponse(BaseModel):
    id: str
    case_id: str
    evidence_type: str  # video, witness, sensor
    filename: str
    original_name: str
    file_hash: str
    file_size_bytes: int
    source_label: str
    status: str
    metadata: Dict[str, Any]
    created_at: str

class WitnessStatementCreate(BaseModel):
    witness_name: str
    witness_type: str  # Driver, Passenger, Pedestrian, Independent Witness
    statement_text: str
    statement_time: Optional[str] = "19:42 EDT"
    location_vantage: Optional[str] = "Sidewalk"

# Timeline Event Model
class TimelineEvent(BaseModel):
    id: str
    case_id: str
    evidence_id: Optional[str] = None
    timestamp_str: str
    timestamp_seconds: float
    vehicle_id: Optional[str] = None
    event_type: str  # video_observation, witness_claim, sensor_measurement, uncertain_event, contradiction
    description: str
    observation_type: str  # direct_observation, sensor_telemetry, witness_statement, kinematic_inference
    confidence_score: float
    confidence_label: str  # High, Moderate, Low, Insufficient Evidence
    supporting_ref: Dict[str, Any]

# Contradiction Model
class Contradiction(BaseModel):
    id: str
    case_id: str
    contradiction_code: str
    title: str
    claim_a: Dict[str, Any]
    claim_b: Dict[str, Any]
    time_interval: str
    explanation: str
    severity: str  # Critical, Major, Minor
    review_status: str  # Pending Review, Verified Contradiction, Discarded
    evidence_links: List[str]

# Evidence Gap Model
class EvidenceGap(BaseModel):
    id: str
    case_id: str
    gap_type: str
    title: str
    description: str
    time_interval: str
    severity: str
    status: str

# Trajectory Point Model
class TrajectoryPoint(BaseModel):
    timestamp_sec: float
    timestamp_str: str
    x: float
    y: float
    speed_mph: float
    heading_deg: float
    brake_active: bool
    is_inferred: bool
    uncertainty_radius_meters: float
    evidence_source: str

class VehicleTrajectory(BaseModel):
    vehicle_id: str
    vehicle_name: str
    color_hex: str
    participant_type: Optional[str] = "Car"
    points: List[TrajectoryPoint]

class TrajectoryReconstruction(BaseModel):
    case_id: str
    intersection_layout: str
    collision_point: Dict[str, Any]
    vehicles: List[VehicleTrajectory]

# Dynamic Forensic Intelligence Synthesis Model
class ForensicSynthesis(BaseModel):
    case_id: str
    status: str  # "completed" | "insufficient_evidence"
    message: Optional[str] = None
    incident_overview: Dict[str, Any]
    evidence_analysis_summary: Dict[str, Any]
    possible_incident_sequence: List[str]
    potential_contradictions: List[Dict[str, Any]]
    evidence_gaps: List[Dict[str, Any]]
    confidence_and_limitations: Dict[str, Any]
    overall_confidence: str
    overall_score: float

# Forensic Report Model
class ForensicReport(BaseModel):
    case_id: str
    report_id: str
    generated_at: str
    investigator_name: str
    badge_number: str
    case_metadata: Dict[str, Any]
    executive_summary: str
    evidence_inventory: List[Dict[str, Any]]
    extracted_observations: List[Dict[str, Any]]
    witness_claims: List[Dict[str, Any]]
    chronological_timeline: List[Dict[str, Any]]
    contradictions: List[Dict[str, Any]]
    evidence_gaps: List[Dict[str, Any]]
    trajectory_analysis: Dict[str, Any]
    confidence_assessment: Dict[str, Any]
    limitations: List[str]
    disclaimer: str
