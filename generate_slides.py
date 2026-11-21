import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = r"c:\Users\Anamika J\ai-dating-platform\demo_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 1920, 1080
FONTS_DIR = r"C:\Windows\Fonts"

font_title = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 52)
font_subtitle = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeui.ttf"), 28)
font_section = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 20)
font_body = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeui.ttf"), 24)
font_bold = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 24)
font_caption = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeui.ttf"), 22)
font_brand = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 30)
font_small = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeui.ttf"), 18)
font_badge = ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 16)

USER_UPLOADED_DIR = r"C:\Users\Anamika J\.gemini\antigravity\brain\3d1f54f2-5bf0-4ba4-954a-e5efa6c84f28\.user_uploaded"

def create_base_canvas(chapter_idx, total_chapters, title, category, time_stamp):
    # Dark modern canvas
    im = Image.new("RGBA", (WIDTH, HEIGHT), (13, 17, 27, 255))
    draw = ImageDraw.Draw(im)
    
    # Ambient background glow
    # Subtle radial glow top-right (Rose)
    glow1 = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gdraw1 = ImageDraw.Draw(glow1)
    gdraw1.ellipse((1300, -200, 2100, 600), fill=(236, 72, 153, 30))
    glow1 = glow1.filter(ImageFilter.GaussianBlur(120))
    im = Image.alpha_composite(im, glow1)
    
    # Subtle radial glow bottom-left (Violet)
    glow2 = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gdraw2 = ImageDraw.Draw(glow2)
    gdraw2.ellipse((-200, 600, 700, 1300), fill=(139, 92, 246, 25))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(140))
    im = Image.alpha_composite(im, glow2)
    
    draw = ImageDraw.Draw(im)
    
    # Top Header Bar (Height: 80px)
    draw.line([(0, 80), (WIDTH, 80)], fill=(255, 255, 255, 25), width=1)
    
    # Brand
    draw.text((80, 24), "💫 Hey Shona!", font=font_brand, fill=(248, 250, 252))
    
    # Category Pill in Header
    pill_text = f"FEATURE DEMO • {category.upper()}"
    pill_w = 260
    draw.rounded_rectangle((320, 26, 320 + pill_w, 56), radius=15, fill=(236, 72, 153, 35), outline=(236, 72, 153, 120), width=1)
    draw.text((338, 31), pill_text, font=font_badge, fill=(244, 114, 182))
    
    # Progress & Time Indicator right-aligned
    time_info = f"Chapter {chapter_idx}/{total_chapters} • {time_stamp}"
    draw.text((WIDTH - 350, 28), time_info, font=font_section, fill=(148, 163, 184))
    
    # Top Progress Line
    progress_w = int((chapter_idx / total_chapters) * WIDTH)
    draw.line([(0, 80), (progress_w, 80)], fill=(236, 72, 153, 255), width=3)
    
    return im

def draw_bottom_caption(im, caption_text):
    draw = ImageDraw.Draw(im)
    # Bottom Subtitle Box (y: 930 to 1040)
    box_x0, box_y0, box_x1, box_y1 = 100, 930, WIDTH - 100, 1040
    
    # Semi-transparent backdrop
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ovdraw = ImageDraw.Draw(overlay)
    ovdraw.rounded_rectangle((box_x0, box_y0, box_x1, box_y1), radius=16, fill=(15, 23, 42, 230), outline=(255, 255, 255, 40), width=1)
    im = Image.alpha_composite(im, overlay)
    
    draw = ImageDraw.Draw(im)
    
    # Speaker indicator pill
    draw.rounded_rectangle((box_x0 + 20, box_y0 + 15, box_x0 + 130, box_y0 + 45), radius=10, fill=(236, 72, 153, 40), outline=(236, 72, 153, 150))
    draw.text((box_x0 + 32, box_y0 + 20), "🎙️ Narrator", font=font_badge, fill=(244, 114, 182))
    
    # Wrap caption text
    words = caption_text.split()
    lines = []
    curr = []
    for w in words:
        curr.append(w)
        if len(" ".join(curr)) > 115:
            lines.append(" ".join(curr[:-1]))
            curr = [w]
    if curr:
        lines.append(" ".join(curr))
    
    line_y = box_y0 + 22
    for line in lines[:2]:
        draw.text((box_x0 + 150, line_y), line, font=font_caption, fill=(241, 245, 249))
        line_y += 34
        
    return im

