from typing import Generator, Dict, Any
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.core.logging import logger

is_sqlite = settings.DATABASE_URL.startswith("sqlite")

engine_kwargs: Dict[str, Any] = {}
if is_sqlite:
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    **engine_kwargs,
)

# Enable foreign keys for SQLite
if is_sqlite:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection: Any, connection_record: Any) -> None:
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency providing a database session per request."""
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def check_db_connection() -> Dict[str, Any]:
    """Performs a light ping to ensure database connectivity."""
    dialect = "sqlite" if is_sqlite else "postgresql"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"connected": True, "dialect": dialect, "error": None}
    except Exception as exc:
        logger.error(f"Database health check failed: {exc}")
        return {"connected": False, "dialect": dialect, "error": str(exc)}
