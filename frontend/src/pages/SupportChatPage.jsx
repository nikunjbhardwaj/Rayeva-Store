import { useEffect, useRef, useState } from "react";
import api from "../api/client.js";

export default function SupportChatPage() {
  const [chatId, setChatId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [escalated, setEscalated] = useState(false);
  const bottomRef = useRef(null);

  // On mount: hydrate from localStorage (order + last chat)
  useEffect(() => {
    const storedOrderId = window.localStorage.getItem("latestOrderId");
    if (storedOrderId) {
      setOrderId(storedOrderId);
    }

    const storedChatId = window.localStorage.getItem("latestChatId");
    if (storedChatId) {
      (async () => {
        try {
          const res = await api.get(`/chat/${storedChatId}`);
          setChatId(res.data.chatId);
          if (res.data.orderId) {
            setOrderId(res.data.orderId);
          }
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

  // Scroll to bottom when messages change
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
    <section className="flex h-[calc(100vh-150px)] flex-col gap-4">
      <header className="space-y-2">
        <p className="pill-badge">Module 4 · WhatsApp-style AI Support Bot</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Chat with support,{" "}
          <span className="text-emerald-300">with business logic in front of AI.</span>
        </h1>
        <p className="text-sm text-slate-400">
          Try messages like{" "}
          <span className="font-mono text-slate-200">
            &quot;Where is my order?&quot;
          </span>{" "}
          or{" "}
          <span className="font-mono text-slate-200">
            &quot;I want refund, this was terrible&quot;
          </span>{" "}
          to see intent classification and escalation.
        </p>
      </header>

      <div className="glass-panel flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20" />
            <div>
              <div className="text-sm font-medium text-slate-100">Support</div>
              <div className="text-[11px] text-emerald-300">
                {escalated ? "Escalated to human" : "AI-assisted · Demo only"}
              </div>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            <div>Chat ID: {chatId ? String(chatId).slice(-6) : "new"}</div>
            <div>
              Order context:{" "}
              {orderId ? (
                <span className="font-mono text-emerald-300">
                  #{String(orderId).slice(-6)}
                </span>
              ) : (
                <span className="text-slate-600">none</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.08),_transparent_50%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.06),_transparent_55%)] px-3 py-3">
          {messages.length === 0 && (
            <div className="mt-4 text-center text-xs text-slate-400">
              No messages yet. Say hi and ask about your order, refunds, or returns.
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-3 py-2 text-xs shadow-sm ${
                  m.sender === "user"
                    ? "bg-emerald-500 text-emerald-950 rounded-br-sm"
                    : "bg-slate-800 text-slate-50 rounded-bl-sm"
                }`}
              >
                <p>{m.text}</p>
                {m.intent && (
                  <p className="mt-1 text-[9px] uppercase tracking-wide text-emerald-200/80">
                    intent: {m.intent}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 border-t border-slate-800/80 bg-slate-950/80 px-3 py-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="h-9 flex-1 rounded-full border border-slate-700 bg-slate-900 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-500 px-3 text-xs font-medium text-emerald-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </form>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </section>
  );
}

