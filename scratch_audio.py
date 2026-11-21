import asyncio
import os
import edge_tts
import subprocess
import imageio_ffmpeg

OUTPUT_DIR = r"c:\Users\Anamika J\ai-dating-platform\demo_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SCENES = [
    {
        "id": "scene_01",
        "title": "Introduction & Mission",
        "subtitle": "Emotionally Intelligent AI Dating Platform",
        "text": "Welcome to Hey Shona, the emotionally intelligent AI dating platform designed to foster genuine, meaningful relationships. Unlike conventional apps optimized for endless swiping, Hey Shona prioritizes deep values, emotional resonance, and authentic human compatibility before you ever initiate a conversation."
    },
    {
        "id": "scene_02",
        "title": "Conversational Onboarding",
        "subtitle": "Private Relationship Blueprint Generation",
        "text": "Every journey begins with our conversational onboarding. Guided by our empathetic AI assistant, users explore their core principles, communication preferences, and lifestyle rhythms. This creates a secure, private Relationship Blueprint without exposing sensitive raw personal answers to third parties."
    },
    {
        "id": "scene_03",
        "title": "Curated Discovery",
        "subtitle": "Intentional Candidate Cards with Real Compatibility",
        "text": "On the Discovery dashboard, users are met with thoughtfully curated candidate profiles. Each card features an elegant portrait, verified location, profession, core values, and an immediate AI-generated compatibility headline. Flexible filters let you discover matches based on mutual intent and verified synergy."
    },
    {
        "id": "scene_04",
        "title": "5-Dimensional Compatibility Engine",
        "subtitle": "Multifaceted Psychological & Emotional Scoring",
        "text": "At the core of Hey Shona is our proprietary 5-Dimensional Compatibility Engine. Rather than superficial likeness, our algorithm analyzes five distinct layers: Core Values Alignment, Communication Cadence, Lifestyle Rhythms, Emotional Intelligence, and Astrological Harmony, ensuring multifaceted synergy."
    },
    {
        "id": "scene_05",
        "title": "Explainable Compatibility Reports",
        "subtitle": "Deep Transparency Behind Every Connection",
        "text": "Clicking any candidate profile opens a transparent Compatibility Report. Powered by Explainable AI, it reveals exact compatibility scores, shared resonance points, growth opportunities, and conversation starters. You always know exactly why two people resonate."
    },
    {
        "id": "scene_06",
        "title": "Cupid AI Wingman",
        "subtitle": "Personalized Openers & Relationship Advice",
        "text": "Never struggle with an awkward first message again. Cupid AI acts as your personal digital wingman, analyzing mutual interests to generate witty, empathetic, and personalized icebreakers, opening the door to authentic, effortless conversations."
    },
    {
        "id": "scene_07",
        "title": "Shona AI Assistant & Messaging",
        "subtitle": "Real-Time AI Coaching & Safe Conversations",
        "text": "Inside Shona AI Assistant, members receive personalized relationship coaching and communication guidance. The built-in messaging platform provides a distraction-free, emotionally intelligent environment to connect and build trust at your own pace."
    },
    {
        "id": "scene_08",
        "title": "Date Planner & Safety",
        "subtitle": "Curated Venues & Verified Trust Protections",
        "text": "When you are ready to meet offline, the Date Planner crafts curated date itineraries at verified, safe public venues tailored to your mutual hobbies. Integrated safety intelligence ensures verified profiles and peace of mind on every first date."
    },
    {
        "id": "scene_09",
        "title": "Horoscope & Synastry Match",
        "subtitle": "Vedic & Western Cosmic Compatibility",
        "text": "For members who appreciate astrological alignment, Hey Shona offers optional Horoscope and Vedic Synastry matching. It provides cosmic compatibility insights, planetary harmony breakdowns, and elemental balance."
    },
    {
        "id": "scene_10",
        "title": "Dating, Redefined",
        "subtitle": "Intentional Romance with Emotional Intelligence",
        "text": "Hey Shona is redefining modern romance with emotional intelligence, explainable AI, and profound human respect. Welcome to dating, redefined."
    }
]

async def generate_audio():
    voice = "en-US-JennyNeural"  # Professional, warm female voice
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    total_duration = 0.0
    scene_durations = []
    
    for scene in SCENES:
        mp3_path = os.path.join(OUTPUT_DIR, f"{scene['id']}.mp3")
        tts = edge_tts.Communicate(scene["text"], voice=voice, rate="+0%", pitch="+0Hz")
        await tts.save(mp3_path)
        
        # Probe duration using ffmpeg
        cmd = [
            ffmpeg_exe, "-i", mp3_path
        ]
        res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
        # Parse duration from ffmpeg output
        duration = 10.0
        for line in res.stderr.splitlines():
            if "Duration:" in line:
                # e.g. Duration: 00:00:15.34, start: ...
                try:
                    time_str = line.split("Duration:")[1].split(",")[0].strip()
                    parts = time_str.split(":")
                    duration = float(parts[0])*3600 + float(parts[1])*60 + float(parts[2])
                except Exception as e:
                    pass
        scene["duration"] = duration
        scene_durations.append(duration)
        total_duration += duration
        print(f"Scene {scene['id']}: {duration:.2f}s | {scene['title']}")
        
    print(f"\nTotal Audio Duration: {total_duration:.2f}s ({total_duration/60:.2f} mins)")
    return scene_durations

if __name__ == "__main__":
    asyncio.run(generate_audio())
