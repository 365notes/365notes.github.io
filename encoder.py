import json
import base64

INPUT_FILE = "notes.json"
OUTPUT_FILE = "encoded.json"

def encode_content_to_base64(value: str) -> str:
    return base64.b64encode(value.encode("utf-8")).decode("utf-8")

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

# Expecting a top-level list of objects
for entry in data:
    if "content" in entry and isinstance(entry["content"], str):
        entry["content"] = encode_content_to_base64(entry["content"])

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
