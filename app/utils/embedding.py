from sentence_transformers import SentenceTransformer


embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embedding(text: str):
    if not text:
        return []
    return embedding_model.encode(text).tolist()
