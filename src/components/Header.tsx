
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getTitleFromPath(pathname: string): string {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/repository')) return 'Proposal Repository';
    if (pathname === '/proposals/new') return 'Create Proposal';
    if (pathname.startsWith('/proposals')) return 'Proposal Workspace';
    return 'ProposerAI';
}

export default function Header() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const title = getTitleFromPath(pathname);
  const isDashboard = pathname === '/';
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const canCreateProposal = user && ['Admin', 'Approver', 'Manager', 'Editor'].includes(user.role);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex-1">
        <h1 className="text-xl font-semibold font-headline">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={isDashboard ? "Search proposals..." : "Search..."}
            className="w-full bg-background pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>
        
        {isDashboard && canCreateProposal && (
          <div className="hidden md:flex items-center gap-2">
            <Button asChild>
              <Link href="/proposals/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Proposal
              </Link>
            </Button>
          </div>
        )}

        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => toast({ title: "Coming Soon!", description: "Notifications will be available shortly." })}>
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                    {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />}
                    <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user?.email} ({user?.role})</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast({ title: "Coming Soon!", description: "The profile page will be available shortly." })}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Coming Soon!", description: "The settings page will be available shortly." })}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
