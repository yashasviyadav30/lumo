"""What to show, hide or drop (plan 3.3, 3.3b; R3, R5, R6).

Every rule uses YouTube's own fields or the user's own settings. Nothing here judges a title's meaning.

- DROP: videos that can't play in the app (age-restricted, not embeddable, blocked in India). Listed with
  the reason, never playable here.
- HIDE: videos YouTube itself types as songs, movies, entertainment shows, news or travel vlogs; the user's
  mutes; Shorts when the user has them off. "Show" reveals them in place.
Channels the user follows are never hidden by YouTube's type (uploaders choose their own category and are
sometimes wrong). People & Blogs is shown: podcasts and interviews carry that label too.
"""

from dataclasses import dataclass, field

# YouTube's standard category IDs (confirmed with videoCategories.list, regionCode=IN).
CATEGORY_NAMES = {
    "1": "Film & Animation",
    "2": "Autos & Vehicles",
    "10": "Music",
    "15": "Pets & Animals",
    "17": "Sports",
    "19": "Travel & Events",
    "20": "Gaming",
    "22": "People & Blogs",
    "23": "Comedy",
    "24": "Entertainment",
    "25": "News & Politics",
    "26": "Howto & Style",
    "27": "Education",
    "28": "Science & Technology",
    "29": "Nonprofits & Activism",
    # Non-assignable categories YouTube lists for India (checked 2026-09-29).
    "18": "Short Movies",
    "21": "Videoblogging",
    "30": "Movies",
    "31": "Anime/Animation",
    "32": "Action/Adventure",
    "33": "Classics",
    "34": "Comedy",
    "35": "Documentary",
    "36": "Drama",
    "37": "Family",
    "38": "Foreign",
    "39": "Horror",
    "40": "Sci-Fi/Fantasy",
    "41": "Thriller",
    "42": "Shorts",
    "43": "Shows",
    "44": "Trailers",
}
# The user's hide list (2026-10-01): songs, movies, entertainment shows, news channels, vlogs.
# Documentary (35) and People & Blogs (22, where most podcasts sit) are left out on purpose.
ENTERTAINMENT_CATEGORIES = {
    "1", "10", "19", "20", "21", "23", "24", "25",  # Film, Music, Travel vlogs, Gaming, Videoblogging, Comedy, Entertainment, News
    "18", "30", "31", "32", "33", "34", "36", "37", "38", "39", "40", "41", "42", "43", "44",  # movie & show genres
}
LEARNING_CATEGORIES = {"26", "27", "28"}

# topicDetails.topicCategories are Wikipedia URLs. These page names mean entertainment.
ENTERTAINMENT_TOPICS = {
    "Music": "Music",
    "Video_game_culture": "Gaming",
    "Action_game": "Gaming",
    "Role-playing_video_game": "Gaming",
    "Humour": "Comedy",
    "Film": "Films",
    "Television_program": "TV shows",
    "Entertainment": "Entertainment",
}

SHORTS_MAX_SECONDS = 180  # YouTube Shorts can be up to 3 minutes


@dataclass
class UserRules:
    muted_channels: set[str] = field(default_factory=set)
    muted_phrases: list[str] = field(default_factory=list)
    shorts_enabled: bool = False
    trusted_channels: set[str] = field(default_factory=set)  # channels the user follows


@dataclass
class Verdict:
    visible: bool
    playable: bool
    reasons: list[str]


def _topic_names(topics: list[str] | None) -> list[str]:
    return [t.rsplit("/", 1)[-1] for t in (topics or [])]


def youtube_type_reason(category_id: str | None, topics: list[str] | None) -> str | None:
    """Plain-word reason if YouTube's own fields say this is entertainment, else None."""
    if category_id in ENTERTAINMENT_CATEGORIES:
        return f"YouTube lists this as {CATEGORY_NAMES[category_id]}"
    if category_id in LEARNING_CATEGORIES:
        return None  # YouTube calls it Education/Science/How-to: don't second-guess with topics
    for name in _topic_names(topics):
        for key, label in ENTERTAINMENT_TOPICS.items():
            if name == key or name.endswith("_music") and key == "Music":
                return f"YouTube tags this as {label}"
    return None


def is_short(video) -> bool:
    """Shorts rule on YouTube's own fields: 3 minutes or less AND vertical. Unknown shape → not a Short,
    because short horizontal lessons (worked examples) must not be hidden (over-blocking is the bigger failure)."""
    return (
        video.duration_s is not None
        and video.duration_s <= SHORTS_MAX_SECONDS
        and video.vertical is True
        and video.live == "none"
    )


def judge(video, rules: UserRules) -> Verdict:
    """video: anything with the YtVideo fields."""
    reasons: list[str] = []
    if video.age_restricted:
        reasons.append("Age-restricted by YouTube")
    if not video.embeddable:
        reasons.append("The owner doesn’t allow it to play outside YouTube")
    if video.blocked_in_india:
        reasons.append("Not available in India")
    if reasons:
        return Verdict(visible=False, playable=False, reasons=reasons)

    if video.channel_id in rules.muted_channels:
        reasons.append("Your mute: this channel")
    title = (video.title or "").casefold()
    for phrase in rules.muted_phrases:
        if phrase and phrase.casefold() in title:
            reasons.append(f"Your mute: “{phrase}”")
            break
    if not rules.shorts_enabled and is_short(video):
        reasons.append("Short vertical video, and your Shorts setting is off")
    if video.channel_id not in rules.trusted_channels:
        type_reason = youtube_type_reason(video.category_id, video.topic_categories)
        if type_reason:
            reasons.append(type_reason)
    return Verdict(visible=not reasons, playable=True, reasons=reasons)
