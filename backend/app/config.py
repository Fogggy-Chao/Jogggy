from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    ELEVENLABS_API_KEY: str
    FRONTEND_URL: str
    PORT: int
    HOST: str
    UPLOAD_DIR: str = "uploads"
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()