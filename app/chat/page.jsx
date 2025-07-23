"use client";
// @ts-ignore
import CoolBackground from "@/components/ui/CoolBackground";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SidebarProvider } from "@/components/sidebar/contexts/sidebar-context";
import { ThemeProvider } from "@/components/sidebar/contexts/theme-context";
import { AppSidebar } from "@/components/AppSidebar";
import "@/app/globals.css";

export default function Page() {
  const [message, setMessage] = useState('');
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const chatEndRef = useRef(null);
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  useEffect(() => {
    const loadChat = async () => {
      if (!chatId) return;

      try {
        const res = await fetch(`/api/chats?id=${chatId}`);
        const data = await res.json();
        if (data && data.messages) {
          setReplies(data.messages);
          localStorage.setItem("chatReplies", JSON.stringify(data.messages));
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    };
    loadChat();
  }, [chatId]);

  useEffect(() => {
    const saved = localStorage.getItem("chatReplies");
    if (saved) {
      setReplies(JSON.parse(saved));
    } else {
      setReplies([{ role: "assistant", content: "Welcome! How can I help you today?" }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatReplies", JSON.stringify(replies));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies]);

  const handleNewChat = () => setShowInput(true);

  const handleSaveChat = async () => {
    if (replies.length === 0) return;
    try {
      await fetch("/api/save-chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: chatName.trim() || "Untitled Chat",
          messages: replies,
        }),
      });
      setChatName("");
      setReplies([]);
      setShowInput(false);
      localStorage.removeItem("chatReplies");
    } catch (err) {
      console.error("Failed to save chat:", err);
    }
  };

  const handleCancelChat = () => {
    setShowInput(false);  
  };


  const addReply = (role, content) => {
    setReplies((prev) => [...prev, { role, content }]);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    addReply("user", message);
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.error) {
        addReply("assistant", `❌ Error: ${data.error}`);
      } else {
        addReply("assistant", data.response || "⚠️ No response received.");
      }
    } catch (err) {
      console.error("API error:", err);
      addReply("assistant", "🚨 Failed to connect to AI.");
    } finally {
      setLoading(false);
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
            <div className="flex flex-col justify-start h-full relative">
              {/* Heading */}
              <h1 className="text-xl font-bold mb-6 text-center bg-[#dfdfdf] dark:bg-[#2d2d2d] text-black dark:text-white p-4 rounded-full w-fit mx-auto">
                Chat with your AI-Assistant
              </h1>

              {/* Chat Display */}
              <div className="space-y-3 overflow-y-auto pb-32 max-h-[calc(100vh-200px)] hide-scrollbar w-[90%] mx-auto relative">
                {replies.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>

                    <div
                      className={`p-3 my-1 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-[#2a2a2a] text-white dark:bg-transparent"
                          : "bg-white text-black dark:bg-gray-300 dark:text-black"
                      }`}
                    >
                      {msg.role === "user" ? "You: " : "AI: "}
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-gray-400 italic text-sm">
                    <span className="blinking-dot"></span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input (original style restored) */}
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
                  <img src="/send.png" alt="Send" className="w-5 h-5 object-contain" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  );
}
