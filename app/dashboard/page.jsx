"use client";
import React, { useState } from "react";
import { SidebarProvider } from "@/components/sidebar/contexts/sidebar-context";
import { ThemeProvider } from "@/components/sidebar/contexts/theme-context";
import { AppSidebar } from "@/components/AppSidebar";
import "@/app/globals.css";

import { SignInButton, SignUpButton, SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();
  const [username, setUsername] = useState(user?.username || "");
  const [isEditing, setIsEditing] = useState(false);

  if (!isSignedIn) return null;

  return (
    <SidebarProvider>
      <ThemeProvider>
        <div className="h-screen flex w-full">
          <AppSidebar />
        <div className="min-h-screen flex flex-col justify-between w-full items-center px-4 py-10 bg-white dark:bg-[#0e0e0e] text-black dark:text-white transition-colors duration-300">

          {/* Top section: Avatar + Info */}
          <div className="flex flex-col items-center gap-6 mt-10">
            {/* Avatar */}
            <img
              src={user.imageUrl}
              alt="User Avatar"
              className="h-36 w-36 rounded-full border-4 border-zinc-300 dark:border-zinc-700 object-cover shadow-xl"
            />

            {/* Editable Username */}
            <div className="text-center w-full max-w-sm">
              {isEditing ? (
                <input
                  type="text"
                  className="bg-zinc-200 dark:bg-zinc-800 text-center w-full px-4 py-2 rounded-md outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : (
                <h2
                  className="text-2xl font-semibold hover:underline cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  {username || "Click to set username"}
                </h2>
              )}
            </div>

            {/* Email */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.emailAddresses?.[0]?.emailAddress || "No email"}
            </p>
          </div>

          {/* Bottom Sign Out Button */}
          <SignedIn>
            <div className="w-full max-w-sm mb-8">
              <SignOutButton>
                <button className="w-40 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition right-0">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </SignedIn>
        </div>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  );
}
