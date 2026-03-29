import { Suspense } from 'react';
import SideNav from '@/app/ui/dashboard/sidenav';
import TopNav from '@/app/ui/dashboard/topnav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<div className="h-16 bg-red-50 border-b border-[##7b1113] animate-pulse"/>}>
          <TopNav />
        </Suspense>
        <main className="flex-1 overflow-y-auto px-6 py-6 bg-white text-zinc-800">
          {children}
        </main>
      </div>
    </div>
  );
}