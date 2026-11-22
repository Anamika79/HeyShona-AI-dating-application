import os
from typing import List, Union
from pydantic import field_validator

# Preload .env if python-dotenv is present
try:
    from dotenv import load_dotenv
    for env_path in [".env", "backend/.env", "../backend/.env"]:
        if os.path.exists(env_path):
            load_dotenv(env_path)
            break
except ImportError:
    pass

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    # Graceful fallback to standard pydantic.BaseModel if pydantic-settings is not installed in the current environment
    from pydantic import BaseModel as BaseSettings
    SettingsConfigDict = None


class Settings(BaseSettings):
    """Application settings and environment variable validation."""

    if SettingsConfigDict is not None:
        model_config = SettingsConfigDict(
            env_file=(".env", "backend/.env", "../backend/.env"),
            env_file_encoding="utf-8",
            case_sensitive=True,
            extra="ignore",
        )

    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "AI Dating Platform API")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    # Database configuration (defaults to SQLite)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dating_platform.db")

    # CORS configuration
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Gemini AI configuration (server-side only, never expose to frontend)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
    GEMINI_TIMEOUT_SECONDS: int = int(os.getenv("GEMINI_TIMEOUT_SECONDS", "60"))

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json

                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return []


settings = Settings()
