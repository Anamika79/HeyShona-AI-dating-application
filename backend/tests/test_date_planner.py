from app.schemas.date_planner import DatePlanningRequest, DatePreferenceProfile
from app.services.date_planner_service import date_planner_service


def test_get_and_save_date_preferences():
    """Verify independent user date preferences can be retrieved and saved."""
    user_id = "test_user_42"
    prefs = date_planner_service.get_user_preferences(user_id, "Test User")
    assert prefs.user_id == user_id

    # Update preferences
    prefs.food_preferences = ["Vegan sushi", "Matcha latte"]
    prefs.disliked_activities = ["Bowling"]
    saved = date_planner_service.save_user_preferences(user_id, prefs)
    assert saved.food_preferences == ["Vegan sushi", "Matcha latte"]

    retrieved = date_planner_service.get_user_preferences(user_id)
    assert "Bowling" in retrieved.disliked_activities


def test_generate_date_plan_synergy_and_itinerary():
    """Verify DatePlanner generates 3 concepts with structured itineraries."""
    req = DatePlanningRequest(
        connection_id="user_3",
        user_name="Anamika",
        match_name="Dr. Maya Alva",
        city="Bengaluru, India",
        date_type="Relaxed & Restorative",
    )
    plan = date_planner_service.generate_date_plan(req)
    assert plan.user_name == "Anamika"
    assert plan.match_name == "Dr. Maya Alva"
    assert len(plan.concepts) == 3

    first_concept = plan.concepts[0]
    assert len(first_concept.title) > 0
    assert len(first_concept.why_it_suits_both) > 0
    assert len(first_concept.itinerary) >= 2
    assert first_concept.itinerary[0].step_number == 1
    assert len(first_concept.itinerary[0].activity_name) > 0
    assert len(first_concept.things_to_consider) >= 1
