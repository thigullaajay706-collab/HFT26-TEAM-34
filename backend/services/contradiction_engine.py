import json
from typing import List, Dict, Any

def detect_contradictions(claims: List[Dict[str, Any]], telemetry_summary: Dict[str, Any], video_metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Automated contradiction detection engine.
    Cross-checks extracted subjective witness claims against objective sensor telemetry and video frame observations.
    """
    contradictions = []

    # Check 1: Speed Claims vs Telemetry
    max_telemetry_spd = telemetry_summary.get("max_speed_mph", 0)
    for cl in claims:
        if cl.get("type") == "speed_claim":
            span = cl.get("span", "")
            # Look for claimed high speeds (e.g. 60+ mph)
            if any(k in span.lower() for k in ["65", "70", "75", "80", "flying", "insane"]):
                if max_telemetry_spd > 0 and max_telemetry_spd < 50:
                    contradictions.append({
                        "contradiction_code": f"CR-AUTO-SPD-{len(contradictions)+1}",
                        "title": "Severe Velocity Estimation Discrepancy",
                        "claim_a": {
                            "source": cl.get("witness_name", "Witness"),
                            "text": f"Claimed vehicle was traveling at excessive speed: '{span}'",
                            "type": "Subjective Eyewitness Perception",
                            "confidence_score": 0.35
                        },
                        "claim_b": {
                            "source": "Vehicle High-Frequency Onboard Telemetry",
                            "text": f"Telemetry records actual peak entry speed of {max_telemetry_spd} mph",
                            "type": "Objective Sensor Telemetry",
                            "confidence_score": 0.99
                        },
                        "time_interval": "Pre-impact approach window",
                        "explanation": f"Eyewitness significantly overestimated speed ({span}) compared to calibrated onboard CAN telemetry ({max_telemetry_spd} mph).",
                        "severity": "Critical",
                        "review_status": "Flagged for Investigator Review"
                    })

    # Check 2: Headlight Illumination
    headlight_off_claim = next((c for c in claims if c.get("type") == "equipment_claim" and "off" in c.get("span", "").lower()), None)
    headlight_on_claim = next((c for c in claims if c.get("type") == "equipment_claim" and any(k in c.get("span", "").lower() for k in ["on", "bright", "illuminated"])), None)

    if headlight_off_claim and headlight_on_claim:
        contradictions.append({
            "contradiction_code": f"CR-AUTO-LGT-{len(contradictions)+1}",
            "title": "Conflicting Headlight Illumination Claims",
            "claim_a": {
                "source": headlight_off_claim.get("witness_name", "Witness A"),
                "text": headlight_off_claim.get("span", ""),
                "type": "Witness Statement",
                "confidence_score": 0.40
            },
            "claim_b": {
                "source": headlight_on_claim.get("witness_name", "Witness B"),
                "text": headlight_on_claim.get("span", ""),
                "type": "Witness Statement",
                "confidence_score": 0.85
            },
            "time_interval": "Dusk / Nighttime illumination period",
            "explanation": "One witness asserts vehicle headlights were completely off, while another eyewitness confirms illuminated headlight beam. Video frame inspection required.",
            "severity": "Major",
            "review_status": "Flagged for Investigator Review"
        })

    return contradictions


def detect_evidence_gaps(evidence_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Identifies blind spots and missing data in the evidence inventory.
    """
    gaps = []
    types_present = {e.get("evidence_type") for e in evidence_items}

    if "sensor" not in types_present:
        gaps.append({
            "gap_type": "Missing Telemetry",
            "title": "Absence of Event Data Recorder (EDR) or CAN Telemetry",
            "description": "Neither vehicle provided continuous electronic telemetry or crash data recorder files. Speeds and decelerations must be derived solely from video photogrammetry.",
            "time_interval": "Entire incident duration",
            "severity": "High",
            "status": "Unresolved - Photogrammetric Fallback"
        })

    if "video" not in types_present:
        gaps.append({
            "gap_type": "No Video Coverage",
            "title": "Absence of Direct Visual / Video Records",
            "description": "No dashcam or municipal CCTV footage available. Reconstruction relies entirely on physical roadway markings, vehicle crush, and witness testimony.",
            "time_interval": "Entire incident duration",
            "severity": "Critical",
            "status": "Unresolved"
        })

    return gaps
