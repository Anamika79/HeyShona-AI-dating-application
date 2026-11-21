import logging
import sys
from app.core.config import settings


def setup_logging() -> None:
    """Configures application-wide structured logging."""
    log_format = "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d - %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"

    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    logging.basicConfig(
        level=level,
        format=log_format,
        datefmt=date_format,
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    # Silence overly verbose third-party loggers if not in DEBUG
    if not settings.DEBUG:
        logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


logger = logging.getLogger("ai_dating_platform")
