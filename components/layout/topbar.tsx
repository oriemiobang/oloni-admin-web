'use client';

import * as React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Breadcrumbs } from './breadcrumbs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

export function Topbar() {
  return (
    <header className="bg-background sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b px-4 sm:px-6">
      {/* Mobile Sidebar Trigger */}
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar isMobile={true} />
        </SheetContent>
      </Sheet>

      {/* Desktop Breadcrumbs */}
      <div className="hidden flex-1 sm:flex">
        <Breadcrumbs />
      </div>

      <div className="flex flex-1 justify-end gap-2 sm:flex-none">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="bg-destructive border-background absolute top-2 right-2 size-2 rounded-full border-2" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
