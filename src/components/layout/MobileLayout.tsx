import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
}

export const MobileLayout = ({ children, title }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {title && (
        <header className="sticky top-0 z-40 bg-primary text-primary-foreground px-4 py-3 shadow-sm">
          <h1 className="text-lg font-semibold text-center">{title}</h1>
        </header>
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};