import { CosmeticCard } from '@/components/cosmetics/cosmetic-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories } from '@/hooks/use-categories';
import { useCosmetics, type Cosmetic } from '@/hooks/use-cosmetics';
import { cn } from '@/lib/utils';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { STATUS_FILTERS } from './constants';
import { DEFAULT_QUICK_ACTIONS } from './quick-actions';
import {
  attachMutators,
  buildDuplicateSnapshot,
  type CosmeticWithMutators,
} from './utils';

export default function CosmeticsPage() {
  const navigate = useNavigate();
  const { items, isLoading, isError, error, refetch, deleteItem, updateItem } =
    useCosmetics();
  const { categories } = useCategories();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Cosmetic['status'] | 'all'>(
    'all'
  );
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const cosmeticsWithMutators = useMemo(
    () => attachMutators(items, updateItem, deleteItem),
    [items, updateItem, deleteItem]
  );

  const overview = useMemo(
    () => ({
      total: items.length,
      dueSoon: items.filter((item) => item.status === 'warning').length,
      expired: items.filter((item) => item.status === 'expired').length,
      unopened: items.filter((item) => !item.opened_at).length,
    }),
    [items]
  );

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return cosmeticsWithMutators.filter((item) => {
      const matchesTerm =
        !term ||
        [item.name, item.brand, item.notes]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(term));
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || item.category_id === categoryFilter;
      return matchesTerm && matchesStatus && matchesCategory;
    });
  }, [cosmeticsWithMutators, searchTerm, statusFilter, categoryFilter]);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const duplicate = (cosmetic: CosmeticWithMutators) => {
    const snapshot = buildDuplicateSnapshot(cosmetic);
    window.sessionStorage.setItem(
      'cosmetic:duplicate',
      JSON.stringify(snapshot)
    );
    navigate('/inventory/cosmetics/add');
  };

  if (isLoading) {
    return (
      <div className='p-4 space-y-4'>
        <Skeleton className='h-12' />
        <Skeleton className='h-12' />
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className='h-48' />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-4'>
        <Alert variant='destructive'>
          <AlertDescription>
            Không thể tải danh sách mỹ phẩm: {error?.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white border-b shadow-sm sticky top-0 z-10'>
        <div className='px-4 py-4 space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900'>
                Quản lý mỹ phẩm
              </h1>
              <p className='text-sm text-gray-500'>
                Theo dõi PAO, hạn dùng và các nhắc nhở chăm sóc cá nhân.
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={refresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={cn(
                    'w-4 h-4 mr-2',
                    isRefreshing ? 'animate-spin' : ''
                  )}
                />
                Làm mới
              </Button>
              <Link to='/inventory/cosmetics/add'>
                <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm mỹ phẩm
                </Button>
              </Link>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <OverviewCard title='Tổng số' value={overview.total} />
            <OverviewCard title='Sắp hết hạn' value={overview.dueSoon} />
            <OverviewCard title='Đã hết hạn' value={overview.expired} />
            <OverviewCard title='Chưa mở' value={overview.unopened} />
          </div>

          <div className='grid gap-3 md:grid-cols-3'>
            <div className='md:col-span-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
                <Input
                  placeholder='Tìm kiếm tên, thương hiệu, ghi chú...'
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <div className='md:col-span-1'>
              <Tabs
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as Cosmetic['status'] | 'all')
                }
              >
                <TabsList className='w-full overflow-x-auto'>
                  {STATUS_FILTERS.map((filter) => (
                    <TabsTrigger
                      key={filter.value}
                      value={filter.value}
                      className='flex-1 text-xs'
                    >
                      {filter.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className='md:col-span-1'>
              <div className='flex flex-wrap gap-2'>
                <Badge
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  className='cursor-pointer'
                  onClick={() => setCategoryFilter('all')}
                >
                  Tất cả danh mục
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={
                      categoryFilter === category.id ? 'default' : 'outline'
                    }
                    className='cursor-pointer'
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    {category.display_name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className='p-4'>
        {filtered.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-lg font-semibold text-gray-700'>
              Chưa có mỹ phẩm nào phù hợp
            </p>
            <p className='text-gray-500 mb-4'>
              Thay đổi bộ lọc hoặc thêm sản phẩm mới để bắt đầu theo dõi.
            </p>
            <Link to='/inventory/cosmetics/add'>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Thêm mỹ phẩm
              </Button>
            </Link>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {filtered.map((cosmetic) => (
              <CosmeticCard
                key={cosmetic.id}
                cosmetic={cosmetic}
                onEdit={() =>
                  navigate(`/inventory/cosmetics/edit/${cosmetic.id}`)
                }
                onDelete={async () => {
                  if (confirm(`Xóa "${cosmetic.name}"?`)) {
                    await cosmetic.remove();
                  }
                }}
                onDuplicate={() => duplicate(cosmetic)}
                actions={DEFAULT_QUICK_ACTIONS.filter(
                  (action) => !action.hidden?.(cosmetic)
                ).map((action) => ({
                  label: action.label,
                  icon: <action.icon className='w-4 h-4' />,
                  onClick: async () => {
                    try {
                      await action.handler(cosmetic);
                    } catch (eventError) {
                      console.error('Failed to run quick action', eventError);
                      alert('Không thể thực hiện hành động. Vui lòng thử lại.');
                    }
                  },
                  variant: action.destructive ? 'destructive' : 'secondary',
                }))}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function OverviewCard({
  title,
  value,
}: Readonly<{ title: string; value: number }>) {
  return (
    <div className='rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm'>
      <p className='text-xs uppercase text-gray-500'>{title}</p>
      <p className='mt-1 text-2xl font-semibold text-gray-900'>{value}</p>
    </div>
  );
}
