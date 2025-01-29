"use client";

import { useSidebar } from "@/components/ui/sidebar";
import React from "react";
import { cn } from "@/lib/utils";

export function MainContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobile, state } = useSidebar();

  return (
    <div
      className={cn("p-4 w-full max-wd-screen-xl transition-all", {
        "w-full": isMobile,

        "w-[calc(100%-var(--sidebar-width-icon))]":
          !isMobile && state === "collapsed",
      })}
    >
      {children}
    </div>
  );
}
