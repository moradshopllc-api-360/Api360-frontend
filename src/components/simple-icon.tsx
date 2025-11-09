"use client";

import * as React from "react";

import type { SimpleIcon } from "simple-icons";

import { cn } from "@/lib/utils";

type SimpleIconProps = {
  icon: SimpleIcon;
  className?: string;
} & React.SVGProps<SVGSVGElement>;

export function SimpleIcon({ icon, className, ...props }: SimpleIconProps) {
  const { title, path } = icon;

  return (
    <svg
      viewBox="0 0 24 24"
      aria-label={title}
      aria-hidden="false"
      focusable="false"
      className={cn("fill-foreground size-5 min-w-[1.25rem] min-h-[1.25rem]", className)}
      style={{
        isolation: 'isolate',
        transform: 'translateZ(0)', // Force GPU acceleration
        backfaceVisibility: 'hidden'
      }}
      {...props}
    >
      <title>{title}</title>
      <path
        d={path}
        style={{
          transition: 'none',
          animation: 'none'
        }}
      />
    </svg>
  );
}
