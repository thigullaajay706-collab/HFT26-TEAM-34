import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "accident_iq.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        badge_number TEXT NOT NULL,
        department TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Lead Investigator',
        created_at TEXT NOT NULL
    );
    """)

    # Cases Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        case_number TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        accident_date TEXT NOT NULL,
        accident_time TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        vehicles_json TEXT NOT NULL,
        status TEXT NOT NULL,
        weather TEXT NOT NULL DEFAULT 'Clear',
        road_condition TEXT NOT NULL DEFAULT 'Dry',
        speed_limit_mph INTEGER NOT NULL DEFAULT 35,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # Evidence Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        evidence_type TEXT NOT NULL,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_hash TEXT NOT NULL,
        file_size_bytes INTEGER NOT NULL,
        source_label TEXT NOT NULL,
        metadata_json TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases (id)
    );
    """)

    # Timeline Events Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        evidence_id TEXT,
        timestamp_str TEXT NOT NULL,
        timestamp_seconds REAL NOT NULL,
        vehicle_id TEXT,
        event_type TEXT NOT NULL,
        description TEXT NOT NULL,
        observation_type TEXT NOT NULL,
        confidence_score REAL NOT NULL,
        confidence_label TEXT NOT NULL,
        supporting_ref_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases (id)
    );
    """)

    # Contradictions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contradictions (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        contradiction_code TEXT NOT NULL,
        title TEXT NOT NULL,
        claim_a_json TEXT NOT NULL,
        claim_b_json TEXT NOT NULL,
        time_interval TEXT NOT NULL,
        explanation TEXT NOT NULL,
        severity TEXT NOT NULL,
        review_status TEXT NOT NULL,
        evidence_links_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases (id)
    );
    """)

    # Evidence Gaps Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence_gaps (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        gap_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        time_interval TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases (id)
    );
    """)

    # Trajectories Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trajectories (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        vehicle_id TEXT NOT NULL,
        vehicle_name TEXT NOT NULL,
        color_hex TEXT NOT NULL,
        points_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases (id)
    );
    """)

    # Reports Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        report_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content_json TEXT NOT NULL,
        investigator_name TEXT NOT NULL,
        badge_number TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES cases (id)
    );
    """)

    # Insert Default Demo Investigator User if not present
    cursor.execute("SELECT id FROM users WHERE email = 'investigator@metro.gov'")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, full_name, badge_number, department, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "usr_demo_01",
            "investigator@metro.gov",
            "hashed_secure_pass_9482",
            "Detective Sarah Vance",
            "INV-9482",
            "Major Collision Investigation Squad (MCIS)",
            "Senior Forensic Specialist",
            datetime.now().isoformat()
        ))

    conn.commit()
    conn.close()
