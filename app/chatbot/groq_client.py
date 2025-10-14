import httpx
import json
# import groq

from app.config.settings import settings

SYSTEM_PROMPT = (
    "You are BookBot. Only answer about books (metadata, summaries, recommendations, genres)."
    "Use **Markdown formatting** to structure your answer, including headings, lists, and **bold/italic formatting**."
    "If the user's question is not about books, reply: 'Xin lỗi — tôi chỉ trả lời các câu hỏi liên quan đến sách.'"
)

class GroqClient:
    _instance = None
    _client: httpx.AsyncClient | None = None
    _llm_model_name_groq: str | None = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GroqClient, cls).__new__(cls)
            api_key = settings.GROQ_API_KEY
            cls._client = httpx.AsyncClient(base_url=settings.GROQ_BASE_URL, headers={"Authorization": f"Bearer {api_key}"}, timeout=300.0)
            cls._llm_model_name_groq = settings.LLM_MODEL_NAME_GROQ
            print(f"Initialized Groq client with model: {cls._llm_model_name_groq}")
        return cls._instance
    
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
            "model": self._llm_model_name_groq,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": messages}
            ],
            "max_tokens": settings.MAX_TOKENS_GROQ,
            "stream": True
        }
        try:
            async with self._client.stream("POST", "chat/completions", json=payload, timeout=None) as response:
                response.raise_for_status()
                buf = ""
                async for chunk in response.aiter_text():
                    buf += chunk
                    while "\n" in buf:
                        line, buf = buf.split("\n", 1)
                        content = await self._process_line(line)
                        if content:
                            yield content
            # response = await self._client.post("chat/completions", json=payload)
            # response.raise_for_status()
            # data = response.json()
            # return data.get("choices", [{}])[0].get("message", {}).get("content", "No content received.")
        except httpx.RequestError as exc:
            print(f"Error while requesting GPT-OSS at {exc.request.url!r}: {exc}")
            yield f"Connection error to GPT-OSS: {exc}"
        except httpx.HTTPStatusError as exc:
            print(f"Error response from GPT-OSS at {exc.request.url!r}: {exc.response.status_code} - {exc.response.text}")
            yield f"Model returned error: {exc.response.status_code} - {exc.response.text}"
        except Exception as e:
            print(f"Unexpected error when calling GPT-OSS: {e}")
            yield "An unexpected error occurred when calling the model."

    def get_llm_model_name(self) -> str:
        return self._llm_model_name_groq
    
def get_gptoss_client() -> GroqClient:
    return GroqClient()