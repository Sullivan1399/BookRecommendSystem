import httpx
from typing import List
import json

from app.config.settings import settings

SYSTEM_PROMPT = (
    "You are BookBot. Only answer about books (metadata, summaries, recommendations, genres)."
    "Use **Markdown formatting** to structure your answer, including headings, lists, and **bold/italic formatting**."
    "If the user's question is not about books, reply: 'Xin lỗi — tôi chỉ trả lời các câu hỏi liên quan đến sách.'"
)

class OllamaClientSingleton:
    _instance = None
    _client: httpx.AsyncClient | None = None
    _llm_model_name: str | None = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(OllamaClientSingleton, cls).__new__(cls)
            cls._client = httpx.AsyncClient(base_url=settings.OLLAMA_BASE_URL, timeout=300.0)
            cls._llm_model_name = settings.LLM_MODEL_NAME
            print(f"Initialized Ollama client with model: LLM model: {cls._llm_model_name}")
        return cls._instance

    # Perform a POST request to the Ollama API
    async def _perform_request(self, endpoint: str, payload: dict) -> dict:
        url = f"{self._client.base_url}{endpoint}"

        try:
            response = await self._client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()            
            return data
        
        except httpx.RequestError as exc:
            print(f"Lỗi khi yêu cầu Ollama tại {exc.request.url!r}: {exc}")
            return {"error": f"Lỗi kết nối đến Ollama: {exc}"}
        except httpx.HTTPStatusError as exc:
            print(f"Lỗi phản hồi từ Ollama tại {exc.request.url!r}: {exc.response.status_code} - {exc.response.text}")
            return {"error": f"Model trả về lỗi: {exc.response.status_code} - {exc.response.text}"}
        except Exception as e:
            print(f"Lỗi không xác định khi gọi Ollama: {e}")
            return {"error": "Đã xảy ra lỗi không xác định khi gọi model."}
    
    async def _perform_stream_request(self, endpoint: str, payload: dict):
        url = f"{self._client.base_url}{endpoint}"

    async def _process_line(self, raw_line: str):
        if raw_line.startswith("data:"):
            raw_line = raw_line[len("data:"):].strip()
        if not raw_line:
            return
        try:
            obj = json.loads(raw_line)
        except json.JSONDecodeError:
            # có thể là plain text token -> in thẳng
            print(raw_line, end='', flush=True)
            return
        
        content = None
        if isinstance(obj, dict):
            content = obj.get("message", {}).get("content") or obj.get("content") or obj.get("text") or obj.get("token")
            if content is None and "choices" in obj:
                for c in obj["choices"]:
                    d = c.get("delta") or c.get("message") or {}
                    if isinstance(d, dict):
                        content = d.get("content") or d.get("text")
                        if content:
                            break
        return content
    
    async def chat_completion(self, messages: list[dict]):
        payload = {
            "model": self._llm_model_name,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": messages}
            ],
            "stream": True
        }

        # data = await self._perform_request("/api/chat", payload)
        # return data.get("message", {}).get("content", data.get("error", "Can not receive chat response."))
        try:
            async with self._client.stream("POST", "/api/chat", json=payload, timeout=None) as response:
                response.raise_for_status()
                buf = ""
                async for chunk in response.aiter_text():
                    buf += chunk
                    while "\n" in buf:
                        line, buf = buf.split("\n", 1)
                        content = await self._process_line(line)
                        if content:
                            yield content
        
        except httpx.RequestError as exc:
            print(f"Lỗi khi yêu cầu Ollama tại {exc.request.url!r}: {exc}")
            yield {f"Lỗi kết nối đến Ollama: {exc}"}
        except httpx.HTTPStatusError as exc:
            print(f"Lỗi phản hồi từ Ollama tại {exc.request.url!r}: {exc.response.status_code} - {exc.response.text}")
            yield {f"Model trả về lỗi: {exc.response.status_code} - {exc.response.text}"}
        except Exception as e:
            print(f"Lỗi không xác định khi gọi Ollama: {e}")
            yield {"Đã xảy ra lỗi không xác định khi gọi model."}
    
    def get_llm_model_name(self) -> str:
        return self._llm_model_name
    
    async def close_client(self):
        if self._client:
            await self._client.aclose()
            self._client = None
            print("Ollama client closed.")

def get_ollama_client_singleton() -> OllamaClientSingleton:
    return OllamaClientSingleton()
