
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import { SidebarNavigation } from '@/components/SidebarNavigation';
import ProposerAILogo from '@/components/ProposerAILogo';

export default function Template({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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
      </SidebarProvider>
    );
  }

  return null;
}
