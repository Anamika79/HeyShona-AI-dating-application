import json
import re
from typing import List, Optional, Dict, Any
from google.genai import types

from app.core.logging import logger
from app.schemas.date_planner import (
    DatePreferenceProfile,
    DatePlanningRequest,
    DatePlanResponse,
    DateConcept,
    ItineraryItem,
)
from app.services.gemini_service import GeminiService, gemini_service

# In-memory preference storage for demo users
DEFAULT_PREFERENCE_STORE: Dict[str, DatePreferenceProfile] = {
    "current_user": DatePreferenceProfile(
        user_id="current_user",
        user_name="Anamika",
        food_preferences=["Specialty pour-over coffee", "Artisanal bakery", "Fresh Italian pasta", "Herbal infusions"],
        favorite_activities=["Art gallery walks", "Minimalist bookstore browsing", "Typography & pottery workshops", "Lakeside strolls"],
        disliked_activities=["Overly loud nightclubs", "Rushed commercial buffets", "Chaotic shopping malls"],
        environment_preference="Cozy indoor spaces & scenic shaded greenery",
        vibe_preference="Creative, Relaxed & Meaningful",
        budget_preference="Moderate (₹1,500 - ₹3,000)",
        preferred_locations=["Indiranagar art cafes", "Church Street bookstores", "Cubbon Park bamboo groves"],
    ),
    "user_3": DatePreferenceProfile(
        user_id="user_3",
        user_name="Dr. Maya Alva",
        food_preferences=["Single-origin espresso", "Comforting warm ramen", "Organic wholesome grain bowls", "Sourdough pastries"],
        favorite_activities=["Early morning trail walks", "Marathon recovery downtime", "Quiet indie coffee corners", "Botanical plant nurseries"],
        disliked_activities=["Overcrowded nightlife", "High-stress loud events", "Rushed tight timelines"],
        environment_preference="Quiet airy interiors & calm outdoor gardens",
        vibe_preference="Low-pressure, Restorative & Empathetic",
        budget_preference="Moderate",
        accessibility_notes="Prefers flexible, relaxed pacing to accommodate hospital on-call recovery.",
        preferred_locations=["Quiet leafy avenues", "Peaceful reading spots", "Boutique coffee roasters"],
    ),
    "user_2": DatePreferenceProfile(
        user_id="user_2",
        user_name="Rohan Verma",
        food_preferences=["Pour-over coffee", "Artisanal gelato", "Modern Japanese tapas", "Craft mocktails"],
        favorite_activities=["Vinyl record hunting", "Live acoustic jazz sessions", "Architecture & design gallery walks", "Bookstore browsing"],
        disliked_activities=["Generic noisy bars", "Crowded food courts", "Fast-food chain dates"],
        environment_preference="Aesthetic intimate interiors & breezy rooftop courtyards",
        vibe_preference="Playful, Inspiring & Design-forward",
        budget_preference="Moderate to Premium",
        preferred_locations=["Bandra heritage lanes", "Kala Ghoda art cafes", "Indie vinyl hubs"],
    ),
}

