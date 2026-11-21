from typing import Any, List, Optional
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    message: str
    location: Optional[List[str]] = None


class ErrorEnvelope(BaseModel):
    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error description")
    details: Optional[List[Any]] = Field(default=None, description="Detailed validation or contextual errors")


class StandardErrorResponse(BaseModel):
    error: ErrorEnvelope
