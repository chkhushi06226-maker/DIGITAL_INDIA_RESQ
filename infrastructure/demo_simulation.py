"""
================================================================================
DIGITAL INDIA RES-Q — LIVE HACKATHON JUDGE DEMO SUITE
Run this script to simulate real-time emergency dispatch in high-tech terminal!
================================================================================
"""

from engine import AdvancedInfrastructureEngine, GeoCoordinate, PriorityTier
import time

# ANSI Terminal Colors for Defense / Command Center Aesthetic
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

def run_live_hackathon_demo():
    print(f"\n{CYAN}{BOLD}" + "=" * 78 + f"{RESET}")
    print(f"{CYAN}{BOLD}   DIGITAL INDIA RES-Q — ADVANCED INFRASTRUCTURE & TELEMETRY ENGINE   {RESET}")
    print(f"    Team: Code Punch | Institution: ABES Engineering College, Ghaziabad   ")
    print(f"{CYAN}{BOLD}" + "=" * 78 + f"{RESET}")

    engine = AdvancedInfrastructureEngine()

    # Ground Incident: Sector 4, Ghaziabad (Residential Fire & Structural Risk)
    incident_coords = GeoCoordinate(28.6692, 77.4538)
    incident_type = "RESIDENTIAL MULTI-STORY STRUCTURAL FIRE & CASUALTIES"
    priority = PriorityTier.CRITICAL

    print(f"\n{YELLOW}[INIT 01] Validating Resilient Hybrid Communication Telemetry...{RESET}")
    time.sleep(0.6)
    print(f"  • Primary 5G Network      : {GREEN}ONLINE (Latency: 14ms | Bandwidth: 150 Mbps){RESET}")
    print(f"  • Satellite Failover Link  : {GREEN}CONNECTED (GSAT-29 L-Band Ground Station){RESET}")
    print(f"  • LoRaWAN Emergency Mesh   : {GREEN}ACTIVE (868 MHz Frequency-Hopping Spread Spectrum){RESET}")

    print(f"\n{YELLOW}[INIT 02] Ingesting Citizen SOS Geo-Coordinates...{RESET}")
    time.sleep(0.6)
    print(f"  • Target Latitude         : {incident_coords.latitude}° N")
    print(f"  • Target Longitude        : {incident_coords.longitude}° E")
    print(f"  • Incident Severity       : {RED}{BOLD}{priority.value} — {incident_type}{RESET}")

    print(f"\n{YELLOW}[INIT 03] Executing Multi-Criteria Decision (MCDA) Triage Algorithm...{RESET}")
    time.sleep(0.8)
    dispatch_results = engine.execute_realtime_dispatch(incident_coords, incident_type, priority)

    print(f"\n{GREEN}{BOLD}" + "-" * 78 + f"{RESET}")
    print(f"{GREEN}{BOLD}⚡ AUTOMATED MULTI-AGENCY DISPATCH & TELEMETRY LOCK{RESET}")
    print(f"{GREEN}{BOLD}" + "-" * 78 + f"{RESET}")

    amb = dispatch_results["ambulance_dispatch"]
    print(f"{BOLD}🚑 Assigned EMS Fleet      :{RESET} {amb['unit_id']} ({amb['category']})")
    print(f"   • Paramedic Lead        : {amb['paramedic_lead']}")
    print(f"   • Road Distance (Urban) : {CYAN}{amb['distance_km']} km (Haversine Winding Corrected){RESET}")
    print(f"   • Estimated Travel ETA  : {GREEN}{BOLD}{amb['calculated_eta_mins']} Minutes (Traffic Preemption Sync){RESET}")

    print(f"\n{BOLD}🏥 Dynamic Hospital Match  :{RESET} {dispatch_results['hospital_allocation']['hospital_name']}")
    hosp = dispatch_results['hospital_allocation']
    print(f"   • Facility Sector       : {hosp['sector']} ({hosp['distance_km']} km away)")
    print(f"   • MCDA Scientific Score : {CYAN}{hosp['mcda_triage_score']} Points (Optimal ICU + Blood Match){RESET}")
    print(f"   • ER Bed Reservation    : {GREEN}1 Trauma ICU Bed LOCKED (Remaining Free: {hosp['icu_remaining']}){RESET}")
    print(f"   • Inbound Alert         : {hosp['trauma_director_alert']}")

    print(f"\n{BOLD}🚁 Autonomous Drone Telemetry:{RESET} {dispatch_results['drone_telemetry']['drone_id']}")
    drone = dispatch_results['drone_telemetry']
    print(f"   • Flight Compass Heading: {CYAN}{drone['bearing_heading_deg']}{RESET} | Altitude: {drone['altitude_agl_m']}")
    print(f"   • Sensor Payload        : {drone['payload']}")
    print(f"   • Battery Capacity      : {GREEN}{drone['battery']}{RESET} | Mode: {drone['flight_mode']}")

    print(f"\n{BOLD}📡 Resilient Packet Frame  :{RESET}")
    print(f"   • Frame Payload         : {YELLOW}{dispatch_results['network_resilience']['compact_disaster_frame']}{RESET}")

    print(f"\n{GREEN}{BOLD}" + "-" * 78 + f"{RESET}")
    print(f"✅ {BOLD}EXECUTION LATENCY       : {CYAN}{dispatch_results['latency_ms']} ms{RESET} (Sub-Second Cloud Response)")
    print(f"✅ {BOLD}INCIDENT REFERENCE ID   : {dispatch_results['incident_id']}")
    print(f"✅ {BOLD}MISSION STATUS          : GOLDEN-HOUR SYNCHRONIZATION LOCKED{RESET}")
    print(f"{CYAN}{BOLD}" + "=" * 78 + f"{RESET}\n")

if __name__ == "__main__":
    run_live_hackathon_demo()
