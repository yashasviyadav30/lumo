"""Study groups (plan v3, step 4): a feed per group with Slack-style threads.

- Join by invite link; up to 50 members; each member picks a name for the group (no emails shown).
- Posts: a note, a doubt at a second of a video, or a shared video (optionally opened on its AI notes or mind map).
- The owner (creator, else the longest-standing member) can remove members and delete any post; authors can
  delete their own. Anyone can report a post or leave. Deleting an account deletes its posts (cascade).
- IDs travel in request bodies (R11). Posts store video IDs only; titles are fetched fresh (R1).
- No "who watched what" and no counts of activity per member (close to R8).
"""

import secrets
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field, model_validator
from sqlalchemy import and_, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth import current_user
from app.db import get_db
from app.models import GroupMember, GroupPost, PostReport, StudyGroup, User
from app.routers.study import VIDEO_ID, lecture_info, youtube_optional
from app.youtube import YouTubeClient

router = APIRouter(prefix="/api/groups", tags=["groups"])

MAX_MEMBERS = 50
MAX_GROUPS_PER_USER = 20
FEED_SIZE = 50


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def _membership(db: Session, user: User, group_id: uuid.UUID) -> GroupMember:
    m = db.scalar(select(GroupMember).where(GroupMember.group_id == group_id, GroupMember.user_id == user.id))
    if m is None:
        raise HTTPException(status_code=404, detail="group_not_found")  # same answer whether it exists or not
    return m


def _owner_id(db: Session, group: StudyGroup) -> uuid.UUID | None:
    members = list(db.scalars(select(GroupMember).where(GroupMember.group_id == group.id).order_by(GroupMember.joined_at, GroupMember.id)))
    ids = [m.user_id for m in members]
    if group.creator_id in ids:
        return group.creator_id
    return ids[0] if ids else None


def _names(db: Session, group_id: uuid.UUID) -> dict[uuid.UUID, str]:
    return dict(db.execute(select(GroupMember.user_id, GroupMember.name).where(GroupMember.group_id == group_id)).all())


def _post_view(p: GroupPost, names: dict, me: User, owner: uuid.UUID | None, reported: set, videos: dict, replies: int = 0) -> dict:
    return {
        "id": str(p.id),
        "kind": p.kind,
        "author": names.get(p.user_id, "Former member"),
        "mine": p.user_id == me.id,
        "can_delete": p.user_id == me.id or owner == me.id,
        "answered": p.answered_at is not None,
        "can_answer": p.kind == "doubt" and (p.user_id == me.id or owner == me.id),
        "reported": p.id in reported,
        "text": p.text,
        "video_id": p.video_id,
        "video": videos.get(p.video_id) if p.video_id else None,
        "t_seconds": p.t_seconds,
        "attach": p.attach,
        "replies": replies,
        "created_at": p.created_at.isoformat(),
    }


class NameIn(BaseModel):
    my_name: str = Field(min_length=1, max_length=40)


class CreateIn(NameIn):
    name: str = Field(min_length=2, max_length=80)


class CodeIn(BaseModel):
    code: str = Field(min_length=8, max_length=32, pattern=r"^[A-Za-z0-9_-]+$")


class JoinIn(CodeIn, NameIn):
    pass


class GroupIn(BaseModel):
    group_id: uuid.UUID


class PostIn(GroupIn):
    kind: str = Field(pattern=r"^(note|doubt|video)$")
    text: str = Field(default="", max_length=2000)
    video_id: str | None = Field(default=None, pattern=VIDEO_ID)
    t_seconds: int | None = Field(default=None, ge=0, le=24 * 3600)
    attach: str | None = Field(default=None, pattern=r"^(notes|map)$")

    @model_validator(mode="after")
    def _complete(self):
        if self.kind == "note" and not self.text.strip():
            raise ValueError("a note needs text")
        if self.kind == "doubt" and not (self.text.strip() or self.video_id):
            raise ValueError("a doubt needs text or a video moment")
        if self.kind == "video" and not self.video_id:
            raise ValueError("a shared video needs a video")
        return self


class PostRef(BaseModel):
    post_id: uuid.UUID


class AnsweredIn(PostRef):
    answered: bool


class ReplyIn(PostRef):
    text: str = Field(min_length=1, max_length=2000)


class RemoveIn(GroupIn):
    member_id: int


def _group_view(db: Session, group: StudyGroup, me: User, member: GroupMember) -> dict:
    owner = _owner_id(db, group)
    members = list(db.scalars(select(GroupMember).where(GroupMember.group_id == group.id).order_by(GroupMember.joined_at, GroupMember.id)))
    return {
        "id": str(group.id),
        "name": group.name,
        "invite_code": group.invite_code,
        "my_name": member.name,
        "i_own": owner == me.id,
        "members": [{"id": m.id, "name": m.name, "owner": m.user_id == owner, "me": m.user_id == me.id} for m in members],
    }


