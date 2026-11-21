import json
from typing import Optional
from google.genai import types

from app.core.logging import logger
from app.schemas.cupid import CupidAdviceRequest, CupidAdviceResponse
from app.services.gemini_service import GeminiService, gemini_service

CUPID_SYSTEM_PROMPT = """
You are Cupid AI 🏹 💘, the charming, intuitive, and emotionally intelligent dating wingman for "Hey Shona!".
Your goal is to help users break the ice, revive stagnant conversations, and communicate authentically with their match based on psychological depth and shared interests.

Tone: Warm, witty, encouraging, observant, and respectful. Avoid superficial pickup lines or manipulative tactics. Focus on genuine curiosity and playful banter.

Output format: Return ONLY a valid JSON object matching:
{
  "cupid_vibe": "One-line charming insight into their conversational chemistry",
  "starters": [
    "Thoughtful, specific question 1 referencing their interests",
    "Engaging, playful question 2",
    "Deeper values question 3"
  ],
  "topic_revivers": [
    "A fun, unexpected pivot question when conversation slows down",
    "A cozy scenario question to reignite banter",
    "A question about recent discoveries, books, or favorite spots"
  ],
  "communication_tips": [
    "Practical advice on pacing and communication style for this match",
    "Green-flag topic to explore",
    "Boundary or schedule consideration to be mindful of"
  ],
  "custom_reply": "Personalized advice if the user asked a specific question, or a cute sign-off"
}
"""


class CupidService:
    def __init__(self, gemini: Optional[GeminiService] = None):
        self.gemini = gemini or gemini_service

    def generate_advice(self, req: CupidAdviceRequest) -> CupidAdviceResponse:
        """Generates Cupid coaching advice using Gemini AI with fallback."""
        user_prompt = (
            f"User Name: {req.user_name}\n"
            f"Match Name: {req.match_name}\n"
            f"Match Job: {req.match_occupation}\n"
            f"Match Bio: {req.match_bio}\n"
            f"Match Core Values: {', '.join(req.match_values) if req.match_values else 'Authenticity'}\n"
            f"Match Interests: {', '.join(req.match_interests) if req.match_interests else 'Art, Travel'}\n"
            f"Match Communication Style: {req.match_communication or 'Direct & thoughtful'}\n"
            f"User Specific Query: {req.user_query or 'General conversation starters and guidance'}\n"
        )

        try:
            client = self.gemini._get_client()
            config = types.GenerateContentConfig(
                system_instruction=CUPID_SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.4,
            )
            response = client.models.generate_content(
                model=self.gemini.model,
                contents=user_prompt,
                config=config,
            )

            raw_text = response.text.strip()
            data = json.loads(raw_text)
            return CupidAdviceResponse(
                match_name=req.match_name,
                cupid_vibe=data.get("cupid_vibe", f"Sparking great dialogue with {req.match_name}!"),
                starters=data.get("starters", [
                  f"What's the story behind your passion for {req.match_occupation}?",
                  f"If you could teleport to any place right now for a weekend getaway, where would it be?",
                  f"What is something you recently tried for the first time?"
                ]),
                topic_revivers=data.get("topic_revivers", [
                  "If our Sunday had zero obligations, how would we spend it?",
                  "What's your most controversial food opinion?",
                  "What was the highlight of your week so far?"
                ]),
                communication_tips=data.get("communication_tips", [
                  f"Keep the energy light and curious. {req.match_name} appreciates authentic engagement.",
                  "Ask open-ended questions about their creative projects or hobbies.",
                  "Give them space to reply without pressure—quality beats speed."
                ]),
                custom_reply=data.get("custom_reply", "Go for it with confidence! You've got this! 🏹 💘"),
            )
        except Exception as exc:
            logger.warning(f"Cupid Gemini AI error ({exc}), applying intelligent fallback.")
            return self._fallback_advice(req)

    def _fallback_advice(self, req: CupidAdviceRequest) -> CupidAdviceResponse:
        interests_str = req.match_interests[0] if req.match_interests else "your creative interests"
        return CupidAdviceResponse(
            match_name=req.match_name,
            cupid_vibe=f"Cupid detects strong shared curiosity with {req.match_name}! 🏹",
            starters=[
                f"I saw you're into {interests_str}—what first got you hooked on it?",
                f"How has your week been treating you so far in {req.match_occupation}?",
                "What's your absolute favorite way to decompress on a quiet Sunday?",
            ],
            topic_revivers=[
                "Hypothetical question: You get 24 hours in any city in the world with no itinerary—where are we heading?",
                "What's a book, podcast, or album that changed your perspective recently?",
                "If we were grabbing coffee right now, what's your go-to order?",
            ],
            communication_tips=[
                f"Match their thoughtful tone—{req.match_name} values substance over small talk.",
                f"Highlight shared curiosity about {interests_str}.",
                "Keep messages warm and conversational, leaving room for their perspective.",
            ],
            custom_reply=(
                f"Cupid's tip: Ask {req.match_name} about what inspired their latest project! People love talking about what lights them up."
            ),
        )


cupid_service = CupidService()
