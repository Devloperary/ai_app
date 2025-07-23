// components/CoolBackground.jsx
"use client";

import React from "react";

export default function CoolBackground({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center gradient-bg">
      <div className="glass-wrapper max-w-3xl w-full p-6">{children}</div>
    </div>
  );
}
