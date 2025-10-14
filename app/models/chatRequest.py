from pydantic import BaseModel

class ChatRequest(BaseModel):
    model_source: str
    query: str