import os
from typing import List

from app.chatbot.ollama_client import OllamaClientSingleton
from app.chatbot.groq_client import GroqClient
from app.config import settings

class ChatbotService:
    def __init__(self, ollama_client: OllamaClientSingleton, gptoss_client: GroqClient):
        self.ollama_client = ollama_client
        self.gptoss_client = gptoss_client

    ### Groq
    async def retrieve_and_generate_groq(self, query: str):
        llm_response = await self.gptoss_client.chat_completion(query)
        return llm_response

    async def stream_response_groq(self, query: str):
        try:
            async for chunk in self.gptoss_client.chat_completion(query):
                yield chunk
        except Exception as e:
            print(f"Lỗi khi stream từ LLM: {e}")
            yield f'{"Lỗi khi stream từ LLM: {e}"}'

    ### Ollama
    async def retrieve_and_generate_ollama(self, query: str):
        llm_response = await self.ollama_client.chat_completion(query)
        return llm_response

    async def stream_response_ollama(self, query: str):
        try:
            async for chunk in self.gptoss_client.chat_completion(query):
                yield chunk
        except Exception as e:
            print(f"Lỗi khi stream từ LLM: {e}")
            yield f'{"Lỗi khi stream từ LLM: {e}"}'