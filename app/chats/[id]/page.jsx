"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { SidebarProvider } from "@/components/sidebar/contexts/sidebar-context";
import { ThemeProvider } from "@/components/sidebar/contexts/theme-context";
import { AppSidebar } from "@/components/AppSidebar";

export default function ChatPage() {
  const { id } = useParams();
  const [chatName, setChatName] = useState("Untitled Chat");
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const fetchChat = async () => {
      try {
        const res = await fetch(`/api/chats/${id}`);
        const text = await res.text();
        if (!text) throw new Error("Empty response");
        const data = JSON.parse(text);

        setReplies(data.messages || []);
        setChatName(data.name || "Untitled Chat");
      } catch (err) {
        console.error("Chat load failed:", err);
        setChatName("Chat not found");
      } finally {
        setLoading(false);
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    fetchChat();
  }, [id]);

  const addReply = (role, content) => {
    setReplies((prev) => [...prev, { role, content }]);
  };

  const sendMessage = async () => {
    if (!message.trim() || sending) return;

    const userMessage = { role: "user", content: message.trim() };
    addReply("user", userMessage.content);
    setMessage("");
    setSending(true);

    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      if (data.error) {
        addReply("assistant", `❌ Error: ${data.error}`);
      } else {
        addReply("assistant", data.reply || "⚠️ No response received.");
      }
    } catch (err) {
      console.error("Send failed:", err);
      addReply("assistant", "🚨 Failed to connect to assistant.");
    } finally {
      setSending(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <SidebarProvider>
      <ThemeProvider>
        <div className="flex min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white">
          <AppSidebar />

          <main className="flex-1 p-6 overflow-hidden relative">
            {/* Chat Title */}
            <h1 className="text-xl font-bold mb-6 text-center bg-[#dfdfdf] dark:bg-[#2d2d2d] text-black dark:text-white p-4 rounded-full w-fit mx-auto">
              {loading ? "Loading..." : chatName}
            </h1>

            {/* Chat Messages */}
            <div className="space-y-3 overflow-y-auto pb-32 max-h-[calc(100vh-200px)] hide-scrollbar w-full max-w-5xl mx-auto">
              {replies.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 my-1 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#2a2a2a] text-white dark:bg-transparent"
                        : "bg-white text-black dark:bg-gray-300 dark:text-black"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="text-gray-400 italic text-sm pl-2">
                  <span className="blinking-dot">⠋</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar (Responsive & Fixed) */}
            <div className="w-[90%] bg-[#dfdfdf] dark:bg-[#2a2a2a] gap-4 rounded-full p-4 absolute bottom-5 left-1/2 transform -translate-x-1/2 flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Anything......."
                className="w-full p-3 rounded-full outline-none h-full text-black dark:text-white dark:bg-[#2a2a2a]"
              />
              <button
                className="p-4 bg-white dark:bg-gray-200 rounded-full disabled:opacity-50"
                onClick={sendMessage}
                disabled={loading}
              >
                <img
                  src="/send.png"
                  alt="Send"
                  className="w-5 h-5 object-contain"
                />
              </button>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  );
}