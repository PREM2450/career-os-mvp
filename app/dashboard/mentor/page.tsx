"use client";

import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import MarkdownRenderer from "@/components/mentor/MarkdownRenderer";

export default function MentorPage() {
  const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const [messages, setMessages] = useState<
  {
    role: "user" | "assistant";
    content: string;
  }[]
>([
  {
    role: "assistant",
    content:
      "👋 Hi Prem! I'm your AI Mentor. Ask me anything about coding, placements, resume or career.",
  },
]);
const sendMessage = async () => {
  if (!message.trim()) return;

  const userMessage = message;

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: userMessage,
    },
  ]);

  setMessage("");
  setLoading(true);

  try {
    const res = await fetch("/api/mentor/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.reply,
      },
    ]);
  } catch {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Something went wrong.",
      },
    ]);
  }

  setLoading(false);
};

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col rounded-3xl border border-white/10 bg-[#0b1020] text-white">

      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-violet-600 p-3">
            <Bot size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">AI Mentor</h1>
            <p className="text-sm text-slate-400">
              Your Personal Career Guide
            </p>
          </div>
        </div>
      </div>

     {/* Chat Area */}
<div className="flex-1 overflow-y-auto space-y-6 p-6">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`flex items-start gap-3 ${
        msg.role === "user" ? "justify-end" : ""
      }`}
    >
      {msg.role === "assistant" && (
        <div className="rounded-full bg-violet-600 p-2">
          <Bot size={18} />
        </div>
      )}

      <div
  className={`max-w-3xl rounded-2xl px-5 py-4 ${
    msg.role === "assistant"
      ? "bg-slate-800"
      : "bg-violet-600"
  }`}
>
  {msg.role === "assistant" ? (
  <MarkdownRenderer content={msg.content} />
) : (
  <p className="whitespace-pre-wrap">{msg.content}</p>
)}
</div>

      {msg.role === "user" && (
        <div className="rounded-full bg-cyan-600 p-2">
          <User size={18} />
        </div>
      )}
    </div>
  ))}

  {loading && (
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-violet-600 p-2">
        <Bot size={18} />
      </div>

      <div className="rounded-2xl bg-slate-800 px-5 py-4">
        Thinking...
      </div>
    </div>
  )}
</div>
      {/* Input */}
      <div className="border-t border-white/10 p-5">
        <div className="flex gap-4">

         <input
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  }}
  placeholder="Ask anything..."
  className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 outline-none focus:border-violet-500"
/>

         <button
  onClick={sendMessage}
  disabled={loading}
  className="rounded-2xl bg-violet-600 px-6 transition hover:bg-violet-500 disabled:opacity-50"
>
  <Send />
</button>
        </div>
      </div>

    </div>
  );
}