"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSidebar } from "@/components/sidebar/contexts/sidebar-context";
import { SidebarTrigger } from "@/components/ui/sidebar-trigger";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/components/sidebar/sidebarItems";
import {
  TooltipRoot as Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  LogIn,
  Moon,
  Sun,
  Folder,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/components/sidebar/contexts/theme-context";

export function AppSidebar() {
  const { isOpen } = useSidebar();
  const { isSignedIn, user } = useUser();
  const { darkMode, setDarkMode } = useTheme();

  const [showChats, setShowChats] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const [chatName, setChatName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [replies, setReplies] = useState([]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch("/api/chats");
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setLoadingChats(false);
      }
    }
    fetchChats();
  }, []);

  useEffect(() => {
    const savedReplies = localStorage.getItem("chatReplies");
    if (savedReplies) {
      setReplies(JSON.parse(savedReplies));
    }
  }, []);

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
      setShowInput(false);
      localStorage.removeItem("chatReplies");
      window.location.reload();
    } catch (err) {
      console.error("Failed to save chat:", err);
    }
  };

  return (
    <aside
      className={cn(
        "h-screen transition-all duration-300 ease-in-out flex flex-col justify-between border-r",
        isOpen ? "w-64" : "w-16",
        "bg-[#dfdfdf] dark:bg-[#1e1e1e] text-black dark:text-white"
      )}
    >
      {/* Top: Logo + Trigger */}
      <div className="flex items-center justify-between px-3 py-4 border-b dark:border-gray-700">
        <div className={cn("flex items-center gap-2", isOpen ? "" : "justify-center w-full")}>
          {isOpen && (
            <>
              <img src="/logo.png" alt="AI-Assist Logo" className="h-8 w-auto rounded-full" />
              <span className="font-bold text-lg">AI-Assist</span>
            </>
          )}
        </div>
        <div className={cn(isOpen ? "" : "mx-auto")}>
          <SidebarTrigger />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-4 px-1">
        <TooltipProvider>
          {sidebarItems.map((section, i) => (
            <div key={i} className="space-y-1">
              {section.items.map(({ name, icon: Icon }) => (
                <Tooltip key={name} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Link
                      onClick={(e) => {
                        if (!isOpen) e.preventDefault(); // block navigation
                      }}
                      href={`/${name.toLowerCase()}`}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-2 text-sm rounded-lg transition-all",
                        "hover:bg-[#bebebe] dark:hover:bg-[#2d2d2d]",
                        !isOpen && "justify-center"
                      )}
                    >
                      <Icon size={20} />
                      {isOpen && <span>{name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side="right">
                      <span>{name}</span>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {/* Chat List */}
      <div className="px-4 mb-2">
        <button
          disabled={!isOpen}
          onClick={() => setShowChats(!showChats)}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition",
            "hover:bg-[#bebebe] dark:hover:bg-[#2d2d2d]",
            !isOpen && "justify-center"
          )}
        >
          <span className="flex items-center gap-2">
            <Folder size={18} />
            {isOpen && "Chats"}
          </span>
          {isOpen && (showChats ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </button>

        {showChats && (
          <div className="mt-2 pl-6 flex flex-col gap-2 text-sm">
            {loadingChats ? (
              <span className="text-gray-500 dark:text-gray-400">Loading...</span>
            ) : chats.length === 0 ? (
              <span className="text-gray-500 dark:text-gray-400">No chats</span>
            ) : (
              chats.map((chat) => (
                <Link key={chat._id} href={`/chats/${chat._id}`}>
                  {isOpen ? chat.name : chat.name.slice(0, 2)}
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Save Chat */}
      <div className="px-4 mb-4 space-y-2">
        {showInput ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter chat name (optional)..."
              className="px-3 py-2 rounded-md border outline-none text-sm transition bg-white text-black dark:bg-[#2a2a2a] dark:text-white dark:border-gray-600"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveChat}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowInput(false)}
                className={cn("flex-1 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition",)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className={cn("w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition",
              !isOpen && "hidden"
            )}
          >
            Save Chat
          </button>
        )}
      </div>

      {/* Bottom: Theme + Auth */}
      <div className="p-4 border-t dark:border-gray-700 space-y-4">
        <div className="flex justify-center">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition bg-white dark:bg-[#2a2a2a] text-black dark:text-white"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isOpen && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>
        </div>

        <TooltipProvider>
          <SignedOut>
            <div className={cn("flex gap-2", !isOpen && "items-center justify-center")}>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <SignInButton>
                    <button className={cn("bg-transparent text-white dark:text-white rounded-full font-medium text-sm h-10 px-4 cursor-pointer w-full")}>
                      {isOpen ? "Sign In" : <LogIn size={20} />}
                    </button>
                  </SignInButton>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">
                    <span>Sign In</span>
                  </TooltipContent>
                )}
              </Tooltip>

              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <SignUpButton>
                    <button className={cn("bg-white text-black dark:bg-white dark:text-black rounded-full font-medium text-sm h-10 px-4 cursor-pointer w-full",isOpen ? "block" : "hidden")}>
                      {isOpen ? "Sign Up" : ""}
                    </button>
                  </SignUpButton>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">
                    <span>Sign Up</span>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </SignedOut>

          <SignedIn>
            <div className={cn("h-10 flex gap-4 items-center", !isOpen && "justify-center")}>
              <UserButton />
              {isOpen && (
                <div className="flex flex-col text-sm">
                  <span>{user?.username || user?.firstName || "User"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-300">
                    {user?.emailAddresses?.[0]?.emailAddress || "No Email"}
                  </span>
                </div>
              )}
            </div>
          </SignedIn>
        </TooltipProvider>
      </div>
    </aside>
  );
}
