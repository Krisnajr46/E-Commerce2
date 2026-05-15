import logging
from typing import Any

from app.core.config import settings
from app.core.redis_client import (
    RedisError,
    deserialize_json,
    get_redis_client,
    serialize_json,
)

logger = logging.getLogger(__name__)


def get_cache(key: str) -> Any | None:
    try:
        client = get_redis_client()
        if client is None:
            return None
        cached_value = client.get(key)
        if cached_value is None:
            return None
        return deserialize_json(cached_value)
    except (RedisError, ValueError, TypeError) as exc:
        logger.warning("Redis cache read failed for key %s: %s", key, exc)
        return None


def set_cache(key: str, value: Any) -> None:
    try:
        client = get_redis_client()
        if client is None:
            return
        client.setex(key, settings.CACHE_TTL_SECONDS, serialize_json(value))
    except (RedisError, TypeError) as exc:
        logger.warning("Redis cache write failed for key %s: %s", key, exc)


def delete_cache(key: str) -> None:
    try:
        client = get_redis_client()
        if client is None:
            return
        client.delete(key)
    except RedisError as exc:
        logger.warning("Redis cache delete failed for key %s: %s", key, exc)


def delete_pattern(pattern: str) -> None:
    try:
        client = get_redis_client()
        if client is None:
            return
        keys = list(client.scan_iter(match=pattern))
        if keys:
            client.delete(*keys)
    except RedisError as exc:
        logger.warning("Redis cache pattern delete failed for pattern %s: %s", pattern, exc)
