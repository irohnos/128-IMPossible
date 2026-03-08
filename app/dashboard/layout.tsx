import SideNav from '@/app/ui/dashboard/sidenav';
import TopNav from '@/app/ui/dashboard/topnav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <div className="flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-y-auto py-10 px-6 bg-white text-zinc-800">
          {children}
        </main>
      </div>
    </div>
  );
}