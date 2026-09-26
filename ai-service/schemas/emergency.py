from pydantic import BaseModel
from typing import Optional


class EmergencyInput(BaseModel):

    emergency_type: Optional[str] = None

    description: str = ""

    people_affected: int = 0

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    location_risk: str = "medium"

    road_accessibility: str = "medium"

    hospital_availability: str = "medium"