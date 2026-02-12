"use client";

import { useState } from "react";

export default function ChatBox({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi... Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        const aiMessage = {
          role: "assistant",
          content: data.result
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      alert("Chat failed.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white shadow-xl rounded-xl border flex flex-col z-50">

      <div className="bg-teal-600 text-white px-4 py-3 rounded-t-xl flex justify-between">
        <span className="font-semibold">AI Chat</span>
        <button onClick={onClose}>✖</button>
      </div>

  
      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.role === "user"
                ? "bg-teal-100 ml-auto text-right"
                : "bg-gray-100"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-xs">AI is typing...</div>
        )}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border rounded px-2 py-1 text-sm"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-teal-600 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
