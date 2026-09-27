"""
Application configuration module.
"""
try:
    # Try to import from pydantic-settings (pydantic v2)
    from pydantic_settings import BaseSettings
except ImportError:
    # Fall back to pydantic v1
    from pydantic import BaseSettings

from pydantic import PostgresDsn, validator
from typing import List, Union, Any
import secrets


class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str = "Connect API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALGORITHM: str = "HS256"

    # Database
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str = "5432"
    DATABASE_URI: PostgresDsn = None

    @validator("DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Union[str, None], values: dict) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+psycopg2",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            port=str(values.get("POSTGRES_PORT")),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8080"]

    # S3 Storage
    S3_ENDPOINT_URL: str = "http://localhost:9000"  # MinIO default
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_REGION: str = "us-east-1"
    S3_BUCKET_NAME: str = "connect-verification-docs"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()