DATE_PLANNER_SYSTEM_PROMPT = """
You are the AI Date Planner for "Hey Shona!", an intentional dating application designed for genuine connection and shared values.
Your goal is to curate 3 distinct, thoughtful date concepts for two matched users based on their mutual interests, lifestyle rhythms, and preferences.

GUIDELINES:
1. Personalization: Synthesize both participants' profiles, dietary preferences, and hobbies.
2. Fair Consideration: Balance both individuals' comfort. Never recommend an activity or venue type that either person explicitly dislikes.
3. Realistic & Non-Fictional: Do NOT invent fake restaurant names, phone numbers, or arbitrary addresses. Refer to authentic venue types and iconic neighborhood zones (e.g. "a tranquil specialty coffee roastery in Indiranagar", "a vintage vinyl and jazz lounge in Bandra").
4. Thoughtful Pacing: Plan natural, low-pressure transitions (e.g., quiet coffee first, followed by an interactive creative activity, ending with a relaxed walk).
5. Structured JSON Output: Return ONLY valid JSON adhering to the specified format.

Output JSON format:
{
  "personalized_synergy_summary": "1-2 sentences explaining how these dates bridge their mutual interests and recharge rhythms.",
  "concepts": [
    {
      "id": "concept_1",
      "title": "Creative Date Title 1",
      "tagline": "Short evocative catchphrase",
      "description": "2-3 sentences painting a vivid picture of the shared experience.",
      "why_it_suits_both": "Concrete explanation connecting both users' values, hobbies, and dietary preferences.",
      "date_type": "Creative & Relaxed",
      "indoor_outdoor": "Balanced Indoor & Shaded Garden",
      "estimated_duration": "3 to 4 hours",
      "estimated_total_cost": "₹1,800 - ₹2,500 total",
      "suggested_activities": ["Activity 1", "Activity 2", "Activity 3"],
      "things_to_consider": ["Tip on parking/timing", "Comfort tip regarding footwear or weather"],
      "itinerary": [
        {
          "step_number": 1,
          "time_slot": "4:30 PM - 5:45 PM",
          "activity_name": "Specialty Coffee & Gentle Introductions",
          "description": "Meet at a quiet neighborhood roastery with pour-over brews and fresh sourdough treats.",
          "location_type": "Boutique Coffee House",
          "indoor_outdoor": "Indoor Cozy",
          "estimated_cost": "₹500 - ₹700"
        },
        {
          "step_number": 2,
          "time_slot": "6:00 PM - 7:30 PM",
          "activity_name": "Interactive Gallery or Craft Walk",
          "description": "Explore contemporary art installations, sketchbooks, or vinyl records together at an unhurried pace.",
          "location_type": "Art Space / Cultural Studio",
          "indoor_outdoor": "Indoor",
          "estimated_cost": "₹400 - ₹600"
        },
        {
          "step_number": 3,
          "time_slot": "7:45 PM - 9:00 PM",
          "activity_name": "Sunset Stroll & Comfort Dinner",
          "description": "Enjoy a peaceful twilight stroll under tree canopies followed by warm artisanal comfort food.",
          "location_type": "Breezy Courtyard Eatery",
          "indoor_outdoor": "Open-air Garden",
          "estimated_cost": "₹900 - ₹1,200"
        }
      ],
      "alternative_options": "Rainy weather backup: Pivot the walk to a cozy indie bookstore with private reading nooks.",
      "travel_tips": "Easy cab accessibility; recommend arriving 10 minutes early to secure a garden table."
    }
  ]
}
"""


