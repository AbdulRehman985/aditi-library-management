'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  UserPlus,
  Receipt,
  X,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Students',
    href: '/students',
    icon: Users,
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: CreditCard,
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Admission',
    href: '/admission',
    icon: UserPlus,
  },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center text-xs text-gray-500">
          <Receipt className="mr-2 h-4 w-4" />
          Library Management v1.0
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open = false, onClose, className }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col',
          className
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-0">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="text-left">Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onClose={onClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
