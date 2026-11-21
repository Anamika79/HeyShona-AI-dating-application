"""
Pre-defined curated dummy profiles with diverse personalities, values,
communication preferences, lifestyle habits, and boundaries for discovery.
"""
from typing import List
from app.schemas.compatibility import UserProfileSummary
from app.schemas.profile_intelligence import (
    CoreValue,
    Interest,
    RelationshipExpectation,
    CommunicationPreference,
    PersonalBoundary,
    MissingInformation,
    ProfileIntelligenceData,
)

DUMMY_PROFILES: List[UserProfileSummary] = [
    UserProfileSummary(
        id="user_1",
        name="Tara Sen",
        age=26,
        gender="Female",
        occupation="Wildlife Biologist & Documentary Filmmaker",
        location="Bengaluru, India",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        bio="Field researcher spending mornings with coffee and bird calls. Passionate about ecology, environmental justice, and impromptu road trips. Deep honesty and quiet loyalty mean the world to me.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Environmental Justice & Empathy", evidence="Passionate about ecology, environmental justice", is_explicit=True),
                CoreValue(value="Honesty & Quiet Loyalty", evidence="Deep honesty and quiet loyalty mean the world to me", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Wildlife Photography & Documentaries", category="Creative Arts", evidence="Wildlife Biologist & Documentary Filmmaker"),
                Interest(interest="Nature Hiking & Bird Watching", category="Outdoors", evidence="Field researcher spending mornings with coffee and bird calls"),
                Interest(interest="Impromptu Road Trips", category="Adventure", evidence="impromptu road trips"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Loyal, long-term intentional partnership", evidence="Deep honesty and quiet loyalty"),
                RelationshipExpectation(expectation="Encourages mutual independence in field work", evidence="Field researcher spending mornings"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Deep evening phone calls over frequent texting", evidence="quiet loyalty, mornings with coffee"),
                CommunicationPreference(preference="Authentic, open communication without passive aggression", evidence="Deep honesty"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Respect for remote field trips without constant phone checking", evidence="Field researcher"),
                PersonalBoundary(boundary="Zero tolerance for superficiality or ghosting", evidence="Deep honesty mean the world to me"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["City living preferences", "Financial alignment"],
                recommended_follow_up_questions=["How do you balance extended field trips with shared home life?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_2",
        name="Rohan Verma",
        age=28,
        gender="Male",
        occupation="Fintech Product Designer & Jazz Pianist",
        location="Mumbai, India",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        bio="Creating clean design systems by day, jamming bebop on piano by night. I value intellectual curiosity, design aesthetics, and healthy discipline. Looking for someone who enjoys gallery walks and quiet vinyl evenings.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Intellectual Curiosity", evidence="value intellectual curiosity, design aesthetics", is_explicit=True),
                CoreValue(value="Creativity & Craftsmanship", evidence="jamming bebop on piano, design systems", is_explicit=True),
                CoreValue(value="Healthy Discipline", evidence="healthy discipline", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Jazz Piano & Vinyl Records", category="Music", evidence="jamming bebop on piano by night, vinyl evenings"),
                Interest(interest="Art Galleries & Architecture", category="Culture", evidence="enjoys gallery walks"),
                Interest(interest="Product Design", category="Tech & Design", evidence="Fintech Product Designer"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Slow-burn partnership rooted in mutual inspiration", evidence="Looking for someone who enjoys gallery walks"),
                RelationshipExpectation(expectation="Shared love for culture and intellectual growth", evidence="intellectual curiosity"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Playful wit, witty banter, and deep in-person conversations", evidence="jamming bebop, gallery walks"),
                CommunicationPreference(preference="Thoughtful text exchanges throughout the day", evidence="clean design systems"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Needs solitary creative time for piano practice and deep focus", evidence="jamming bebop on piano by night"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Outdoor activity enthusiasm", "Views on marriage timeline"],
                recommended_follow_up_questions=["What is your favorite jazz standard to play when you need to unwind?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_3",
        name="Dr. Maya Alva",
        age=30,
        gender="Female",
        occupation="Pediatric Resident & Marathoner",
        location="Delhi NCR, India",
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
        bio="Pediatric resident fueled by black coffee and 5 AM runs. Compassion and resilience are my north star. My schedule is demanding, so I cherish low-stress quality time, home-cooked dinners, and genuine empathy.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Compassion & Service", evidence="Pediatric resident, compassion are my north star", is_explicit=True),
                CoreValue(value="Resilience & Dedication", evidence="resilience are my north star, 5 AM runs", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Marathon Training & Long Distance Running", category="Fitness", evidence="5 AM runs, Marathoner"),
                Interest(interest="Home Cooking & Comfort Food", category="Culinary", evidence="home-cooked dinners"),
                Interest(interest="Espresso & Specialty Coffee", category="Lifestyle", evidence="fueled by black coffee"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Emotionally secure partner who understands demanding shift hours", evidence="My schedule is demanding, so I cherish low-stress quality time"),
                RelationshipExpectation(expectation="Long-term partnership with shared commitment to kindness", evidence="genuine empathy"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Clear, asynchronous texting during shifts; intentional presence when together", evidence="schedule is demanding"),
                CommunicationPreference(preference="Warm voice notes to stay connected", evidence="cherish low-stress quality time"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Patience required regarding hospital on-call emergencies", evidence="schedule is demanding"),
                PersonalBoundary(boundary="No unnecessary drama or emotional volatility", evidence="low-stress quality time"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Travel availability", "Artistic hobbies"],
                recommended_follow_up_questions=["How do you unwind mentally after a tough hospital rotation?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_4",
        name="Kabir Mehta",
        age=27,
        gender="Male",
        occupation="Indie Game Developer & Sci-Fi Writer",
        location="Bengaluru, India",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        bio="Building cozy narrative games and writing cyberpunk short stories. Big fan of retro consoles, ramen spots, and late-night tech debates. Looking for an authentic partner who embraces weird ideas and creative freedom.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Creative Freedom & Authenticity", evidence="embraces weird ideas and creative freedom", is_explicit=True),
                CoreValue(value="Curiosity & Unconventional Thinking", evidence="Indie Game Developer & Sci-Fi Writer", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Video Game Development & Retro Gaming", category="Gaming", evidence="Building cozy narrative games, retro consoles"),
                Interest(interest="Sci-Fi Literature & Creative Writing", category="Literature", evidence="writing cyberpunk short stories"),
                Interest(interest="Japanese Cuisine & Ramen Crawls", category="Food", evidence="ramen spots"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Mutual encouragement of creative passions and independent projects", evidence="partner who embraces weird ideas and creative freedom"),
                RelationshipExpectation(expectation="Playful companionship with shared curiosity", evidence="late-night tech debates"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Late night deep dives, memes, and enthusiastic discussions", evidence="late-night tech debates"),
                CommunicationPreference(preference="Casual, low-pressure conversational flow", evidence="cozy narrative games"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Boundary against rigid traditional relationship rules or micro-management", evidence="creative freedom"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Fitness habits", "Long-term relocation plans"],
                recommended_follow_up_questions=["What sci-fi universe has inspired your world-building the most?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_5",
        name="Ananya Joshi",
        age=29,
        gender="Female",
        occupation="Sustainability Consultant & Potter",
        location="Pune, India",
        avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
        bio="Working towards circular economies by weekday, getting my hands dirty on the pottery wheel on weekends. I value mindful living, conscious consumerism, and grounded emotional warmth. Looking for an equal life partner.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Mindfulness & Sustainability", evidence="circular economies, mindful living, conscious consumerism", is_explicit=True),
                CoreValue(value="Equality & Grounded Warmth", evidence="grounded emotional warmth, equal life partner", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Ceramic Pottery & Clay Sculpting", category="Crafts", evidence="hands dirty on the pottery wheel"),
                Interest(interest="Sustainable Living & Thrift Culture", category="Lifestyle", evidence="Sustainability Consultant, conscious consumerism"),
                Interest(interest="Plant Care & Urban Gardening", category="Nature", evidence="mindful living"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Committed, egalitarian partnership building a mindful shared home", evidence="equal life partner, grounded emotional warmth"),
                RelationshipExpectation(expectation="Shared values around ethical living and environmental awareness", evidence="Sustainability Consultant"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Active, empathetic listening and emotionally articulate conversations", evidence="grounded emotional warmth"),
                CommunicationPreference(preference="Weekly check-ins to stay emotionally aligned", evidence="mindful living"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Respect for environmental consciousness in daily habits", evidence="conscious consumerism"),
                PersonalBoundary(boundary="Strict boundary against emotional dismissiveness", evidence="grounded emotional warmth"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Travel style", "Music preferences"],
                recommended_follow_up_questions=["What is the most rewarding piece you've shaped on the wheel?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_6",
        name="Vikram Nair",
        age=31,
        gender="Male",
        occupation="Corporate Attorney & Amateur Chef",
        location="Hyderabad, India",
        avatar_url="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
        bio="Corporate lawyer who channels stress into artisanal sourdough baking and pasta from scratch. Ambition, sharp intellect, and loyalty are core to me. I enjoy formal dinners as much as quiet Sundays with a good biography.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Ambition & Professional Excellence", evidence="Corporate lawyer, Ambition, sharp intellect", is_explicit=True),
                CoreValue(value="Loyalty & Integrity", evidence="loyalty are core to me", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Artisanal Sourdough Baking & Pasta Making", category="Culinary", evidence="artisanal sourdough baking and pasta from scratch"),
                Interest(interest="Biographies & History Non-Fiction", category="Reading", evidence="quiet Sundays with a good biography"),
                Interest(interest="Fine Dining & Wine Appreciation", category="Culinary", evidence="formal dinners"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="High-trust, ambitious partnership where both careers are celebrated", evidence="Ambition, loyalty are core to me"),
                RelationshipExpectation(expectation="Traditional relationship trajectory towards marriage and family", evidence="loyalty, quiet Sundays"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Direct, articulate, and respectful debate", evidence="sharp intellect, lawyer"),
                CommunicationPreference(preference="Structured communication; prefers planned dates over last-minute plans", evidence="formal dinners, quiet Sundays"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Strong boundary around professional commitments during trial weeks", evidence="Corporate Attorney"),
                PersonalBoundary(boundary="High expectation of personal integrity and punctuality", evidence="loyalty are core to me"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Fitness routine", "Spontaneity preference"],
                recommended_follow_up_questions=["What sourdough hydration percentage gives you the perfect crumb?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_7",
        name="Siddharth Rao",
        age=25,
        gender="Male",
        occupation="Extreme Sports Instructor & Vlogger",
        location="Goa, India",
        avatar_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
        bio="Surfing sunrise swells in Goa, paragliding on weekends. I live for adrenaline, spontaneity, and unfiltered laughter. Looking for someone fearless who packs light and loves beach bonfires under the stars.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Spontaneity & Adventure", evidence="live for adrenaline, spontaneity, packs light", is_explicit=True),
                CoreValue(value="Joy & Lightheartedness", evidence="unfiltered laughter, beach bonfires", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Surfing & Kitesurfing", category="Extreme Sports", evidence="Surfing sunrise swells in Goa"),
                Interest(interest="Paragliding & Skydiving", category="Extreme Sports", evidence="paragliding on weekends"),
                Interest(interest="Travel Vlogging & Beach Culture", category="Media & Adventure", evidence="Vlogger, beach bonfires under the stars"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Adventurous companion for travel and spontaneous experiences", evidence="someone fearless who packs light"),
                RelationshipExpectation(expectation="Casual, fun-first dating dynamic without heavy pressure", evidence="live for adrenaline and spontaneity"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Spontaneous voice notes, short video clips, real-time calls", evidence="Vlogger, live for spontaneity"),
                CommunicationPreference(preference="Minimal texting; prefers doing activities together in person", evidence="surfing sunrise swells"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Dislikes rigid scheduling, corporate routine, or restrictive lifestyle rules", evidence="spontaneity, fearless"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Long-term stability", "Quiet introverted hobbies"],
                recommended_follow_up_questions=["What wave break in the world is still on your bucket list?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_8",
        name="Pooja Kulkarni",
        age=27,
        gender="Female",
        occupation="Data Scientist & Board Game Enthusiast",
        location="Bengaluru, India",
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
        bio="Machine learning engineer by day, strategy board game host on weekends. I love sci-fi novels, logic puzzles, and quirky podcasts. Looking for someone honest, intellectually stimulating, and emotionally supportive.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Honesty & Mutual Support", evidence="honest, intellectually stimulating, and emotionally supportive", is_explicit=True),
                CoreValue(value="Intellectual Curiosity & Playfulness", evidence="logic puzzles, strategy board game host", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Strategy Board Games & Tabletop RPGs", category="Gaming", evidence="strategy board game host on weekends"),
                Interest(interest="Data Science & Machine Learning", category="Technology", evidence="Machine learning engineer by day"),
                Interest(interest="Sci-Fi Books & Investigative Podcasts", category="Media", evidence="sci-fi novels, quirky podcasts"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Meaningful partnership with deep conversations and shared intellectual interests", evidence="Looking for someone honest, intellectually stimulating"),
                RelationshipExpectation(expectation="Comfortable companionship with mutual emotional safety", evidence="emotionally supportive"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Meaningful text chats with interesting articles and podcast recommendations", evidence="quirky podcasts, logic puzzles"),
                CommunicationPreference(preference="Direct, honest discussions without mind games", evidence="honest, emotionally supportive"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Need dedicated focus time for research and work", evidence="Machine learning engineer"),
                PersonalBoundary(boundary="Requires mutual honesty and emotional transparency", evidence="honest, emotionally supportive"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Outdoor adventures", "Cooking interests"],
                recommended_follow_up_questions=["What board game has the cleverest game mechanics in your opinion?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_9",
        name="Noor Sen",
        age=26,
        gender="LGBTQ+",
        occupation="UI/UX Designer & Queer Indie Musician",
        location="Bengaluru, India",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        bio="Designing accessible interfaces and producing indie dream-pop. Passionate about queer safe spaces, intersectional empathy, and acoustic jam sessions. Seeking a thoughtful, authentic bond rooted in kindness and creative solidarity.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Empathy & Inclusivity", evidence="queer safe spaces, intersectional empathy", is_explicit=True),
                CoreValue(value="Creative Expression & Authenticity", evidence="indie dream-pop, acoustic jam sessions", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Dream-pop Synthesis & Acoustic Guitar", category="Music", evidence="producing indie dream-pop"),
                Interest(interest="Accessible Design & Typography", category="Design", evidence="Designing accessible interfaces"),
                Interest(interest="Community Zines & Independent Bookstores", category="Culture", evidence="queer safe spaces"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Authentic queer companionship with mutual emotional safety", evidence="thoughtful, authentic bond rooted in kindness"),
                RelationshipExpectation(expectation="Creative partnership that celebrates individuality", evidence="creative solidarity"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Gentle, thoughtful check-ins and heartfelt conversations", evidence="intersectional empathy, kindness"),
                CommunicationPreference(preference="Sharing playlists and music reflections", evidence="dream-pop, acoustic jam sessions"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Zero tolerance for prejudice, intolerance, or gatekeeping", evidence="queer safe spaces, intersectional empathy"),
                PersonalBoundary(boundary="Needs healthy emotional boundaries and unhurried pacing", evidence="authentic bond rooted in kindness"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Travel preferences", "Sports enthusiasm"],
                recommended_follow_up_questions=["Which indie artists inspire your current musical project?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_10",
        name="Samay Roy",
        age=28,
        gender="LGBTQ+",
        occupation="Contemporary Dancer & Art Curator",
        location="Kolkata, India",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        bio="Expressing stories through movement and curating queer community art exhibits. Lover of old architectural ruins, chai conversations, and expressive poetry. Looking for an emotionally mature, passionate partner who values artistic vulnerability.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Artistic Vulnerability & Depth", evidence="Expressing stories through movement, artistic vulnerability", is_explicit=True),
                CoreValue(value="Community & Emotional Maturity", evidence="curating queer community art, emotionally mature", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Contemporary Dance & Choreography", category="Performing Arts", evidence="Contemporary Dancer"),
                Interest(interest="Visual Arts Curation & Heritage Walks", category="Arts", evidence="Art Curator, old architectural ruins"),
                Interest(interest="Street Chai & Urdu/Bengali Poetry", category="Culture", evidence="chai conversations, expressive poetry"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Deep emotional intimacy and mutual respect for artistic callings", evidence="emotionally mature, passionate partner"),
                RelationshipExpectation(expectation="Long-term partnership built on open vulnerability", evidence="artistic vulnerability"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Warm, soul-baring in-person walks and tea sessions", evidence="chai conversations, heritage walks"),
                CommunicationPreference(preference="Expressive, poetic texting and voice memos", evidence="expressive poetry"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Requires mutual emotional openness and psychological safety", evidence="emotional maturity, queer community"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Tech interest", "Outdoor camping"],
                recommended_follow_up_questions=["What is the narrative behind your latest choreographic piece?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_11",
        name="Arjun Kapoor",
        age=29,
        gender="Male",
        occupation="Architect & Heritage Restorer",
        location="Bengaluru, India",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        bio="Restoring centuries-old stone stepwells and sketching city arches. Early riser, lover of south Indian filter coffee, thoughtful minimalism, and quiet presence. Looking for an authentic partner who finds wonder in historical craft and shared silence.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Architectural Craftsmanship & Heritage", evidence="Restoring centuries-old stone stepwells, historical craft", is_explicit=True),
                CoreValue(value="Mindful Presence & Calmness", evidence="quiet presence, shared silence, thoughtful minimalism", is_explicit=True),
                CoreValue(value="Intellectual Curiosity", evidence="sketching city arches, finding wonder in craft", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Stepwell & Heritage Sketches", category="Creative Arts", evidence="sketching city arches, historical craft"),
                Interest(interest="Specialty Filter Coffee & Slow Mornings", category="Lifestyle", evidence="Early riser, south Indian filter coffee"),
                Interest(interest="Cycling Old Quarters", category="Outdoors", evidence="fieldwork in heritage zones"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Grounded, serene partnership built on mutual respect and shared curiosity", evidence="authentic partner who finds wonder"),
                RelationshipExpectation(expectation="Calm sanctuary at home after intense field restoration projects", evidence="quiet presence, thoughtful minimalism"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Unrushed evening tea chats and thoughtful check-ins", evidence="shared silence, filter coffee mornings"),
                CommunicationPreference(preference="Direct, calm honesty without passive hints", evidence="authentic partner"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Needs quiet sketching time on Sunday mornings; respectful pacing", evidence="thoughtful minimalism"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Nightlife interest", "Music preferences"],
                recommended_follow_up_questions=["What is your favorite historic structure in India?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_12",
        name="Aditya Sen",
        age=28,
        gender="Male",
        occupation="Aerospace Systems Engineer & Astrophotographer",
        location="Hyderabad, India",
        avatar_url="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
        bio="Building autonomous satellite flight systems and capturing nebulae under dark skies. Deeply fascinated by astrophysics, philosophy of consciousness, and ambient music. Seeking an empathetic mind who appreciates cosmic wonder and gentle kindness.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Intellectual Wonder & Curiosity", evidence="fascinated by astrophysics, philosophy of consciousness", is_explicit=True),
                CoreValue(value="Gentle Kindness & Empathy", evidence="Seeking an empathetic mind who appreciates gentle kindness", is_explicit=True),
                CoreValue(value="Patience & Deep Focus", evidence="capturing nebulae under dark skies, satellite flight systems", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Deep-Sky Astrophotography & Telescopes", category="Science & Hobby", evidence="capturing nebulae under dark skies"),
                Interest(interest="Ambient & Synthesizer Music", category="Music", evidence="ambient music, modular soundscapes"),
                Interest(interest="Desert & Mountain Stargazing Expeditions", category="Adventure", evidence="dark sky travels"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Supportive, intellectually stimulating partnership", evidence="Seeking an empathetic mind who appreciates cosmic wonder"),
                RelationshipExpectation(expectation="Mutual space for passion projects and deep shared wonder", evidence="capturing nebulae under dark skies"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Thoughtful deep conversations; loves sharing voice notes about books and cosmology", evidence="philosophy of consciousness"),
                CommunicationPreference(preference="Values clear emotional presence and warm vulnerability", evidence="gentle kindness"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Respect for remote telescope sessions during clear new-moon weekends", evidence="capturing nebulae under dark skies"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Cooking habits", "Fitness routine"],
                recommended_follow_up_questions=["What telescope target took you the longest to capture?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_13",
        name="Meera Nambiar",
        age=27,
        gender="Female",
        occupation="Marine Ecologist & Scuba Divemaster",
        location="Kochi, India",
        avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
        bio="Studying coral restoration in the Arabian Sea and teaching mindful buoyancy underwater. Passionate about ocean preservation, coastal cuisines, and acoustic folk songs. Looking for a genuine, adventurous soul who respects nature and communicates with warmth.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Ocean Conservation & Ecological Mindfulness", evidence="Studying coral restoration, ocean preservation", is_explicit=True),
                CoreValue(value="Authenticity & Warmth", evidence="communicates with warmth, genuine soul", is_explicit=True),
                CoreValue(value="Adventure with Care", evidence="mindful buoyancy, teaching scuba diving", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Coral Reef Monitoring & Scuba Diving", category="Outdoors", evidence="Marine Ecologist & Scuba Divemaster"),
                Interest(interest="Acoustic Folk Songs & Ukulele", category="Music", evidence="acoustic folk songs"),
                Interest(interest="Coastal Culinary Traditions", category="Lifestyle", evidence="coastal cuisines"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Partnership grounded in shared values, environmental ethics, and joyful curiosity", evidence="genuine, adventurous soul who respects nature"),
                RelationshipExpectation(expectation="Encourages mutual passions without possessiveness", evidence="teaching mindful buoyancy underwater"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Animated storytelling over fresh coastal meals and gentle check-in messages", evidence="communicates with warmth"),
                CommunicationPreference(preference="Open and non-defensive communication", evidence="mindful presence"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="High value on ocean safety; zero tolerance for ego-driven recklessness", evidence="mindful buoyancy, conservation"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Winter travel preferences", "Tech habits"],
                recommended_follow_up_questions=["Which coral species is showing the best recovery in your study area?"],
            ),
        ),
    ),
    UserProfileSummary(
        id="user_14",
        name="Devrat Sharma",
        age=26,
        gender="Male",
        occupation="Stand-Up Writer & Podcast Producer",
        location="Delhi, India",
        avatar_url="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
        bio="Finding genuine humor in the bittersweet absurdities of daily life. Obsessive vinyl record digger, street food explorer, and believer in emotional vulnerability. Seeking someone witty, introspective, and kind who doesn't take life too seriously but takes love with devotion.",
        profile_data=ProfileIntelligenceData(
            personality_insights=[],
            core_values=[
                CoreValue(value="Empathetic Humor & Laughter", evidence="Finding genuine humor in the bittersweet absurdities of daily life", is_explicit=True),
                CoreValue(value="Radical Authenticity & Vulnerability", evidence="believer in emotional vulnerability", is_explicit=True),
                CoreValue(value="Emotional Devotion & Kindness", evidence="takes love with devotion, kind and introspective", is_explicit=True),
            ],
            interests_and_lifestyle=[
                Interest(interest="Vintage Vinyl Collecting & Jazz/Soul", category="Music", evidence="Obsessive vinyl record digger"),
                Interest(interest="Improv Theater & Storytelling", category="Performing Arts", evidence="Stand-Up Writer & Podcast Producer"),
                Interest(interest="Old Delhi Street Food Walks", category="Food & Culture", evidence="street food explorer"),
            ],
            relationship_expectations=[
                RelationshipExpectation(expectation="Slow-burn companionship where we make each other laugh through hard days", evidence="witty, introspective, takes love with devotion"),
                RelationshipExpectation(expectation="Mutual emotional safety and deep listening", evidence="believer in emotional vulnerability"),
            ],
            communication_preferences=[
                CommunicationPreference(preference="Playful banter balanced with deeply reassuring emotional check-ins", evidence="Finding genuine humor, emotional vulnerability"),
                CommunicationPreference(preference="Prefers talking things through immediately rather than bottling up", evidence="radical authenticity"),
            ],
            personal_boundaries=[
                PersonalBoundary(boundary="Healthy space to test comedy material; transparency without mind games", evidence="radical authenticity, devotion"),
            ],
            missing_information=MissingInformation(
                unknown_aspects=["Morning routines", "Outdoor fitness"],
                recommended_follow_up_questions=["What is the rarest vinyl record you've found at a flea market?"],
            ),
        ),
    ),
]