def create_slide_01():
    im = create_base_canvas(1, 10, "Introduction", "Platform Vision", "0:00 / 2:49")
    draw = ImageDraw.Draw(im)
    
    # Left Content
    draw.rounded_rectangle((100, 140, 290, 175), radius=12, fill=(139, 92, 246, 30), outline=(139, 92, 246, 120))
    draw.text((115, 147), "WELCOME TO HEY SHONA", font=font_badge, fill=(196, 181, 253))
    
    draw.text((100, 195), "Dating Built on Emotional\nIntelligence & Deep Compatibility", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "Moving beyond gamified, superficial swiping toward authentic\nhuman alignment, transparent values, and mutual respect.", font=font_subtitle, fill=(148, 163, 184))
    
    # 3 Pillar Cards on Left
    pillars = [
        ("💎 Values-First Alignment", "Compatibility measured before interaction begins."),
        ("🛡️ Privacy & Autonomy First", "No surveillance, no unconsented sharing, full user control."),
        ("✨ 5-Dimensional Synergy", "Psychological, emotional, lifestyle, communication & horoscope.")
    ]
    card_y = 430
    for title, desc in pillars:
        draw.rounded_rectangle((100, card_y, 880, card_y + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, card_y + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, card_y + 45), desc, font=font_small, fill=(148, 163, 184))
        card_y += 95
        
    # Right Showcase Card
    draw.rounded_rectangle((960, 140, 1820, 880), radius=20, fill=(22, 27, 46, 200), outline=(236, 72, 153, 80), width=1)
    
    # Inner Header
    draw.rounded_rectangle((990, 170, 1790, 250), radius=14, fill=(30, 41, 59, 180))
    draw.text((1020, 195), "💫 Intentional Connection Ecosystem", font=font_bold, fill=(255, 255, 255))
    draw.text((1580, 195), "Active & Verified", font=font_small, fill=(52, 211, 153))
    
    # Feature Badges Grid
    features = [
        ("🎯 5D Compatibility Engine", "Deep psychological synergy scoring", (236, 72, 153)),
        ("🏹 Cupid AI Wingman", "Contextual icebreakers & date advice", (139, 92, 246)),
        ("💬 Shona AI Assistant", "Empathetic communication coaching", (59, 130, 246)),
        ("📅 Curated Date Planner", "Safe, verified mutual date venues", (16, 185, 129)),
        ("✨ Horoscope Synastry", "Vedic & Western astrological harmony", (245, 158, 11)),
        ("🛡️ Dating Safety Intelligence", "Trust checks & uncompromised privacy", (239, 68, 68))
    ]
    grid_y = 280
    for i, (f_title, f_desc, color) in enumerate(features):
        row = i // 2
        col = i % 2
        gx = 990 if col == 0 else 1395
        gy = grid_y + row * 180
        draw.rounded_rectangle((gx, gy, gx + 380, gy + 150), radius=14, fill=(15, 23, 42, 200), outline=color + (90,), width=1)
        draw.rounded_rectangle((gx + 20, gy + 20, gx + 60, gy + 60), radius=10, fill=color + (40,))
        draw.text((gx + 28, gy + 26), "★", font=font_bold, fill=color)
        draw.text((gx + 75, gy + 26), f_title, font=font_bold, fill=(255, 255, 255))
        draw.text((gx + 20, gy + 80), f_desc, font=font_small, fill=(148, 163, 184))
        
    im = draw_bottom_caption(im, "Welcome to Hey Shona, the emotionally intelligent AI dating platform designed to foster genuine, meaningful relationships. Unlike conventional apps optimized for endless swiping, Hey Shona prioritizes deep values, emotional resonance, and authentic human compatibility.")
    return im

