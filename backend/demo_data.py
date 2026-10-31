import json
import hashlib
from datetime import datetime

def seed_demo_case(cursor):
    case_id = "case_demo_2026_0849x"
    case_number = "CRASH-2026-0849X"

    # Check if demo case already exists
    cursor.execute("SELECT id FROM cases WHERE id = ?", (case_id,))
    if cursor.fetchone():
        return case_id

    now = datetime.now().isoformat()

    vehicles = [
        {
            "id": "veh_a_sedan",
            "make_model": "2023 Honda Civic EX",
            "color": "Crimson Red",
            "license_plate": "7XYZ892",
            "driver_name": "Marcus Rivera (Age 34)",
            "vehicle_type": "Sedan",
            "status": "Moderate front-right quarter damage",
            "color_hex": "#ff3366"
        },
        {
            "id": "veh_b_motorcycle",
            "make_model": "2024 Yamaha MT-09 SP",
            "color": "Cobalt Blue",
            "license_plate": "MC-4911",
            "driver_name": "Elena Rostova (Age 28)",
            "vehicle_type": "Motorcycle",
            "status": "Severe front fork and fairing distortion, side impact",
            "color_hex": "#00f2fe"
        }
    ]

    cursor.execute("""
    INSERT INTO cases (
        id, case_number, title, accident_date, accident_time, location,
        description, vehicles_json, status, weather, road_condition,
        speed_limit_mph, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        case_id,
        case_number,
        "Intersection Collision: Red Sedan Turning Across Oncoming Blue Motorcycle",
        "2026-10-24",
        "19:42:15 EDT",
        "Intersection of Broadway & 4th Avenue, Metro District",
        "Two-vehicle T-bone collision at controlled 4-way intersection. Vehicle A (Honda Civic, Crimson Red) was executing an eastbound-to-northbound left turn across opposing traffic. Vehicle B (Yamaha MT-09, Cobalt Blue) was traveling westbound through the intersection. Impact occurred in the inner westbound through-lane. Conflicting claims regarding speed, signal state, and headlight illumination.",
        json.dumps(vehicles),
        "Analysis In Progress",
        "Clear / Dusk (Streetlights active)",
        "Dry Asphalt (Friction coeff: ~0.72)",
        35,
        now,
        now
    ))

    # Evidence Items
    evid_vid_id = "evid_vid_01"
    evid_wit1_id = "evid_wit_01"
    evid_wit2_id = "evid_wit_02"
    evid_sns_id = "evid_sns_01"

    # Evidence 1: Video
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_vid_id,
        case_id,
        "video",
        "dashcam_intersection_clip_01.mp4",
        "Dashcam_FleetCam_774.mp4",
        "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        18432190,
        "Vehicle C (Trailing Fleet Dashcam, 1080p 30fps)",
        json.dumps({
            "duration_sec": 16.4,
            "fps": 30.0,
            "resolution": "1920x1080",
            "codec": "H.264 / AAC",
            "view_angle": "Forward-facing 140° wide FOV",
            "camera_sync_offset_ms": 0,
            "yolo_detections_count": 482,
            "frames": [
                {
                    "frame_idx": 45,
                    "timestamp_str": "19:42:11.500",
                    "time_sec": 1.5,
                    "description": "Signal state displays amber phase for Broadway corridor. Red sedan enters left-turn pocket.",
                    "detections": [
                        {"label": "Sedan (Vehicle A)", "confidence": 0.96, "bbox": [420, 310, 560, 440], "color": "#ff3366"},
                        {"label": "Traffic Signal (Amber)", "confidence": 0.98, "bbox": [780, 110, 810, 180], "color": "#f5a623"}
                    ]
                },
                {
                    "frame_idx": 93,
                    "timestamp_str": "19:42:13.100",
                    "time_sec": 3.1,
                    "description": "Red sedan initiates left turn trajectory across opposing lane. Headlights verified ON.",
                    "detections": [
                        {"label": "Sedan (Vehicle A)", "confidence": 0.98, "bbox": [480, 340, 640, 490], "color": "#ff3366"}
                    ]
                },
                {
                    "frame_idx": 126,
                    "timestamp_str": "19:42:14.200",
                    "time_sec": 4.2,
                    "description": "Motorcycle enters field of view. Single LED headlight beam clearly visible and illuminated.",
                    "detections": [
                        {"label": "Motorcycle (Vehicle B)", "confidence": 0.94, "bbox": [880, 410, 960, 520], "color": "#00f2fe"},
                        {"label": "Headlight Beam", "confidence": 0.91, "bbox": [875, 430, 895, 455], "color": "#ffffff"}
                    ]
                },
                {
                    "frame_idx": 162,
                    "timestamp_str": "19:42:15.400",
                    "time_sec": 5.4,
                    "description": "Point of collision: Front tire of motorcycle contacts right-front fender/wheel arch of sedan.",
                    "detections": [
                        {"label": "Collision Point", "confidence": 0.99, "bbox": [580, 370, 710, 490], "color": "#ff3366"}
                    ]
                }
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 2: Witness Statement 1 (Driver Rivera)
    witness_rivera_text = """I was driving east on Broadway in my red Civic on my way home. When I approached the intersection at 4th Avenue, the left turn arrow turned yellow. I crept forward slowly past the stop line to see oncoming cars. I saw no one in the oncoming lane, so I proceeded with my turn. Suddenly, out of nowhere, this blue sports motorcycle came flying down the street at insane speed—he must have been doing at least 65 or 70 miles per hour! Plus, his headlights were completely off, which made him invisible in the dusk. By the time I slammed my brakes, he smashed right into my passenger side."""
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_wit1_id,
        case_id,
        "witness",
        "statement_marcus_rivera.txt",
        "Statement_Rivera_Marcus.txt",
        hashlib.sha256(witness_rivera_text.encode()).hexdigest(),
        len(witness_rivera_text),
        "Driver of Vehicle A (Marcus Rivera)",
        json.dumps({
            "witness_name": "Marcus Rivera",
            "role": "Driver of Vehicle A (Sedan)",
            "statement_taken_at": "2026-10-24 20:45 EDT by Officer K. Miller",
            "vantage_point": "Behind the steering wheel of Vehicle A",
            "extracted_claims": [
                {"claim": "Claimed motorcycle speed was 65-70 mph", "span": "at least 65 or 70 miles per hour", "subject": "veh_b_motorcycle", "type": "speed_claim", "confidence": 0.88},
                {"claim": "Claimed motorcycle headlights were off", "span": "headlights were completely off", "subject": "veh_b_motorcycle", "type": "equipment_claim", "confidence": 0.92},
                {"claim": "Claimed having a yellow turn arrow", "span": "left turn arrow turned yellow", "subject": "signal_state", "type": "traffic_control_claim", "confidence": 0.85},
                {"claim": "Claimed creeping forward slowly", "span": "crept forward slowly past the stop line", "subject": "veh_a_sedan", "type": "speed_claim", "confidence": 0.78}
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 3: Witness Statement 2 (Pedestrian Chen)
    witness_chen_text = """I was standing on the northeast corner of Broadway and 4th Avenue waiting for the pedestrian walk sign. I heard the motorcycle approaching. The bike wasn't racing or revving loudly; it seemed to be traveling at a normal cruising pace, probably around 30 to 35 mph. Its headlight was bright white and clearly on. As the motorcycle crossed the intersection line, the traffic light was still green/yellow for Broadway. Suddenly, the red car in the oncoming lane made an aggressive left cut directly across the bike's lane without signaling. The rider hit their brakes hard, you could hear the tire squeal, but there wasn't enough room to stop."""
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_wit2_id,
        case_id,
        "witness",
        "statement_dave_chen.txt",
        "Statement_Chen_Dave_Pedestrian.txt",
        hashlib.sha256(witness_chen_text.encode()).hexdigest(),
        len(witness_chen_text),
        "Independent Pedestrian Eyewitness (Dave Chen)",
        json.dumps({
            "witness_name": "Dave Chen",
            "role": "Independent Pedestrian Witness",
            "statement_taken_at": "2026-10-24 20:15 EDT by Officer J. Kowalski",
            "vantage_point": "Northeast sidewalk corner, 22 meters from impact point, unobstructed view",
            "extracted_claims": [
                {"claim": "Estimated motorcycle speed at 30-35 mph", "span": "probably around 30 to 35 mph", "subject": "veh_b_motorcycle", "type": "speed_claim", "confidence": 0.89},
                {"claim": "Headlight was bright white and clearly on", "span": "headlight was bright white and clearly on", "subject": "veh_b_motorcycle", "type": "equipment_claim", "confidence": 0.95},
                {"claim": "Red car executed sudden left cut without signal", "span": "made an aggressive left cut directly across", "subject": "veh_a_sedan", "type": "maneuver_claim", "confidence": 0.91},
                {"claim": "Motorcyclist applied hard emergency braking", "span": "rider hit their brakes hard, you could hear the tire squeal", "subject": "veh_b_motorcycle", "type": "braking_claim", "confidence": 0.94}
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 4: Sensor Telemetry CSV
    sensor_csv_meta = {
        "device": "Yamaha Y-Connect Telemetry ECU + High-Precision GPS Logger",
        "sampling_rate_hz": 10,
        "records_count": 81,
        "start_time": "19:42:10.000",
        "end_time": "19:42:18.000",
        "max_recorded_speed_mph": 47.4,
        "impact_speed_mph": 28.4,
        "peak_deceleration_g": -0.82,
        "anomalies_detected": [
            {
                "type": "Rapid Deceleration Spike",
                "timestamp": "19:42:14.200",
                "detail": "Longitudinal deceleration reached -0.82g following front brake pressure spike from 12 PSI to 154 PSI."
            },
            {
                "type": "Sudden Yaw Velocity Step",
                "timestamp": "19:42:15.400",
                "detail": "Instantaneous lateral acceleration shock (+3.6g) coinciding with primary mechanical impact."
            }
        ]
    }
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_sns_id,
        case_id,
        "sensor",
        "motorcycle_telemetry_log_01.csv",
        "Yamaha_CAN_GPS_20261024_1942.csv",
        "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        14280,
        "Vehicle B (Onboard CAN-bus & 10Hz GPS Telemetry)",
        json.dumps(sensor_csv_meta),
        "Analyzed",
        now
    ))

    # Timeline Events
    timeline_events = [
        {
            "id": "evt_01",
            "timestamp_str": "19:42:10.500",
            "timestamp_sec": 10.5,
            "vehicle_id": "veh_b_motorcycle",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Motorcycle cruises westbound on Broadway at steady 46.8 mph, throttle position 32%, engine RPM 4800.",
            "confidence_score": 0.98,
            "confidence_label": "High",
            "supporting_ref": {
                "source": "Vehicle B Onboard CAN Telemetry",
                "evidence_id": evid_sns_id,
                "data_point": "Row #6, Speed=46.8 mph, Throttle=32%, Brake=0 PSI"
            }
        },
        {
            "id": "evt_02",
            "timestamp_str": "19:42:11.800",
            "timestamp_sec": 11.8,
            "vehicle_id": None,
            "event_type": "video_observation",
            "observation_type": "direct_observation",
            "description": "Traffic signal on Broadway transitions from Green to Amber phase (City timing plan: 4.0s amber duration).",
            "confidence_score": 0.96,
            "confidence_label": "High",
            "supporting_ref": {
                "source": "Trailing Dashcam Frame #54",
                "evidence_id": evid_vid_id,
                "data_point": "BBox [780, 110, 810, 180], Class: Traffic Signal (Amber)"
            }
        },
        {
            "id": "evt_03",
            "timestamp_str": "19:42:12.300",
            "timestamp_sec": 12.3,
            "vehicle_id": "veh_a_sedan",
            "event_type": "witness_claim",
            "observation_type": "witness_statement",
            "description": "Driver Rivera claims he observed a yellow turn arrow and crept forward past stop line with clear visibility.",
            "confidence_score": 0.65,
            "confidence_label": "Moderate",
            "supporting_ref": {
                "source": "Witness Statement - Marcus Rivera",
                "evidence_id": evid_wit1_id,
                "data_point": "Span: 'left turn arrow turned yellow. I crept forward slowly...'"
            }
        },
        {
            "id": "evt_04",
            "timestamp_str": "19:42:13.100",
            "timestamp_sec": 13.1,
            "vehicle_id": "veh_a_sedan",
            "event_type": "video_observation",
            "observation_type": "direct_observation",
            "description": "Red Sedan initiates continuous left turn maneuver at 14.2 mph across westbound through lanes.",
            "confidence_score": 0.94,
            "confidence_label": "High",
            "supporting_ref": {
                "source": "Trailing Dashcam Frame #93",
                "evidence_id": evid_vid_id,
                "data_point": "Optical flow tracking indicates angular velocity 18°/s, lateral entry into Lane 1"
            }
        },
        {
            "id": "evt_05",
            "timestamp_str": "19:42:13.800",
            "timestamp_sec": 13.8,
            "vehicle_id": "veh_b_motorcycle",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Motorcycle rider detects turning vehicle: throttle drops to 0% (throttle cut reaction time ~0.7s).",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {
                "source": "Vehicle B Onboard CAN Telemetry",
                "evidence_id": evid_sns_id,
                "data_point": "Row #39, Throttle=0%, Speed=46.2 mph"
            }
        },
        {
            "id": "evt_06",
            "timestamp_str": "19:42:14.200",
            "timestamp_sec": 14.2,
            "vehicle_id": "veh_b_motorcycle",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Emergency brake activation: front hydraulic brake pressure ramps to 154 PSI; deceleration reaches -0.82g.",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {
                "source": "Vehicle B Onboard CAN Telemetry",
                "evidence_id": evid_sns_id,
                "data_point": "Row #43, Brake=154 PSI, Accel=-0.82g, ABS cycle active"
            }
        },
        {
            "id": "evt_07",
            "timestamp_str": "19:42:14.300",
            "timestamp_sec": 14.3,
            "vehicle_id": "veh_b_motorcycle",
            "event_type": "witness_claim",
            "observation_type": "witness_statement",
            "description": "Pedestrian Dave Chen observes motorcycle braking hard with audible tire squeal and bright white headlight beam.",
            "confidence_score": 0.91,
            "confidence_label": "High",
            "supporting_ref": {
                "source": "Witness Statement - Dave Chen",
                "evidence_id": evid_wit2_id,
                "data_point": "Span: 'rider hit their brakes hard, you could hear the tire squeal... headlight was bright white'"
            }
        },
        {
            "id": "evt_08",
            "timestamp_str": "19:42:15.000",
            "timestamp_sec": 15.0,
            "vehicle_id": None,
            "event_type": "uncertain_event",
            "observation_type": "kinematic_inference",
            "description": "Sedan driver pre-impact braking or steering reaction is inferred from dashcam roll angle due to missing OBD-II log.",
            "confidence_score": 0.58,
            "confidence_label": "Low",
            "supporting_ref": {
                "source": "Video Optical Flow Inference",
                "evidence_id": evid_vid_id,
                "data_point": "Vehicle A pitch angle delta -1.2°, estimated braking ~0.35g"
            }
        },
        {
            "id": "evt_09",
            "timestamp_str": "19:42:15.400",
            "timestamp_sec": 15.4,
            "vehicle_id": None,
            "event_type": "contradiction",
            "observation_type": "direct_observation",
            "description": "Point of Impact (POI): Front tire/fork of motorcycle impacts right-front fender of sedan at 28.4 mph.",
            "confidence_score": 0.97,
            "confidence_label": "High",
            "supporting_ref": {
                "source": "Combined Telemetry & Dashcam Frame #162",
                "evidence_id": evid_sns_id,
                "data_point": "Instantaneous 3.6g lateral shock, velocity drop from 28.4 mph to 0 in 180ms"
            }
        },
        {
            "id": "evt_10",
            "timestamp_str": "19:42:16.800",
            "timestamp_sec": 16.8,
            "vehicle_id": "veh_b_motorcycle",
            "event_type": "video_observation",
            "observation_type": "direct_observation",
            "description": "Final rest positions: Motorcycle slides to rest on left side 8.2m northwest of POI; Sedan halts facing north-northwest.",
            "confidence_score": 0.95,
            "confidence_label": "High",
            "supporting_ref": {
                "source": "Trailing Dashcam Frame #204",
                "evidence_id": evid_vid_id,
                "data_point": "Final Rest polygon coordinates verified against physical survey markers"
            }
        }
    ]

    for evt in timeline_events:
        cursor.execute("""
        INSERT INTO events (
            id, case_id, evidence_id, timestamp_str, timestamp_seconds,
            vehicle_id, event_type, description, observation_type,
            confidence_score, confidence_label, supporting_ref_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            evt["id"],
            case_id,
            evt["supporting_ref"].get("evidence_id"),
            evt["timestamp_str"],
            evt["timestamp_sec"],
            evt["vehicle_id"],
            evt["event_type"],
            evt["description"],
            evt["observation_type"],
            evt["confidence_score"],
            evt["confidence_label"],
            json.dumps(evt["supporting_ref"]),
            now
        ))

    # Contradictions
    contradictions = [
        {
            "id": "ctrd_01",
            "contradiction_code": "CR-01-SPD",
            "title": "Severe Motorcycle Speed Discrepancy (Driver Claim vs. Telemetry)",
            "claim_a": {
                "source": "Marcus Rivera (Driver Vehicle A)",
                "evidence_id": evid_wit1_id,
                "text": "Claimed motorcycle was traveling at 'at least 65 or 70 miles per hour'",
                "type": "Driver Eyewitness Estimate",
                "confidence_score": 0.35
            },
            "claim_b": {
                "source": "Yamaha CAN-Bus & GPS High-Precision Telemetry",
                "evidence_id": evid_sns_id,
                "text": "Recorded entry speed was 46.8 mph (speed limit 35 mph), braking at T-1.2s decelerated to 28.4 mph at impact",
                "type": "Objective Sensor Telemetry",
                "confidence_score": 0.99
            },
            "time_interval": "19:42:10.000 — 19:42:15.400",
            "explanation": "Driver Rivera's claim of 65-70 mph is contradicted by objective 10Hz CAN-bus telemetry. While the motorcycle was traveling 11.8 mph over the 35 mph posted limit prior to braking, the driver's perception substantially overestimated speed by +23 to +28 mph.",
            "severity": "Critical",
            "review_status": "Verified Contradiction",
            "evidence_links": [evid_wit1_id, evid_sns_id, evid_wit2_id]
        },
        {
            "id": "ctrd_02",
            "contradiction_code": "CR-02-LGT",
            "title": "Motorcycle Headlight Illumination State",
            "claim_a": {
                "source": "Marcus Rivera (Driver Vehicle A)",
                "evidence_id": evid_wit1_id,
                "text": "Claimed motorcycle's 'headlights were completely off, which made him invisible in the dusk'",
                "type": "Driver Eyewitness Claim",
                "confidence_score": 0.20
            },
            "claim_b": {
                "source": "Dashcam Footage & Independent Witness Dave Chen",
                "evidence_id": evid_vid_id,
                "text": "Dashcam Frame #126 and Pedestrian Chen confirm motorcycle's factory LED projector headlight was active and illuminated",
                "type": "Multi-Source Photographic & Independent Corroboration",
                "confidence_score": 0.96
            },
            "time_interval": "19:42:12.000 — 19:42:15.400",
            "explanation": "Video evidence and an independent bystander corroborate that the motorcycle's dual-LED running lights were powered and emitting light. The driver's claim of darkness/invisibility is refuted by physical optical evidence.",
            "severity": "Major",
            "review_status": "Verified Contradiction",
            "evidence_links": [evid_wit1_id, evid_vid_id, evid_wit2_id]
        },
        {
            "id": "ctrd_03",
            "contradiction_code": "CR-03-SIG",
            "title": "Signal Phasing & Right-of-Way Priority",
            "claim_a": {
                "source": "Marcus Rivera (Driver Vehicle A)",
                "evidence_id": evid_wit1_id,
                "text": "Asserts he turned on a 'yellow turn arrow' implying protected clearance",
                "type": "Driver Eyewitness Claim",
                "confidence_score": 0.40
            },
            "claim_b": {
                "source": "Metro DOT Signal Timing Log & Video Analysis",
                "evidence_id": evid_vid_id,
                "text": "Broadway & 4th intersection operates with flashing yellow permissive arrow, requiring left-turning vehicles to yield to oncoming traffic",
                "type": "Traffic Signal Engineering Log & Video Corroboration",
                "confidence_score": 0.98
            },
            "time_interval": "19:42:11.800 — 19:42:13.500",
            "explanation": "The intersection signal configuration does not offer a protected yellow clearance without yielding. Under Metro Traffic Code §402.1, Vehicle A was legally obligated to yield to oncoming vehicles in the through lane.",
            "severity": "Major",
            "review_status": "Verified Contradiction",
            "evidence_links": [evid_wit1_id, evid_vid_id]
        }
    ]

    for ctrd in contradictions:
        cursor.execute("""
        INSERT INTO contradictions (
            id, case_id, contradiction_code, title, claim_a_json, claim_b_json,
            time_interval, explanation, severity, review_status, evidence_links_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ctrd["id"],
            case_id,
            ctrd["contradiction_code"],
            ctrd["title"],
            json.dumps(ctrd["claim_a"]),
            json.dumps(ctrd["claim_b"]),
            ctrd["time_interval"],
            ctrd["explanation"],
            ctrd["severity"],
            ctrd["review_status"],
            json.dumps(ctrd["evidence_links"]),
            now
        ))

    # Evidence Gaps
    evidence_gaps = [
        {
            "id": "gap_01",
            "gap_type": "Video Data Loss",
            "title": "CCTV Municipal Camera Network Packet Drop",
            "description": "Pole-mounted traffic camera #402 experienced a 1.8-second UDP stream loss between 19:42:13.200 and 19:42:15.000, obscuring the primary pre-impact steering adjustments of Vehicle A.",
            "time_interval": "19:42:13.200 — 19:42:15.000 (1.8s)",
            "severity": "Moderate",
            "status": "Partially Compensated by Trailing Vehicle Dashcam"
        },
        {
            "id": "gap_02",
            "gap_type": "Missing Telemetry",
            "title": "Sedan Event Data Recorder (EDR) Steering Telemetry",
            "description": "Vehicle A's airbag control module does not record continuous CAN steering angle PIDs prior to deployment, leaving pre-turn wheel orientation reliant on visual pixel tracking.",
            "time_interval": "19:42:11.000 — 19:42:15.400",
            "severity": "Low",
            "status": "Inferred from Optical Trajectory"
        }
    ]

    for gap in evidence_gaps:
        cursor.execute("""
        INSERT INTO evidence_gaps (
            id, case_id, gap_type, title, description, time_interval, severity, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            gap["id"],
            case_id,
            gap["gap_type"],
            gap["title"],
            gap["description"],
            gap["time_interval"],
            gap["severity"],
            gap["status"],
            now
        ))

    # Trajectories for 2D Intersection Simulation
    # Coordinates in standard canvas coordinate space: 800x800 intersection
    # Westbound traffic travels from Right (X: 750) to Left (X: 100) along Y: 380 (Lane 1) and Y: 430 (Lane 2)
    # Eastbound traffic travels from Left (X: 50) to Right along Y: 520, turning North onto Y: 200 (X: 420)
    # POI is roughly at (X: 430, Y: 430)

    # Vehicle B (Motorcycle) Points (Westbound)
    motorcycle_points = [
        {"timestamp_sec": 10.0, "timestamp_str": "19:42:10.000", "x": 750, "y": 430, "speed_mph": 46.8, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "GPS/CAN Telemetry"},
        {"timestamp_sec": 11.0, "timestamp_str": "19:42:11.000", "x": 680, "y": 430, "speed_mph": 46.9, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "GPS/CAN Telemetry"},
        {"timestamp_sec": 12.0, "timestamp_str": "19:42:12.000", "x": 610, "y": 430, "speed_mph": 46.8, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "GPS/CAN Telemetry"},
        {"timestamp_sec": 13.0, "timestamp_str": "19:42:13.000", "x": 540, "y": 430, "speed_mph": 46.5, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "GPS/CAN Telemetry"},
        {"timestamp_sec": 13.8, "timestamp_str": "19:42:13.800", "x": 485, "y": 430, "speed_mph": 45.2, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.5, "evidence_source": "Throttle Drop Recorded"},
        {"timestamp_sec": 14.2, "timestamp_str": "19:42:14.200", "x": 460, "y": 430, "speed_mph": 41.6, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.6, "evidence_source": "Hard Braking (154 PSI)"},
        {"timestamp_sec": 14.8, "timestamp_str": "19:42:14.800", "x": 438, "y": 430, "speed_mph": 34.2, "heading_deg": 272, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.7, "evidence_source": "Skid Deceleration"},
        {"timestamp_sec": 15.4, "timestamp_str": "19:42:15.400", "x": 420, "y": 430, "speed_mph": 28.4, "heading_deg": 275, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.8, "evidence_source": "Collision Impact Point"},
        {"timestamp_sec": 16.5, "timestamp_str": "19:42:16.500", "x": 370, "y": 400, "speed_mph": 8.0, "heading_deg": 310, "brake_active": False, "is_inferred": True, "uncertainty_radius_meters": 1.5, "evidence_source": "Post-impact Slide"},
        {"timestamp_sec": 18.0, "timestamp_str": "19:42:18.000", "x": 340, "y": 385, "speed_mph": 0.0, "heading_deg": 315, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Final Rest Survey"}
    ]

    # Vehicle A (Sedan) Points (Eastbound turning North)
    sedan_points = [
        {"timestamp_sec": 10.0, "timestamp_str": "19:42:10.000", "x": 220, "y": 510, "speed_mph": 22.0, "heading_deg": 90, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.8, "evidence_source": "Dashcam Visual Tracking"},
        {"timestamp_sec": 11.5, "timestamp_str": "19:42:11.500", "x": 280, "y": 510, "speed_mph": 18.5, "heading_deg": 90, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.8, "evidence_source": "Deceleration into Pocket"},
        {"timestamp_sec": 12.5, "timestamp_str": "19:42:12.500", "x": 340, "y": 505, "speed_mph": 12.0, "heading_deg": 85, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.9, "evidence_source": "Creep forward past stop line"},
        {"timestamp_sec": 13.5, "timestamp_str": "19:42:13.500", "x": 380, "y": 485, "speed_mph": 14.5, "heading_deg": 65, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.9, "evidence_source": "Turn initiation across Lane 2"},
        {"timestamp_sec": 14.5, "timestamp_str": "19:42:14.500", "x": 405, "y": 455, "speed_mph": 15.0, "heading_deg": 45, "brake_active": False, "is_inferred": True, "uncertainty_radius_meters": 1.2, "evidence_source": "Inferred from yaw arc"},
        {"timestamp_sec": 15.4, "timestamp_str": "19:42:15.400", "x": 420, "y": 430, "speed_mph": 14.0, "heading_deg": 35, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.8, "evidence_source": "Collision Impact Point"},
        {"timestamp_sec": 16.5, "timestamp_str": "19:42:16.500", "x": 425, "y": 410, "speed_mph": 4.0, "heading_deg": 25, "brake_active": True, "is_inferred": True, "uncertainty_radius_meters": 1.0, "evidence_source": "Secondary rotation"},
        {"timestamp_sec": 18.0, "timestamp_str": "19:42:18.000", "x": 428, "y": 400, "speed_mph": 0.0, "heading_deg": 20, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "Final Rest Survey"}
    ]

    cursor.execute("""
    INSERT INTO trajectories (id, case_id, vehicle_id, vehicle_name, color_hex, points_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "traj_b",
        case_id,
        "veh_b_motorcycle",
        "Vehicle B (Yamaha MT-09)",
        "#00f2fe",
        json.dumps(motorcycle_points),
        now
    ))

    cursor.execute("""
    INSERT INTO trajectories (id, case_id, vehicle_id, vehicle_name, color_hex, points_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "traj_a",
        case_id,
        "veh_a_sedan",
        "Vehicle A (Honda Civic)",
        "#ff3366",
        json.dumps(sedan_points),
        now
    ))

    # Pre-generated Forensic Report
    report_content = {
        "case_id": case_id,
        "report_id": "REP-2026-MCIS-0849X",
        "case_number": case_number,
        "title": "Comprehensive AI Forensic Reconstruction & Evidence Corroboration Report",
        "jurisdiction": "Metro Police Department — Major Collision Investigation Squad",
        "investigator": {
            "name": "Detective Sarah Vance",
            "badge": "INV-9482",
            "unit": "Accident Reconstruction Unit",
            "contact": "svance@metro.gov"
        },
        "incident_overview": {
            "date": "October 24, 2026",
            "time": "19:42:15 EDT",
            "location": "Broadway & 4th Avenue, Metro District",
            "primary_classification": "Failure to Yield Right of Way / Permissive Turn Collision",
            "environmental_conditions": "Clear, dry pavement (f=0.72), artificial ambient street lighting active."
        },
        "executive_summary": "On October 24, 2026 at 19:42:15 EDT, a two-vehicle collision occurred at Broadway and 4th Avenue. Vehicle A (Honda Civic) initiated an eastbound-to-northbound left turn across westbound opposing lanes during a permissive amber phase. Vehicle B (Yamaha MT-09) was traveling westbound in the through lane. Multi-modal forensic evidence—including 10Hz CAN-bus telemetry, trailing dashcam footage, and bystander accounts—confirms that Vehicle B was traveling at 46.8 mph (exceeding the 35 mph speed limit by 11.8 mph) but executed emergency braking 1.2 seconds prior to impact, reducing speed to 28.4 mph at the point of collision. Vehicle A's driver's statement asserting that the motorcycle was travelling at 65-70 mph with extinguished headlights is conclusively refuted by digital sensor records and video analysis. Primary contributing factor: Vehicle A failed to yield right of way to approaching through-traffic on a permissive signal. Secondary contributing factor: Vehicle B exceeded the posted speed limit by 11.8 mph prior to perception-reaction braking.",
        "evidence_inventory": [
            {"id": "EVID-VID-01", "type": "Video / Dashcam", "source": "Vehicle C Trailing Fleet Camera (1080p 30fps)", "hash": "sha256:e3b0c442...", "weight": "High (Direct Photographic)"},
            {"id": "EVID-WIT-01", "type": "Witness Statement", "source": "Marcus Rivera (Driver of Vehicle A)", "hash": "sha256:4f81c9a...", "weight": "Subjective / Refuted Claims"},
            {"id": "EVID-WIT-02", "type": "Witness Statement", "source": "Dave Chen (Independent Pedestrian Bystander)", "hash": "sha256:9a32df1...", "weight": "Moderate-High (Independent Corroboration)"},
            {"id": "EVID-SNS-01", "type": "Sensor Telemetry", "source": "Vehicle B Onboard CAN-bus & 10Hz GPS", "hash": "sha256:7f83b16...", "weight": "High (Objective Micro-Telemetry)"}
        ],
        "contradiction_summary": [
            {
                "code": "CR-01-SPD",
                "finding": "Vehicle A Driver claimed motorcycle traveled at 65-70 mph. Telemetry proves 46.8 mph pre-braking, 28.4 mph at impact.",
                "status": "Refuted Subjective Claim"
            },
            {
                "code": "CR-02-LGT",
                "finding": "Vehicle A Driver claimed motorcycle headlights were extinguished. Dashcam and independent witness prove factory LED headlights were on.",
                "status": "Refuted Subjective Claim"
            },
            {
                "code": "CR-03-SIG",
                "finding": "Vehicle A Driver claimed protected arrow. Metro DOT log confirms permissive yellow with statutory duty to yield.",
                "status": "Refuted Subjective Claim"
            }
        ],
        "vehicle_dynamics": {
            "vehicle_a": {
                "initial_speed": "22.0 mph",
                "turn_entry_speed": "14.2 mph",
                "impact_speed": "14.0 mph",
                "reaction_braking": "Negligible pre-impact braking detected; continued through turn arc"
            },
            "vehicle_b": {
                "initial_speed": "46.8 mph (exceeding 35 mph limit)",
                "perception_reaction_time": "0.7 seconds (19:42:13.1 to 19:42:13.8)",
                "peak_braking_deceleration": "-0.82 g (front brake pressure 154 PSI)",
                "impact_speed": "28.4 mph",
                "speed_reduction": "-18.4 mph dissipated through braking friction"
            }
        },
        "limitations": [
            "1.8-second municipal CCTV network frame drop required reliance on trailing civilian dashcam for turn initiation angle.",
            "Vehicle A OBD-II lacked high-resolution steering angle logging, requiring optical flow trajectory tracking.",
            "Post-impact motorcycle roll distance estimated using photogrammetric survey and friction coefficient assumptions (f=0.55 on side fairing)."
        ],
        "extracted_observations": [
            {"description": "Traffic signal on Broadway entered amber phase at 19:42:11.800.", "timestamp_str": "19:42:11.800", "confidence_score": 0.98},
            {"description": "Vehicle A (Sedan) initiated left turn at 14.2 mph across westbound lane at 19:42:13.100.", "timestamp_str": "19:42:13.100", "confidence_score": 0.96},
            {"description": "Vehicle B (Motorcycle) factory LED projector beam illuminated throughout approach (Frame #126).", "timestamp_str": "19:42:13.800", "confidence_score": 0.97},
            {"description": "Vehicle B applied 154 PSI hydraulic brake pressure at 19:42:14.200 producing -0.82g deceleration.", "timestamp_str": "19:42:14.200", "confidence_score": 0.99}
        ],
        "witness_claims": [
            {"witness_name": "Marcus Rivera (Driver A)", "claim": "Claimed motorcycle traveled at 65-70 mph with extinguished headlights on yellow arrow."},
            {"witness_name": "Dave Chen (Pedestrian)", "claim": "Observed motorcycle cruising at 30-35 mph with active headlight; Sedan turned suddenly without signal."}
        ],
        "chronological_timeline": timeline_events,
        "contradictions": contradictions,
        "evidence_gaps": evidence_gaps,
        "vehicle_movement_reconstruction": {
            "summary": "Westbound through-approach vs eastbound-to-northbound left turn arc.",
            "impact_speed_assessment": "Motorcycle approach velocity: 46.8 MPH; Deceleration work done: -18.4 MPH (-0.82g); Net impact speed: 28.4 MPH. Sedan left turn arc speed: 14.0 MPH."
        },
        "confidence_assessment": {
            "overall_reliability": "High (Multi-modal Sensor & Photographic Ground Truth)",
            "telemetry_confidence": "99.2% (Calibrated Onboard Sensor/CAN Bus)",
            "video_tracking_confidence": "95.4% (YOLO Object Detection & Optical Flow)",
            "eyewitness_consistency_index": "42.0% (Driver Claim Refuted by Objective Telemetry)",
            "methodology": "Confidence is calculated as an empirical multi-source agreement metric. Objective electronic records and verified optical frames receive highest confidence weights."
        },
        "investigator_review_notes": "All contradictions highlighted by the AccidentIQ platform were reviewed against raw logs. The speed of the through vehicle was conclusively established by digital telemetry, refuting opposing claims. Case forwarded for statutory violation review.",
        "disclaimer": "This report is an AI-assisted analysis of the supplied evidence. Findings are provisional, probabilistic, and derived from algorithmic cross-correlation of available sensor, video, and textual data. This document does not determine legal liability or criminal guilt, and must be reviewed and certified by qualified, certified accident reconstruction investigators in accordance with judicial standards."
    }

    cursor.execute("""
    INSERT INTO reports (
        id, case_id, report_id, title, content_json, investigator_name, badge_number, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "rep_01",
        case_id,
        "REP-2026-MCIS-0849X",
        "Comprehensive AI Forensic Reconstruction & Evidence Corroboration Report",
        json.dumps(report_content),
        "Detective Sarah Vance",
        "INV-9482",
        now
    ))

    return case_id


