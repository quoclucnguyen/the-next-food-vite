import { BottomNav } from '@/components/bottom-nav';
import type { ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
  showBottomNav?: boolean;
};

export default function AppLayout({
  children,
  showBottomNav = true,
}: Readonly<AppLayoutProps>) {
  return (
    <div className='min-h-screen flex flex-col md:flex-row transition-all duration-300 ease-in-out'>
      <main className='flex-1 pb-16 md:pb-0 md:pl-20 transition-all duration-300 ease-in-out'>{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
