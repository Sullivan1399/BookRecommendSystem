from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config=SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    MONGODB_URI: str = ""
    HOST:str = "127.0.0.1"
    PORT:int = 8000

settings = Settings()