def create_slide_02():
    im = create_base_canvas(2, 10, "Onboarding", "Conversational Blueprint", "0:20 / 2:49")
    draw = ImageDraw.Draw(im)
    
    # Left Content
    draw.rounded_rectangle((100, 140, 310, 175), radius=12, fill=(16, 185, 129, 30), outline=(16, 185, 129, 120))
    draw.text((115, 147), "PRIVATE ONBOARDING", font=font_badge, fill=(52, 211, 153))
    
    draw.text((100, 195), "Conversational Onboarding &\nRelationship Blueprint", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "An empathetic, guided dialogue to capture what truly matters\nto you without subjecting your responses to public display.", font=font_subtitle, fill=(148, 163, 184))
    
    points = [
        ("🔒 Zero Public Exposure", "Raw onboarding answers are strictly private; never shown to matches."),
        ("🧠 AI Behavioral Extraction", "Synthesizes communication style, lifestyle rhythm, and deep values."),
        ("📝 Review & Edit Anytime", "You have 100% control to refine or adjust your Blueprint at any time.")
    ]
    py = 430
    for title, desc in points:
        draw.rounded_rectangle((100, py, 880, py + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, py + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, py + 45), desc, font=font_small, fill=(148, 163, 184))
        py += 95
        
    # Right Showcase Card: The Relationship Blueprint UI
    draw.rounded_rectangle((960, 140, 1820, 880), radius=20, fill=(22, 27, 46, 200), outline=(16, 185, 129, 80), width=1)
    draw.rounded_rectangle((990, 170, 1790, 250), radius=14, fill=(30, 41, 59, 180))
    draw.text((1020, 195), "📋 Relationship Blueprint (Anamika J)", font=font_bold, fill=(255, 255, 255))
    draw.text((1600, 195), "🔒 Private Data", font=font_small, fill=(244, 114, 182))
    
    # Blueprint Sections
    sections = [
        ("Core Values & Philosophy", ["Authenticity & Transparency", "Creative Independence", "Intellectual Curiosity"], (236, 72, 153)),
        ("Communication Rhythms", ["Thoughtful, unhurried cadence", "Prefers direct voice & in-person depth"], (139, 92, 246)),
        ("Lifestyle & Social Energy", ["Balanced social battery", "Morning routines & weekend nature retreats"], (59, 130, 246)),
        ("Relationship Intent", ["Seeking meaningful, intentional long-term partnership"], (16, 185, 129))
    ]
    sy = 280
    for sec_title, items, col in sections:
        draw.rounded_rectangle((990, sy, 1790, sy + 125), radius=14, fill=(15, 23, 42, 200), outline=col + (70,), width=1)
        draw.text((1020, sy + 18), sec_title, font=font_bold, fill=(255, 255, 255))
        pill_x = 1020
        for item in items:
            iw = len(item) * 11 + 30
            draw.rounded_rectangle((pill_x, sy + 62, pill_x + iw, sy + 102), radius=10, fill=col + (30,), outline=col + (100,), width=1)
            draw.text((pill_x + 15, sy + 72), item, font=font_small, fill=(241, 245, 249))
            pill_x += iw + 15
        sy += 140

    im = draw_bottom_caption(im, "Every journey begins with our conversational onboarding. Guided by our empathetic AI assistant, users explore their core principles, communication preferences, and lifestyle rhythms. This creates a secure, private Relationship Blueprint.")
    return im

def create_slide_03():
    im = create_base_canvas(3, 10, "Discovery", "Curated Candidate Cards", "0:39 / 2:49")
    draw = ImageDraw.Draw(im)
    
    # Left Content
    draw.rounded_rectangle((100, 140, 310, 175), radius=12, fill=(245, 158, 11, 30), outline=(245, 158, 11, 120))
    draw.text((115, 147), "DISCOVERY SYSTEM", font=font_badge, fill=(251, 191, 36))
    
    draw.text((100, 195), "Curated Discovery &\nCandidate Cards", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "High-resolution editorial cards displaying genuine compatibility\nmetrics, verified values, and explainable match headlines.", font=font_subtitle, fill=(148, 163, 184))
    
    points = [
        ("✨ Instant AI Compatibility Badge", "Scores calculated dynamically against your Blueprint."),
        ("🔍 Precision Filtering Controls", "Filter by orientation (Female, Male, LGBTQ+) & min score threshold."),
        ("🛡️ No Endless Swiping Trap", "Curated batches encourage mindful consideration over mindless reflex.")
    ]
    py = 430
    for title, desc in points:
        draw.rounded_rectangle((100, py, 880, py + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, py + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, py + 45), desc, font=font_small, fill=(148, 163, 184))
        py += 95

    # Right Content: Candidate Profile Image Card
    card_img_path = os.path.join(USER_UPLOADED_DIR, "media_1795223770731_1da63955.jpg")
    if os.path.exists(card_img_path):
        cimg = Image.open(card_img_path)
        cimg = cimg.resize((520, 730), Image.Resampling.LANCZOS)
        # Wrap in border container
        draw.rounded_rectangle((1120, 130, 1660, 880), radius=18, fill=(30, 41, 59, 160), outline=(236, 72, 153, 120), width=2)
        im.paste(cimg, (1130, 140))
    else:
        draw.rounded_rectangle((1000, 140, 1800, 880), radius=20, fill=(30, 41, 59, 200))
        
    im = draw_bottom_caption(im, "On the Discovery dashboard, users are met with thoughtfully curated candidate profiles. Each card features an elegant portrait, verified location, profession, core values, and an immediate AI-generated compatibility headline.")
    return im

