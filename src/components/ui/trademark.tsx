import React from "react";

interface TrademarkProps {
  className?: string;
}

export function Trademark({ className = "" }: TrademarkProps) {
  return (
    <span
      className={`text-xs text-primary-foreground/50 align-super ml-0.5 -mt-1 ${className}`}
    >
      ®
    </span>
  );
}