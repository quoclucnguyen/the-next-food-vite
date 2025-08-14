import {
  Home,
  Package,
  Calendar,
  ChefHat,
  ShoppingCart,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { href: '/', icon: Home, label: 'Trang chủ' },
    { href: '/inventory', icon: Package, label: 'Kho' },
    { href: '/meal-planning', icon: Calendar, label: 'Bữa ăn' },
    { href: '/recipes', icon: ChefHat, label: 'Công thức' },
    { href: '/shopping-list', icon: ShoppingCart, label: 'Mua sắm' },
    { href: '/settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    <div
      className={
        // Mobile: bottom nav; md+: left sidebar
        'fixed bg-white border-gray-200 safe-area-inset-bottom z-40 transition-all duration-300 ease-in-out '
        + 'bottom-0 left-0 right-0 border-t w-full '
        + 'md:top-0 md:bottom-0 md:right-auto md:w-20 md:border-t-0 md:border-r'
      }
    >
      <div className='flex justify-around items-center px-1 sm:px-2 md:flex-col md:justify-start md:items-stretch md:py-2 md:gap-1 transition-all duration-300 ease-in-out'>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                // Base styles with proper touch targets (min 44px)
                'flex flex-col items-center justify-center transition-colors duration-200 min-w-0 relative',
                // Touch target sizing - minimum 44px height and width
                'min-h-[44px] min-w-[44px] py-1.5 px-1 md:py-2',
                // Responsive padding and spacing
                'sm:py-2 sm:px-2 sm:min-h-[48px] sm:min-w-[48px]',
                // Gap between icon and text
                'gap-0.5 sm:gap-1',
                // Rounded corners and hover states
                'rounded-lg hover:bg-gray-50 active:bg-gray-100 md:mx-1',
                // Active and inactive states
                isActive
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  // Responsive icon sizing
                  'shrink-0 transition-colors duration-200',
                  // Smaller icons on very small screens, larger on mobile and up
                  'w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6'
                )}
              />
              <span
                className={cn(
                  'font-medium truncate text-center leading-tight transition-all duration-200',
                  // Responsive text sizing
                  'text-[10px] xs:text-[11px] sm:text-xs',
                  // Hide text on very small screens (< 320px) if needed; always show on md sidebar
                  'hidden xs:block md:block'
                )}
              >
                {label}
              </span>
              {/* Show only icon on very small screens with a small indicator dot for active state */}
              {isActive && (
                <>
                  {/* Mobile active dot */}
                  <div className='absolute -top-0.5 right-1 w-1 h-1 bg-blue-600 rounded-full xs:hidden md:hidden transition-opacity duration-200' />
                  {/* MD+ active bar on left */}
                  <div className='hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-sm transition-all duration-200' />
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
