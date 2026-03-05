import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";

export default function SupportChatPage() {
  const [chatId, setChatId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [escalated, setEscalated] = useState(false);
  const [activeNav, setActiveNav] = useState("chat");
  const bottomRef = useRef(null);

  useEffect(() => {
    const storedOrderId = window.localStorage.getItem("latestOrderId");
    if (storedOrderId) setOrderId(storedOrderId);

    const storedChatId = window.localStorage.getItem("latestChatId");
    if (storedChatId) {
      (async () => {
        try {
          const res = await api.get(`/chat/${storedChatId}`);
          setChatId(res.data.chatId);
          if (res.data.orderId) setOrderId(res.data.orderId);
          setEscalated(res.data.escalated);
          const withIds = (res.data.messages || []).map((m, index) => ({
            ...m,
            id: `${res.data.chatId}-${index}-${m.timestamp || "t"}`
          }));
          setMessages(withIds);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    setIsSending(true);
    setError("");
    const userText = input.trim();
    setInput("");

    try {
      const res = await api.post("/chat/message", {
        chatId,
        message: userText,
        orderId
      });

      setChatId(res.data.chatId);
      window.localStorage.setItem("latestChatId", res.data.chatId);
      setEscalated(res.data.escalated);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "user", text: userText },
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: res.data.botReply,
          intent: res.data.intent
        }
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Is the backend running?");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 flex flex-col border-r border-white/5 bg-background-dark/40 glass-panel">
          <div className="p-6 flex flex-col gap-6 h-full">
            <div className="flex flex-col">
              <h1 className="text-slate-100 text-lg font-semibold">
                AI Support
              </h1>
              <p className="text-primary/70 text-xs font-medium uppercase tracking-widest mt-1">
                {escalated ? "Escalated to support" : "Powered by AI"}
              </p>
            </div>
            <nav className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => setActiveNav("chat")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  activeNav === "chat"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-slate-400 hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  chat_bubble
                </span>
                <span className="text-sm font-medium">Active Chat</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveNav("history")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  activeNav === "history"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-slate-400 hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  history
                </span>
                <span className="text-sm font-medium">Chat History</span>
              </button>
              <Link
                to="/cart"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all"
              >
                <span className="material-symbols-outlined text-[22px]">
                  shopping_cart
                </span>
                <span className="text-sm font-medium">Cart</span>
              </Link>
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all"
              >
                <span className="material-symbols-outlined text-[22px]">
                  storefront
                </span>
                <span className="text-sm font-medium">Shop</span>
              </Link>
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all w-full text-left"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    info
                  </span>
                  <span className="text-sm font-medium">Help</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col forest-gradient relative min-w-0 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
            {messages.length === 0 && (
              <div className="flex flex-col items-start max-w-[70%]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/20 p-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-sm">
                      smart_toy
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    AI Support
                  </span>
                </div>
                <div className="bg-message-bot glass-panel text-slate-100 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-xl border border-white/5">
                  <p className="text-[15px] leading-relaxed">
                    Hello! I can help with your order, impact reporting, refunds,
                    or returns. What would you like to know?
                  </p>
                </div>
              </div>
            )}
            {messages.map((m) =>
              m.sender === "user" ? (
                <div
                  key={m.id}
                  className="flex flex-col items-end self-end max-w-[70%]"
                >
                  <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                    <div className="bg-slate-700/50 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-slate-300 text-sm">
                        person
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      You
                    </span>
                  </div>
                  <div className="bg-primary text-background-dark rounded-2xl rounded-tr-none px-5 py-3.5 shadow-lg shadow-primary/10">
                    <p className="text-[15px] font-medium leading-relaxed">
                      {m.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex flex-col items-start max-w-[70%]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/20 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-primary text-sm">
                        smart_toy
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      AI Support
                    </span>
                  </div>
                  <div className="bg-message-bot glass-panel text-slate-100 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-xl border border-white/5">
                    <p className="text-[15px] leading-relaxed">{m.text}</p>
                  </div>
                  {m.intent && (
                    <div className="mt-1.5 flex items-center gap-1.5 px-1">
                      <span className="material-symbols-outlined text-primary/60 text-[14px]">
                        psychology
                      </span>
                      <p className="text-primary/60 text-[11px] font-medium italic">
                        Intent: {m.intent}
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="flex-shrink-0 p-6 bg-background-dark/60 backdrop-blur-xl border-t border-white/5">
            {error && (
              <p className="text-xs text-red-400 mb-2 text-center">{error}</p>
            )}
            <form
              onSubmit={sendMessage}
              className="max-w-4xl mx-auto flex items-center gap-4 bg-white/5 rounded-2xl border border-white/10 p-2 focus-within:border-primary/50 transition-all"
            >
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-primary transition-colors"
                aria-label="Attach"
              >
                <span className="material-symbols-outlined">add_circle</span>
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 text-sm py-2"
                type="text"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-primary transition-colors"
                  aria-label="Emoji"
                >
                  <span className="material-symbols-outlined">mood</span>
                </button>
                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  className="ml-1 bg-primary text-background-dark p-2.5 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    send
                  </span>
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-slate-500 mt-3 uppercase tracking-widest font-medium">
              Powered by RayevaStore · Carbon Neutral Compute
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
