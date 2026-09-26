import re


KEYWORDS = {

    "fire": [
        "fire",
        "smoke",
        "flame",
        "burning",
        "blaze"
    ],

    "accident": [
        "accident",
        "crash",
        "collision",
        "vehicle"
    ],

    "medical": [
        "unconscious",
        "injury",
        "injured",
        "breathing",
        "medical",
        "ambulance"
    ],

    "flood": [
        "flood",
        "flooded",
        "waterlogging",
        "water level"
    ],

    "earthquake": [
        "earthquake",
        "tremor",
        "shaking"
    ],

    "building_collapse": [
        "building collapsed",
        "collapse",
        "debris",
        "rubble"
    ],

    "landslide": [
        "landslide",
        "mudslide",
        "rockfall"
    ],

    "industrial_accident": [
        "chemical leak",
        "gas leak",
        "factory accident",
        "industrial accident"
    ],

    "missing_person": [
        "missing person",
        "missing",
        "lost child"
    ]
}


def classify_emergency(description, emergency_type=None):

    if emergency_type:
        emergency_type = emergency_type.lower().replace(" ", "_")

        if emergency_type in KEYWORDS:
            return emergency_type, 95

    text = description.lower()

    scores = {}

    for category, keywords in KEYWORDS.items():

        score = 0

        for keyword in keywords:

            if keyword in text:
                score += 1

        scores[category] = score

    best_category = max(
        scores,
        key=scores.get
    )

    if scores[best_category] == 0:
        return "other", 50

    confidence = min(
        95,
        65 + scores[best_category] * 10
    )

    return best_category, confidence