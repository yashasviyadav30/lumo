# Thrywe's rules

Every feature is checked against these rules before it ships. They come from YouTube's Developer Policies and API
compliance guide, India's Digital Personal Data Protection Act (DPDP), and Thrywe's own product decisions.

| # | Rule | Source |
|---|---|---|
| R1 | YouTube API data (titles, descriptions, thumbnails, fields) is kept **30 days at most**, then refreshed or deleted. | YouTube Developer Policies III.E.4 |
| R2 | A person's data is deleted **within 7 days** of their request or of deleting their account (in practice, at once). | Policies III.E.4.g |
| R3 | **A video's type comes only from YouTube** (`categoryId`, `topicDetails`, `safeSearch`, age-restricted, embeddable). Thrywe never judges YouTube videos with its own model, an LLM or word-matching on titles. Only YouTube's fields, curated mappings and each person's own rules decide what shows. | YouTube API compliance guide |
| R4 | The goal assistant (an LLM) sees only **the person's own words**: their goal, search or mute words, never video titles, on a zero-retention host. AI summaries are made from the public video only. | Architecture |
| R5 | `safeSearch=strict` on every search. Age-restricted, non-embeddable and region-blocked videos are dropped everywhere and counted in the hidden line. | YouTube Data API |
| R6 | Hidden results show **"N hidden by Thrywe · Why · Show"**, and Show reveals them in place. | Policies III.C |
| R7 | The YouTube player is never changed, covered or blocked. Ads play, its links open YouTube, and there is no background play. Thrywe's panels open below the player. | Policies III.I |
| R8 | **No rewards for watching**: no coins, points, streaks or leaderboards, and nothing but "play" to watch. | Policies III.F |
| R9 | Thrywe's own data next to YouTube data is marked as not from YouTube. Thrywe has its own name and look, with YouTube attribution per the branding guidelines. | Policies III.E.4.h |
| R10 | Accounts are for adults (**18+**). The date of birth is checked once and never stored. | Product decision |
| R11 | Video IDs and search text travel in request bodies, never URLs; logs hold route templates only, never video IDs or titles. | Privacy by design |
| R12 | Search uses a fixed daily quota for the whole app. Every feature still works, in reduced form, when it runs out. | YouTube API quota |
| R13 | Safety wording is "we try to hide harmful content", never "safe". | Product decision |
| R14 | No viewing record is kept for Made-for-Kids videos. | Policies III.E.4.j |

A person's own mutes (a word or channel they chose) are their rule, not Thrywe's judgement, so they fit R3.
