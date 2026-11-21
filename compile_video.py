import os
import subprocess
import imageio_ffmpeg

ASSETS_DIR = r"c:\Users\Anamika J\ai-dating-platform\demo_assets"
FINAL_VIDEO = r"c:\Users\Anamika J\ai-dating-platform\Hey_Shona_3Min_Demo_Video.mp4"

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

scenes = [f"scene_{i:02d}" for i in range(1, 11)]
clip_paths = []

print(f"Using ffmpeg: {ffmpeg_exe}")

def get_audio_duration(file_path):
    cmd = [ffmpeg_exe, "-i", file_path]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    for line in res.stderr.splitlines():
        if "Duration:" in line:
            time_str = line.split("Duration:")[1].split(",")[0].strip()
            parts = time_str.split(":")
            return float(parts[0])*3600 + float(parts[1])*60 + float(parts[2])
    return 15.0

total_expected = 0.0

for sid in scenes:
    img_path = os.path.join(ASSETS_DIR, f"{sid}.png")
    mp3_path = os.path.join(ASSETS_DIR, f"{sid}.mp3")
    clip_mp4 = os.path.join(ASSETS_DIR, f"{sid}.mp4")
    clip_paths.append(clip_mp4)
    
    dur = get_audio_duration(mp3_path)
    total_expected += dur
    print(f"Rendering clip for {sid} (exact duration: {dur:.2f}s)...")
    
    # Use exact -t duration and frame rate 25 fps
    cmd = [
        ffmpeg_exe, "-y",
        "-loop", "1",
        "-i", img_path,
        "-i", mp3_path,
        "-t", f"{dur:.2f}",
        "-c:v", "libx264",
        "-r", "25",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        clip_mp4
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"Error rendering {sid}:", res.stderr[-500:])
        raise RuntimeError(f"Failed on {sid}")
    print(f"Finished {sid}.mp4")

# Write concat list
concat_file = os.path.join(ASSETS_DIR, "concat_list.txt")
with open(concat_file, "w", encoding="utf-8") as f:
    for c in clip_paths:
        escaped = c.replace("\\", "/")
        f.write(f"file '{escaped}'\n")

print(f"\nConcatenating clips (expected total ~ {total_expected:.2f}s)...")
concat_cmd = [
    ffmpeg_exe, "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_file,
    "-c", "copy",
    FINAL_VIDEO
]
cres = subprocess.run(concat_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
if cres.returncode != 0:
    print("Error during concat:", cres.stderr[-500:])
    raise RuntimeError("Failed concat")

# Probe final video
probe_cmd = [ffmpeg_exe, "-i", FINAL_VIDEO]
pres = subprocess.run(probe_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
for line in pres.stderr.splitlines():
    if "Duration:" in line:
        print(f"\nFINAL VERIFIED VIDEO: {line.strip()}")
        time_str = line.split("Duration:")[1].split(",")[0].strip()
        parts = time_str.split(":")
        total_sec = float(parts[0])*3600 + float(parts[1])*60 + float(parts[2])
        print(f"Total Seconds: {total_sec:.2f}s (Max 180s constraint: {'PASSED ✅' if total_sec <= 180.0 else 'FAILED ❌'})")