def seed_demo_case_2(cursor):
    case_id = "case_demo_2026_ped01"
    case_number = "CRASH-2026-0219P"

    cursor.execute("SELECT id FROM cases WHERE id = ?", (case_id,))
    if cursor.fetchone():
        return case_id

    now = datetime.now().isoformat()

    participants = [
        {
            "id": "veh_a_suv",
            "participant_type": "Car",
            "vehicle_type": "SUV",
            "make_model": "2025 Tesla Model Y Long Range",
            "color": "Quicksilver Metallic",
            "license_plate": "8EVX402",
            "driver_name": "Jonathan Miller (Age 42)",
            "movement_state": "Driving through mid-block corridor",
            "status": "Front bumper lower grille deformation, active hood pyrotechnic actuator deployed",
            "color_hex": "#38bdf8"
        },
        {
            "id": "ped_b_priya",
            "participant_type": "Pedestrian",
            "vehicle_type": "Pedestrian",
            "make_model": "Pedestrian",
            "color": "Yellow Raincoat & Dark Trousers",
            "license_plate": "N/A",
            "driver_name": "Priya Sharma (Age 23)",
            "movement_state": "Crossing the road",
            "status": "Lower left leg fracture, thoracic contusion",
            "color_hex": "#f43f5e"
        }
    ]

    cursor.execute("""
    INSERT INTO cases (
        id, case_number, title, accident_date, accident_time, location,
        description, vehicles_json, status, weather, road_condition,
        speed_limit_mph, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        case_id,
        case_number,
        "Pedestrian Impact: Electric SUV vs Pedestrian at Signalized Mid-Block Zebra Crossing",
        "2026-10-21",
        "18:15:30 EDT",
        "Pine Street & 7th Avenue (Mid-block Signalized Pedestrian Crossing)",
        "Direct vehicle-pedestrian impact at marked crosswalk equipped with pedestrian countdown signals. Vehicle A (Tesla Model Y) traveling westbound on Pine Street struck Pedestrian B (Priya Sharma) traversing south-to-north in the marked crosswalk. Severe dispute regarding pedestrian walk signal state, vehicle approach speed in a 25 MPH school/transit corridor, and driver reaction latency on damp pavement.",
        json.dumps(participants),
        "Analysis In Progress",
        "Rain / Wet Roadway",
        "Wet Asphalt (Friction coeff: ~0.52)",
        25,
        now,
        now
    ))

    # Evidence Items
    evid_vid_id = "evid_ped_vid_01"
    evid_wit1_id = "evid_ped_wit_01"
    evid_wit2_id = "evid_ped_wit_02"
    evid_sns_id = "evid_ped_sns_01"

    # Evidence 1: Municipal CCTV
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_vid_id,
        case_id,
        "video",
        "cctv_pine_crossing_01.mp4",
        "Municipal_CCTV_Cam14_Pine_7th.mp4",
        "sha256:7b42f63810a9c68a913bc540f28873ad9989b531dc1ef6b24501a97d956a310c",
        15928100,
        "Municipal Traffic Camera #14 (Pine & 7th, 1080p 30fps)",
        json.dumps({
            "duration_sec": 14.0,
            "fps": 30.0,
            "resolution": "1920x1080",
            "codec": "H.264 / RTSP",
            "view_angle": "Overhead East-facing 90° FOV directly overlooking zebra crossing",
            "camera_sync_offset_ms": 0,
            "yolo_detections_count": 360,
            "frames": [
                {
                    "frame_idx": 30,
                    "timestamp_str": "18:15:26.000",
                    "time_sec": 1.0,
                    "description": "Pedestrian countdown signal activates illuminated Walking Person symbol. Pedestrian in bright yellow raincoat steps into crosswalk.",
                    "detections": [
                        {"label": "Pedestrian (Priya)", "confidence": 0.98, "bbox": [370, 560, 410, 640], "color": "#f43f5e"},
                        {"label": "Pedestrian Signal (WALK)", "confidence": 0.99, "bbox": [330, 280, 360, 320], "color": "#ffffff"}
                    ]
                },
                {
                    "frame_idx": 95,
                    "timestamp_str": "18:15:28.150",
                    "time_sec": 3.15,
                    "description": "Pedestrian reaches center lane divider. Silver SUV enters upper camera quadrant traveling west without noticeable deceleration.",
                    "detections": [
                        {"label": "SUV (Vehicle A)", "confidence": 0.97, "bbox": [710, 390, 830, 480], "color": "#38bdf8"},
                        {"label": "Pedestrian (Priya)", "confidence": 0.96, "bbox": [380, 480, 415, 550], "color": "#f43f5e"}
                    ]
                },
                {
                    "frame_idx": 138,
                    "timestamp_str": "18:15:29.600",
                    "time_sec": 4.6,
                    "description": "SUV nose dips as emergency braking activates approximately 12 meters prior to zebra crosswalk.",
                    "detections": [
                        {"label": "Braking Pitch Dip", "confidence": 0.92, "bbox": [480, 395, 600, 475], "color": "#ef4444"}
                    ]
                },
                {
                    "frame_idx": 156,
                    "timestamp_str": "18:15:30.200",
                    "time_sec": 5.2,
                    "description": "Impact occurred: Front bumper center-right strikes pedestrian. Pedestrian thrown onto hood before sliding forward.",
                    "detections": [
                        {"label": "Impact Contact Point", "confidence": 0.99, "bbox": [375, 410, 450, 470], "color": "#f43f5e"}
                    ]
                }
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 2: Witness Statement (Driver Miller)
    witness_miller_text = """I was driving west on Pine Street heading home from work. It was raining and dark, but I was keeping my speed down to maybe 20 miles per hour, definitely well below the 25 limit. As I approached the 7th Avenue crosswalk, there was a parked delivery van on the curb obscuring the sidewalk. Suddenly, out of nowhere, a pedestrian wearing dark clothes darted out into the street right in front of me! The pedestrian signal was clearly displaying a solid red Don't Walk hand. I immediately slammed on my brakes, but the wet asphalt caused my car to slide and tap her."""
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_wit1_id,
        case_id,
        "witness",
        "statement_driver_miller.txt",
        "Driver_Miller_Sworn_Statement.txt",
        "sha256:39a1c4987f2b1d09e992b8d4380a18205fbc0629738d8719bc45009aef82312d",
        1820,
        "Driver Vehicle A (Jonathan Miller, Recorded 18:45 EDT)",
        json.dumps({
            "witness_name": "Jonathan Miller",
            "vantage_point": "Operator seat inside Vehicle A",
            "character_count": len(witness_miller_text),
            "word_count": len(witness_miller_text.split()),
            "extracted_claims": [
                {
                    "claim": "Claimed operating speed below 20 mph",
                    "span": "20 miles per hour, definitely well below the 25 limit",
                    "type": "speed_claim",
                    "subject": "vehicle",
                    "confidence": 0.85
                },
                {
                    "claim": "Asserted pedestrian signal displayed red Don't Walk",
                    "span": "pedestrian signal was clearly displaying a solid red Don't Walk hand",
                    "type": "traffic_control_claim",
                    "subject": "signal",
                    "confidence": 0.90
                },
                {
                    "claim": "Claimed pedestrian darted out suddenly from behind van",
                    "span": "pedestrian wearing dark clothes darted out into the street",
                    "type": "maneuver_claim",
                    "subject": "pedestrian",
                    "confidence": 0.82
                }
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 3: Witness Statement (Barista Mateo)
    witness_mateo_text = """I work as a barista at Pine Street Roasters right at the corner of 7th. I was wiping down the front counter looking out the large street window. I noticed the young woman in the bright bright yellow raincoat pressing the pedestrian button. The white walking man illuminated, and she began walking across the zebra crossing normally, not running at all. Then I heard an electric motor whine and tires hissing on the wet pavement. This silver SUV was definitely flying down Pine Street, doing at least 30 to 35 mph. The driver didn't brake until he was right on top of her. He never stood a chance of stopping in time on that wet road."""
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_wit2_id,
        case_id,
        "witness",
        "statement_barista_mateo.txt",
        "Eyewitness_Mateo_Gomez.txt",
        "sha256:1a84f50937c981b37b420f1883c489721ad432014605ea4b09c85175928ea499",
        1940,
        "Independent Bystander (Mateo Gomez, Pine St Roasters)",
        json.dumps({
            "witness_name": "Mateo Gomez",
            "vantage_point": "Elevated unobstructed window, 15m northeast of crosswalk",
            "character_count": len(witness_mateo_text),
            "word_count": len(witness_mateo_text.split()),
            "extracted_claims": [
                {
                    "claim": "Observed illuminated white walk signal",
                    "span": "The white walking man illuminated, and she began walking across the zebra crossing normally",
                    "type": "traffic_control_claim",
                    "subject": "signal",
                    "confidence": 0.94
                },
                {
                    "claim": "Estimated vehicle speed 30 to 35 mph",
                    "span": "doing at least 30 to 35 mph",
                    "type": "speed_claim",
                    "subject": "vehicle",
                    "confidence": 0.86
                },
                {
                    "claim": "Noted late emergency braking on wet road",
                    "span": "The driver didn't brake until he was right on top of her",
                    "type": "braking_claim",
                    "subject": "braking",
                    "confidence": 0.91
                }
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 4: Vehicle Telemetry CSV
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_sns_id,
        case_id,
        "sensor",
        "tesla_modely_canbus_log.csv",
        "Tesla_ModelY_EDR_Log_20261021.csv",
        "sha256:88fa2b109312c4ef8919a3b70821038e21974bb920f3a612503d8b12f716298a",
        94280,
        "Vehicle A Onboard Telematics & Autopilot Log (50Hz)",
        json.dumps({
            "total_records": 700,
            "max_speed_mph": 31.8,
            "min_speed_mph": 0.0,
            "avg_speed_mph": 27.4,
            "has_braking_event": True,
            "braking_timestamp": "18:15:29.600",
            "anomalies": [
                {
                    "type": "Speed Limit Exceedance",
                    "timestamp": "18:15:25.000 — 18:15:29.500",
                    "detail": "Vehicle sustained 31.5 to 31.8 MPH in a posted 25 MPH school/pedestrian transit corridor."
                },
                {
                    "type": "Late Autonomous Emergency Braking (AEB) / Driver Brake Trigger",
                    "timestamp": "18:15:29.600",
                    "detail": "Brake pressure rose from 0 to 88 PSI producing -0.62g deceleration on wet surface only 0.6 seconds prior to bumper contact."
                }
            ],
            "chart_data": [
                {"timestamp": "18:15:25.0", "speed": 31.5, "brake": 0.0, "throttle": 22.0, "accel": 0.02},
                {"timestamp": "18:15:26.0", "speed": 31.8, "brake": 0.0, "throttle": 22.0, "accel": 0.01},
                {"timestamp": "18:15:27.0", "speed": 31.7, "brake": 0.0, "throttle": 21.0, "accel": -0.01},
                {"timestamp": "18:15:28.0", "speed": 31.6, "brake": 0.0, "throttle": 21.0, "accel": 0.00},
                {"timestamp": "18:15:29.0", "speed": 31.4, "brake": 0.0, "throttle": 15.0, "accel": -0.05},
                {"timestamp": "18:15:29.6", "speed": 29.8, "brake": 55.0, "throttle": 0.0, "accel": -0.45},
                {"timestamp": "18:15:30.0", "speed": 21.2, "brake": 88.0, "throttle": 0.0, "accel": -0.62},
                {"timestamp": "18:15:30.2", "speed": 16.4, "brake": 92.0, "throttle": 0.0, "accel": -0.58},
                {"timestamp": "18:15:31.0", "speed": 0.0, "brake": 95.0, "throttle": 0.0, "accel": -0.10}
            ]
        }),
        "Analyzed",
        now
    ))

    # Timeline Events
    timeline_events = [
        {
            "id": "evt_ped_01",
            "timestamp_str": "18:15:25.200",
            "timestamp_sec": 25.2,
            "vehicle_id": "ped_b_priya",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Pedestrian signal controller actuates pedestrian phase: Solid DON'T WALK terminates; Illuminated WALK icon engages.",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {"source": "Municipal Signal Phase Log", "evidence_id": evid_vid_id}
        },
        {
            "id": "evt_ped_02",
            "timestamp_str": "18:15:26.000",
            "timestamp_sec": 26.0,
            "vehicle_id": "ped_b_priya",
            "event_type": "video_observation",
            "observation_type": "direct_observation",
            "description": "Pedestrian Priya Sharma steps onto south curb of zebra crosswalk wearing high-visibility yellow raincoat.",
            "confidence_score": 0.98,
            "confidence_label": "High",
            "supporting_ref": {"source": "CCTV Cam #14 Frame #30", "evidence_id": evid_vid_id}
        },
        {
            "id": "evt_ped_03",
            "timestamp_str": "18:15:27.500",
            "timestamp_sec": 27.5,
            "vehicle_id": "veh_a_suv",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Vehicle A (Model Y) cruises westbound on Pine St at 31.7 MPH, 6.7 MPH above the 25 MPH corridor limit.",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {"source": "CAN-Bus Speed PID", "evidence_id": evid_sns_id}
        },
        {
            "id": "evt_ped_04",
            "timestamp_str": "18:15:28.150",
            "timestamp_sec": 28.15,
            "vehicle_id": "ped_b_priya",
            "event_type": "video_observation",
            "observation_type": "direct_observation",
            "description": "Pedestrian crosses centerline lane marking at steady walking velocity of 3.1 MPH (1.4 m/s).",
            "confidence_score": 0.96,
            "confidence_label": "High",
            "supporting_ref": {"source": "CCTV Cam #14 Frame #95", "evidence_id": evid_vid_id}
        },
        {
            "id": "evt_ped_05",
            "timestamp_str": "18:15:29.000",
            "timestamp_sec": 29.0,
            "vehicle_id": "veh_a_suv",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Driver lifts throttle pedal from 21% to 15% (perception-reaction onset). No brake application.",
            "confidence_score": 0.98,
            "confidence_label": "High",
            "supporting_ref": {"source": "CAN Throttle Position Sensor", "evidence_id": evid_sns_id}
        },
        {
            "id": "evt_ped_06",
            "timestamp_str": "18:15:29.600",
            "timestamp_sec": 29.6,
            "vehicle_id": "veh_a_suv",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Braking initiated: Hydraulic pressure surges to 88 PSI, yielding -0.62g longitudinal deceleration on wet asphalt.",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {"source": "Brake Master Cylinder Pressure Transducer", "evidence_id": evid_sns_id}
        },
        {
            "id": "evt_ped_07",
            "timestamp_str": "18:15:30.200",
            "timestamp_sec": 30.2,
            "vehicle_id": "veh_a_suv",
            "event_type": "contradiction",
            "observation_type": "kinematic_inference",
            "description": "Primary Point of Impact: Vehicle A strikes Pedestrian B in crosswalk at residual speed of 16.4 MPH.",
            "confidence_score": 0.97,
            "confidence_label": "High",
            "supporting_ref": {"source": "CCTV Frame #156 & Accelerometer Spike", "evidence_id": evid_sns_id}
        },
        {
            "id": "evt_ped_08",
            "timestamp_str": "18:15:31.000",
            "timestamp_sec": 31.0,
            "vehicle_id": "veh_a_suv",
            "event_type": "video_observation",
            "observation_type": "direct_observation",
            "description": "Vehicle A comes to a complete halt 4.8 meters west of crosswalk; Pedestrian rests 3.2m forward of bumper.",
            "confidence_score": 0.95,
            "confidence_label": "High",
            "supporting_ref": {"source": "CCTV Frame #180", "evidence_id": evid_vid_id}
        }
    ]

    for evt in timeline_events:
        cursor.execute("""
        INSERT INTO events (
            id, case_id, evidence_id, timestamp_str, timestamp_seconds,
            vehicle_id, event_type, description, observation_type,
            confidence_score, confidence_label, supporting_ref_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            evt["id"],
            case_id,
            evt["supporting_ref"].get("evidence_id"),
            evt["timestamp_str"],
            evt["timestamp_sec"],
            evt["vehicle_id"],
            evt["event_type"],
            evt["description"],
            evt["observation_type"],
            evt["confidence_score"],
            evt["confidence_label"],
            json.dumps(evt["supporting_ref"]),
            now
        ))

    # Contradictions
    contradictions = [
        {
            "id": "ctrd_ped_01",
            "contradiction_code": "CR-02-WLK",
            "title": "Pedestrian Crosswalk Signal Status Discrepancy",
            "claim_a": {
                "source": "Jonathan Miller (Driver Vehicle A)",
                "evidence_id": evid_wit1_id,
                "text": "Claimed pedestrian signal was clearly displaying a solid red Don't Walk hand",
                "type": "Driver Defense Claim",
                "confidence_score": 0.25
            },
            "claim_b": {
                "source": "Municipal CCTV Cam #14 & Independent Witness (Mateo Gomez)",
                "evidence_id": evid_vid_id,
                "text": "Confirmed pedestrian entered crosswalk with illuminated White Walk symbol active for 4.8 seconds prior to collision",
                "type": "Video Ground Truth & Corroborated Eye Witness",
                "confidence_score": 0.98
            },
            "time_interval": "18:15:25.200 — 18:15:30.200",
            "explanation": "Driver Miller asserts pedestrian crossed illegally against a red hand. Municipal traffic camera video and corner eyewitness conclusively prove the pedestrian phase was active with an illuminated Walk symbol.",
            "severity": "Critical",
            "review_status": "Verified Contradiction",
            "evidence_links": [evid_wit1_id, evid_vid_id, evid_wit2_id]
        },
        {
            "id": "ctrd_ped_02",
            "contradiction_code": "CR-02-SPD",
            "title": "Approach Speed in Pedestrian Transit Corridor",
            "claim_a": {
                "source": "Jonathan Miller (Driver Vehicle A)",
                "evidence_id": evid_wit1_id,
                "text": "Asserted speed was maybe 20 mph, definitely well below the 25 limit",
                "type": "Driver Self-Report",
                "confidence_score": 0.30
            },
            "claim_b": {
                "source": "Tesla Model Y Calibrated Onboard CAN Telemetry",
                "evidence_id": evid_sns_id,
                "text": "Recorded sustained cruising speed of 31.5 to 31.8 MPH in posted 25 MPH corridor",
                "type": "Calibrated Electronic Sensor Record",
                "confidence_score": 0.99
            },
            "time_interval": "Pre-impact approach window (18:15:25 — 18:15:29.6)",
            "explanation": "Driver claimed he was traveling below 20 mph due to rain. Calibrated electronic CAN telemetry confirms vehicle was operating at 31.8 mph (exceeding the speed limit) until late emergency braking was initiated 0.6s prior to contact.",
            "severity": "Critical",
            "review_status": "Verified Contradiction",
            "evidence_links": [evid_wit1_id, evid_sns_id]
        }
    ]

    for ctrd in contradictions:
        cursor.execute("""
        INSERT INTO contradictions (
            id, case_id, contradiction_code, title, claim_a_json, claim_b_json,
            time_interval, explanation, severity, review_status, evidence_links_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ctrd["id"],
            case_id,
            ctrd["contradiction_code"],
            ctrd["title"],
            json.dumps(ctrd["claim_a"]),
            json.dumps(ctrd["claim_b"]),
            ctrd["time_interval"],
            ctrd["explanation"],
            ctrd["severity"],
            ctrd["review_status"],
            json.dumps(ctrd["evidence_links"]),
            now
        ))

    # Evidence Gaps
    evidence_gaps = [
        {
            "id": "gap_ped_01",
            "gap_type": "Optical Occlusion",
            "title": "Wet Windshield Optical Rain Glare",
            "description": "Windshield wiper interval created brief 0.8-second optical streak across forward-facing cabin camera between 18:15:28.400 and 18:15:29.200, partially obscuring forward driver viewpoint perception.",
            "time_interval": "18:15:28.400 — 18:15:29.200 (0.8s)",
            "severity": "Low",
            "status": "Compensated by Overhead Municipal CCTV Camera #14"
        }
    ]

    for gap in evidence_gaps:
        cursor.execute("""
        INSERT INTO evidence_gaps (
            id, case_id, gap_type, title, description, time_interval, severity, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            gap["id"],
            case_id,
            gap["gap_type"],
            gap["title"],
            gap["description"],
            gap["time_interval"],
            gap["severity"],
            gap["status"],
            now
        ))

    # Trajectories
    # SUV traveling Westbound: X decreases from 720 to 330 along Y: 420
    # Pedestrian walking Northbound across Zebra Crossing: X: 380, Y decreases from 560 to 420
    suv_points = [
        {"timestamp_sec": 25.0, "timestamp_str": "18:15:25.000", "x": 720, "y": 420, "speed_mph": 31.5, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "CAN-Bus GPS"},
        {"timestamp_sec": 26.0, "timestamp_str": "18:15:26.000", "x": 645, "y": 420, "speed_mph": 31.8, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "CAN-Bus GPS"},
        {"timestamp_sec": 27.0, "timestamp_str": "18:15:27.000", "x": 570, "y": 420, "speed_mph": 31.7, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "CAN-Bus GPS"},
        {"timestamp_sec": 28.0, "timestamp_str": "18:15:28.000", "x": 495, "y": 420, "speed_mph": 31.6, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "CCTV Visual Track"},
        {"timestamp_sec": 29.0, "timestamp_str": "18:15:29.000", "x": 435, "y": 420, "speed_mph": 31.4, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "Throttle Release"},
        {"timestamp_sec": 29.6, "timestamp_str": "18:15:29.600", "x": 405, "y": 420, "speed_mph": 29.8, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.5, "evidence_source": "Brake Line Pressure Spike (88 PSI)"},
        {"timestamp_sec": 30.2, "timestamp_str": "18:15:30.200", "x": 380, "y": 420, "speed_mph": 16.4, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.5, "evidence_source": "Collision Contact with Pedestrian"},
        {"timestamp_sec": 31.0, "timestamp_str": "18:15:31.000", "x": 330, "y": 420, "speed_mph": 0.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Final Rest Position"}
    ]

    pedestrian_points = [
        {"timestamp_sec": 25.0, "timestamp_str": "18:15:25.000", "x": 380, "y": 575, "speed_mph": 0.0, "heading_deg": 0, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Waiting at Curb"},
        {"timestamp_sec": 26.0, "timestamp_str": "18:15:26.000", "x": 380, "y": 555, "speed_mph": 3.1, "heading_deg": 0, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "CCTV Foot Step Initiation"},
        {"timestamp_sec": 27.0, "timestamp_str": "18:15:27.000", "x": 380, "y": 520, "speed_mph": 3.1, "heading_deg": 0, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "CCTV Crosswalk Tracking"},
        {"timestamp_sec": 28.0, "timestamp_str": "18:15:28.000", "x": 380, "y": 485, "speed_mph": 3.1, "heading_deg": 0, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "CCTV Centerline Crossing"},
        {"timestamp_sec": 29.0, "timestamp_str": "18:15:29.000", "x": 380, "y": 450, "speed_mph": 3.1, "heading_deg": 0, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "CCTV Travel Lane 1"},
        {"timestamp_sec": 30.2, "timestamp_str": "18:15:30.200", "x": 380, "y": 420, "speed_mph": 0.0, "heading_deg": 0, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "Impact Point in Crosswalk"},
        {"timestamp_sec": 31.0, "timestamp_str": "18:15:31.000", "x": 355, "y": 415, "speed_mph": 0.0, "heading_deg": 0, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "Pedestrian Final Rest"}
    ]

    cursor.execute("""
    INSERT INTO trajectories (id, case_id, vehicle_id, vehicle_name, color_hex, points_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "traj_ped_suv",
        case_id,
        "veh_a_suv",
        "2025 Tesla Model Y (Vehicle A)",
        "#38bdf8",
        json.dumps(suv_points),
        now
    ))

    cursor.execute("""
    INSERT INTO trajectories (id, case_id, vehicle_id, vehicle_name, color_hex, points_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "traj_ped_person",
        case_id,
        "ped_b_priya",
        "Priya Sharma (Pedestrian)",
        "#f43f5e",
        json.dumps(pedestrian_points),
        now
    ))

    # Pre-generated Report
    report_content = {
        "report_id": "REP-2026-MCIS-0219P",
        "case_information": {
            "case_number": case_number,
            "title": "Pedestrian Impact: Electric SUV vs Pedestrian at Signalized Mid-Block Zebra Crossing",
            "date": "2026-10-21",
            "time": "18:15:30 EDT",
            "location": "Pine Street & 7th Avenue (Mid-block Signalized Pedestrian Crossing)",
            "speed_limit": "25 MPH",
            "environmental_conditions": "Rain / Wet Roadway (µ = 0.52)",
            "vehicles_involved": participants
        },
        "executive_summary": "Forensic reconstruction of a vehicle-pedestrian collision occurring at a marked crosswalk on Pine Street. Electronic telematics, municipal CCTV footage, and eyewitness testimonies were fused to determine right-of-way compliance and impact dynamics. The investigation established that the pedestrian entered the crosswalk on an active illuminated Walk signal. Vehicle A entered the school corridor traveling 31.8 MPH (exceeding the 25 MPH posted limit) on wet pavement, failing to yield and initiating emergency braking only 0.6 seconds prior to impact.",
        "evidence_inventory": [
            {"evidence_id": evid_vid_id, "type": "video", "source_label": "Municipal CCTV Camera #14 (Pine & 7th)", "file_hash": "sha256:7b42f63810a9c68a...", "status": "Analyzed"},
            {"evidence_id": evid_wit1_id, "type": "witness", "source_label": "Driver Vehicle A (Jonathan Miller)", "file_hash": "sha256:39a1c4987f2b1d09...", "status": "Analyzed"},
            {"evidence_id": evid_wit2_id, "type": "witness", "source_label": "Independent Bystander (Mateo Gomez)", "file_hash": "sha256:1a84f50937c981b3...", "status": "Analyzed"},
            {"evidence_id": evid_sns_id, "type": "sensor", "source_label": "Vehicle A Onboard Telematics & Autopilot Log", "file_hash": "sha256:88fa2b109312c4ef...", "status": "Analyzed"}
        ],
        "extracted_observations": [
            {"description": "Pedestrian walk countdown controller activated illuminated walk symbol at 18:15:25.200.", "timestamp_str": "18:15:25.200", "confidence_score": 0.99},
            {"description": "Pedestrian Priya Sharma stepped onto crosswalk at 18:15:26.000 wearing high-visibility yellow coat.", "timestamp_str": "18:15:26.000", "confidence_score": 0.98},
            {"description": "Vehicle A approached at 31.8 mph without deceleration until 0.6s prior to zebra crosswalk.", "timestamp_str": "18:15:29.600", "confidence_score": 0.99},
            {"description": "Impact occurred at 16.4 mph with front bumper contacting pedestrian.", "timestamp_str": "18:15:30.200", "confidence_score": 0.97}
        ],
        "witness_claims": [
            {"witness_name": "Jonathan Miller (Driver A)", "claim": "Asserted pedestrian darted out on red Don't Walk signal while he drove below 20 mph."},
            {"witness_name": "Mateo Gomez (Bystander)", "claim": "Observed pedestrian walking calmly on white walk signal; SUV was speeding at 30-35 mph and braked too late."}
        ],
        "chronological_timeline": timeline_events,
        "contradictions": contradictions,
        "evidence_gaps": evidence_gaps,
        "vehicle_movement_reconstruction": {
            "summary": "Westbound approach along Pine Street with south-to-north crosswalk traversal.",
            "impact_speed_assessment": "Vehicle A approach velocity: 31.8 MPH; Deceleration work done: -15.4 MPH (-0.62g); Net impact speed: 16.4 MPH."
        },
        "confidence_assessment": {
            "overall_reliability": "High (Direct Overhead Video & Calibrated CAN Bus)",
            "telemetry_confidence": "99.1% (High-frequency Tesla EDR Log)",
            "video_tracking_confidence": "97.5% (Overhead Municipal CCTV Cam #14)",
            "eyewitness_consistency_index": "25.0% (Driver claim contradicted by all objective streams)",
            "methodology": "Video timestamps synchronized with municipal traffic signal controller phase logs and CAN-bus velocity curves."
        },
        "limitations": [
            "Rain glare on vehicle forward camera momentarily reduced vision object classification confidence before impact.",
            "Wet asphalt coefficient estimated at 0.52 based on regional standard wet roadway parameters."
        ],
        "investigator_review_notes": "Driver's defense of a red pedestrian signal is entirely disproven by independent video and signal phase logging. Furthermore, excessive corridor speed in wet conditions was the determining proximate cause.",
        "disclaimer": "This report is an AI-assisted forensic analysis of supplied digital evidence. Findings are provisional, evidence-linked, and probabilistic."
    }

    cursor.execute("""
    INSERT INTO reports (
        id, case_id, report_id, title, content_json, investigator_name, badge_number, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "rep_ped_01",
        case_id,
        "REP-2026-MCIS-0219P",
        "Comprehensive AI Forensic Reconstruction & Pedestrian Collision Analysis Report",
        json.dumps(report_content),
        "Detective Sarah Vance",
        "INV-9482",
        now
    ))

    return case_id


def seed_demo_case_3(cursor):
    case_id = "case_demo_2026_multi01"
    case_number = "CRASH-2026-0572M"

    cursor.execute("SELECT id FROM cases WHERE id = ?", (case_id,))
    if cursor.fetchone():
        return case_id

    now = datetime.now().isoformat()

    vehicles = [
        {
            "id": "veh_a_lead",
            "participant_type": "Car",
            "vehicle_type": "Sedan",
            "make_model": "2022 Toyota Corolla LE",
            "color": "Celestial Gray",
            "license_plate": "6TYP182",
            "driver_name": "David Kim (Age 31)",
            "movement_state": "Halted in traffic lane",
            "status": "Severe rear-end trunk deformation and exhaust displacement",
            "color_hex": "#10b981"
        },
        {
            "id": "veh_b_mid",
            "participant_type": "Car",
            "vehicle_type": "Hatchback",
            "make_model": "2024 Volkswagen Golf GTI",
            "color": "Tornado Red",
            "license_plate": "GTI-8831",
            "driver_name": "Chloe Bennett (Age 26)",
            "movement_state": "Decelerated and stopped behind Lead Vehicle",
            "status": "Total loss: severe rear structural crush, frontal radiator collapse, side curtain airbags deployed",
            "color_hex": "#ef4444"
        },
        {
            "id": "veh_c_truck",
            "participant_type": "Truck",
            "vehicle_type": "Truck",
            "make_model": "2021 Freightliner M2 106 Box Truck",
            "color": "Arctic White / Fleet Livery",
            "license_plate": "COMM-49210",
            "driver_name": "Arthur Vance (Age 53)",
            "movement_state": "High-speed highway travel",
            "status": "Steel bumper deformation, bent steering tie rod, cracked fiberglass hood",
            "color_hex": "#f59e0b"
        }
    ]

    cursor.execute("""
    INSERT INTO cases (
        id, case_number, title, accident_date, accident_time, location,
        description, vehicles_json, status, weather, road_condition,
        speed_limit_mph, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        case_id,
        case_number,
        "Multi-Vehicle Chain Collision: Commercial Box Truck, Sedan, and Hatchback",
        "2026-10-18",
        "07:48:10 EDT",
        "State Highway 104 Westbound, Mile Marker 18.4",
        "Three-vehicle in-line chain reaction collision on high-speed dual carriageway during dense morning fog. Lead Vehicle A (Toyota Corolla) came to a controlled stop due to a stalled delivery van ahead. Middle Vehicle B (Volkswagen Golf GTI) decelerated smoothly and came to a complete halt 2.5 meters behind Vehicle A with active brake lamps. Trailing Vehicle C (Freightliner Box Truck) failed to decelerate in time, violently rear-ending Vehicle B at 43.1 MPH and propelling it forward into Vehicle A. Contradictions exist regarding middle vehicle brake light operation and truck following distance.",
        json.dumps(vehicles),
        "Analysis In Progress",
        "Dense Fog / Low Visibility (<100m)",
        "Damp Asphalt (Friction coeff: ~0.60)",
        45,
        now,
        now
    ))

    # Evidence Items
    evid_vid_id = "evid_multi_vid_01"
    evid_wit1_id = "evid_multi_wit_01"
    evid_wit2_id = "evid_multi_wit_02"
    evid_sns_id = "evid_multi_sns_01"

    # Evidence 1: Middle Vehicle Dual Dashcam
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_vid_id,
        case_id,
        "video",
        "golf_gti_dual_dashcam_rear.mp4",
        "Golf_GTI_Rear_Dashcam_Clip_0748.mp4",
        "sha256:9c12b847190f89e217823b10852e901f9284102837bcde019284a719281a0293",
        22410800,
        "Vehicle B Dual Dashcam (Rear-Facing 1080p 60fps)",
        json.dumps({
            "duration_sec": 18.0,
            "fps": 60.0,
            "resolution": "1920x1080",
            "codec": "H.265 / HEVC",
            "view_angle": "Rear-facing wide angle through back window",
            "camera_sync_offset_ms": 0,
            "yolo_detections_count": 520,
            "frames": [
                {
                    "frame_idx": 60,
                    "timestamp_str": "07:48:04.000",
                    "time_sec": 1.0,
                    "description": "Vehicle B initiates smooth deceleration behind Lead Vehicle A. Center high-mount brake light reflection visible.",
                    "detections": [
                        {"label": "Brake Reflection", "confidence": 0.98, "bbox": [400, 700, 560, 740], "color": "#ef4444"}
                    ]
                },
                {
                    "frame_idx": 240,
                    "timestamp_str": "07:48:07.000",
                    "time_sec": 4.0,
                    "description": "Vehicle B comes to complete standstill. Trailing commercial truck emerges from fog bank 45m behind, closing rapidly.",
                    "detections": [
                        {"label": "Freightliner Truck (Vehicle C)", "confidence": 0.95, "bbox": [390, 280, 580, 480], "color": "#f59e0b"}
                    ]
                },
                {
                    "frame_idx": 420,
                    "timestamp_str": "07:48:10.000",
                    "time_sec": 7.0,
                    "description": "Truck front grille impacts rear hatch of Vehicle B at high speed without tire smoke or anti-lock pulsation.",
                    "detections": [
                        {"label": "High-Speed Impact", "confidence": 0.99, "bbox": [320, 200, 640, 600], "color": "#ef4444"}
                    ]
                }
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 2: Truck Driver Statement
    witness_truck_text = """I was operating Freightliner Truck 106 westbound on Highway 104 with a 14,000 lb pallet load. There was patchy fog, but visibility was okay. Out of nowhere, the red Golf in front of me slammed on its brakes without any warning whatsoever. Their brake lights were completely dark and not working! I hit my air brakes the split second I saw their car looming in the fog, but a loaded rig on damp pavement cannot stop on a dime. I tried to steer into the shoulder, but there was no room."""
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_wit1_id,
        case_id,
        "witness",
        "statement_truck_driver_vance.txt",
        "Truck_Driver_Arthur_Vance_Statement.txt",
        "sha256:490219f8a018274be19284091823719283749018237491029384719283749102",
        1910,
        "Driver Vehicle C (Arthur Vance, Commercial Truck Operator)",
        json.dumps({
            "witness_name": "Arthur Vance",
            "vantage_point": "Elevated cab of commercial box truck",
            "character_count": len(witness_truck_text),
            "word_count": len(witness_truck_text.split()),
            "extracted_claims": [
                {
                    "claim": "Claimed Golf brake lights were dark and non-operational",
                    "span": "Their brake lights were completely dark and not working!",
                    "type": "equipment_claim",
                    "subject": "lighting",
                    "confidence": 0.88
                },
                {
                    "claim": "Claimed immediate brake application upon seeing vehicle",
                    "span": "I hit my air brakes the split second I saw their car looming in the fog",
                    "type": "braking_claim",
                    "subject": "braking",
                    "confidence": 0.84
                }
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 3: Middle Vehicle Driver Statement
    witness_chloe_text = """Traffic slowed down ahead because of a stalled truck in the right lane. The Toyota in front of me brought its hazard lights on and stopped gently. I pressed my brakes early, came to a very gentle stop about two car lengths behind him, and kept my foot firmly on the brake pedal. I looked in my rearview mirror and was horrified to see a massive white box truck barrelling toward me through the fog at full highway speed. He didn't even slow down before he crushed my car into the Corolla."""
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_wit2_id,
        case_id,
        "witness",
        "statement_driver_chloe.txt",
        "Chloe_Bennett_Witness_Statement.txt",
        "sha256:7192837491823749182374918237491823749182374918237491823749182374",
        1750,
        "Driver Vehicle B (Chloe Bennett, Golf GTI Operator)",
        json.dumps({
            "witness_name": "Chloe Bennett",
            "vantage_point": "Driver seat inside Vehicle B",
            "character_count": len(witness_chloe_text),
            "word_count": len(witness_chloe_text.split()),
            "extracted_claims": [
                {
                    "claim": "Asserted foot was firmly on brake pedal while stopped",
                    "span": "came to a very gentle stop about two car lengths behind him, and kept my foot firmly on the brake pedal",
                    "type": "braking_claim",
                    "subject": "braking",
                    "confidence": 0.92
                },
                {
                    "claim": "Claimed truck barreled forward at full speed without braking",
                    "span": "white box truck barrelling toward me through the fog at full highway speed. He didn't even slow down",
                    "type": "speed_qualitative",
                    "subject": "vehicle",
                    "confidence": 0.89
                }
            ]
        }),
        "Analyzed",
        now
    ))

    # Evidence 4: Commercial Fleet ELD & CAN Telematics
    cursor.execute("""
    INSERT INTO evidence (
        id, case_id, evidence_type, filename, original_name, file_hash,
        file_size_bytes, source_label, metadata_json, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        evid_sns_id,
        case_id,
        "sensor",
        "freightliner_fleet_eld_telematics.csv",
        "Freightliner_ELD_CAN_Log_20261018.csv",
        "sha256:1092837491827394817293847192837491827394817293847192837491827394",
        112400,
        "Freightliner M2 Commercial Fleet Telematics (J1939 CAN)",
        json.dumps({
            "total_records": 850,
            "max_speed_mph": 48.4,
            "min_speed_mph": 0.0,
            "avg_speed_mph": 46.2,
            "has_braking_event": True,
            "braking_timestamp": "07:48:09.300",
            "anomalies": [
                {
                    "type": "Excessive Speed in Severe Weather Condition",
                    "timestamp": "07:48:00.000 — 07:48:09.000",
                    "detail": "Truck operated at 48.2 MPH in dense fog (visibility < 100m, posted advisory speed 30 MPH)."
                },
                {
                    "type": "Delayed Perception-Reaction & Air Brake Onset",
                    "timestamp": "07:48:09.300",
                    "detail": "Air brake treadle valve was depressed only 0.7 seconds before impact, producing negligible deceleration before contact."
                }
            ],
            "chart_data": [
                {"timestamp": "07:48:02.0", "speed": 48.2, "brake": 0.0, "throttle": 45.0, "accel": 0.01},
                {"timestamp": "07:48:04.0", "speed": 48.4, "brake": 0.0, "throttle": 44.0, "accel": 0.00},
                {"timestamp": "07:48:06.0", "speed": 48.1, "brake": 0.0, "throttle": 42.0, "accel": -0.02},
                {"timestamp": "07:48:08.0", "speed": 47.8, "brake": 0.0, "throttle": 38.0, "accel": -0.04},
                {"timestamp": "07:48:09.0", "speed": 47.0, "brake": 0.0, "throttle": 10.0, "accel": -0.12},
                {"timestamp": "07:48:09.3", "speed": 46.2, "brake": 65.0, "throttle": 0.0, "accel": -0.32},
                {"timestamp": "07:48:10.0", "speed": 43.1, "brake": 98.0, "throttle": 0.0, "accel": -0.44},
                {"timestamp": "07:48:10.5", "speed": 18.0, "brake": 100.0, "throttle": 0.0, "accel": -1.80},
                {"timestamp": "07:48:12.0", "speed": 0.0, "brake": 100.0, "throttle": 0.0, "accel": 0.00}
            ]
        }),
        "Analyzed",
        now
    ))

    # Timeline Events
    timeline_events = [
        {
            "id": "evt_multi_01",
            "timestamp_str": "07:48:01.000",
            "timestamp_sec": 1.0,
            "vehicle_id": "veh_a_lead",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Lead Vehicle A (Toyota Corolla) initiates controlled braking due to stalled traffic in lane 1.",
            "confidence_score": 0.98,
            "confidence_label": "High",
            "supporting_ref": {"source": "Lead Driver Statement & Rear Dashcam", "evidence_id": evid_vid_id}
        },
        {
            "id": "evt_multi_02",
            "timestamp_str": "07:48:03.500",
            "timestamp_sec": 3.5,
            "vehicle_id": "veh_b_mid",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Middle Vehicle B (Golf GTI) detects deceleration ahead; driver Bennett applies progressive braking.",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {"source": "Dashcam Telemetry Overlays", "evidence_id": evid_vid_id}
        },
        {
            "id": "evt_multi_03",
            "timestamp_str": "07:48:06.200",
            "timestamp_sec": 6.2,
            "vehicle_id": "veh_b_mid",
            "event_type": "video_observation",
            "observation_type": "direct_observation",
            "description": "Vehicle B comes to complete safe halt 2.5 meters behind Vehicle A. Brake lights remain continuously energized.",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {"source": "Dashcam Rear Optical Mirror Track", "evidence_id": evid_vid_id}
        },
        {
            "id": "evt_multi_04",
            "timestamp_str": "07:48:08.000",
            "timestamp_sec": 8.0,
            "vehicle_id": "veh_c_truck",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Vehicle C (Box Truck) cruises at 47.8 MPH in dense fog with zero brake pressure applied.",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {"source": "Fleet J1939 Telematics Stream", "evidence_id": evid_sns_id}
        },
        {
            "id": "evt_multi_05",
            "timestamp_str": "07:48:09.300",
            "timestamp_sec": 9.3,
            "vehicle_id": "veh_c_truck",
            "event_type": "sensor_measurement",
            "observation_type": "sensor_telemetry",
            "description": "Truck driver Vance releases accelerator and initiates late air brake application (65 PSI).",
            "confidence_score": 0.98,
            "confidence_label": "High",
            "supporting_ref": {"source": "Treadle Air Pressure Valve", "evidence_id": evid_sns_id}
        },
        {
            "id": "evt_multi_06",
            "timestamp_str": "07:48:10.000",
            "timestamp_sec": 10.0,
            "vehicle_id": "veh_c_truck",
            "event_type": "contradiction",
            "observation_type": "kinematic_inference",
            "description": "Primary Collision 1: Box Truck impacts rear of stationary Golf GTI at 43.1 MPH.",
            "confidence_score": 0.99,
            "confidence_label": "High",
            "supporting_ref": {"source": "Dual Dashcam Frame #420 & Severe Impact Deceleration", "evidence_id": evid_sns_id}
        },
        {
            "id": "evt_multi_07",
            "timestamp_str": "07:48:10.350",
            "timestamp_sec": 10.35,
            "vehicle_id": "veh_b_mid",
            "event_type": "kinematic_inference",
            "observation_type": "kinematic_inference",
            "description": "Secondary Collision 2: Shunted Golf GTI is propelled forward into rear of stationary Toyota Corolla.",
            "confidence_score": 0.97,
            "confidence_label": "High",
            "supporting_ref": {"source": "Front Dashcam Shock Impulse Log", "evidence_id": evid_vid_id}
        },
        {
            "id": "evt_multi_08",
            "timestamp_str": "07:48:12.500",
            "timestamp_sec": 12.5,
            "vehicle_id": "veh_c_truck",
            "event_type": "video_observation",
            "observation_type": "direct_observation",
            "description": "All three vehicles achieve final rest positions locked along westbound lane 1.",
            "confidence_score": 0.96,
            "confidence_label": "High",
            "supporting_ref": {"source": "State Police Highway Patrol Scene Log", "evidence_id": evid_vid_id}
        }
    ]

    for evt in timeline_events:
        cursor.execute("""
        INSERT INTO events (
            id, case_id, evidence_id, timestamp_str, timestamp_seconds,
            vehicle_id, event_type, description, observation_type,
            confidence_score, confidence_label, supporting_ref_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            evt["id"],
            case_id,
            evt["supporting_ref"].get("evidence_id"),
            evt["timestamp_str"],
            evt["timestamp_sec"],
            evt["vehicle_id"],
            evt["event_type"],
            evt["description"],
            evt["observation_type"],
            evt["confidence_score"],
            evt["confidence_label"],
            json.dumps(evt["supporting_ref"]),
            now
        ))

    # Contradictions
    contradictions = [
        {
            "id": "ctrd_multi_01",
            "contradiction_code": "CR-03-BRK",
            "title": "Middle Vehicle Brake Light Operational Status Discrepancy",
            "claim_a": {
                "source": "Arthur Vance (Commercial Truck Driver)",
                "evidence_id": evid_wit1_id,
                "text": "Claimed Golf brake lights were completely dark and not working",
                "type": "Driver Defense Claim",
                "confidence_score": 0.20
            },
            "claim_b": {
                "source": "Vehicle B High-Definition Dashcam Reflection & Post-Crash Circuit Audit",
                "evidence_id": evid_vid_id,
                "text": "Optical reflection proves high-mount center stop lamp and taillights illuminated 3.8s before impact; bulbs intact",
                "type": "Optical Video Analysis & Physical Evidence",
                "confidence_score": 0.99
            },
            "time_interval": "07:48:04.000 — 07:48:10.000",
            "explanation": "Truck driver claimed he failed to brake because the vehicle ahead had no illuminated brake lamps. Rear dashcam footage and post-crash electronic bus review unequivocally prove the Golf GTI brake lights were fully illuminated for nearly four seconds while halted.",
            "severity": "Critical",
            "review_status": "Verified Contradiction",
            "evidence_links": [evid_wit1_id, evid_vid_id, evid_wit2_id]
        },
        {
            "id": "ctrd_multi_02",
            "contradiction_code": "CR-03-DST",
            "title": "Truck Following Distance and Perception Latency in Dense Fog",
            "claim_a": {
                "source": "Arthur Vance (Commercial Truck Driver)",
                "evidence_id": evid_wit1_id,
                "text": "Asserted he hit his air brakes the split second he saw the vehicle in the fog",
                "type": "Driver Testimony",
                "confidence_score": 0.30
            },
            "claim_b": {
                "source": "Freightliner Commercial Fleet J1939 CAN Log",
                "evidence_id": evid_sns_id,
                "text": "Telematics record 48.2 MPH cruising with no brake application until 0.7s before impact",
                "type": "Calibrated Telematics Data",
                "confidence_score": 0.99
            },
            "time_interval": "Pre-impact approach window (07:48:02 — 07:48:10)",
            "explanation": "Truck operator claimed immediate reaction. Telematics show 48.2 MPH cruise maintained in severe fog with following distance less than 1.2 seconds, well below the mandatory 5.0-second commercial heavy vehicle following distance standard.",
            "severity": "Critical",
            "review_status": "Verified Contradiction",
            "evidence_links": [evid_wit1_id, evid_sns_id]
        }
    ]

    for ctrd in contradictions:
        cursor.execute("""
        INSERT INTO contradictions (
            id, case_id, contradiction_code, title, claim_a_json, claim_b_json,
            time_interval, explanation, severity, review_status, evidence_links_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ctrd["id"],
            case_id,
            ctrd["contradiction_code"],
            ctrd["title"],
            json.dumps(ctrd["claim_a"]),
            json.dumps(ctrd["claim_b"]),
            ctrd["time_interval"],
            ctrd["explanation"],
            ctrd["severity"],
            ctrd["review_status"],
            json.dumps(ctrd["evidence_links"]),
            now
        ))

    # Evidence Gaps
    evidence_gaps = [
        {
            "id": "gap_multi_01",
            "gap_type": "Unretrieved Sensor Log",
            "title": "Lead Vehicle A Airbag Control Module Not Downloaded",
            "description": "12V electrical system severed during rear impact on Toyota Corolla prevented standard OBD-II DLC download at scene; bench extraction scheduled.",
            "time_interval": "Entire event duration",
            "severity": "Low",
            "status": "Compensated by Middle Vehicle Front/Rear Dashcam"
        }
    ]

    for gap in evidence_gaps:
        cursor.execute("""
        INSERT INTO evidence_gaps (
            id, case_id, gap_type, title, description, time_interval, severity, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            gap["id"],
            case_id,
            gap["gap_type"],
            gap["title"],
            gap["description"],
            gap["time_interval"],
            gap["severity"],
            gap["status"],
            now
        ))

    # Trajectories
    # All 3 vehicles westbound along Highway 104 (Lane 1, Y: 430)
    lead_points = [
        {"timestamp_sec": 1.0, "timestamp_str": "07:48:01.000", "x": 300, "y": 430, "speed_mph": 25.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "Visual Tracking"},
        {"timestamp_sec": 4.0, "timestamp_str": "07:48:04.000", "x": 230, "y": 430, "speed_mph": 0.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Stopped in Traffic"},
        {"timestamp_sec": 10.0, "timestamp_str": "07:48:10.000", "x": 230, "y": 430, "speed_mph": 0.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Pre-impact Stationary"},
        {"timestamp_sec": 10.4, "timestamp_str": "07:48:10.400", "x": 210, "y": 430, "speed_mph": 12.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.5, "evidence_source": "Shunted by Vehicle B"},
        {"timestamp_sec": 12.0, "timestamp_str": "07:48:12.000", "x": 195, "y": 430, "speed_mph": 0.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Final Rest Position"}
    ]

    mid_points = [
        {"timestamp_sec": 1.0, "timestamp_str": "07:48:01.000", "x": 420, "y": 430, "speed_mph": 35.0, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "Dashcam Visual Tracking"},
        {"timestamp_sec": 4.0, "timestamp_str": "07:48:04.000", "x": 340, "y": 430, "speed_mph": 18.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "Deceleration"},
        {"timestamp_sec": 6.2, "timestamp_str": "07:48:06.200", "x": 275, "y": 430, "speed_mph": 0.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Complete Stop behind Vehicle A"},
        {"timestamp_sec": 10.0, "timestamp_str": "07:48:10.000", "x": 275, "y": 430, "speed_mph": 0.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Struck from Behind by Truck"},
        {"timestamp_sec": 10.4, "timestamp_str": "07:48:10.400", "x": 240, "y": 430, "speed_mph": 22.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.6, "evidence_source": "Propelled Forward into Vehicle A"},
        {"timestamp_sec": 12.0, "timestamp_str": "07:48:12.000", "x": 225, "y": 430, "speed_mph": 0.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.3, "evidence_source": "Final Rest Position"}
    ]

    truck_points = [
        {"timestamp_sec": 1.0, "timestamp_str": "07:48:01.000", "x": 750, "y": 430, "speed_mph": 48.2, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "ELD J1939 Log"},
        {"timestamp_sec": 4.0, "timestamp_str": "07:48:04.000", "x": 620, "y": 430, "speed_mph": 48.4, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "ELD J1939 Log"},
        {"timestamp_sec": 7.0, "timestamp_str": "07:48:07.000", "x": 480, "y": 430, "speed_mph": 48.0, "heading_deg": 270, "brake_active": False, "is_inferred": False, "uncertainty_radius_meters": 0.4, "evidence_source": "ELD J1939 Log"},
        {"timestamp_sec": 9.3, "timestamp_str": "07:48:09.300", "x": 340, "y": 430, "speed_mph": 46.2, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.5, "evidence_source": "Air Brake Treadle Valve Depressed"},
        {"timestamp_sec": 10.0, "timestamp_str": "07:48:10.000", "x": 295, "y": 430, "speed_mph": 43.1, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.5, "evidence_source": "Primary Collision Impact"},
        {"timestamp_sec": 12.0, "timestamp_str": "07:48:12.000", "x": 260, "y": 430, "speed_mph": 0.0, "heading_deg": 270, "brake_active": True, "is_inferred": False, "uncertainty_radius_meters": 0.2, "evidence_source": "Final Rest Position"}
    ]

    cursor.execute("""
    INSERT INTO trajectories (id, case_id, vehicle_id, vehicle_name, color_hex, points_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "traj_multi_lead",
        case_id,
        "veh_a_lead",
        "2022 Toyota Corolla (Lead Vehicle)",
        "#10b981",
        json.dumps(lead_points),
        now
    ))

    cursor.execute("""
    INSERT INTO trajectories (id, case_id, vehicle_id, vehicle_name, color_hex, points_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "traj_multi_mid",
        case_id,
        "veh_b_mid",
        "2024 VW Golf GTI (Middle Vehicle)",
        "#ef4444",
        json.dumps(mid_points),
        now
    ))

    cursor.execute("""
    INSERT INTO trajectories (id, case_id, vehicle_id, vehicle_name, color_hex, points_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "traj_multi_truck",
        case_id,
        "veh_c_truck",
        "2021 Freightliner Box Truck (Trailing Vehicle)",
        "#f59e0b",
        json.dumps(truck_points),
        now
    ))

    # Pre-generated Report
    report_content = {
        "report_id": "REP-2026-MCIS-0572M",
        "case_information": {
            "case_number": case_number,
            "title": "Multi-Vehicle Chain Collision: Commercial Box Truck, Sedan, and Hatchback",
            "date": "2026-10-18",
            "time": "07:48:10 EDT",
            "location": "State Highway 104 Westbound, Mile Marker 18.4",
            "speed_limit": "45 MPH",
            "environmental_conditions": "Dense Fog / Low Visibility (<100m), Damp Asphalt (µ = 0.60)",
            "vehicles_involved": vehicles
        },
        "executive_summary": "Reconstruction of a high-energy three-vehicle chain collision occurring in dense fog on State Highway 104. Lead Vehicle A and Middle Vehicle B were stationary in traffic with active illumination when struck from behind by Trailing Commercial Vehicle C. The investigation isolated electronic telematics from the commercial vehicle and synchronized dual-dashcam video from the middle vehicle. Findings conclusively refute the truck driver's assertion of unlit brake lights and established failure to maintain safe following distance and speed suited to weather conditions as the sole proximate cause.",
        "evidence_inventory": [
            {"evidence_id": evid_vid_id, "type": "video", "source_label": "Vehicle B Dual Dashcam (Rear-Facing)", "file_hash": "sha256:9c12b847190f89e2...", "status": "Analyzed"},
            {"evidence_id": evid_wit1_id, "type": "witness", "source_label": "Driver Vehicle C (Arthur Vance, Box Truck)", "file_hash": "sha256:490219f8a018274b...", "status": "Analyzed"},
            {"evidence_id": evid_wit2_id, "type": "witness", "source_label": "Driver Vehicle B (Chloe Bennett, Golf GTI)", "file_hash": "sha256:7192837491823749...", "status": "Analyzed"},
            {"evidence_id": evid_sns_id, "type": "sensor", "source_label": "Freightliner M2 Commercial Fleet Telematics", "file_hash": "sha256:1092837491827394...", "status": "Analyzed"}
        ],
        "extracted_observations": [
            {"description": "Middle Vehicle B stopped safely behind Vehicle A with illuminated brake lamps at 07:48:06.200.", "timestamp_str": "07:48:06.200", "confidence_score": 0.99},
            {"description": "Commercial Box Truck maintained 48.2 mph in heavy fog until 0.7 seconds before collision.", "timestamp_str": "07:48:09.300", "confidence_score": 0.99},
            {"description": "Initial rear impact delivered at 43.1 mph forward velocity.", "timestamp_str": "07:48:10.000", "confidence_score": 0.98},
            {"description": "Secondary impact occurred at 07:48:10.350 shunting Vehicle B into Lead Vehicle A.", "timestamp_str": "07:48:10.350", "confidence_score": 0.97}
        ],
        "witness_claims": [
            {"witness_name": "Arthur Vance (Truck Driver)", "claim": "Claimed Golf brake lights were dead and vehicle stopped unexpectedly without warning."},
            {"witness_name": "Chloe Bennett (Golf Driver)", "claim": "Stated she stopped smoothly behind traffic with foot on brake for several seconds before being crushed from behind."}
        ],
        "chronological_timeline": timeline_events,
        "contradictions": contradictions,
        "evidence_gaps": evidence_gaps,
        "vehicle_movement_reconstruction": {
            "summary": "Linear rear-end chain impact with momentum transfer from Vehicle C through Vehicle B to Vehicle A.",
            "impact_speed_assessment": "Truck entry: 48.2 MPH; Impact 1 speed: 43.1 MPH; Energy dissipation: 284 kJ absorbed in crumple zones."
        },
        "confidence_assessment": {
            "overall_reliability": "Very High (Commercial ELD Black Box & Dual HD Dashcam)",
            "telemetry_confidence": "99.8% (Federal Mandate J1939 Telematics Log)",
            "video_tracking_confidence": "98.2% (Dual 1080p 60fps Dashcam with Reflection Mapping)",
            "eyewitness_consistency_index": "30.0% (Truck driver claim completely refuted)",
            "methodology": "Multi-vehicle momentum and energy balance corroborated with calibrated millisecond ELD crash records."
        },
        "limitations": [
            "Lead vehicle electronic control module unretrieved due to battery terminal destruction.",
            "Fog density gradient estimated between 60m and 90m along Highway corridor."
        ],
        "investigator_review_notes": "Commercial driver failed to adhere to heavy vehicle following distance and speed reduction guidelines in adverse weather. Middle vehicle and lead vehicle fully cleared of contributory negligence.",
        "disclaimer": "This report is an AI-assisted forensic analysis of supplied digital evidence. Findings are provisional, evidence-linked, and probabilistic."
    }

    cursor.execute("""
    INSERT INTO reports (
        id, case_id, report_id, title, content_json, investigator_name, badge_number, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "rep_multi_01",
        case_id,
        "REP-2026-MCIS-0572M",
        "Comprehensive AI Forensic Reconstruction & Multi-Vehicle Chain Collision Report",
        json.dumps(report_content),
        "Detective Sarah Vance",
        "INV-9482",
        now
    ))

    return case_id
