from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # Database
    MONGODB_URI: str = ""
    DATABASE_NAME: str = "BookRecommend"
    BOOK_COLLECTION_NAME: str = "Book"
    USER_COLLECTION_NAME: str = "User"

    # JWT Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


settings = Settings()
