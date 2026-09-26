BASE_SEVERITY = {

    "fire": 3,
    "accident": 2,
    "medical": 2,
    "flood": 2,
    "earthquake": 3,
    "building_collapse": 4,
    "industrial_accident": 4,
    "landslide": 3,
    "missing_person": 1,
    "other": 1
}


def predict_severity(
    emergency_type,
    people_affected,
    description
):

    score = BASE_SEVERITY.get(
        emergency_type,
        1
    )

    description = description.lower()

    if people_affected >= 20:
        score += 3

    elif people_affected >= 10:
        score += 2

    elif people_affected >= 5:
        score += 1


    dangerous_words = [
        "explosion",
        "trapped",
        "unconscious",
        "chemical",
        "gas leak",
        "collapsed",
        "multiple victims",
        "spreading fire"
    ]


    for word in dangerous_words:

        if word in description:
            score += 1


    if score >= 7:

        severity = "critical"

    elif score >= 5:

        severity = "high"

    elif score >= 3:

        severity = "medium"

    else:

        severity = "low"


    return severity, score