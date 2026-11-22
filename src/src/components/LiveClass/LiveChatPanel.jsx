import { useEffect, useRef, useState } from "react";
import { useChat, useLocalParticipant } from "@livekit/components-react";
import { Send, MessageSquare, X } from "lucide-react";

const LiveChatPanel = ({ isOpen, onClose, title = "Live Class Chat" }) => {
  const { chatMessages, send, isSending } = useChat();
  const { localParticipant } = useLocalParticipant();
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    try {
      await send(trimmed);
      setInput("");
    } catch (err) {
      console.error("Failed to send chat message:", err);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 flex flex-col bg-[#0b1220] border-l border-white/10 h-full shrink-0">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-[#0f172a]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
            {chatMessages.length}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[260px]">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
            <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No messages yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Ask questions or share notes in real time with everyone in this session.
            </p>
          </div>
        ) : (
          chatMessages.map((msg, idx) => {
            const senderIdentity = msg.from?.identity;
            const isMine =
              senderIdentity &&
              localParticipant?.identity &&
              senderIdentity === localParticipant.identity;
            const senderName =
              msg.from?.name || msg.from?.identity || "Participant";
            const isHost = senderName.includes("(Host)");

            return (
              <div
                key={msg.id || `${msg.timestamp}-${idx}`}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span
                    className={`text-[11px] font-semibold ${
                      isHost
                        ? "text-amber-400"
                        : isMine
                          ? "text-sky-400"
                          : "text-slate-300"
                    }`}
                  >
                    {isMine ? "You" : senderName}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-[13px] leading-relaxed break-words ${
                    isMine
                      ? "bg-amber-400 text-slate-950 font-medium rounded-br-sm"
                      : isHost
                        ? "bg-indigo-500/20 border border-indigo-400/30 text-slate-100 rounded-bl-sm"
                        : "bg-[#161f33] border border-white/[0.08] text-slate-200 rounded-bl-sm"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-white/10 bg-[#0f172a] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#0b1220] border border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400/70 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          aria-label="Send message"
          className="w-9 h-9 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 flex items-center justify-center transition cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};

export default LiveChatPanel;
