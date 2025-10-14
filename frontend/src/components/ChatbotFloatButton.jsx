import { useState } from "react";
import { MessageCircle, X, Send, Maximize2, Minimize2, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatbotFloatButton() {
  const [open, setOpen] = useState(false);
  const [expandedBox, setExpandedBox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelSource, setModelSource] = useState("groq"); // 🧠 thêm state chọn model

  // 🧠 Gọi API thật
  const callChatAPI = async (query) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_source: modelSource, // ✅ dùng model được chọn
          query: query,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.text();
      return data;
    } catch (err) {
      console.error("❌ Lỗi gọi chatbot:", err);
      return "⚠️ Xin lỗi, không thể kết nối đến máy chủ.";
    }
  };

  // 📨 Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    const botIndex = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "", fullText: "", expanded: false },
    ]);

    const controller = new AbortController();
    window.currentChatAbortController = controller;
    const signal = controller.signal;

    try {
      const reply = await callChatAPI(userText);
      let currentText = "";

      for (let i = 0; i <= reply.length; i++) {
        if (signal.aborted) break;
        await new Promise((r) => setTimeout(r, 15));
        currentText = reply.slice(0, i);

        setMessages((prev) => {
          const newMsgs = [...prev];
          if (newMsgs[botIndex]) {
            newMsgs[botIndex] = {
              ...newMsgs[botIndex],
              text: currentText,
              fullText: reply,
            };
          }
          return newMsgs;
        });
      }
    } catch (err) {
      console.error("⚠️ Lỗi xử lý:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Lỗi khi phản hồi.", fullText: "⚠️ Lỗi khi phản hồi." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Toggle mở rộng — dừng stream nếu đang chạy
  const toggleExpand = (index) => {
    if (window.currentChatAbortController) {
      window.currentChatAbortController.abort();
      window.currentChatAbortController = null;
    }

    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, expanded: !msg.expanded } : msg
      )
    );
  };

  return (
    <>
      {/* 🔘 Nút nổi Chatbot */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 z-40 border border-slate-700 cursor-pointer"
      >
        {!open ? <MessageCircle size={24} /> : <X size={24} />}
      </button>

      {/* 💬 Hộp chat */}
      {open && (
        <div
          className={`fixed bottom-24 right-6 bg-white shadow-2xl rounded-3xl border border-slate-200 flex flex-col overflow-hidden z-50 transition-all duration-300 ${
            expandedBox ? "w-[60vw] h-[80vh]" : "w-96 h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-white font-semibold text-lg">📚 BookBot</h2>
              <p className="text-slate-300 text-xs">
                Gợi ý sách & hỗ trợ bạn
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* 🧩 Select model */}
              <select
                value={modelSource}
                onChange={(e) => setModelSource(e.target.value)}
                className="bg-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none border border-slate-500 cursor-pointer hover:bg-slate-600"
                title="Chọn model chatbot"
              >
                <option value="groq">Groq</option>
                <option value="ollama">Ollama</option>
              </select>

              {/* Nút thu nhỏ / đóng */}
              <button
                onClick={() => setExpandedBox(!expandedBox)}
                className="p-2 hover:bg-white/20 rounded-full text-white"
                title={expandedBox ? "Thu nhỏ" : "Mở rộng"}
              >
                {expandedBox ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-slate-500 text-sm">
                    Xin chào! Mình là <b>BookBot</b>.
                  </p>
                  <p className="text-slate-400 text-xs mt-2">
                    Hãy hỏi mình về sách, thể loại hoặc tác giả nhé!
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm max-w-[90%] whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white rounded-br-none shadow-md"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.expanded
                          ? msg.fullText
                          : (msg.text || "").slice(0, 500) +
                            (msg.fullText?.length > 500 ? "..." : "")}
                      </ReactMarkdown>
                      {msg.fullText?.length > 500 && (
                        <button
                          onClick={() => toggleExpand(i)}
                          className="text-blue-500 text-xs ml-2 underline"
                        >
                          {msg.expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                        </button>
                      )}
                    </>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white p-4 flex gap-3 items-end !text-black">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-full border border-slate-300 !text-black placeholder:text-gray-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800"
              } !text-white transition-colors`}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
