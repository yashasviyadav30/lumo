"""Daily YouTube quota counter (R12, plan 3.6).

YouTube resets quota at midnight Pacific time, so days are counted in that zone.
"""

from datetime import date, datetime
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import QuotaUsage

PACIFIC = ZoneInfo("America/Los_Angeles")


def quota_day(now: datetime | None = None) -> date:
    return (now or datetime.now(PACIFIC)).astimezone(PACIFIC).date()


def used(db: Session, bucket: str, day: date | None = None) -> int:
    row = db.get(QuotaUsage, (day or quota_day(), bucket))
    return row.count if row else 0


def search_left(db: Session) -> int:
    return max(0, get_settings().search_quota_per_day - used(db, "search"))


def record(db: Session, bucket: str, units: int = 1) -> None:
    day = quota_day()
    row = db.scalar(select(QuotaUsage).where(QuotaUsage.day == day, QuotaUsage.bucket == bucket).with_for_update())
    if row is None:
        db.add(QuotaUsage(day=day, bucket=bucket, count=units))
        try:
            db.commit()
            return
        except IntegrityError:  # another request made today's row first: add to that one
            db.rollback()
            row = db.scalar(select(QuotaUsage).where(QuotaUsage.day == day, QuotaUsage.bucket == bucket).with_for_update())
    row.count += units
    db.commit()
