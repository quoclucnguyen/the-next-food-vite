import { AppNavigation } from '@/components/app-navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';

type AppLayoutProps = {
  children: ReactNode;
  showAppNavigation?: boolean;
};

export default function AppLayout({
  children,
  showAppNavigation = true,
}: Readonly<AppLayoutProps>) {
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  return (
    <div className='min-h-screen flex flex-col md:flex-row transition-all duration-300 ease-in-out'>
      <main
        className={`flex-1 pb-16 md:pb-0 transition-all duration-300 ease-in-out ${
          isNavExpanded ? 'md:pl-64' : 'md:pl-20'
        }`}
      >
        {children}
      </main>
      {showAppNavigation && (
        <AppNavigation onExpandedChange={setIsNavExpanded} />
      )}
    </div>
  );
}
