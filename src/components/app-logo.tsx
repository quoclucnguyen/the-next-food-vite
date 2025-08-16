import { cn } from '@/lib/utils';

type AppLogoProps = {
  isExpanded?: boolean;
  className?: string;
};

export function AppLogo({ isExpanded = true, className }: AppLogoProps) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3', className)}>
      {/* Logo Icon - Food/Plate themed */}
      <div className='shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm'>
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='w-5 h-5 text-white'
        >
          {/* Fork and Spoon crossed design */}
          <path d='M3 2v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V2' />
          <path d='M7 2v20' />
          <path d='M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z' />
          <path d='M19 2v20' />
        </svg>
      </div>

      {/* Logo Text - Only show when expanded */}
      <div
        className={cn(
          'min-w-0 flex-1 transition-all duration-300 ease-out overflow-hidden',
          isExpanded
            ? 'opacity-100 translate-x-0 w-auto'
            : 'opacity-0 translate-x-2 w-0'
        )}
        style={{
          transitionDelay: isExpanded ? '100ms' : '0ms',
        }}
      >
        <h1 className='font-bold text-lg text-gray-900 leading-tight whitespace-nowrap'>
          The Next Food
        </h1>
        <p className='text-xs text-gray-500 leading-tight whitespace-nowrap'>
          Quản lý thực phẩm thông minh
        </p>
      </div>
    </div>
  );
}
