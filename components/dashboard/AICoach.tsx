"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, SendHorizontal, User } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
  isPlan?: boolean;
}

export default function AICoach() {
  const welcomeMessage: Message = {
  role: "assistant",
  content: `# 👋 Welcome to Career OS AI Coach

I can help you with

- DSA
- Coding
- Machine Learning
- Resume
- Placement Preparation
- Interview Questions

Ask me anything 🚀`,
};

const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  loadHistory();
}, []);

async function loadHistory() {
  try {
    const response = await fetch("/api/ai/history");
    const data = await response.json();

    if (!data.success) {
      setMessages([welcomeMessage]);
      return;
    }

    if (data.chats.length === 0) {
      setMessages([welcomeMessage]);
      return;
    }

    const history: Message[] = data.chats.map((chat: any) => ({
      role: chat.role,
      content: chat.message,
      isPlan:
        chat.message.toLowerCase().includes("today's study plan") ||
        chat.message.toLowerCase().includes("today's plan") ||
        chat.message.toLowerCase().includes("total xp"),
    }));

    setMessages(history);
  } catch (error) {
    console.error(error);
    setMessages([welcomeMessage]);
  }
}

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      const reply = data.reply as string;

      const isPlan =
        reply.toLowerCase().includes("today's study plan") ||
        reply.toLowerCase().includes("today's plan") ||
        reply.toLowerCase().includes("total xp");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          isPlan,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Failed to connect to Gemini.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function savePlan(plan: string) {
    try {
      const response = await fetch("/api/ai/save-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
        }),
      });

      const data = await response.json();

      console.log(data);

if (data.success) {
  alert("✅ Plan sent successfully.");
} else {
  alert(`❌ ${data.message}`);
}
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong.");
    }
  }  return (
    <div className="h-[700px] rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl flex flex-col">

      <div className="border-b border-white/10 p-5 flex items-center gap-3">

        <Bot className="text-cyan-400" size={28} />

        <div>
          <h2 className="font-bold text-xl">
            Career OS AI Coach
          </h2>

          <p className="text-sm text-gray-400">
            Powered by Gemini
          </p>
        </div>

      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {messages.map((message, index) => (

          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.role === "user"
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800 text-white"
              }`}
            >

              <div className="flex items-center gap-2 mb-3">

                {message.role === "assistant" ? (
                  <Bot size={18} />
                ) : (
                  <User size={18} />
                )}

                <span className="font-semibold text-sm">
                  {message.role === "assistant"
                    ? "AI Coach"
                    : "You"}
                </span>

              </div>

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code(props) {
                    const { children, className } = props;

                    const match =
                      /language-(\w+)/.exec(className || "");

                    if (match) {
                      return (
                        <SyntaxHighlighter
                          language={match[1]}
                          style={oneDark}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      );
                    }

                    return (
                      <code className="bg-slate-700 px-1 py-0.5 rounded">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>

              {message.role === "assistant" && message.isPlan && (
                <button
                  onClick={() => savePlan(message.content)}
                  className="mt-5 rounded-xl bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-400 transition"
                >
                  💾 Save Plan
                </button>
              )}

            </div>

          </div>

        ))}

        {loading && (

          <div className="flex justify-start">

            <div className="rounded-2xl bg-slate-800 px-5 py-3 animate-pulse">

              AI Coach is thinking...

            </div>

          </div>

        )}

        <div ref={bottomRef} />

      </div>

      <div className="border-t border-white/10 p-5">

        <div className="flex gap-3">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask anything..."
            className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-xl bg-cyan-500 px-5 hover:bg-cyan-400 disabled:opacity-50"
          >
            <SendHorizontal />
          </button>

        </div>

      </div>

    </div>
  );
}