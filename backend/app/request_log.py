"""Request logging without YouTube data (R11, plan 2.6).

Each API request writes one row: time, user pseudonym, method, route *template* (never the raw path or
query string), status, duration and a shortened IP. Video IDs travel in request bodies, which are never
logged, so logs can't contain them. Uvicorn's own access log is switched off in the Dockerfile.
"""

import ipaddress
import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.db import session_factory
from app.models import AppLog

log = logging.getLogger("app.requests")


def ip_prefix(raw: str | None) -> str | None:
    """IPv4 → a.b.c.0, IPv6 → first 48 bits. Enough to spot abuse, not to identify a home."""
    if not raw:
        return None
    try:
        ip = ipaddress.ip_address(raw.split(",")[0].strip())
    except ValueError:
        return None
    net = ipaddress.ip_network(f"{ip}/{24 if ip.version == 4 else 48}", strict=False)
    return str(net.network_address)


def client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded
    return request.client.host if request.client else None


class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        if not request.url.path.startswith("/api/"):
            return response
        route = getattr(request.scope.get("route"), "path", "unmatched")
        action = getattr(request.state, "action", None)
        # R10: nothing about a refused under-18 person is kept, not even a shortened IP.
        keep_ip = action != "signup_refused_under_18"
        row = AppLog(
            actor=getattr(request.state, "actor", None),
            method=request.method,
            route=route[:120],
            status=response.status_code,
            ms=int((time.perf_counter() - start) * 1000),
            ip_prefix=ip_prefix(client_ip(request)) if keep_ip else None,
            action=action,
        )
        factory = session_factory()
        if factory is not None:
            try:
                with factory() as db:
                    db.add(row)
                    db.commit()
            except Exception:  # logging must never break a request
                log.exception("could not write request log")
        return response
