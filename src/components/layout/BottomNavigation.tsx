import { Home, Users, Package, CreditCard, Warehouse, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/pos', icon: CreditCard, label: 'POS' },
  { to: '/warehouse', icon: Warehouse, label: 'Warehouse' },
  { to: '/reports', icon: FileText, label: 'Reports' },
];

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-6 h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center text-xs transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="truncate w-full text-center">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};