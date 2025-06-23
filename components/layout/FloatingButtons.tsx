import React from "react";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

export default function FloatingButtons() {
  const { isMobile } = useSidebar();
  return (
    <>
      {isMobile && (
        <div className="fixed bottom-5 right-5 z-50">
          <SidebarTrigger className="w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary" />
        </div>
      )}
    </>
  );
}
