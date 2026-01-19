import os
from typing import Optional

# Prefer pydantic_settings (pydantic v2) if available; fall back safely.
BaseSettings = None
try:
    from pydantic_settings import BaseSettings  # type: ignore
except Exception:
    try:
        import pydantic
        if hasattr(pydantic, "BaseSettings"):
            BaseSettings = pydantic.BaseSettings  # type: ignore
    except Exception:
        BaseSettings = None

if BaseSettings is not None:
    class Settings(BaseSettings):
        DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/model_vadivamaipu"
        SECRET_KEY: str = "your_secret_key_here"
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
        GEMINI_API_KEY: Optional[str] = None

        class Config:
            env_file = ".env"

    settings = Settings()
else:
    # Minimal fallback when pydantic BaseSettings is not available.
    # Load .env if python-dotenv is available, otherwise trust os.environ.
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except Exception:
        pass

    class Settings:
        DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/model_vadivamaipu")
        SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key_here")
        ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")

    settings = Settings()