def create_slide_04():
    im = create_base_canvas(4, 10, "AI Engine", "5D Compatibility Engine", "1:00 / 2:49")
    draw = ImageDraw.Draw(im)
    
    draw.rounded_rectangle((100, 140, 310, 175), radius=12, fill=(236, 72, 153, 30), outline=(236, 72, 153, 120))
    draw.text((115, 147), "CORE ALGORITHM", font=font_badge, fill=(244, 114, 182))
    
    draw.text((100, 195), "Proprietary 5-Dimensional\nCompatibility Engine", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "Why single percentage scores fail: Hey Shona deconstructs attraction\ninto five independent, empirically-grounded relationship pillars.", font=font_subtitle, fill=(148, 163, 184))
    
    # Left Highlights
    points = [
        ("📊 Multi-Factor Evaluation", "Balances emotional needs, life pacing, and worldview synergy."),
        ("⚖️ Weighted Harmony Algorithm", "Identifies both harmonious synergy and complementary contrasts."),
        ("🛡️ Scientifically Grounded", "Built on attachment styles, relational psychology, and communication theory.")
    ]
    py = 430
    for title, desc in points:
        draw.rounded_rectangle((100, py, 880, py + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, py + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, py + 45), desc, font=font_small, fill=(148, 163, 184))
        py += 95
        
    # Right Showcase Card: The 5 Dimensions breakdown
    draw.rounded_rectangle((960, 140, 1820, 880), radius=20, fill=(22, 27, 46, 200), outline=(236, 72, 153, 100), width=1)
    draw.rounded_rectangle((990, 170, 1790, 250), radius=14, fill=(30, 41, 59, 180))
    draw.text((1020, 195), "💫 5-Dimensional Synergy Breakdown (Target: Tara Sen)", font=font_bold, fill=(255, 255, 255))
    draw.text((1630, 195), "92% Total", font=font_bold, fill=(236, 72, 153))
    
    dims = [
        ("1. Core Values Alignment", 94, "Integrity, creative curiosity, shared ethical compass", (236, 72, 153)),
        ("2. Communication Cadence", 88, "Thoughtful response pacing, non-violent resolution style", (139, 92, 246)),
        ("3. Lifestyle & Energy Rhythms", 91, "Mutual respect for active work & calm personal space", (59, 130, 246)),
        ("4. Emotional Intelligence", 89, "High self-awareness, active listening, vulnerability balance", (16, 185, 129)),
        ("5. Astrological Harmony", 82, "Complementary Sun/Moon placements, elemental balance", (245, 158, 11))
    ]
    dy = 280
    for d_title, score, desc, col in dims:
        draw.rounded_rectangle((990, dy, 1790, dy + 105), radius=14, fill=(15, 23, 42, 200), outline=col + (70,), width=1)
        draw.text((1020, dy + 15), d_title, font=font_bold, fill=(255, 255, 255))
        draw.text((1680, dy + 15), f"{score}%", font=font_bold, fill=col)
        # Score bar
        draw.rounded_rectangle((1020, dy + 52, 1760, dy + 62), radius=5, fill=(51, 65, 85))
        bar_w = int((score / 100) * 740)
        draw.rounded_rectangle((1020, dy + 52, 1020 + bar_w, dy + 62), radius=5, fill=col)
        draw.text((1020, dy + 72), desc, font=font_small, fill=(148, 163, 184))
        dy += 120

    im = draw_bottom_caption(im, "At the core of Hey Shona is our proprietary 5-Dimensional Compatibility Engine. Rather than superficial likeness, our algorithm analyzes five distinct layers: Core Values, Communication Cadence, Lifestyle, Emotional Intelligence, and Astrological Harmony.")
    return im

