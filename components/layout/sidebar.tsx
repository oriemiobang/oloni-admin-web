'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

import { OloniLogo } from '@/components/ui/oloni-logo';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/config/nav';
import { cn } from '@/lib/utils';
// We'll replace these mock imports with actual Lucide icons later
import * as Icons from 'lucide-react';

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const userRole = 'ADMIN'; // MOCK - Will come from auth later

  return (
    <div
      className={cn(
        'bg-sidebar border-sidebar-border flex h-full flex-col border-r transition-all duration-300',
        isMobile ? 'w-64' : 'w-16 lg:w-64',
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'border-sidebar-border flex h-16 shrink-0 items-center border-b transition-all duration-300',
          isMobile ? 'px-6' : 'justify-center lg:justify-start lg:px-6',
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* Show full logo on mobile and desktop, small icon on tablet */}
          <div className={isMobile ? 'block' : 'hidden lg:block'}>
            <OloniLogo size="sm" />
          </div>
          <div className={isMobile ? 'hidden' : 'block lg:hidden'}>
            {/* Minimal logo mark for tablet */}
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded font-bold">
              O
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 lg:p-4">
        {NAV_ITEMS.filter((item) => !item.adminOnly || userRole === 'ADMIN').map((item) => {
          const Icon =
            (Icons as unknown as Record<string, React.ElementType>)[item.icon] || Icons.Circle;
          // Simple exact match or starts-with for nested routes (excluding /dashboard matching everything)
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label} // Tooltip for collapsed state
              className={cn(
                'flex items-center rounded-md text-sm font-medium transition-colors',
                isMobile
                  ? 'gap-3 px-3 py-2'
                  : 'justify-center p-2 lg:justify-start lg:gap-3 lg:px-3 lg:py-2',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="size-5 shrink-0 lg:size-4" />
              <span className={isMobile ? 'block' : 'hidden lg:block'}>{item.label}</span>

              {/* Mock Badge - will be wired up to realtime stats later */}
              {item.badgeKey && (
                <span
                  className={cn(
                    'bg-destructive text-destructive-foreground ml-auto inline-flex items-center justify-center rounded-full font-medium',
                    isMobile
                      ? 'h-5 px-2 text-xs'
                      : 'absolute top-2 right-2 size-2 lg:static lg:h-5 lg:px-2 lg:text-xs',
                  )}
                >
                  <span className={isMobile ? 'inline' : 'hidden lg:inline'}>3</span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="border-sidebar-border shrink-0 border-t p-3 lg:p-4">
        <div
          className={cn(
            'text-sidebar-foreground flex items-center rounded-md text-sm',
            isMobile
              ? 'gap-3 px-3 py-2'
              : 'justify-center p-2 lg:justify-start lg:gap-3 lg:px-3 lg:py-2',
          )}
        >
          <div className="bg-sidebar-accent text-sidebar-accent-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
            <User className="size-4" />
          </div>
          <div
            className={cn('flex min-w-0 flex-1 flex-col', isMobile ? 'block' : 'hidden lg:flex')}
          >
            <span className="truncate font-medium">Admin User</span>
            <span className="text-muted-foreground truncate text-xs">{userRole}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'text-sidebar-foreground hover:text-destructive h-8 w-8 shrink-0',
              isMobile ? 'flex' : 'hidden lg:flex',
            )}
          >
            <LogOut className="size-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
