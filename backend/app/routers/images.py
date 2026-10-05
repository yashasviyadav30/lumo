"""Screenshots in her notepad, like Google Docs (feedback 2026-10-06).

Images are compressed on the phone (WebP, at most 1600 px wide) and kept in our database. Each has an unguessable
ID, so the notepad can show it with a plain <img> (browsers can't send our sign-in header for images); only she
gets the link, inside her own notepad. Only PNG, JPEG and WebP are accepted, checked by their first bytes, and
they are served with nosniff so a browser never treats one as a page.
"""

import base64
import binascii
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth import current_user
from app.db import get_db
from app.models import NoteImage, User

router = APIRouter(prefix="/api/notepad/images", tags=["notepad"])

MAX_BYTES = 1_500_000
MAX_PER_USER = 300
SIGNATURES = {
    "image/png": lambda b: b.startswith(b"\x89PNG\r\n\x1a\n"),
    "image/jpeg": lambda b: b.startswith(b"\xff\xd8\xff"),
    "image/webp": lambda b: b[:4] == b"RIFF" and b[8:12] == b"WEBP",
}


class ImageIn(BaseModel):
    mime: str = Field(pattern=r"^image/(png|jpeg|webp)$")
    data: str = Field(min_length=16, max_length=MAX_BYTES * 4 // 3 + 8)  # base64


@router.post("", status_code=201)
def upload(body: ImageIn, request: Request, user: User = Depends(current_user), db: Session = Depends(get_db)) -> dict:
    request.state.action = "note_image"
    try:
        raw = base64.b64decode(body.data, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=422, detail="bad_image") from None
    if len(raw) > MAX_BYTES or not SIGNATURES[body.mime](raw):
        raise HTTPException(status_code=422, detail="bad_image")
    if db.scalar(select(func.count()).select_from(NoteImage).where(NoteImage.user_id == user.id)) >= MAX_PER_USER:
        raise HTTPException(status_code=429, detail="too_many_images")
    img = NoteImage(user_id=user.id, mime=body.mime, data=raw)
    db.add(img)
    db.commit()
    return {"url": f"/api/notepad/images/{img.id}"}


@router.get("/{image_id}")
def show(image_id: uuid.UUID, db: Session = Depends(get_db)) -> Response:
    img = db.get(NoteImage, image_id)
    if img is None:
        raise HTTPException(status_code=404, detail="image_not_found")
    return Response(content=img.data, media_type=img.mime, headers={
        "Cache-Control": "private, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
    })
