
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import { SidebarNavigation } from '@/components/SidebarNavigation';
import ProposerAILogo from '@/components/ProposerAILogo';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_TIMEOUT_MS = 13 * 60 * 1000;  // 13 minutes (2 min before timeout)

export default function Template({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const [warningOpen, setWarningOpen] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout>();
  const warningTimeoutId = useRef<NodeJS.Timeout>();

  const resetTimers = useCallback(() => {
    clearTimeout(timeoutId.current);
    clearTimeout(warningTimeoutId.current);

    warningTimeoutId.current = setTimeout(() => {
      setWarningOpen(true);
    }, WARNING_TIMEOUT_MS);

    timeoutId.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT_MS);

  }, [logout]);

  const handleStayLoggedIn = () => {
    setWarningOpen(false);
    resetTimers();
  };

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
      return;
    }
    
    if (isAuthenticated) {
      if (pathname === '/login') {
        router.push('/');
      }
      // Admin route protection
      if (pathname.startsWith('/admin') && user?.role !== 'Admin') {
          router.push('/not-found'); // Or a dedicated "access-denied" page
      }
    }
  }, [isAuthenticated, loading, pathname, router, user]);
  
  useEffect(() => {
    if (isAuthenticated) {
      const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach(event => window.addEventListener(event, resetTimers));
      resetTimers(); // Start the timer on load

      return () => {
        events.forEach(event => window.removeEventListener(event, resetTimers));
        clearTimeout(timeoutId.current);
        clearTimeout(warningTimeoutId.current);
      };
    }
  }, [isAuthenticated, resetTimers]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <ProposerAILogo className="w-16 h-16 text-primary animate-pulse" />
            <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, the effect will redirect.
  // We can show a loading state or null while redirecting.
  if (!isAuthenticated && pathname !== '/login') {
    return null; 
  }

  // Render children without layout for login page
  if (!isAuthenticated && pathname === '/login') {
    return <>{children}</>;
  }
  
  // For authenticated users, render with layout if not on login page
  if (isAuthenticated && pathname !== '/login') {
    return (
      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon">
          <SidebarNavigation />
        </Sidebar>
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
         <AlertDialog open={warningOpen} onOpenChange={setWarningOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you still there?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have been inactive for a while. For your security, you will be automatically logged out soon.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline" onClick={logout}>Log Out</Button>
                <Button onClick={handleStayLoggedIn}>Stay Logged In</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </SidebarProvider>
    );
  }

  return null;
}
