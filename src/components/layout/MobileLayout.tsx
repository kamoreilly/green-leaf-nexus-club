import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
}

export const MobileLayout = ({ children, title }: MobileLayoutProps) => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20">
      {title && (
        <header className="sticky top-0 z-40 bg-primary text-primary-foreground px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">{title}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};