import json
import logging
from typing import Dict, List, Optional
from google.genai import types

from app.core.logging import logger
from app.schemas.compatibility import (
    CompatibilityBreakdown,
    CompatibilityReport,
    UserProfileSummary,
)
from app.services.compatibility_engine import calculate_deterministic_breakdown
from app.services.gemini_service import GeminiService, gemini_service

COMPATIBILITY_INSIGHTS_PROMPT = """
You are an expert Relationship Compatibility Intelligence engine for "Hey Shona!", an AI dating platform that values depth, values-alignment, trust, and relationship quality.

Your goal is to compare two user profiles and generate structured qualitative insights explaining WHY they might connect, identifying constructive differences, and providing engaging conversation starters.

RULES:
1. Do NOT calculate or alter compatibility percentages (percentages are strictly calculated deterministically).
2. Base insights strictly on the users' profiles provided below.
3. Frame differences constructively as opportunities for mutual discovery or discussion, NOT red flags or fatal flaws.
4. Generate 3 to 4 personalized 'why_you_might_connect' points highlighting shared values, complementary traits, or lifestyle synergy.
5. Generate 2 to 3 constructive 'potential_differences' highlighting areas requiring thoughtful communication.
6. Generate exactly 3 personalized, fun, and thoughtful 'conversation_starters' based on their specific hobbies or values.
7. Return a single JSON object strictly matching this schema:

{
  "headline": "A one-sentence engaging summary of their connection (e.g. 'Shared appreciation for intellectual curiosity and creative freedom creates strong conversational chemistry.')",
  "overall_explanation": "A 2-3 sentence thoughtful overview of their relational synergy.",
  "why_you_might_connect": [
    "...",
    "...",
    "..."
  ],
  "potential_differences": [
    "...",
    "..."
  ],
  "conversation_starters": [
    "...",
    "...",
    "..."
  ]
}

Do not include any markdown fences or conversational filler outside the JSON object.
"""


class CompatibilityService:
    def __init__(self, gemini: Optional[GeminiService] = None):
        self.gemini = gemini or gemini_service

    def analyze_compatibility(
        self, user_a: UserProfileSummary, user_b: UserProfileSummary
    ) -> CompatibilityReport:
        """
        1. Calculates deterministic weighted dimension scores.
        2. Queries Gemini AI for semantic qualitative insights (Why connect, Differences, Starters).
        3. Returns complete CompatibilityReport.
        """
        # Step 1: Calculate deterministic score & breakdown
        overall_score, breakdown = calculate_deterministic_breakdown(
            user_a.profile_data, user_b.profile_data
        )

        # Step 2: Use Gemini for qualitative interpretation
        user_a_summary = {
            "name": user_a.name,
            "bio": user_a.bio,
            "core_values": [v.value for v in user_a.profile_data.core_values],
            "interests": [i.interest for i in user_a.profile_data.interests_and_lifestyle],
            "expectations": [e.expectation for e in user_a.profile_data.relationship_expectations],
            "communication": [c.preference for c in user_a.profile_data.communication_preferences],
            "boundaries": [b.boundary for b in user_a.profile_data.personal_boundaries],
        }

        user_b_summary = {
            "name": user_b.name,
            "bio": user_b.bio,
            "core_values": [v.value for v in user_b.profile_data.core_values],
            "interests": [i.interest for i in user_b.profile_data.interests_and_lifestyle],
            "expectations": [e.expectation for e in user_b.profile_data.relationship_expectations],
            "communication": [c.preference for c in user_b.profile_data.communication_preferences],
            "boundaries": [b.boundary for b in user_b.profile_data.personal_boundaries],
        }

        user_prompt = (
            f"Compare these two profiles:\n\n"
            f"=== USER A ({user_a.name}) ===\n{json.dumps(user_a_summary, indent=2)}\n\n"
            f"=== USER B ({user_b.name}) ===\n{json.dumps(user_b_summary, indent=2)}\n\n"
            f"Calculated Overall Compatibility: {overall_score}%\n"
            f"Breakdown: Core Values {breakdown.core_values.score}%, Expectations {breakdown.relationship_expectations.score}%, "
            f"Communication {breakdown.communication_style.score}%, Lifestyle {breakdown.lifestyle_and_interests.score}%, "
            f"Boundaries {breakdown.personal_boundaries.score}%.\n\n"
            f"Generate the qualitative compatibility report adhering to the requested JSON format."
        )

        try:
            client = self.gemini._get_client()
            config = types.GenerateContentConfig(
                system_instruction=COMPATIBILITY_INSIGHTS_PROMPT,
                response_mime_type="application/json",
                temperature=0.3,
            )
            response = client.models.generate_content(
                model=self.gemini.model,
                contents=user_prompt,
                config=config,
            )

            raw_text = getattr(response, "text", "") or ""
            cleaned = self.gemini._extract_and_clean_text(raw_text)
            ai_data = json.loads(cleaned)

            headline = ai_data.get("headline", f"High resonance across shared core values ({overall_score}%).")
            overall_explanation = ai_data.get(
                "overall_explanation",
                f"{user_a.name} and {user_b.name} show promising alignment, particularly in their shared personal priorities.",
            )
            why_connect = ai_data.get("why_you_might_connect", [
                "Strong mutual alignment on shared values and authenticity.",
                "Compatible expectations regarding relationship depth and mutual growth.",
            ])
            differences = ai_data.get("potential_differences", [
                "Different day-to-day schedules or activity pacings that invite healthy curiosity.",
            ])
            starters = ai_data.get("conversation_starters", [
                f"What is a passion project you've been most excited about recently?",
                f"What does your ideal Sunday morning look like?",
            ])

        except Exception as exc:
            logger.warning(f"Gemini AI comparison generation failed; falling back to rule-based insights: {exc}")
            # Graceful fallback: construct rule-based insights without blocking user
            headline = f"Strong alignment in core values and shared life priorities ({overall_score}%)."
            overall_explanation = (
                f"{user_a.name} and {user_b.name} share foundational principles and compatible communication styles, "
                f"providing a strong base for genuine connection."
            )
            why_connect = [
                f"Both prioritize depth, authenticity, and mutual respect in relationships.",
                f"Overlapping interests in {user_a.profile_data.interests_and_lifestyle[0].interest if user_a.profile_data.interests_and_lifestyle else 'personal growth'}.",
                f"Complementary communication preferences that allow space for thoughtful conversation.",
            ]
            differences = [
                f"Different daily professional demands that provide opportunities to share diverse perspectives.",
                f"Distinct leisure rhythms that balance quiet focus with adventurous energy.",
            ]
            starters = [
                f"What inspired your journey into {user_b.occupation}?",
                f"What is something you're deeply curious about right now?",
                f"What does a meaningful conversation look like when getting to know someone?",
            ]

        return CompatibilityReport(
            overall_score=overall_score,
            headline=headline,
            overall_explanation=overall_explanation,
            breakdown=breakdown,
            why_you_might_connect=why_connect,
            potential_differences=differences,
            conversation_starters=starters,
        )


compatibility_service = CompatibilityService()
