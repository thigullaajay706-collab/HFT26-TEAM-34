# AccidentIQ — AI Forensic Reconstruction Platform

> **"Reconstruct the Incident. Reveal the Evidence."**  
> An advanced AI-powered forensic intelligence and road accident timeline reconstruction web application engineered for police investigators, collision reconstruction specialists, and insurance fraud analysts.

---

## 🌟 Platform Highlights & Key Features

1. **Futuristic Forensic Dark-Mode Intelligence UI**:
   - Deep navy, midnight black, charcoal, and dark blue backgrounds with electric cyan (`#00f2fe`), neon blue (`#4facfe`), violet (`#9b51e0`), emerald (`#00f5a0`), and warning red (`#ff3366`) accents.
   - Glassmorphism cards with translucent blur backgrounds, soft neon borders, and cyber-grid radar aesthetics.
   - Animated HTML5 canvas particle network with interconnected glowing nodes and real-time scanning lines.
   - Modern typography using **Space Grotesk** for headings, **Inter** for UI, and **JetBrains Mono** for forensic telemetry and timestamps.

2. **Multi-Source Evidence Fusion**:
   - **Video Evidence (MP4, MOV, WebM)**: Frame-by-frame stepper with simulated 30fps YOLO object tracking bounding boxes (Vehicle A, Vehicle B, Signal state, Point of Collision).
   - **Witness Statements (TXT / Direct text)**: NLP extraction engine isolating speed claims, headlight illumination assertions, signal phase claims, and sudden maneuvers with verbatim text-span anchoring.
   - **Sensor Telemetry (CSV)**: Pure-Python kinematics engine analyzing CAN-bus and GPS records, calculating speed profiles, detecting emergency braking spikes (`>0.4g` deceleration / `>50 PSI` brake pressure), and rendering interactive charts.
   - Cryptographic **SHA-256 integrity hashing** for every evidence item ensuring Rule 702 Daubert admissibility and chain-of-custody.

3. **Interactive Chronological Timeline**:
   - Synchronized microsecond timeline with color-coded classification:
     - **Cyan**: Video observations (direct camera evidence)
     - **Purple**: Witness claims (subjective perceptual claims)
     - **Green**: Sensor measurements (objective electronic telemetry)
     - **Amber**: Kinematic inferences & uncertain events
     - **Red**: Point of Impact (POI) & material contradictions
   - Filter by evidence source (All, Video, Witness, Sensor, Contradictions) and by vehicle.
   - **Evidence Drawer Inspector**: Click any timeline event to inspect the raw supporting source, text excerpt, and confidence score.

4. **Automated Contradiction & Gap Detection Engine**:
   - Side-by-side comparison matrix highlighting critical discrepancies:
     - **Speed Contradiction**: Driver Rivera claimed motorcycle speed was *65-70 mph*; 10Hz CAN telemetry objectively proves entry at *46.8 mph* (exceeding 35 mph limit by 11.8 mph) and emergency braking decelerating to *28.4 mph* at impact.
     - **Headlight Contradiction**: Driver Rivera claimed motorcycle *headlights were off*; Video Frame #126 and independent pedestrian Dave Chen corroborate active illuminated factory LED beam.
     - **Signal Priority Contradiction**: Driver Rivera claimed protected arrow; City DOT logs and video confirm permissive yellow phase requiring left-turning vehicles to yield.
   - **Evidence Gap Detection**: Identifies 1.8-second municipal CCTV network frame drop and lack of continuous pre-crash steering angle telemetry in older vehicle modules.

5. **2D Vehicle Trajectory Kinematics (Top-Down Intersection)**:
   - Interactive 2D canvas simulation of the 4-way intersection (Broadway & 4th Avenue).
   - Real-time animated vehicles: **Vehicle A (Red Honda Civic Sedan)** executing left turn across opposing traffic, and **Vehicle B (Cobalt Blue Yamaha MT-09 Motorcycle)** traveling westbound.
   - Play, Pause, Restart, Scrubber Slider (10.0s to 18.0s), and Playback Speed selector (0.5x, 1x, 2x).
   - Path trails (solid lines for verified sensor data, dashed for inferred segments) and positional uncertainty hulls.
   - Real-time vehicle telemetry HUD updating velocity, heading, and braking deceleration dynamically.

6. **Official 12-Section Forensic Report**:
   - Complete standardized forensic report with printable layout, digital signature token, and mandatory statutory disclaimer.
   - Direct export to print or PDF via `window.print()`.

---

## 🚀 Quickstart & Running the Application

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (v3.10+)

### 1. Backend Setup & Startup
The FastAPI backend runs with pure-Python standard library parsing and SQLite:
```powershell
# From project root:
& "backend_env\Scripts\python.exe" backend\main.py
```
*Backend runs on:* `http://127.0.0.1:8000` (API documentation at `/docs`)

### 2. Frontend Setup & Startup
The React TypeScript frontend runs with Vite and Tailwind CSS v4:
```powershell
cd client
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

---

## 👥 Demo Investigator Credentials
For 1-click evaluation, the platform includes a prominent **"Load Crash Demo"** button in the navbar and landing page:
- **Investigator**: Detective Sarah Vance
- **Badge ID**: `INV-9482`
- **Department**: Major Collision Investigation Squad (MCIS)
- **Email**: `investigator@metro.gov`

---

## ⚖️ Legal & Evidentiary Disclaimer
*This platform is an AI-assisted forensic analysis tool designed for certified collision reconstructionists. Findings are provisional, evidence-linked, and probabilistic. It does not establish legal liability or criminal guilt.*
