
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookCopy,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Users
} from "lucide-react";
import ProposerAILogo from "./ProposerAILogo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function SidebarNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 p-2">
          <ProposerAILogo className="w-8 h-8 text-primary" />
          <h1 className={cn("text-xl font-semibold font-headline text-primary", "group-data-[collapsible=icon]:hidden")}>
            ProposerAI
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/'} tooltip={{children: "Dashboard"}}>
              <Link href="/">
                <LayoutDashboard />
                <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/repository')} tooltip={{children: "Repository"}}>
              <Link href="/repository">
                <BookCopy />
                <span className="group-data-[collapsible=icon]:hidden">Repository</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/proposals')} tooltip={{children: "Proposals"}}>
              <Link href="/proposals">
                <FileText />
                <span className="group-data-[collapsible=icon]:hidden">Proposals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user?.role === 'Admin' && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/admin')} tooltip={{children: "User Management"}}>
                <Link href="/admin/users">
                  <Users />
                  <span className="group-data-[collapsible=icon]:hidden">Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{children: "Support"}}>
              <LifeBuoy />
              <span className="group-data-[collapsible=icon]:hidden">Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{children: "Settings"}}>
              <Settings />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
