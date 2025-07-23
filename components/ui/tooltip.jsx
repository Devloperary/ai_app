'use client';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = ({ children, ...props }) => (
  <TooltipPrimitive.Content
    className="bg-black text-white text-sm px-2 py-1 rounded shadow-md"
    sideOffset={5}
    {...props}
  >
    {children}
  </TooltipPrimitive.Content>
);
