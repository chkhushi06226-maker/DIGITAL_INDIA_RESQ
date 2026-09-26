def recommend_resources(
    emergency_type,
    severity,
    risk_level
):

    resources = []


    if emergency_type in [
        "fire",
        "industrial_accident",
        "building_collapse"
    ]:

        resources.append({
            "type": "fire_engine",
            "quantity": 2
        })


    if emergency_type in [
        "medical",
        "accident",
        "fire",
        "building_collapse",
        "industrial_accident"
    ]:

        resources.append({
            "type": "ambulance",
            "quantity": 1
        })


    if emergency_type in [
        "accident",
        "fire",
        "flood",
        "building_collapse",
        "industrial_accident"
    ]:

        resources.append({
            "type": "police_unit",
            "quantity": 2
        })


    if emergency_type in [
        "fire",
        "flood",
        "earthquake",
        "building_collapse",
        "landslide"
    ]:

        resources.append({
            "type": "drone",
            "quantity": 1
        })


    if severity == "critical" or risk_level == "high":

        resources.append({
            "type": "command_team",
            "quantity": 1
        })


    if not resources:

        resources.append({
            "type": "response_unit",
            "quantity": 1
        })


    return resources