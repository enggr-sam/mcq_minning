"""Application configuration."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings loaded from environment."""

    app_name: str = "MCQ Mining API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    upload_dir: str = "uploads"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


settings = Settings()
