import urllib.request, urllib.error

urls = [
    ("ROOT/announcements/saa.png", "https://qrypogbiveozlopzodcb.supabase.co/storage/v1/object/public/media/announcements/saa.png"),
    ("MEDIA/announcements/saa.png", "https://qrypogbiveozlopzodcb.supabase.co/storage/v1/object/public/media/media/announcements/saa.png"),
    ("ROOT/diocese/bishop-photo.jpg", "https://qrypogbiveozlopzodcb.supabase.co/storage/v1/object/public/media/diocese/bishop-photo.jpg"),
    ("MEDIA/diocese/bishop-photo.jpg", "https://qrypogbiveozlopzodcb.supabase.co/storage/v1/object/public/media/media/diocese/bishop-photo.jpg"),
]

for label, url in urls:
    try:
        resp = urllib.request.urlopen(url)
        size = resp.headers.get("Content-Length", "?")
        print(f"  OK  {label} -> {resp.getcode()} ({size} bytes)")
    except urllib.error.HTTPError as e:
        print(f"  ERR {label} -> {e.code}")
    except Exception as e:
        print(f"  ERR {label} -> {e}")
