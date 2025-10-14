import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatbotFloatButton() {
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");

const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    setTimeout(() => {
    setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Mình đang xử lý câu hỏi của bạn..." },
    ]);
    }, 600);
};

return (
    <>
    {/* Float Button */}
    <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 z-40 border border-slate-700 cursor-pointer"
    >
        {!open ? (
        <MessageCircle size={24} className="text-white " />
        ) : (
        <X size={24} className="text-white" />
        )}
    </button>

    {/* Chat Box */}
    {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white shadow-2xl rounded-3xl border border-slate-200 flex flex-col overflow-hidden z-50 backdrop-blur-sm bg-opacity-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex justify-between items-center">
            <div>
            <h2 className="text-white font-semibold text-lg">BookBot</h2>
            <p className="text-slate-300 text-xs">Luôn sẵn sàng giúp bạn</p>
            </div>
            <button
            onClick={() => setOpen(false)}
            className="!bg-transparent !text-white hover:!bg-white hover:!text-black hover:!rounded-full p-2 cursor-pointer"
            >
            <X size={20} />
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
                <div>
                <div className="text-4xl mb-3">👋</div>
                <p className="text-slate-500 text-sm">
                    Chào bạn! Mình là MeeBot.
                </p>
                <p className="text-slate-400 text-xs mt-2">
                    Hãy bắt đầu một cuộc trò chuyện
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
                className={`px-4 py-3 rounded-2xl text-sm max-w-xs transition-all ${
                    msg.sender === "user"
                    ? "bg-slate-900 text-white rounded-br-none shadow-md"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                }`}
                >
                {msg.text}
                </div>
            </div>
            ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white p-4 flex gap-3 items-end">
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 rounded-full border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
            />
            <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors hover:shadow-md cursor-pointer"
            >
            <Send size={16} />
            </button>
        </div>
        </div>
      )}
    </>
  );
}
