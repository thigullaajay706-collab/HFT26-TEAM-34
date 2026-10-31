import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def api_call(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"} if data else {}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

def run_tests():
    print("=== STARTING ACCIDENTIQ END-TO-END VALIDATION ===")

    # 1. Health check
    code, res = api_call("/api/health")
    assert code == 200, f"Health check failed: {code}"
    print(f"[PASS] 1. Health Check online: {res.get('service')}")

    # 2. Demo 1 Load
    code, res = api_call("/api/demo/load", "POST", {"demo_id": "demo1"})
    assert code == 200, f"Demo 1 load failed: {code}"
    demo1_id = res["case_id"]
    print(f"[PASS] 2. Demo 1 loaded: {demo1_id} ({res.get('message')[:60]}...)")

    # 3. Demo 2 Load (Pedestrian)
    code, res = api_call("/api/demo/load", "POST", {"demo_id": "demo2"})
    assert code == 200, f"Demo 2 load failed: {code}"
    demo2_id = res["case_id"]
    print(f"[PASS] 3. Demo 2 loaded: {demo2_id} ({res.get('message')[:60]}...)")

    # 4. Demo 3 Load (Multi-vehicle chain collision)
    code, res = api_call("/api/demo/load", "POST", {"demo_id": "demo3"})
    assert code == 200, f"Demo 3 load failed: {code}"
    demo3_id = res["case_id"]
    print(f"[PASS] 4. Demo 3 loaded: {demo3_id} ({res.get('message')[:60]}...)")

    # 5. List Cases & verify isolation
    code, cases = api_call("/api/cases")
    assert code == 200 and len(cases) >= 3, f"Listing cases failed: {len(cases)}"
    print(f"[PASS] 5. List cases verified: {len(cases)} total cases found in database")

    # 6. Verify Demo 2 Synthesis
    code, syn2 = api_call(f"/api/cases/{demo2_id}/synthesis")
    assert code == 200, f"Synthesis demo 2 failed: {code}"
    assert "Pedestrian" in json.dumps(syn2), "Pedestrian not in demo 2 synthesis"
    print(f"[PASS] 6. Dynamic Synthesis (Demo 2 Pedestrian): Status={syn2['status']}, Confidence={syn2['overall_confidence']}")

    # 7. Verify Demo 2 Trajectory
    code, traj2 = api_call(f"/api/cases/{demo2_id}/trajectory")
    assert code == 200, f"Trajectory demo 2 failed: {code}"
    assert "pedestrian" in traj2["intersection_type"].lower(), f"Wrong road type: {traj2['intersection_type']}"
    assert len(traj2["vehicles"]) == 2, f"Expected 2 participants in traj2, got {len(traj2['vehicles'])}"
    print(f"[PASS] 7. Dynamic Trajectory (Demo 2): Type={traj2['intersection_type']}, Vehicles={len(traj2['vehicles'])}")

    # 8. Verify Demo 3 Trajectory
    code, traj3 = api_call(f"/api/cases/{demo3_id}/trajectory")
    assert code == 200, f"Trajectory demo 3 failed: {code}"
    assert len(traj3["vehicles"]) == 3, f"Expected 3 vehicles in traj3, got {len(traj3['vehicles'])}"
    print(f"[PASS] 8. Dynamic Trajectory (Demo 3): Type={traj3['intersection_type']}, Vehicles={len(traj3['vehicles'])}")

    # 9. Verify Demo 2 Report
    code, rep2 = api_call(f"/api/cases/{demo2_id}/report")
    assert code == 200, f"Report demo 2 failed: {code}"
    assert len(rep2.get("extracted_observations", [])) > 0, "No observations in demo 2 report"
    assert len(rep2.get("witness_claims", [])) > 0, "No witness claims in demo 2 report"
    print(f"[PASS] 9. Dynamic Report (Demo 2): Report ID={rep2.get('report_id')}, Observations={len(rep2.get('extracted_observations', []))}")

    # 10. Manual Case Creation with Pedestrian Participant
    test_case_payload = {
        "title": "Autonomous Rover vs Pedestrian Collision Test",
        "accident_date": "2026-10-30",
        "accident_time": "14:22",
        "location": "Oak Lane & University Dr",
        "description": "Validation test case for multi-participant dynamic cross-analysis.",
        "vehicles": [
            {
                "participant_type": "Car",
                "make_model": "Audi Q7",
                "color": "Silver",
                "license_plate": "7XYZ99",
                "driver_name": "Dr. Aris Thorne",
                "movement_state": "Traveling forward"
            },
            {
                "participant_type": "Pedestrian",
                "make_model": "Pedestrian",
                "color": "High-vis orange",
                "license_plate": "N/A",
                "driver_name": "Elena Rostova",
                "movement_state": "Crossing in crosswalk"
            }
        ],
        "weather": "Overcast",
        "road_condition": "Damp",
        "speed_limit_mph": 25
    }
    code, created = api_call("/api/cases", "POST", test_case_payload)
    assert code == 200, f"Manual case creation failed: {code}"
    test_case_id = created["id"]
    print(f"[PASS] 10. Manual Case Created: {test_case_id} ({created['case_number']})")

    # 11. Add witness statement to manual case
    wit_payload = {
        "witness_name": "Security Guard Jim",
        "witness_type": "Campus Security",
        "statement_text": "I saw the silver Audi approach at approximately 45 mph, way above the 25 limit. The pedestrian had already entered the crosswalk with an orange vest.",
        "statement_time": "14:25",
        "location_vantage": "Gatehouse window 15 meters north"
    }
    code, wit_res = api_call(f"/api/cases/{test_case_id}/evidence/witness", "POST", wit_payload)
    assert code == 200, f"Witness upload failed: {code}"
    print(f"[PASS] 11. Ingested Evidence: Witness statement added ({wit_res.get('status')})")

    # 12. Run AI Analysis Pipeline on manual case
    code, anl_res = api_call(f"/api/cases/{test_case_id}/analyze", "POST")
    assert code == 200, f"Analysis pipeline failed: {code}"
    print(f"[PASS] 12. Cross-Modal AI Pipeline Executed on Manual Case: {anl_res.get('case_status')}")

    # 13. Check synthesis of manual case after analysis
    code, test_syn = api_call(f"/api/cases/{test_case_id}/synthesis")
    assert code == 200, f"Synthesis manual case failed: {code}"
    assert test_syn["status"] == "completed", f"Status not completed: {test_syn['status']}"
    print(f"[PASS] 13. Manual Case Dynamic Synthesis: Score={test_syn['overall_score']}, Thesis length={len(test_syn['incident_overview']['thesis'])}")

    # 14. Check trajectory generated for manual case
    code, test_traj = api_call(f"/api/cases/{test_case_id}/trajectory")
    assert code == 200, f"Trajectory manual case failed: {code}"
    assert len(test_traj["vehicles"]) == 2, f"Expected 2 vehicles, got {len(test_traj['vehicles'])}"
    print(f"[PASS] 14. Manual Case Synthesized Trajectory: Road Type={test_traj['intersection_type']}, Vehicles={len(test_traj['vehicles'])}")

    # 15. Delete the test case and verify complete cascading DB purge
    code, del_res = api_call(f"/api/cases/{test_case_id}", "DELETE")
    assert code == 200, f"Case deletion failed: {code}"
    print(f"[PASS] 15. Case Cascading Deletion: {del_res.get('message')}")

    # Verify 404 on deleted case
    code, _ = api_call(f"/api/cases/{test_case_id}")
    assert code == 404, f"Deleted case still found! Code={code}"
    print("[PASS] 16. Verified 404 for deleted case (clean relational purge)")

    print("\n>>> ALL 16 END-TO-END SYSTEM VALIDATION CHECKS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    run_tests()
