import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "@/Redux/P2P/P2PSlice";
import { Send } from "lucide-react";

const TradeChat = ({ tradeId }) => {
  const dispatch = useDispatch();
  const { p2p, auth } = useSelector((s) => s);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMessages(tradeId));
    // Polling toutes les 5 secondes
    const interval = setInterval(() => dispatch(fetchMessages(tradeId)), 5000);
    return () => clearInterval(interval);
  }, [tradeId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [p2p.messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await dispatch(sendMessage({ tradeId, content: text.trim() }));
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0">
        {p2p.messages.map((msg) => {
          const isMe = msg.sender_id === auth.user?.id;
          const isSystem = msg.type === "SYSTEM";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs text-neutral-600 bg-neutral-800/50 px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {!isMe && (
                  <span className="text-xs text-neutral-500 px-1">
                    {msg.sender_name}
                  </span>
                )}
                <div className={`px-3 py-2 rounded-xl text-sm ${
                  isMe
                    ? "bg-white text-black rounded-br-sm"
                    : "bg-neutral-800 text-white rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
                <span className="text-xs text-neutral-600 px-1">
                  {new Date(msg.created_at).toLocaleTimeString("fr", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-neutral-800 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="h-9 w-9 rounded-lg bg-white text-black flex items-center justify-center hover:bg-neutral-200 disabled:opacity-40 transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TradeChat;