def create_slide_05():
    im = create_base_canvas(5, 10, "Explainable AI", "Compatibility Reports", "1:21 / 2:49")
    draw = ImageDraw.Draw(im)
    
    draw.rounded_rectangle((100, 140, 310, 175), radius=12, fill=(59, 130, 246, 30), outline=(59, 130, 246, 120))
    draw.text((115, 147), "EXPLAINABLE AI", font=font_badge, fill=(96, 165, 250))
    
    draw.text((100, 195), "Deep Compatibility\nReports on Click", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "Click any profile card to uncover the transparent psychological\nrationale behind every connection score.", font=font_subtitle, fill=(148, 163, 184))
    
    points = [
        ("🔍 Transparent AI Reasoning", "No black boxes: see exact reasons why you complement each other."),
        ("🤝 Shared Synergy Highlights", "Highlights common ground in passions, values, and humor."),
        ("🌱 Growth Opportunities", "Constructive insights on where communication styles differ gracefully.")
    ]
    py = 430
    for title, desc in points:
        draw.rounded_rectangle((100, py, 880, py + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, py + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, py + 45), desc, font=font_small, fill=(148, 163, 184))
        py += 95
        
    # Right Showcase Card: The Compatibility Modal
    draw.rounded_rectangle((960, 140, 1820, 880), radius=20, fill=(22, 27, 46, 200), outline=(59, 130, 246, 100), width=1)
    draw.rounded_rectangle((990, 170, 1790, 250), radius=14, fill=(30, 41, 59, 180))
    draw.text((1020, 195), "📊 Compatibility Report: Siddharth Rao & Anamika", font=font_bold, fill=(255, 255, 255))
    draw.text((1620, 195), "High Confidence", font=font_small, fill=(52, 211, 153))
    
    # Modal sections
    items = [
        ("✨ Core Resonance", "Both value deep intellectual exploration paired with spontaneous outdoor adventures. High synergy in creative expression.", (236, 72, 153)),
        ("💬 Communication Dynamics", "Siddharth expresses thoughts through shared action; Anamika provides verbal nuance. They balance each other effectively.", (139, 92, 246)),
        ("⚡ Gentle Friction & Growth", "Differing sleep rhythms (Night Owl vs. Dawn Surfer) offers opportunity to develop independent morning pacing.", (245, 158, 11)),
        ("🎯 Suggested Icebreaker", "\"Ask him about his favorite sunrise wave in Goa and compare it to your morning creative ritual.\"", (16, 185, 129))
    ]
    my = 280
    for ititle, idesc, col in items:
        draw.rounded_rectangle((990, my, 1790, my + 130), radius=14, fill=(15, 23, 42, 200), outline=col + (70,), width=1)
        draw.text((1020, my + 18), ititle, font=font_bold, fill=(255, 255, 255))
        draw.text((1020, my + 58), idesc, font=font_body, fill=(203, 213, 225))
        my += 145

    im = draw_bottom_caption(im, "Clicking any candidate profile opens a transparent Compatibility Report. Powered by Explainable AI, it reveals exact compatibility scores, shared resonance points, growth opportunities, and conversation starters.")
    return im

def create_slide_06():
    im = create_base_canvas(6, 10, "Cupid AI", "Cupid AI Wingman", "1:39 / 2:49")
    draw = ImageDraw.Draw(im)
    
    draw.rounded_rectangle((100, 140, 310, 175), radius=12, fill=(236, 72, 153, 30), outline=(236, 72, 153, 120))
    draw.text((115, 147), "WINGMAN ENGINE", font=font_badge, fill=(244, 114, 182))
    
    draw.text((100, 195), "Cupid AI Wingman &\nContextual Icebreakers", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "Say goodbye to awkward 'Hey' messages. Cupid AI analyzes mutual\nhobbies and values to craft engaging, personalized openers.", font=font_subtitle, fill=(148, 163, 184))
    
    points = [
        ("🎯 Contextual Icebreakers", "Generates witty, thoughtful, and playful openers tailored to candidate bios."),
        ("🎭 Adaptive Tone Controls", "Choose your vibe: Playful, Thoughtful, Direct, or Spontaneous."),
        ("🛡️ Authentic Voice Verification", "You always review, edit, and approve every message before it sends.")
    ]
    py = 430
    for title, desc in points:
        draw.rounded_rectangle((100, py, 880, py + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, py + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, py + 45), desc, font=font_small, fill=(148, 163, 184))
        py += 95
        
    # Right Showcase Card: Cupid UI
    draw.rounded_rectangle((960, 140, 1820, 880), radius=20, fill=(22, 27, 46, 200), outline=(236, 72, 153, 100), width=1)
    draw.rounded_rectangle((990, 170, 1790, 250), radius=14, fill=(30, 41, 59, 180))
    draw.text((1020, 195), "🏹 Cupid AI Wingman: Candidate Guidance", font=font_bold, fill=(255, 255, 255))
    draw.text((1580, 195), "Personalized Tips", font=font_small, fill=(244, 114, 182))
    
    icebreakers = [
        ("Playful & Adventurous", "\"I noticed your sunrise surf photos in Goa! Between catching dawn waves and paragliding, which one cures weekday stress faster?\"", (236, 72, 153)),
        ("Thoughtful & Reflective", "\"Your passion for adrenaline and calm morning rituals resonates. How do you find harmony between extreme sports and unwinding?\"", (139, 92, 246)),
        ("Direct & Spontaneous", "\"Coffee this weekend? We both share a love for high-energy travel and good espresso.\"", (16, 185, 129))
    ]
    cy = 280
    for tone, text, col in icebreakers:
        draw.rounded_rectangle((990, cy, 1790, cy + 175), radius=14, fill=(15, 23, 42, 200), outline=col + (70,), width=1)
        draw.rounded_rectangle((1020, cy + 18, 1020 + 220, cy + 50), radius=10, fill=col + (30,), outline=col + (100,), width=1)
        draw.text((1035, cy + 24), f"Tone: {tone}", font=font_badge, fill=col)
        draw.text((1020, cy + 70), text, font=font_body, fill=(241, 245, 249))
        draw.rounded_rectangle((1580, cy + 120, 1760, cy + 155), radius=8, fill=col + (50,))
        draw.text((1605, cy + 127), "Use Opener ✍️", font=font_badge, fill=(255, 255, 255))
        cy += 195

    im = draw_bottom_caption(im, "Never struggle with an awkward first message again. Cupid AI acts as your personal digital wingman, analyzing mutual interests to generate witty, empathetic, and personalized icebreakers, opening the door to authentic conversations.")
    return im