@router.post("", status_code=201)
def create_group(body: CreateIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    if db.scalar(select(func.count()).select_from(GroupMember).where(GroupMember.user_id == user.id)) >= MAX_GROUPS_PER_USER:
        raise HTTPException(status_code=429, detail="too_many_groups")
    group = StudyGroup(name=body.name.strip(), invite_code=secrets.token_urlsafe(12), creator_id=user.id)
    db.add(group)
    db.flush()
    member = GroupMember(group_id=group.id, user_id=user.id, name=body.my_name.strip())
    db.add(member)
    db.commit()
    return _group_view(db, group, user, member)


@router.get("")
def my_groups(user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    """Their groups, newest activity first, each with how many posts and replies the user hasn't seen."""
    rows = db.execute(select(StudyGroup, GroupMember).join(GroupMember, GroupMember.group_id == StudyGroup.id)
                      .where(GroupMember.user_id == user.id)).all()
    out = []
    for group, m in rows:
        unread = db.scalar(select(func.count()).select_from(GroupPost).where(
            GroupPost.group_id == group.id, GroupPost.user_id != user.id, GroupPost.created_at > m.seen_at))
        members = db.scalar(select(func.count()).select_from(GroupMember).where(GroupMember.group_id == group.id))
        last = db.scalar(select(func.max(GroupPost.created_at)).where(GroupPost.group_id == group.id))
        out.append({"id": str(group.id), "name": group.name, "members": members, "unread": unread,
                    "last": (_aware(last) if last else _aware(group.created_at)).isoformat()})
    out.sort(key=lambda g: g["last"], reverse=True)
    return {"groups": out, "unread": sum(g["unread"] for g in out)}


@router.post("/preview")
def preview(body: CodeIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    group = db.scalar(select(StudyGroup).where(StudyGroup.invite_code == body.code))
    if group is None:
        raise HTTPException(status_code=404, detail="invite_not_found")
    members = db.scalar(select(func.count()).select_from(GroupMember).where(GroupMember.group_id == group.id))
    already = db.scalar(select(GroupMember.id).where(GroupMember.group_id == group.id, GroupMember.user_id == user.id))
    return {"id": str(group.id), "name": group.name, "members": members, "full": members >= MAX_MEMBERS, "member": already is not None}


@router.post("/join")
def join(body: JoinIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "group_join"
    group = db.scalar(select(StudyGroup).where(StudyGroup.invite_code == body.code))
    if group is None:
        raise HTTPException(status_code=404, detail="invite_not_found")
    existing = db.scalar(select(GroupMember).where(GroupMember.group_id == group.id, GroupMember.user_id == user.id))
    if existing:
        return _group_view(db, group, user, existing)
    if db.scalar(select(func.count()).select_from(GroupMember).where(GroupMember.group_id == group.id)) >= MAX_MEMBERS:
        raise HTTPException(status_code=409, detail="group_full")
    member = GroupMember(group_id=group.id, user_id=user.id, name=body.my_name.strip())
    db.add(member)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # double tap
        member = db.scalar(select(GroupMember).where(GroupMember.group_id == group.id, GroupMember.user_id == user.id))
    return _group_view(db, group, user, member)


@router.post("/open")
def open_group(body: GroupIn, user: User = Depends(current_user), db: Session = Depends(get_db),
               yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    """The group's feed: posts newest first, each with its reply count. Marks the group as seen."""
    member = _membership(db, user, body.group_id)
    group = db.get(StudyGroup, body.group_id)
    posts = list(db.scalars(select(GroupPost).where(GroupPost.group_id == group.id, GroupPost.parent_id.is_(None))
                            .order_by(GroupPost.created_at.desc()).limit(FEED_SIZE)))
    counts = dict(db.execute(select(GroupPost.parent_id, func.count()).where(GroupPost.parent_id.in_([p.id for p in posts]))
                             .group_by(GroupPost.parent_id)).all()) if posts else {}
    reported = set(db.scalars(select(PostReport.post_id).where(PostReport.user_id == user.id)))
    videos = lecture_info(db, yt, [p.video_id for p in posts if p.video_id])
    names, owner = _names(db, group.id), _owner_id(db, group)
    member.seen_at = _now()
    db.commit()
    return _group_view(db, group, user, member) | {
        "posts": [_post_view(p, names, user, owner, reported, videos, counts.get(p.id, 0)) for p in posts]
    }


@router.post("/post", status_code=201)
def add_post(body: PostIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db),
             yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    request.state.action = "group_post"
    member = _membership(db, user, body.group_id)
    post = GroupPost(group_id=body.group_id, user_id=user.id, kind=body.kind, text=body.text.strip(), video_id=body.video_id,
                     t_seconds=body.t_seconds, attach=body.attach if body.kind == "video" else None)
    db.add(post)
    member.seen_at = _now()
    db.commit()
    group = db.get(StudyGroup, body.group_id)
    videos = lecture_info(db, yt, [post.video_id] if post.video_id else [])
    return _post_view(post, _names(db, group.id), user, _owner_id(db, group), set(), videos)


def _post_for(db: Session, user: User, post_id: uuid.UUID) -> tuple[GroupPost, GroupMember]:
    post = db.get(GroupPost, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="post_not_found")
    return post, _membership(db, user, post.group_id)


@router.post("/thread")
def thread(body: PostRef, user: User = Depends(current_user), db: Session = Depends(get_db),
           yt: YouTubeClient | None = Depends(youtube_optional)) -> dict:
    post, member = _post_for(db, user, body.post_id)
    if post.parent_id is not None:
        raise HTTPException(status_code=404, detail="post_not_found")
    replies = list(db.scalars(select(GroupPost).where(GroupPost.parent_id == post.id).order_by(GroupPost.created_at)))
    group = db.get(StudyGroup, post.group_id)
    names, owner = _names(db, group.id), _owner_id(db, group)
    reported = set(db.scalars(select(PostReport.post_id).where(PostReport.user_id == user.id)))
    videos = lecture_info(db, yt, [post.video_id] if post.video_id else [])
    return {"post": _post_view(post, names, user, owner, reported, videos, len(replies)),
            "replies": [_post_view(r, names, user, owner, reported, {}) for r in replies]}


@router.post("/reply", status_code=201)
def reply(body: ReplyIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "group_reply"
    post, member = _post_for(db, user, body.post_id)
    if post.parent_id is not None:
        raise HTTPException(status_code=422, detail="reply_to_a_reply")  # threads are one level, like Slack
    r = GroupPost(group_id=post.group_id, user_id=user.id, parent_id=post.id, kind="reply", text=body.text.strip())
    db.add(r)
    member.seen_at = _now()
    db.commit()
    group = db.get(StudyGroup, post.group_id)
    return _post_view(r, _names(db, group.id), user, _owner_id(db, group), set(), {})


@router.post("/post/delete", status_code=204)
def delete_post(body: PostRef, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    post, _ = _post_for(db, user, body.post_id)
    if post.user_id != user.id and _owner_id(db, db.get(StudyGroup, post.group_id)) != user.id:
        raise HTTPException(status_code=403, detail="not_allowed")
    db.delete(post)
    db.commit()


@router.post("/post/answered", status_code=204)
def mark_answered(body: AnsweredIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    """The person who asked a doubt (or the group owner) marks it answered, or open again."""
    post, _ = _post_for(db, user, body.post_id)
    if post.kind != "doubt":
        raise HTTPException(status_code=422, detail="not_a_doubt")
    if post.user_id != user.id and _owner_id(db, db.get(StudyGroup, post.group_id)) != user.id:
        raise HTTPException(status_code=403, detail="not_allowed")
    post.answered_at = datetime.now(timezone.utc) if body.answered else None
    db.commit()


@router.post("/report", status_code=204)
def report(body: PostRef, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    request.state.action = "group_report"
    post, _ = _post_for(db, user, body.post_id)
    db.add(PostReport(post_id=post.id, user_id=user.id))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # already reported


@router.post("/leave", status_code=204)
def leave(body: GroupIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    member = _membership(db, user, body.group_id)
    db.delete(member)
    db.flush()
    if db.scalar(select(func.count()).select_from(GroupMember).where(GroupMember.group_id == body.group_id)) == 0:
        db.delete(db.get(StudyGroup, body.group_id))  # the last one out deletes the group
    db.commit()


@router.post("/remove", status_code=204)
def remove(body: RemoveIn, user: User = Depends(current_user), db: Session = Depends(get_db)) -> None:
    _membership(db, user, body.group_id)
    group = db.get(StudyGroup, body.group_id)
    if _owner_id(db, group) != user.id:
        raise HTTPException(status_code=403, detail="not_allowed")
    target = db.get(GroupMember, body.member_id)
    if target is None or target.group_id != group.id or target.user_id == user.id:
        raise HTTPException(status_code=404, detail="member_not_found")
    db.delete(target)
    db.commit()
