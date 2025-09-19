import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Calendar,
  ChefHat,
  ChevronLeft,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { AppLogo } from './app-logo';

type AppNavigationProps = {
  onExpandedChange?: (expanded: boolean) => void;
};

export function AppNavigation({ onExpandedChange }: AppNavigationProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  const navItems = [
    { href: '/', icon: Home, label: 'Trang chủ' },
    { href: '/inventory', icon: Package, label: 'Kho' },
    { href: '/inventory/cosmetics', icon: Sparkles, label: 'Mỹ phẩm' },
    { href: '/meal-planning', icon: Calendar, label: 'Bữa ăn' },
    { href: '/restaurants', icon: Utensils, label: 'Nhà hàng' },
    { href: '/recipes', icon: ChefHat, label: 'Công thức' },
    { href: '/shopping-list', icon: ShoppingCart, label: 'Mua sắm' },
    { href: '/settings', icon: Settings, label: 'Cài đặt' },
  ];

  return (
    <div
      className={cn(
        // Mobile: bottom nav; md+: left sidebar with proper flex structure
        'fixed bg-white border-gray-200 safe-area-inset-bottom z-40',
        'bottom-0 left-0 right-0 border-t w-full',
        'md:top-0 md:bottom-0 md:right-auto md:border-t-0 md:border-r md:flex md:flex-col',
        // Smooth transitions with GPU acceleration
        'transition-all duration-300 ease-out will-change-transform',
        // Dynamic width for desktop
        isExpanded ? 'md:w-64' : 'md:w-20'
      )}
      style={{ contain: 'layout style' }}
    >
      {/* Desktop Logo Area */}
      <div className='hidden md:block border-b border-gray-200'>
        <AppLogo isExpanded={isExpanded} />
      </div>

      <div className='flex justify-around items-center px-1 sm:px-2 md:flex-col md:justify-start md:items-stretch md:py-2 md:gap-1 md:flex-1 md:overflow-hidden transition-all duration-300 ease-out'>
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                // Base styles with proper touch targets (min 44px)
                'flex transition-colors duration-200 min-w-0 relative',
                // Mobile: flex-col (vertical), Desktop: flex-row when expanded, flex-col when collapsed
                'flex-col items-center justify-center',
                isExpanded
                  ? 'md:flex-row md:items-center md:justify-start'
                  : 'md:flex-col md:items-center md:justify-center',
                // Touch target sizing - minimum 44px height and width
                'min-h-[44px] min-w-[44px] py-1.5 px-1',
                // Desktop padding adjustments
                isExpanded ? 'md:py-3 md:px-4' : 'md:py-2 md:px-2',
                // Responsive padding and spacing
                'sm:py-2 sm:px-2 sm:min-h-[48px] sm:min-w-[48px]',
                // Gap between icon and text
                'gap-0.5 sm:gap-1',
                isExpanded ? 'md:gap-3' : 'md:gap-1',
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
                  'font-medium truncate text-center leading-tight transition-all duration-300 ease-out',
                  // Responsive text sizing
                  'text-[10px] xs:text-[11px] sm:text-xs',
                  // Hide text on very small screens (< 320px) if needed; show on md sidebar only when expanded
                  'hidden xs:block',
                  isExpanded
                    ? 'md:block md:opacity-100 md:translate-x-0'
                    : 'md:hidden md:opacity-0 md:translate-x-2'
                )}
                style={{
                  transitionDelay: isExpanded ? '75ms' : '0ms',
                }}
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

      {/* Desktop Toggle Button - Moved to bottom */}
      <div className='hidden md:flex justify-center p-2 border-t border-gray-200 transition-all duration-300 ease-out'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Thu gọn menu' : 'Mở rộng menu'}
          className='w-8 h-8 transition-all duration-300 ease-in-out hover:bg-gray-100 active:scale-95 will-change-transform'
        >
          <ChevronLeft
            className={cn(
              'w-4 h-4 transition-transform duration-300 ease-in-out transform-gpu origin-center will-change-transform',
              isExpanded ? 'rotate-0' : 'rotate-180'
            )}
          />
        </Button>
      </div>
    </div>
  );
}