def create_slide_07():
    im = create_base_canvas(7, 10, "Shona AI", "Assistant & Safe Messaging", "1:55 / 2:49")
    draw = ImageDraw.Draw(im)
    
    draw.rounded_rectangle((100, 140, 310, 175), radius=12, fill=(139, 92, 246, 30), outline=(139, 92, 246, 120))
    draw.text((115, 147), "AI ASSISTANT", font=font_badge, fill=(196, 181, 253))
    
    draw.text((100, 195), "Shona AI Assistant &\nSafe Interactive Messaging", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "An integrated, emotionally aware assistant and chat ecosystem\nto foster respectful connection and relationship coaching.", font=font_subtitle, fill=(148, 163, 184))
    
    points = [
        ("💬 Real-Time Guidance", "Ask Shona for advice on navigating boundary setting or shared plans."),
        ("🛡️ Safe & Respectful Chat", "Built-in detection against harassment, uninvited photos, or spam."),
        ("🎙️ Voice & Multimodal Controls", "Hands-free voice input, deep thinking mode, and contextual coaching.")
    ]
    py = 430
    for title, desc in points:
        draw.rounded_rectangle((100, py, 880, py + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, py + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, py + 45), desc, font=font_small, fill=(148, 163, 184))
        py += 95
        
    # Right Showcase Card: Chat UI Screenshot
    chat_img_path = os.path.join(USER_UPLOADED_DIR, "media_1795225403964_cd4c4ae0.jpg")
    if os.path.exists(chat_img_path):
        cimg = Image.open(chat_img_path)
        cimg = cimg.resize((820, 680), Image.Resampling.LANCZOS)
        draw.rounded_rectangle((970, 140, 1810, 840), radius=18, fill=(30, 41, 59, 160), outline=(139, 92, 246, 120), width=2)
        im.paste(cimg, (980, 150))
    else:
        draw.rounded_rectangle((960, 140, 1820, 880), radius=20, fill=(30, 41, 59, 200))

    im = draw_bottom_caption(im, "Inside Shona AI Assistant, members receive personalized relationship coaching and communication guidance. The built-in messaging platform provides a distraction-free, emotionally intelligent environment to connect and build trust.")
    return im

