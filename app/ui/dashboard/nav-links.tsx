'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { 
  Squares2X2Icon, 
  BookOpenIcon, 
  ClipboardDocumentCheckIcon, 
  RectangleStackIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
  { name: 'Student Papers', href: '/dashboard/papers', icon: RectangleStackIcon },
  { name: 'Student Checklist', href: '/dashboard/checklist', icon: ClipboardDocumentCheckIcon },
  { name: 'Handbook', href: '/dashboard/handbook', icon: BookOpenIcon },
  { name: 'About Us', href: '/dashboard/about', icon: InformationCircleIcon},
];

export default function NavLinks({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-1">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            title={isCollapsed ? link.name : ''}
            className={clsx(
              'group relative flex h-[60px] items-center gap-4 transition-all duration-200 ease-in-out',
              {
                'bg-[#7b1113] text-white shadow-md': isActive,
                'text-[#3b0708] hover:bg-[#7b1113]/10 hover:text-[#7b1113]': !isActive,
                'px-6': !isCollapsed,
                'justify-center px-0': isCollapsed,
              }
            )}
          >
            {isActive && !isCollapsed && (
              <div className="absolute left-0 h-full w-1.5 bg-[#3b0708]/30" />
            )}

            <LinkIcon 
              className={clsx('w-7 h-7 shrink-0 transition-colors', {
                'text-white': isActive,
                'text-[#7b1113]': !isActive
              })} 
            />
            
            {!isCollapsed && (
              <p className={clsx(
                "whitespace-nowrap text-sm transition-all duration-300",
                isActive ? "font-bold" : "font-medium"
              )}>
                {link.name}
              </p>
            )}

            {isActive && isCollapsed && (
              <div className="absolute left-0 h-10 w-1.5 rounded-r-full bg-white/60" />
            )}
          </Link>
        );
      })}
    </div>
  );
}