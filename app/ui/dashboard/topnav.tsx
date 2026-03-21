'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { LogoutButton } from '@/components/logout-button'; 

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/papers': 'Academic Papers',
  '/dashboard/checklist': 'Student Checklist',
  '/dashboard/handbook': 'Student Handbook',
  '/dashboard/profile': 'My Profile',
  '/dashboard/about' : 'About Us'
};

export default function TopNav() {
  const pathname = usePathname();

  const currentTitle = () => {
    if (routeTitles[pathname]) return routeTitles[pathname];
    if (pathname.startsWith('/dashboard/checklist/student/')) return 'Student Profile';
    if (pathname.startsWith('/dashboard/checklist/')) {
      const segments = pathname.split('/');
      const lastSegment = segments[segments.length - 1];
      return `Batch ${lastSegment}`;
    }

    return 'Management System';
  };

  const navItemClassName = (isActive: boolean) =>
    clsx(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
      {
        'bg-maroon text-white shadow-sm': isActive,
        'text-maroon-900 hover:bg-maroon/10 hover:text-maroon': !isActive,
      }
    );

  return (
    <header className="flex h-16 items-center justify-between border-b border-maroon/10 bg-red-50 px-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight text-maroon pt-1.5">{currentTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile" className={navItemClassName(pathname === '/dashboard/profile')}>
          <UserCircleIcon className={clsx("w-6 h-6", pathname === '/dashboard/profile' ? "text-white" : "text-maroon")} />
          <span className="hidden md:inline">Profile</span>
        </Link>

        <div className="h-6 w-[1px] bg-maroon/20 mx-2" />

        <LogoutButton className={navItemClassName(false)}>
          <ArrowLeftOnRectangleIcon className="w-6 h-6 text-maroon" />
          <span className="hidden md:inline">Logout</span>
        </LogoutButton>
      </div>
    </header>
  );
}