class DatePlannerService:
    def __init__(self, gemini: Optional[GeminiService] = None):
        self.gemini = gemini or gemini_service

    def get_user_preferences(self, user_id: str, default_name: str = "User") -> DatePreferenceProfile:
        """Retrieves user's date preferences or returns intelligent defaults."""
        if user_id in DEFAULT_PREFERENCE_STORE:
            return DEFAULT_PREFERENCE_STORE[user_id]
        
        return DatePreferenceProfile(
            user_id=user_id,
            user_name=default_name,
            food_preferences=["Specialty coffee", "Fresh artisanal cuisine"],
            favorite_activities=["Art galleries", "Quiet bookstore cafes", "Peaceful walks"],
            disliked_activities=["Noisy nightclubs", "Crowded malls"],
            environment_preference="Cozy indoors & serene outdoors",
            vibe_preference="Relaxed & Meaningful",
            budget_preference="Moderate",
            preferred_locations=["Tranquil neighborhood cafes", "Parks", "Art hubs"],
        )

    def save_user_preferences(self, user_id: str, prefs: DatePreferenceProfile) -> DatePreferenceProfile:
        """Saves or updates date preferences for an individual user."""
        DEFAULT_PREFERENCE_STORE[user_id] = prefs
        logger.info(f"Updated date preferences for user_id={user_id}")
        return prefs

    def generate_date_plan(self, req: DatePlanningRequest) -> DatePlanResponse:
        """Generates 3 customized date recommendations using Gemini AI with fallback."""
        user_prefs = req.user_preferences or self.get_user_preferences("current_user", req.user_name)
        match_prefs = req.match_preferences or self.get_user_preferences(req.connection_id, req.match_name)

        ai_payload = self._call_gemini_planner(req, user_prefs, match_prefs)

        concepts: List[DateConcept] = []
        raw_concepts = ai_payload.get("concepts", [])

        for idx, c in enumerate(raw_concepts):
            itinerary_items: List[ItineraryItem] = []
            for item in c.get("itinerary", []):
                itinerary_items.append(
                    ItineraryItem(
                        step_number=item.get("step_number", 1),
                        time_slot=item.get("time_slot", "5:00 PM - 6:30 PM"),
                        activity_name=item.get("activity_name", "Activity"),
                        description=item.get("description", "Enjoyable shared experience."),
                        location_type=item.get("location_type", "Cafe"),
                        indoor_outdoor=item.get("indoor_outdoor", "Indoor"),
                        estimated_cost=item.get("estimated_cost", "₹500"),
                    )
                )

            concepts.append(
                DateConcept(
                    id=c.get("id", f"concept_{idx + 1}"),
                    title=c.get("title", f"The {req.date_type} Experience"),
                    tagline=c.get("tagline", "Designed for genuine conversation and low-pressure connection"),
                    description=c.get("description", "A relaxed date tailored to your shared rhythms."),
                    why_it_suits_both=c.get(
                        "why_it_suits_both",
                        f"Bridges {req.user_name}'s appreciation for artful spaces and {req.match_name}'s restorative downtime.",
                    ),
                    date_type=c.get("date_type", req.date_type),
                    indoor_outdoor=c.get("indoor_outdoor", "Balanced Indoor & Shaded Garden"),
                    estimated_duration=c.get("estimated_duration", "3 to 4 hours"),
                    estimated_total_cost=c.get("estimated_total_cost", req.budget_range),
                    suggested_activities=c.get("suggested_activities", ["Coffee & Conversation", "Gallery Browsing", "Evening Walk"]),
                    things_to_consider=c.get("things_to_consider", ["Book weekend tables ahead of time", "Wear comfortable walking shoes"]),
                    itinerary=itinerary_items,
                    alternative_options=c.get("alternative_options", "Indoor option: Pivot the outdoor portion to a cozy indie bookstore."),
                    travel_tips=c.get("travel_tips", "Centrally located with convenient cab pickup spots."),
                )
            )

        synergy_summary = ai_payload.get(
            "personalized_synergy_summary",
            f"These curated experiences honor {req.user_name}'s love for creative aesthetics and {req.match_name}'s preference for calm, restorative pacing.",
        )

        return DatePlanResponse(
            connection_id=req.connection_id,
            user_name=req.user_name,
            match_name=req.match_name,
            city=req.city,
            date_type=req.date_type,
            budget_range=req.budget_range,
            concepts=concepts,
            personalized_synergy_summary=synergy_summary,
        )

    def _call_gemini_planner(
        self,
        req: DatePlanningRequest,
        user_prefs: DatePreferenceProfile,
        match_prefs: DatePreferenceProfile,
    ) -> Dict[str, Any]:
        """Calls Gemini API or applies rich personalized fallback."""
        try:
            client = self.gemini._get_client()

            prompt_content = (
                f"User: {req.user_name}\n"
                f"User Food Preferences: {', '.join(user_prefs.food_preferences)}\n"
                f"User Favorite Activities: {', '.join(user_prefs.favorite_activities)}\n"
                f"User Disliked Activities: {', '.join(user_prefs.disliked_activities)}\n"
                f"User Environment Preference: {user_prefs.environment_preference}\n"
                f"User Vibe Preference: {user_prefs.vibe_preference}\n\n"
                f"Match: {req.match_name}\n"
                f"Match Food Preferences: {', '.join(match_prefs.food_preferences)}\n"
                f"Match Favorite Activities: {', '.join(match_prefs.favorite_activities)}\n"
                f"Match Disliked Activities: {', '.join(match_prefs.disliked_activities)}\n"
                f"Match Environment Preference: {match_prefs.environment_preference}\n"
                f"Match Vibe Preference: {match_prefs.vibe_preference}\n"
                f"Match Accessibility Notes: {match_prefs.accessibility_notes or 'None'}\n\n"
                f"Target City: {req.city}\n"
                f"Date & Time: {req.preferred_date} ({req.preferred_time_of_day})\n"
                f"Desired Date Type: {req.date_type}\n"
                f"Budget Range: {req.budget_range}\n"
                f"Additional User Request / Note: {req.additional_notes or 'Focus on low-pressure, authentic conversation.'}\n\n"
                f"Generate 3 personalized date concepts conforming strictly to the JSON schema."
            )

            config = types.GenerateContentConfig(
                system_instruction=DATE_PLANNER_SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.5,
            )

            response = client.models.generate_content(
                model=self.gemini.model,
                contents=prompt_content,
                config=config,
            )

            cleaned_text = response.text.strip()
            if cleaned_text.startswith("```"):
                cleaned_text = re.sub(r"^```(?:json)?\n", "", cleaned_text)
                cleaned_text = re.sub(r"\n```$", "", cleaned_text)

            return json.loads(cleaned_text)
        except Exception as e:
            logger.warning(f"Gemini Date Planner error ({e}), applying intelligent personalized fallback.")
            return self._generate_fallback_date_concepts(req, user_prefs, match_prefs)

    def _generate_fallback_date_concepts(
        self,
        req: DatePlanningRequest,
        user_prefs: DatePreferenceProfile,
        match_prefs: DatePreferenceProfile,
    ) -> Dict[str, Any]:
        """Provides rich, contextual date itineraries tailored to the match."""
        is_maya = "maya" in req.match_name.lower() or "pediatric" in str(req.match_profile or "").lower()
        is_rohan = "rohan" in req.match_name.lower() or "piano" in str(req.match_profile or "").lower()

        city_tag = req.city if req.city else "Bengaluru"

        if is_maya:
            # Maya Alva (Doctor & Marathoner who values recovery & quiet coffee)
            synergy = f"Carefully balanced for Anamika's eye for creative spaces and Maya's need for relaxing, post-hospital recharge time with zero chaotic crowds."
            concepts = [
                {
                    "id": "maya_concept_1",
                    "title": "The Artful Roastery & Greenery Escape",
                    "tagline": "Specialty pour-overs, botanical serenity, and unhurried conversation",
                    "description": "Start at a quiet neighborhood micro-roastery sampling single-origin Ethiopian pour-overs, followed by a shaded botanical garden walk and comforting warm dinner.",
                    "why_it_suits_both": f"Satisfies Anamika's passion for specialty coffee culture and Maya's love for open green spaces that restore energy after intense pediatric shifts.",
                    "date_type": "Relaxed & Restorative",
                    "indoor_outdoor": "Cozy Roastery & Shaded Botanical Garden",
                    "estimated_duration": "3.5 hours",
                    "estimated_total_cost": "₹1,800 - ₹2,400 total",
                    "suggested_activities": ["Tasting single-origin pour-overs", "Strolling under old bamboo canopies", "Warm comfort dinner"],
                    "things_to_consider": ["Comfortable flat footwear for the garden paths", "Pre-book outdoor garden seating for dinner"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "4:30 PM - 5:45 PM",
                            "activity_name": "Artisanal Pour-Over Tasting",
                            "description": "Meet at a tranquil neighborhood cafe known for light roasts, soothing jazz, and fresh sourdough cardamom buns.",
                            "location_type": "Specialty Coffee Roastery",
                            "indoor_outdoor": "Indoor Cozy",
                            "estimated_cost": "₹550"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "6:00 PM - 7:15 PM",
                            "activity_name": "Twilight Botanical & Bamboo Walk",
                            "description": "A quiet stroll through tree-lined pathways, discussing favorite weekend rituals with zero phone distractions.",
                            "location_type": "Botanical Garden / City Park",
                            "indoor_outdoor": "Outdoor Shaded",
                            "estimated_cost": "₹100 (park entry)"
                        },
                        {
                            "step_number": 3,
                            "time_slot": "7:30 PM - 8:45 PM",
                            "activity_name": "Warm Comfort Bowl Dinner",
                            "description": "A wholesome meal featuring fresh sourdough, handmade pasta or comforting ramen in an ambient open courtyard.",
                            "location_type": "Courtyard Bistro",
                            "indoor_outdoor": "Semi-outdoor Patio",
                            "estimated_cost": "₹1,400"
                        }
                    ],
                    "alternative_options": "Rain backup: Transition from the roastery into an intimate art gallery with indoor cafe seating.",
                    "travel_tips": "Both venues are within 8 minutes walking distance, minimizing transit friction."
                },
                {
                    "id": "maya_concept_2",
                    "title": "Mindful Pottery & Herbal Tea Sanctuary",
                    "tagline": "Tactile creativity, hands-on clay, and soothing calm",
                    "description": "A gentle beginner-friendly wheel pottery session where you both create small ceramic cups, followed by soothing herbal teas and desserts.",
                    "why_it_suits_both": "Offers a fun, non-awkward shared creative project for Anamika while giving Maya a therapeutic tactile escape from hospital sterile routines.",
                    "date_type": "Creative & Mindful",
                    "indoor_outdoor": "Indoor Studio & Tea Terrace",
                    "estimated_duration": "3 hours",
                    "estimated_total_cost": "₹2,500 - ₹3,200 total",
                    "suggested_activities": ["Wheel pottery making", "Herb infusion tasting", "Shared laughter over imperfect cups"],
                    "things_to_consider": ["Wear relaxed clothes that you don't mind getting a splash of clay on"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "5:00 PM - 6:30 PM",
                            "activity_name": "Handmade Clay & Cup Workshop",
                            "description": "Private studio table with instructor guidance to shape and fire your own ceramic coffee cups.",
                            "location_type": "Artisan Pottery Studio",
                            "indoor_outdoor": "Indoor Sunlit Studio",
                            "estimated_cost": "₹1,800 (workshop for two)"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "6:45 PM - 8:00 PM",
                            "activity_name": "Herbal Infusions & Pastry Wind-Down",
                            "description": "Relax on a nearby rooftop greenhouse terrace with chamomile-lavender infusions and artisanal tarts.",
                            "location_type": "Botanical Tea House",
                            "indoor_outdoor": "Glasshouse Terrace",
                            "estimated_cost": "₹800"
                        }
                    ],
                    "alternative_options": "If pottery is booked, substitute with a private botanical terrarium building session.",
                    "travel_tips": "Studio provides aprons and dedicated wash stations."
                },
                {
                    "id": "maya_concept_3",
                    "title": "Sunset Lake Trail & Al Fresco Trattoria",
                    "tagline": "Golden hour reflection and authentic Italian plates",
                    "description": "A gentle stroll along the lake perimeter as the sun dips below the skyline, concluding with candlelit al fresco pasta under fairy lights.",
                    "why_it_suits_both": "Combines Maya's comfort in scenic outdoor pacing with Anamika's love for warm, authentic Italian dining.",
                    "date_type": "Romantic & Relaxed",
                    "indoor_outdoor": "Lakeside Boardwalk & Al Fresco Trattoria",
                    "estimated_duration": "3 hours",
                    "estimated_total_cost": "₹2,000 - ₹2,800 total",
                    "suggested_activities": ["Scenic boardwalk golden hour walk", "Handmade ravioli & focaccia", "Deep conversation under twilight"],
                    "things_to_consider": ["Arrive at 5:15 PM to catch prime sunset lighting"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "5:15 PM - 6:30 PM",
                            "activity_name": "Golden Hour Lake Perimeter Walk",
                            "description": "Breezy walk along the perimeter path, enjoying cool evening air and birdwatching.",
                            "location_type": "Lake Promenade",
                            "indoor_outdoor": "Outdoor Waterfront",
                            "estimated_cost": "Free"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "6:45 PM - 8:30 PM",
                            "activity_name": "Candlelit Al Fresco Italian Dinner",
                            "description": "Authentic wood-fired sourdough pizza, hand-rolled gnocchi, and sparkling citrus sodas under amber lantern lights.",
                            "location_type": "Garden Trattoria",
                            "indoor_outdoor": "Open-air Garden Patio",
                            "estimated_cost": "₹2,200"
                        }
                    ],
                    "alternative_options": "If windy, ask for an enclosed conservatory table overlooking the courtyard.",
                    "travel_tips": "Valet parking available at the trattoria."
                }
            ]
        elif is_rohan:
            # Rohan Verma (Jazz Pianist & Product Designer)
            synergy = f"Designed for Anamika's love of clean typography & craft and Rohan's appreciation for vinyl acoustics and inspiring banter."
            concepts = [
                {
                    "id": "rohan_concept_1",
                    "title": "The Vinyl Crate Dig & Acoustic Lounge",
                    "tagline": "Vintage record hunting, espresso, and live jazz harmonies",
                    "description": "Browse classic jazz and soul vinyl records at an independent music hub, sip crafted espresso, and settle into a cozy acoustic listening lounge.",
                    "why_it_suits_both": "Directly speaks to Rohan's passion for bebop piano and Anamika's eye for album sleeve art and design aesthetics.",
                    "date_type": "Cultural & Creative",
                    "indoor_outdoor": "Indoor Music Hub & Jazz Courtyard",
                    "estimated_duration": "3.5 hours",
                    "estimated_total_cost": "₹2,000 - ₹2,800 total",
                    "suggested_activities": ["Crate digging for rare vinyl records", "Single-origin espresso pairings", "Live acoustic piano lounge"],
                    "things_to_consider": ["Check jazz lounge performance schedule to reserve tables near the acoustics"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "5:00 PM - 6:15 PM",
                            "activity_name": "Independent Record Store Exploration",
                            "description": "Flip through vintage vinyl crates, sharing favorite album covers and design typography.",
                            "location_type": "Boutique Vinyl Shop",
                            "indoor_outdoor": "Indoor",
                            "estimated_cost": "₹300 (browsing/coffee)"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "6:30 PM - 8:30 PM",
                            "activity_name": "Intimate Jazz Lounge & Tapas",
                            "description": "Acoustic trio playing Bill Evans and Miles Davis standards with gourmet small plates and craft mocktails.",
                            "location_type": "Live Music Tapas Lounge",
                            "indoor_outdoor": "Ambient Indoor",
                            "estimated_cost": "₹2,200"
                        }
                    ],
                    "alternative_options": "If the jazz session is sold out, pivot to a private listening bar with high-fidelity headphone booths.",
                    "travel_tips": "Located in the heritage arts district with lively, walkable sidewalks."
                },
                {
                    "id": "rohan_concept_2",
                    "title": "Architecture Gallery & Rooftop Gelato",
                    "tagline": "Design systems, gallery installations, and skyline views",
                    "description": "Walk through an evening modern art and design retrospective, followed by artisanal gelato on a scenic rooftop overlooking the city.",
                    "why_it_suits_both": "Matches both individuals' design discipline background, sparking effortless intellectual conversation.",
                    "date_type": "Creative & Playful",
                    "indoor_outdoor": "Gallery & Open-air Skyline Rooftop",
                    "estimated_duration": "3 hours",
                    "estimated_total_cost": "₹1,500 - ₹2,000 total",
                    "suggested_activities": ["Contemporary gallery walk", "Design critique banter", "Artisanal Sicilian gelato"],
                    "things_to_consider": ["Gallery exhibits require silent phone mode"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "5:30 PM - 7:00 PM",
                            "activity_name": "Contemporary Architecture & Design Exhibit",
                            "description": "Explore minimalist installations, product design prototypes, and photography collections.",
                            "location_type": "Art Foundation Gallery",
                            "indoor_outdoor": "Indoor Minimalist",
                            "estimated_cost": "₹400"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "7:15 PM - 8:30 PM",
                            "activity_name": "Rooftop Gelato & City Skyline Banter",
                            "description": "Fresh pistachio and dark chocolate gelato with panoramic evening views and cool breeze.",
                            "location_type": "Skyline Gelato Terrace",
                            "indoor_outdoor": "Open-air Rooftop",
                            "estimated_cost": "₹700"
                        }
                    ],
                    "alternative_options": "Add an optional stop at a 24/7 heritage bookstore across the street.",
                    "travel_tips": "Both spots are within 5 minutes walking distance."
                },
                {
                    "id": "rohan_concept_3",
                    "title": "Modern Japanese Tasting & Bookstore Walk",
                    "tagline": "Refined sushi, design books, and late-night tea",
                    "description": "A refined Japanese izakaya dining experience featuring clean aesthetic plates, followed by wandering an independent art bookstore.",
                    "why_it_suits_both": "Rohan's appreciation for Japanese minimalism combined with Anamika's love for art books and quiet evening dialogue.",
                    "date_type": "Food & Cultural",
                    "indoor_outdoor": "Indoor Izakaya & Bookstore",
                    "estimated_duration": "3 hours",
                    "estimated_total_cost": "₹2,600 - ₹3,400 total",
                    "suggested_activities": ["Matcha & sushi pairing", "Flipping through imported typography books", "Quiet nighttime city walk"],
                    "things_to_consider": ["Reserve counter seating for interactive chef view"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "6:30 PM - 8:00 PM",
                            "activity_name": "Modern Japanese Izakaya Dinner",
                            "description": "Hand-rolled sushi, tempura crisps, and warm miso soup in a warm cedar-wood dining room.",
                            "location_type": "Modern Japanese Bistro",
                            "indoor_outdoor": "Indoor Ambient",
                            "estimated_cost": "₹2,600"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "8:15 PM - 9:30 PM",
                            "activity_name": "Late Night Bookstore Browsing",
                            "description": "Browsing architecture and design monographs while sipping roasted hojicha tea.",
                            "location_type": "Curated Bookstore & Tea Bar",
                            "indoor_outdoor": "Indoor",
                            "estimated_cost": "₹500"
                        }
                    ],
                    "alternative_options": "Switch to an intimate dessert bar if either desires something sweet.",
                    "travel_tips": "Evening cabs readily available outside the book lounge."
                }
            ]
        else:
            # Generic personalized fallback
            synergy = f"Curated to connect {req.user_name} and {req.match_name} through relaxed, low-pressure shared activities tailored to {city_tag}."
            concepts = [
                {
                    "id": "gen_concept_1",
                    "title": "The Artisan Cafe & Gallery Promenade",
                    "tagline": "Great coffee, visual inspiration, and easygoing strolls",
                    "description": f"A delightful afternoon in {city_tag}'s most vibrant cultural enclave, pairing specialty brew tasting with an unhurried gallery walk.",
                    "why_it_suits_both": "Provides natural conversational anchors and an unhurried, comfortable pace.",
                    "date_type": req.date_type,
                    "indoor_outdoor": "Balanced Indoor & Shaded Street",
                    "estimated_duration": "3 hours",
                    "estimated_total_cost": "₹1,500 - ₹2,200 total",
                    "suggested_activities": ["Specialty pour-overs", "Curated gallery walk", "Street canopy stroll"],
                    "things_to_consider": ["Comfortable shoes for walking between spots"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "4:30 PM - 5:45 PM",
                            "activity_name": "Specialty Coffee Pairing",
                            "description": "Enjoy crafted coffees and warm pastries in a sunlit corner.",
                            "location_type": "Artisan Roastery",
                            "indoor_outdoor": "Indoor",
                            "estimated_cost": "₹600"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "6:00 PM - 7:30 PM",
                            "activity_name": "Independent Gallery Browsing",
                            "description": "Explore contemporary regional art and design installations.",
                            "location_type": "Art Gallery",
                            "indoor_outdoor": "Indoor",
                            "estimated_cost": "₹300"
                        }
                    ],
                    "alternative_options": "Rain backup: Extend time in the gallery's covered conservatory cafe.",
                    "travel_tips": "Easy central access."
                },
                {
                    "id": "gen_concept_2",
                    "title": "Sunset Park Walk & Courtyard Dinner",
                    "tagline": "Golden hour breezes followed by candlelit dining",
                    "description": "Take advantage of golden hour with a relaxing walk through landscaped city gardens, followed by a candlelit dinner.",
                    "why_it_suits_both": "Blends restorative outdoor calm with a romantic dinner atmosphere.",
                    "date_type": "Romantic & Relaxed",
                    "indoor_outdoor": "Outdoor Garden & Covered Patio",
                    "estimated_duration": "3 hours",
                    "estimated_total_cost": "₹2,000 - ₹2,800 total",
                    "suggested_activities": ["Golden hour photography", "Scenic park stroll", "Gourmet dinner"],
                    "things_to_consider": ["Check sunset timing"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "5:30 PM - 6:45 PM",
                            "activity_name": "Scenic Garden Walk",
                            "description": "Stroll under canopies of trees and enjoy the cooling evening breeze.",
                            "location_type": "City Park",
                            "indoor_outdoor": "Outdoor",
                            "estimated_cost": "Free"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "7:00 PM - 8:30 PM",
                            "activity_name": "Candlelit Al Fresco Dinner",
                            "description": "Fresh seasonal cuisine in an ambient courtyard.",
                            "location_type": "Courtyard Restaurant",
                            "indoor_outdoor": "Semi-outdoor",
                            "estimated_cost": "₹2,000"
                        }
                    ],
                    "alternative_options": "Indoors option: Move table inside to main dining hall if weather turns.",
                    "travel_tips": "Valet parking available."
                },
                {
                    "id": "gen_concept_3",
                    "title": "Hands-on Creative Workshop & Dessert Bar",
                    "tagline": "Make something together and celebrate with craft sweets",
                    "description": "An interactive, low-pressure creative class followed by celebrating your creations over craft desserts.",
                    "why_it_suits_both": "Gives hands-on shared engagement with plenty of laughter.",
                    "date_type": "Creative & Fun",
                    "indoor_outdoor": "Indoor Studios",
                    "estimated_duration": "3.5 hours",
                    "estimated_total_cost": "₹2,200 - ₹3,000 total",
                    "suggested_activities": ["Creative workshop", "Artisanal desserts", "Sharing travel stories"],
                    "things_to_consider": ["Book workshop slots 24 hours prior"],
                    "itinerary": [
                        {
                            "step_number": 1,
                            "time_slot": "4:30 PM - 6:30 PM",
                            "activity_name": "Creative Workshop Session",
                            "description": "Hands-on pottery, terrarium building, or latte art session.",
                            "location_type": "Creative Studio",
                            "indoor_outdoor": "Indoor",
                            "estimated_cost": "₹1,800"
                        },
                        {
                            "step_number": 2,
                            "time_slot": "6:45 PM - 8:00 PM",
                            "activity_name": "Craft Dessert & Mocktail Lounge",
                            "description": "Relax and debrief over gourmet desserts and teas.",
                            "location_type": "Dessert Bar",
                            "indoor_outdoor": "Indoor",
                            "estimated_cost": "₹800"
                        }
                    ],
                    "alternative_options": "Swap workshop for a private cooking demo.",
                    "travel_tips": "Centrally located."
                }
            ]

        return {
            "personalized_synergy_summary": synergy,
            "concepts": concepts
        }


date_planner_service = DatePlannerService()
