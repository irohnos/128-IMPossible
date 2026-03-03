import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { 
  UserCircleIcon, 
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex h-full w-64 flex-col bg-zinc-600 py-6">
      <div className="mb-8 flex items-center gap-4 px-6">
        <div className="h-12 w-12 shrink-0 rounded-full bg-zinc-100 shadow-sm" />
        <h1 className="text-sm font-bold leading-tight text-white">
          Institute of <br /> Management System
        </h1>
      </div>

      <div className="mb-2 px-6">
        <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">
          Menu
        </span>
      </div>

      <div className="flex flex-col">
        <NavLinks />
      </div>

      <div className="mt-auto flex flex-col gap-1">
        <Link 
          href="/dashboard/profile" 
          className="flex h-[48px] items-center gap-4 px-6 text-sm font-medium text-zinc-200 hover:bg-zinc-500 hover:text-white transition-colors"
        >
          <UserCircleIcon className="w-6" />
          <p>Profile</p>
        </Link>
        
        <form action={async () => { 'use server'; /* Logout logic */ }}>
          <button className="flex h-[48px] w-full items-center gap-4 px-6 text-sm font-medium text-zinc-200 hover:bg-zinc-500 hover:text-white transition-colors">
            <ArrowLeftOnRectangleIcon className="w-6" />
            <p>Logout</p>
          </button>
        </form>
      </div>
    </div>
  );
}