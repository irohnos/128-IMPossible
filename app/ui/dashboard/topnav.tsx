'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/papers': 'Academic Papers',
  '/dashboard/checklist': 'Student Checklist',
  '/dashboard/handbook': 'Student Handbook',
  '/dashboard/profile': 'My Profile',
};

export default function TopNav() {
  const pathname = usePathname();
  const currentTitle = routeTitles[pathname] || 'Management System';

  const navItemClassName = (isActive: boolean) =>
    clsx(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
      {
        'bg-[#7b1113] text-white shadow-sm': isActive,
        'text-[#3b0708] hover:bg-[#7b1113]/10 hover:text-[#7b1113]': !isActive,
      }
    );

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#7b1113]/10 bg-[#faf7f5] px-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight text-[#7b1113]">
          {currentTitle}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/profile"
          className={navItemClassName(pathname === '/dashboard/profile')}
        >
          <UserCircleIcon className={clsx("w-6 h-6", pathname === '/dashboard/profile' ? "text-white" : "text-[#7b1113]")} />
          <span className="hidden md:inline">Profile</span>
        </Link>

        <div className="h-6 w-[1px] bg-[#7b1113]/20 mx-2" />

        <button
          onClick={() => {}}
          className={navItemClassName(false)}
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 text-[#7b1113] group-hover:text-[#7b1113]" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}