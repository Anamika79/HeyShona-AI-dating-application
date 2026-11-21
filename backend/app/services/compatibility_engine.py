import json
from typing import Dict, List, Tuple
from app.schemas.compatibility import (
    CompatibilityBreakdown,
    CompatibilityReport,
    DimensionScore,
    UserProfileSummary,
)
from app.schemas.profile_intelligence import ProfileIntelligenceData

WEIGHTS = {
    "core_values": 0.30,
    "relationship_expectations": 0.25,
    "communication_style": 0.20,
    "lifestyle_and_interests": 0.15,
    "personal_boundaries": 0.10,
}

# Semantic synonym groupings to match meaning beyond exact keywords
SEMANTIC_SYNONYMS = {
    "honesty": ["authenticity", "truth", "genuine", "transparent", "openness", "integrity", "loyal", "loyalty"],
    "curiosity": ["intellectual", "learning", "growth", "ideas", "philosophy", "books", "debate", "exploration"],
    "empathy": ["kindness", "compassion", "service", "listening", "support", "gentle", "care", "warmth"],
    "creativity": ["art", "design", "music", "writing", "pottery", "games", "filmmaker", "craft"],
    "adventure": ["travel", "travelling", "hiking", "outdoors", "road trips", "explore", "nature", "surfing", "sports"],
    "spontaneity": ["fearless", "unplanned", "adrenaline", "lighthearted", "fun-first"],
    "discipline": ["routine", "marathon", "fitness", "ambition", "structured", "excellence"],
    "meaningful": ["deep", "long-term", "partnership", "intentional", "committed", "secure"],
}


def _extract_semantic_tokens(text: str) -> set:
    """Normalize and expand text into semantic root tokens."""
    tokens = set()
    cleaned = text.lower().replace(",", " ").replace(".", " ").replace("-", " ")
    words = [w.strip() for w in cleaned.split() if len(w.strip()) > 2]

    for word in words:
        tokens.add(word)
        for root, synonyms in SEMANTIC_SYNONYMS.items():
            if word == root or word in synonyms:
                tokens.add(root)
                for syn in synonyms:
                    tokens.add(syn)
    return tokens


def _compute_semantic_overlap(texts_a: List[str], texts_b: List[str]) -> float:
    """Compute semantic Jaccard overlap between two collections of text entries."""
    if not texts_a and not texts_b:
        return 0.70  # Neutral baseline when both sparse
    if not texts_a or not texts_b:
        return 0.60  # Graceful partial baseline (missing information is not incompatibility)

    tokens_a = set()
    for t in texts_a:
        tokens_a.update(_extract_semantic_tokens(t))

    tokens_b = set()
    for t in texts_b:
        tokens_b.update(_extract_semantic_tokens(t))

    if not tokens_a or not tokens_b:
        return 0.65

    intersection = tokens_a.intersection(tokens_b)
    union = tokens_a.union(tokens_b)

    ratio = len(intersection) / len(union) if union else 0.0
    # Map raw Jaccard overlap (typically 0.05 - 0.5) to a fair human score between 45% and 98%
    score = 45.0 + min(53.0, ratio * 130.0)
    return max(40.0, min(98.0, score))


def calculate_deterministic_breakdown(
    user_a: ProfileIntelligenceData, user_b: ProfileIntelligenceData
) -> Tuple[int, CompatibilityBreakdown]:
    """
    Computes deterministic, weighted scores across 5 dimensions:
    - Core Values (30%)
    - Relationship Expectations (25%)
    - Communication Style (20%)
    - Lifestyle & Interests (15%)
    - Personal Boundaries (10%)
    """
    # 1. Core Values (30%)
    vals_a = [v.value for v in user_a.core_values]
    vals_b = [v.value for v in user_b.core_values]
    score_vals = int(round(_compute_semantic_overlap(vals_a, vals_b)))

    # 2. Relationship Expectations (25%)
    exp_a = [e.expectation for e in user_a.relationship_expectations]
    exp_b = [e.expectation for e in user_b.relationship_expectations]
    score_exp = int(round(_compute_semantic_overlap(exp_a, exp_b)))

    # 3. Communication Style (20%)
    comm_a = [c.preference for c in user_a.communication_preferences]
    comm_b = [c.preference for c in user_b.communication_preferences]
    score_comm = int(round(_compute_semantic_overlap(comm_a, comm_b)))

    # 4. Lifestyle & Interests (15%)
    int_a = [f"{i.interest} {i.category or ''}" for i in user_a.interests_and_lifestyle]
    int_b = [f"{i.interest} {i.category or ''}" for i in user_b.interests_and_lifestyle]
    score_int = int(round(_compute_semantic_overlap(int_a, int_b)))

    # 5. Personal Boundaries (10%) - Checks for non-conflicting mutual respect
    bound_a = [b.boundary for b in user_a.personal_boundaries]
    bound_b = [b.boundary for b in user_b.personal_boundaries]
    score_bound = int(round(_compute_semantic_overlap(bound_a, bound_b)))

    # Overall weighted calculation
    overall = int(
        round(
            score_vals * WEIGHTS["core_values"]
            + score_exp * WEIGHTS["relationship_expectations"]
            + score_comm * WEIGHTS["communication_style"]
            + score_int * WEIGHTS["lifestyle_and_interests"]
            + score_bound * WEIGHTS["personal_boundaries"]
        )
    )

    breakdown = CompatibilityBreakdown(
        core_values=DimensionScore(
            score=score_vals,
            weight=WEIGHTS["core_values"],
            explanation=f"Evaluates shared personal principles and moral alignment ({score_vals}% match)",
        ),
        relationship_expectations=DimensionScore(
            score=score_exp,
            weight=WEIGHTS["relationship_expectations"],
            explanation=f"Alignment on relationship trajectory, commitment, and mutual goals ({score_exp}% match)",
        ),
        communication_style=DimensionScore(
            score=score_comm,
            weight=WEIGHTS["communication_style"],
            explanation=f"Harmony between messaging cadence, conversational depth, and tone ({score_comm}% match)",
        ),
        lifestyle_and_interests=DimensionScore(
            score=score_int,
            weight=WEIGHTS["lifestyle_and_interests"],
            explanation=f"Shared hobbies, daily activity levels, and leisure passions ({score_int}% match)",
        ),
        personal_boundaries=DimensionScore(
            score=score_bound,
            weight=WEIGHTS["personal_boundaries"],
            explanation=f"Mutual respect for space, limits, and emotional boundaries ({score_bound}% match)",
        ),
    )

    return overall, breakdown
