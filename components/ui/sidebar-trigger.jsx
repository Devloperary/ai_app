// components/ui/sidebar-trigger.jsx
"use client";
import { useSidebar } from "@/components/sidebar/contexts/sidebar-context";
import { PanelLeftIcon } from "lucide-react";

export function SidebarTrigger({ className }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={`p-2 hover:bg-[#bebebe] dark:hover:bg-[#2a2a2a] rounded transition ${className}`}
    >
      <PanelLeftIcon className="w-5 h-5 text-white invert dark:invert-0" />
    </button>
  );
}
