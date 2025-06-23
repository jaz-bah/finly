import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, useSidebar
} from "@/components/ui/sidebar";
import { DollarSign, Home, LogOut, Recycle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "../Logo";
import { ThemeToggle } from "../ThemeToggler";
import { Button } from "../ui/button";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: DollarSign,
  },
  {
    title: "Recurring",
    url: "/recurring",
    icon: Recycle,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { data: session, status } = useSession();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col gap-4">
        <SidebarHeader className="p-0">
          <div className="flex items-center justify-center h-15 border-b border-border">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="border-t border-border">
          {open && status === "authenticated" && <p className="text-md text-center">{session?.user?.name}</p>}
          <div className="flex align-center justify-between gap-2">
            <Button variant="destructive" className="flex-1" onClick={() => signOut()}>{open ? "Sign Out" : <LogOut />}</Button>
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
