"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/sidebar/SidebarTrigger";

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const savedReplies = localStorage.getItem('chatReplies');
    if (savedReplies) {
      setReplies(JSON.parse(savedReplies));
    } else {
      setReplies([{ role: 'assistant', content: 'Welcome! How can I help you today?' }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatReplies', JSON.stringify(replies));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setReplies((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      setReplies((prev) => [...prev, { role: 'assistant', content: data.response || 'Something went wrong.' }]);
    } catch (err) {
      console.error("API error:", err);
      setReplies((prev) => [...prev, { role: 'assistant', content: 'Failed to fetch response.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white">
      <AppSidebar />
      <SidebarTrigger />
      <main className="flex-1 p-6 overflow-hidden">
        <div className="flex flex-col justify-start h-full relative">
          <h1 className="text-xl font-bold mb-6 text-center bg-[#dfdfdf] dark:bg-[#2d2d2d] text-black dark:text-white p-4 rounded-full w-fit mx-auto">
            Chat with your AI-Assistant
          </h1>

          <div className="space-y-3 overflow-y-auto pb-32 max-h-[calc(100vh-150px)]">
            {replies.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 my-1 rounded-xl max-w-[80%] whitespace-pre-wrap border
                    ${msg.role === 'user'
                      ? 'bg-white text-black dark:bg-gray-300 dark:text-black border-white dark:border-gray-500'
                      : 'bg-[#2a2a2a] text-white border-white dark:bg-[#333] dark:border-gray-600'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 italic text-sm">Assistant is typing...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="w-[90%] bg-[#dfdfdf] dark:bg-[#2a2a2a] gap-4 rounded-full p-4 absolute bottom-5 left-1/2 transform -translate-x-1/2 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
  );
}
