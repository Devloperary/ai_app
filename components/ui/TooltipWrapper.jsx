// components/ui/TooltipWrapper.jsx
"use client";
import * as Tooltip from "@radix-ui/react-tooltip";

export function TooltipWrapper({ label, children }) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded bg-black px-2 py-1 text-xs text-white shadow-md animate-in fade-in"
            side="right"
            sideOffset={8}
          >
          
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
