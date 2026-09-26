def calculate_risk(
    severity,
    people_affected,
    location_risk,
    road_accessibility,
    hospital_availability
):

    severity_score = {

        "low": 20,
        "medium": 45,
        "high": 70,
        "critical": 90

    }

    score = severity_score.get(
        severity,
        45
    )


    score += min(
        people_affected,
        15
    )


    if location_risk.lower() == "high":

        score += 10

    elif location_risk.lower() == "low":

        score -= 5


    if road_accessibility.lower() == "low":

        score += 8


    if hospital_availability.lower() == "low":

        score += 7


    score = max(
        0,
        min(score, 100)
    )


    if score >= 75:

        risk = "high"

    elif score >= 45:

        risk = "medium"

    else:

        risk = "low"


    return risk, score