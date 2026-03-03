'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { 
  Squares2X2Icon, 
  BookOpenIcon, 
  ClipboardDocumentCheckIcon, 
  ChartBarIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
  { name: 'Student Papers', href: '/papers', icon: RectangleStackIcon },
  { name: 'Student Checklist', href: '/checklist', icon: ClipboardDocumentCheckIcon },
  { name: 'Handbook', href: '/handbook', icon: BookOpenIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon }
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[52px] items-center gap-4 px-6 text-sm font-medium transition-all',
              {
                'bg-white text-zinc-800 shadow-sm': isActive,
                'text-zinc-200 hover:bg-zinc-500 hover:text-white': !isActive,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}