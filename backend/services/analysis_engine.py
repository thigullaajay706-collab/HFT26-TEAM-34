import re
import csv
import io
import json
from typing import Dict, Any, List

def analyze_sensor_csv(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Parses and analyzes uploaded vehicle sensor CSV telemetry using pure-Python standard library.
    Validates columns, calculates kinematics, and flags deceleration spikes / gaps.
    """
    try:
        text = file_bytes.decode('utf-8', errors='replace')
        f = io.StringIO(text)
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            return {"status": "error", "message": "CSV header row not found or empty."}

        # Normalize column names mapping
        raw_columns = list(reader.fieldnames)
        col_map = {c: c.strip().lower().replace(" ", "_") for c in raw_columns}
        
        # Identify key columns
        speed_col = next((c for c in raw_columns if any(k in col_map[c] for k in ["speed", "velocity", "mph", "kmh"])), None)
        time_col = next((c for c in raw_columns if any(k in col_map[c] for k in ["time", "timestamp", "seconds", "sec"])), None)
        brake_col = next((c for c in raw_columns if any(k in col_map[c] for k in ["brake", "psi", "bar"])), None)
        accel_col = next((c for c in raw_columns if any(k in col_map[c] for k in ["accel", "g_force", "decel", "g_accel"])), None)
        throttle_col = next((c for c in raw_columns if any(k in col_map[c] for k in ["throttle", "tps", "pedal"])), None)

        rows = []
        speeds = []
        accels = []
        brakes = []

        for row in reader:
            rows.append(row)
            if speed_col and row.get(speed_col):
                try:
                    speeds.append(float(row[speed_col]))
                except ValueError:
                    pass
            if accel_col and row.get(accel_col):
                try:
                    accels.append(float(row[accel_col]))
                except ValueError:
                    pass
            if brake_col and row.get(brake_col):
                try:
                    brakes.append(float(row[brake_col]))
                except ValueError:
                    pass

        total_records = len(rows)
        max_speed = round(max(speeds), 1) if speeds else 0.0
        min_speed = round(min(speeds), 1) if speeds else 0.0
        avg_speed = round(sum(speeds) / len(speeds), 1) if speeds else 0.0

        summary: Dict[str, Any] = {
            "total_records": total_records,
            "columns_found": raw_columns,
            "sampling_detected": True,
            "anomalies": [],
            "chart_data": [],
            "max_speed_mph": max_speed,
            "min_speed_mph": min_speed,
            "avg_speed_mph": avg_speed,
            "has_braking_event": False,
            "braking_timestamp": None
        }

        # Detect deceleration / braking spikes
        for idx, row in enumerate(rows):
            t_val = row.get(time_col, f"Row #{idx}")
            if accel_col and row.get(accel_col):
                try:
                    a_val = float(row[accel_col])
                    if a_val < -0.4 and not summary["has_braking_event"]:
                        summary["has_braking_event"] = True
                        summary["braking_timestamp"] = str(t_val)
                        summary["anomalies"].append({
                            "type": "Rapid Deceleration Spike",
                            "timestamp": str(t_val),
                            "detail": f"Deceleration reached {round(a_val, 2)}g (exceeds -0.4g threshold) indicating emergency braking."
                        })
                except ValueError:
                    pass

            if brake_col and row.get(brake_col):
                try:
                    b_val = float(row[brake_col])
                    if b_val > 50 and not summary["has_braking_event"]:
                        summary["has_braking_event"] = True
                        summary["braking_timestamp"] = str(t_val)
                        summary["anomalies"].append({
                            "type": "High Hydraulic Brake Pressure",
                            "timestamp": str(t_val),
                            "detail": f"Brake hydraulic pressure spiked to {round(b_val, 1)} PSI."
                        })
                except ValueError:
                    pass

        # Sample ~40 records for frontend chart
        stride = max(1, total_records // 40)
        for i in range(0, total_records, stride):
            r = rows[i]
            t_label = str(r.get(time_col, f"{i*0.1:.1f}s"))
            s_val = 0.0
            b_val = 0.0
            th_val = 0.0
            ac_val = 0.0

            if speed_col and r.get(speed_col):
                try: s_val = round(float(r[speed_col]), 1)
                except ValueError: pass
            if brake_col and r.get(brake_col):
                try: b_val = round(float(r[brake_col]), 1)
                except ValueError: pass
            if throttle_col and r.get(throttle_col):
                try: th_val = round(float(r[throttle_col]), 1)
                except ValueError: pass
            if accel_col and r.get(accel_col):
                try: ac_val = round(float(r[accel_col]), 2)
                except ValueError: pass

            summary["chart_data"].append({
                "timestamp": t_label,
                "speed": s_val,
                "brake": b_val,
                "throttle": th_val,
                "accel": ac_val
            })

        return summary
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to parse CSV file: {str(e)}"
        }


def analyze_witness_statement(text: str, witness_name: str, vantage_point: str) -> Dict[str, Any]:
    """
    NLP extraction engine for witness statements.
    Extracts speed claims, equipment claims, signal claims, and maneuver observations.
    """
    extracted_claims = []

    # 1. Speed Claims Regex
    speed_matches = re.finditer(r'(\b\d{1,3}\b)\s*(?:to\s*(\b\d{1,3}\b)\s*)?(?:mph|miles per hour|kmh|km/h)', text, re.IGNORECASE)
    for match in speed_matches:
        span_text = match.group(0)
        spd1 = match.group(1)
        spd2 = match.group(2)
        val_str = f"{spd1}-{spd2} mph" if spd2 else f"{spd1} mph"
        extracted_claims.append({
            "claim": f"Reported speed of {val_str}",
            "span": span_text,
            "type": "speed_claim",
            "subject": "vehicle",
            "confidence": 0.88
        })

    # Speed qualitative claims
    if re.search(r'\b(flying|insane speed|speeding|very fast|hauling)\b', text, re.IGNORECASE):
        m = re.search(r'\b(flying|insane speed|speeding|very fast|hauling)\b[^\.\,]*', text, re.IGNORECASE)
        extracted_claims.append({
            "claim": "Witness asserted vehicle was traveling at excessive/high speed",
            "span": m.group(0) if m else "speeding",
            "type": "speed_qualitative",
            "subject": "vehicle",
            "confidence": 0.75
        })

    # 2. Lighting / Headlight Claims
    if re.search(r'\bheadlights?\b', text, re.IGNORECASE):
        if re.search(r'\b(off|dark|invisible|unlit|extinguished|not on)\b', text, re.IGNORECASE):
            m = re.search(r'[^.]*headlights?[^.]*(?:off|dark|invisible|unlit)[^.]*', text, re.IGNORECASE)
            extracted_claims.append({
                "claim": "Asserts vehicle headlights were OFF / unlit",
                "span": m.group(0).strip() if m else "headlights were off",
                "type": "equipment_claim",
                "subject": "lighting",
                "confidence": 0.85
            })
        elif re.search(r'\b(on|bright|illuminated|shining)\b', text, re.IGNORECASE):
            m = re.search(r'[^.]*headlights?[^.]*(?:on|bright|illuminated)[^.]*', text, re.IGNORECASE)
            extracted_claims.append({
                "claim": "Asserts vehicle headlights were ON and bright",
                "span": m.group(0).strip() if m else "headlights were on",
                "type": "equipment_claim",
                "subject": "lighting",
                "confidence": 0.90
            })

    # 3. Traffic Signal Claims
    if re.search(r'\b(green|yellow|amber|red|arrow|signal|light)\b', text, re.IGNORECASE):
        sig_match = re.search(r'[^.]*\b(green|yellow|amber|red|arrow|traffic light)\b[^.]*', text, re.IGNORECASE)
        if sig_match:
            extracted_claims.append({
                "claim": "Reported traffic signal phase during approach/entry",
                "span": sig_match.group(0).strip(),
                "type": "traffic_control_claim",
                "subject": "signal",
                "confidence": 0.82
            })

    # 4. Turn / Maneuver Claims
    if re.search(r'\b(left turn|turned|cut|swerved|pulled out|crept)\b', text, re.IGNORECASE):
        turn_match = re.search(r'[^.]*\b(left turn|turned|cut|swerved|pulled out|crept)\b[^.]*', text, re.IGNORECASE)
        if turn_match:
            extracted_claims.append({
                "claim": "Observed vehicle turning maneuver or path deviation",
                "span": turn_match.group(0).strip(),
                "type": "maneuver_claim",
                "subject": "maneuver",
                "confidence": 0.85
            })

    # 5. Braking Claims
    if re.search(r'\b(slammed|brakes?|braking|skid|squeal)\b', text, re.IGNORECASE):
        brake_match = re.search(r'[^.]*\b(slammed|brakes?|braking|skid|squeal)\b[^.]*', text, re.IGNORECASE)
        if brake_match:
            extracted_claims.append({
                "claim": "Observed sudden or emergency braking action",
                "span": brake_match.group(0).strip(),
                "type": "braking_claim",
                "subject": "braking",
                "confidence": 0.88
            })

    return {
        "witness_name": witness_name,
        "vantage_point": vantage_point,
        "character_count": len(text),
        "word_count": len(text.split()),
        "extracted_claims": extracted_claims
    }