def create_slide_08():
    im = create_base_canvas(8, 10, "Date & Safety", "Date Planner & Safety System", "2:10 / 2:49")
    draw = ImageDraw.Draw(im)
    
    draw.rounded_rectangle((100, 140, 310, 175), radius=12, fill=(16, 185, 129, 30), outline=(16, 185, 129, 120))
    draw.text((115, 147), "OFFLINE SAFETY", font=font_badge, fill=(52, 211, 153))
    
    draw.text((100, 195), "Curated Date Planner &\nDating Safety Subsystem", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "Bridging the digital and physical world safely with verified\nvenues, date itineraries, and proactive check-in mechanisms.", font=font_subtitle, fill=(148, 163, 184))
    
    points = [
        ("📍 Public & Verified Venues", "Recommendations tailored to mutual interests (art galleries, cozy bistros)."),
        ("🛡️ Safety Check-In Timers", "Automated check-ins with emergency contact dispatch if unconfirmed."),
        ("✅ Zero Bad Actors", "Continuous verification flags to protect members from impersonation.")
    ]
    py = 430
    for title, desc in points:
        draw.rounded_rectangle((100, py, 880, py + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, py + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, py + 45), desc, font=font_small, fill=(148, 163, 184))
        py += 95
        
    # Right Showcase Card: Date Planner & Safety UI
    draw.rounded_rectangle((960, 140, 1820, 880), radius=20, fill=(22, 27, 46, 200), outline=(16, 185, 129, 100), width=1)
    draw.rounded_rectangle((990, 170, 1790, 250), radius=14, fill=(30, 41, 59, 180))
    draw.text((1020, 195), "📅 Date Planner: Itinerary Generator", font=font_bold, fill=(255, 255, 255))
    draw.text((1600, 195), "🛡️ Verified Venue", font=font_small, fill=(52, 211, 153))
    
    venues = [
        ("Artisan Pottery & Coffee Bar", "Indiranagar, Bangalore • Low-pressure, hands-on creativity with relaxed seating.", "Mutual Interest: Creative Arts & Specialty Coffee", (16, 185, 129)),
        ("Sunset Botanicals Walk & Tea House", "Cubbon Park Pavilion • Scenic, open-air walking date with verified ambient crowd.", "Mutual Interest: Nature & Unhurried Dialogue", (59, 130, 246)),
        ("Indie Acoustic Book Café", "Koramangala 4th Block • Quiet acoustic background, ideal for deep values discussion.", "Mutual Interest: Literature & Indie Music", (245, 158, 11))
    ]
    vy = 280
    for vname, vdesc, vwhy, col in venues:
        draw.rounded_rectangle((990, vy, 1790, vy + 170), radius=14, fill=(15, 23, 42, 200), outline=col + (70,), width=1)
        draw.text((1020, vy + 18), f"📍 {vname}", font=font_bold, fill=(255, 255, 255))
        draw.text((1020, vy + 60), vdesc, font=font_small, fill=(203, 213, 225))
        draw.rounded_rectangle((1020, vy + 105, 1020 + 440, vy + 145), radius=10, fill=col + (30,), outline=col + (100,), width=1)
        draw.text((1035, vy + 115), vwhy, font=font_badge, fill=col)
        vy += 195

    im = draw_bottom_caption(im, "When you are ready to meet offline, the Date Planner crafts curated date itineraries at verified, safe public venues tailored to your mutual hobbies. Integrated safety intelligence ensures verified profiles and peace of mind on every date.")
    return im

def create_slide_09():
    im = create_base_canvas(9, 10, "Astrology", "Horoscope & Synastry Match", "2:26 / 2:49")
    draw = ImageDraw.Draw(im)
    
    draw.rounded_rectangle((100, 140, 310, 175), radius=12, fill=(245, 158, 11, 30), outline=(245, 158, 11, 120))
    draw.text((115, 147), "COSMIC HARMONY", font=font_badge, fill=(251, 191, 36))
    
    draw.text((100, 195), "Horoscope & Synastry\nCosmic Compatibility", font=font_title, fill=(255, 255, 255))
    draw.text((100, 325), "An optional, culturally resonant feature combining Western zodiac\nsynastry with Vedic astrology calculations.", font=font_subtitle, fill=(148, 163, 184))
    
    points = [
        ("✨ Vedic Guna Milan Scoring", "Calculates traditional harmony across mental, physical & spiritual planes."),
        ("🪐 Elemental Balance", "Evaluates Fire, Earth, Air & Water synergy between birth charts."),
        ("🔒 100% Optional & Customizable", "Can be enabled or hidden anytime based on your personal preference.")
    ]
    py = 430
    for title, desc in points:
        draw.rounded_rectangle((100, py, 880, py + 80), radius=12, fill=(30, 41, 59, 140), outline=(255, 255, 255, 25), width=1)
        draw.text((125, py + 15), title, font=font_bold, fill=(248, 250, 252))
        draw.text((125, py + 45), desc, font=font_small, fill=(148, 163, 184))
        py += 95
        
    # Right Showcase Card: Horoscope UI
    draw.rounded_rectangle((960, 140, 1820, 880), radius=20, fill=(22, 27, 46, 200), outline=(245, 158, 11, 100), width=1)
    draw.rounded_rectangle((990, 170, 1790, 250), radius=14, fill=(30, 41, 59, 180))
    draw.text((1020, 195), "✨ Synastry Chart: Taurus ♉ & Virgo ♍", font=font_bold, fill=(255, 255, 255))
    draw.text((1600, 195), "89% Cosmic Sync", font=font_bold, fill=(245, 158, 11))
    
    aspects = [
        ("Elemental Harmony: Earth & Earth", "High stability, shared appreciation for grounded routine, material comfort, and thoughtful patience.", "Earth Element: 96% Harmony", (245, 158, 11)),
        ("Vedic Guna Milan: 28 / 36 Points", "Strong spiritual and emotional alignment across Varna, Vashya, Tara, Yoni, and Maitri dimensions.", "Traditional Compatibility: Auspicious", (236, 72, 153)),
        ("Planetary Ruler Dynamics: Venus & Mercury", "Venus provides warmth and aesthetic appreciation; Mercury offers sharp conversational wit and intellectual clarity.", "Balanced Communication & Affection", (139, 92, 246))
    ]
    ay = 280
    for atitle, adesc, abp, col in aspects:
        draw.rounded_rectangle((990, ay, 1790, ay + 170), radius=14, fill=(15, 23, 42, 200), outline=col + (70,), width=1)
        draw.text((1020, ay + 18), atitle, font=font_bold, fill=(255, 255, 255))
        draw.text((1020, ay + 60), adesc, font=font_small, fill=(203, 213, 225))
        draw.rounded_rectangle((1020, ay + 105, 1020 + 440, ay + 145), radius=10, fill=col + (30,), outline=col + (100,), width=1)
        draw.text((1035, ay + 115), abp, font=font_badge, fill=col)
        ay += 195

    im = draw_bottom_caption(im, "For members who appreciate astrological alignment, Hey Shona offers optional Horoscope and Vedic Synastry matching. It provides cosmic compatibility insights, planetary harmony breakdowns, and elemental balance.")
    return im

