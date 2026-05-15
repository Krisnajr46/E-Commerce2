import json
import logging
from typing import Any

import redis
from redis.exceptions import RedisError

from app.core.config import settings

logger = logging.getLogger(__name__)


def get_redis_client() -> redis.Redis:
    return redis.Redis.from_url(
        settings.REDIS_URL,
        decode_responses=True,
    )


def ping_redis() -> bool:
    try:
        redis_client = get_redis_client()
        return bool(redis_client.ping())
    except RedisError as exc:
        logger.warning("Redis ping failed: %s", exc)
        return False


def serialize_json(value: Any) -> str:
    return json.dumps(value)


def deserialize_json(value: str) -> Any:
    return json.loads(value)
