"use client";
import React from "react";

export default function FancyButton({ children = "Click Me", onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative bg-transparent inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white rounded-full shadow-md group"
    >
      <span className="absolute inset-0 w-full h-full group-hover:bg-black transition-all duration-500 blur-sm opacity-70 group-hover:scale-125"></span>
      <span className="absolute inset-0 w-full h-full hover:bg-black rounded-full"></span>
      <span className="relative">{children}</span>
    </button>
  );
}