def create_slide_10():
    im = create_base_canvas(10, 10, "Conclusion", "Dating, Redefined", "2:40 / 2:49")
    draw = ImageDraw.Draw(im)
    
    # Centered Outro Card
    draw.rounded_rectangle((250, 150, 1670, 870), radius=24, fill=(22, 27, 46, 230), outline=(236, 72, 153, 140), width=2)
    
    draw.text((760, 200), "💫 Hey Shona!", font=ImageFont.truetype(os.path.join(FONTS_DIR, "segoeuib.ttf"), 64), fill=(255, 255, 255))
    draw.text((700, 290), "Intentional Connection • Emotionally Intelligent Matching", font=font_subtitle, fill=(244, 114, 182))
    
    draw.line([(400, 360), (1520, 360)], fill=(255, 255, 255, 30), width=1)
    
    # Summary Pillars
    pillars = [
        ("🎯 5D Compatibility", "Values, lifestyle, communication, emotional IQ & astrology in harmony."),
        ("🛡️ Privacy & Safety", "Conversational blueprint, verified public venues, zero bad actors."),
        ("🏹 Cupid AI Wingman", "Contextual icebreakers & authentic relationship coaching."),
        ("✨ Meaning Over Metrics", "No gamified swipe dopamine loops—just intentional romance.")
    ]
    py = 410
    for i, (ptitle, pdesc) in enumerate(pillars):
        row = i // 2
        col = i % 2
        x = 350 if col == 0 else 960
        y = py + row * 150
        draw.rounded_rectangle((x, y, x + 560, y + 120), radius=14, fill=(15, 23, 42, 200), outline=(255, 255, 255, 30), width=1)
        draw.text((x + 25, y + 20), ptitle, font=font_bold, fill=(255, 255, 255))
        draw.text((x + 25, y + 60), pdesc, font=font_small, fill=(148, 163, 184))
        
    draw.text((660, 750), "Ready to experience dating built for human connection?", font=font_bold, fill=(255, 255, 255))
    draw.rounded_rectangle((780, 800, 1140, 850), radius=25, fill=(236, 72, 153, 240))
    draw.text((820, 812), "Explore Hey Shona 🚀", font=font_bold, fill=(255, 255, 255))

    im = draw_bottom_caption(im, "Hey Shona is redefining modern romance with emotional intelligence, explainable AI, and profound human respect. Welcome to dating, redefined.")
    return im

def generate_all_slides():
    creators = [
        ("scene_01", create_slide_01),
        ("scene_02", create_slide_02),
        ("scene_03", create_slide_03),
        ("scene_04", create_slide_04),
        ("scene_05", create_slide_05),
        ("scene_06", create_slide_06),
        ("scene_07", create_slide_07),
        ("scene_08", create_slide_08),
        ("scene_09", create_slide_09),
        ("scene_10", create_slide_10),
    ]
    
    for sid, func in creators:
        img = func()
        out_path = os.path.join(OUTPUT_DIR, f"{sid}.png")
        img.save(out_path, format="PNG")
        print(f"Generated {out_path}")

if __name__ == "__main__":
    generate_all_slides()
