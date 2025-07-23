// components/sidebar/SidebarTrigger.jsx
"use client";
import React from "react";
import { useSidebar } from "./SidebarContext";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";

export function SidebarTrigger() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-[60] p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded"
    >
      {isOpen ? <PanelLeftIcon /> : <PanelRightIcon />}
    </button>
  );
}
