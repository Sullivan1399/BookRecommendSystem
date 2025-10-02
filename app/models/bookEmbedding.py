from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class BookEmbedding(BaseModel):
    ISBN: str
    embedding: List[float] = Field(..., alias="Embedding")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)