import logging

from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.redis_client import ping_redis
from app.db.session import engine

router = APIRouter(tags=["Health"])
logger = logging.getLogger(__name__)


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ecommerce-backend",
    }


@router.get("/health/details")
def health_details():
    database_status = "connected"
    redis_status = "connected"

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        logger.warning("Database health check failed: %s", exc)
        database_status = "disconnected"

    if not ping_redis():
        redis_status = "disconnected"

    return {
        "status": "healthy" if database_status == "connected" else "unhealthy",
        "service": "ecommerce-backend",
        "version": settings.API_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": database_status,
        "redis": redis_status,
    }
