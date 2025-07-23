"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";
import { TooltipWrapper } from "@/components/ui/TooltipWrapper";

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size and set initial sidebar state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // Open for desktop, closed for mobile
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[60] p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded"
      >
        {isOpen ? <PanelLeftIcon /> : <PanelRightIcon />}
      </button>

      {/* Mobile Overlay */}
      {isMobile ? (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={closeSidebar}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.aside
                className="fixed top-0 left-0 bottom-0 w-64 z-50 bg-[#1e1e1e] text-white flex flex-col border-r border-neutral-800"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      ) : (
        // Desktop Sidebar
        <motion.aside
          animate={{ width: isOpen ? 256 : 64 }}
          transition={{ duration: 0.3 }}
          className="h-screen bg-[#1e1e1e] text-white flex flex-col border-r border-neutral-800 fixed top-0 left-0 z-30"
        >
          {children}
        </motion.aside>
      )}
    </>
  );
}

// Utility layout sections
export function SidebarHeader({ children }) {
  return (
    <div className="sticky top-0 z-10 p-4 bg-[#2a2a2a] border-b border-neutral-700">
      {children}
    </div>
  );
}

export function SidebarContent({ children }) {
  return <div className="flex-1 overflow-y-auto p-2 space-y-2">{children}</div>;
}

export function SidebarGroup({ icon: Icon, label }) {
  return (
    <TooltipWrapper label={label}>
      <div className="flex items-center space-x-2 p-2 rounded hover:bg-[#333] cursor-pointer">
        {Icon && <Icon size={20} />}
        <span>{label}</span>
      </div>
    </TooltipWrapper>
  );
}

export function SidebarFooter({ children }) {
  return (
    <div className="sticky bottom-0 z-10 p-4 bg-[#2a2a2a] border-t border-neutral-700">
      {children}
    </div>
  );
}
