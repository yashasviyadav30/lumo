# Filter prototype (Phase 1)

Scripts to build and test the learning-vs-entertainment filter before any app exists.

## Setup

1. Get a YouTube Data API key: Google Cloud Console, enable **YouTube Data API v3**, then create an API key under Credentials.
2. Copy `.env.example` to `.env` and paste the key in.
3. Install dependencies: `uv sync`

## Fetch video details

Put video IDs or URLs in `data/video_ids.txt`, one per line, then run:

```
uv run fetch_videos.py data/video_ids.txt data/videos.csv --check-shorts
```

This writes title, channel, category, tags, duration, captions flag, live status and description for each video. The `label` column is empty: fill it in by hand with `learning` or `entertainment`.

`--check-shorts` uses an unofficial trick (a `youtube.com/shorts/<id>` request answers 200 for Shorts and redirects for normal videos). It isn't part of the API and may stop working, which is why it's a flag and not the default.

## Next steps

- [ ] Collect 500+ video IDs and label them
- [ ] Write the LLM classifier prompt
- [ ] Measure wrongly blocked and wrongly allowed
