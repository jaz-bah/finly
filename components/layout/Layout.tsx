"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import FloatingButtons from "./FloatingButtons";
import { AddTransactionModal } from "../modal/AddTransactionModal";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full pb-5">
        <div className="h-15 border-b border-border flex items-center justify-between px-4">
            <p className="text-lg font-medium capitalize">
              {pathName !== "/" ? pathName.split("/")[1] : "Dashboard"}
            </p>
            <AddTransactionModal/>
        </div>
        <div className="px-4">{children}</div>
        <FloatingButtons />
      </main>
    </SidebarProvider>
  );
}
