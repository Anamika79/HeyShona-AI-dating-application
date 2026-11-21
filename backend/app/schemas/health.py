from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class DatabaseHealth(BaseModel):
    connected: bool
    dialect: str
    error: Optional[str] = None


class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="Overall health state ('healthy' or 'degraded')")
    service: str = Field(..., description="Service identifier")
    version: str = Field(..., description="Application semantic version")
    environment: str = Field(..., description="Deployment environment")
    database: DatabaseHealth = Field(..., description="Database connectivity status")
    timestamp: datetime = Field(..., description="Server timestamp (UTC)")
