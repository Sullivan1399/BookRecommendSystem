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
    RATING_COLLECTION_NAME: str = "Rating"
    BOOK_EMBEDDING_COLLECTION_NAME: str = "Book_Embedding"

    # JWT Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Ollama Settings
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    LLM_MODEL_NAME: str = "llama3.2:1b"

    # Groq Settings
    GROQ_API_KEY: str = ""
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    LLM_MODEL_NAME_GROQ: str = "openai/gpt-oss-20b"
    MAX_TOKENS_GROQ: int = 8192

settings = Settings()
