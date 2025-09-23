import { CosmeticCard } from '@/components/cosmetics/cosmetic-card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories, type CategoryWithType } from '@/hooks/use-categories';
import { useCosmeticCategoryTypes } from '@/hooks/use-cosmetic-category-types';
import { useCosmetics, type Cosmetic } from '@/hooks/use-cosmetics';
import { cn } from '@/lib/utils';
import { Plus, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CosmeticsFilters } from './components/cosmetics-filters';
import { OverviewCard } from './components/overview-card';
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
  const { categoryTypes } = useCosmeticCategoryTypes();

  const { typedGroups, unassignedCategories } = useMemo(() => {
    const sortedCategories = [...categories].sort((a, b) =>
      a.display_name.localeCompare(b.display_name, 'vi', {
        sensitivity: 'base',
      })
    );

    const groups = categoryTypes
      .map((type) => ({
        id: type.id,
        label: type.display_name,
        categories: sortedCategories.filter(
          (category) => category.cosmetic_category_type_id === type.id
        ),
      }))
      .filter((group) => group.categories.length > 0);

    const fallback = sortedCategories.filter(
      (category) => !category.cosmetic_category_type_id
    );

    return { typedGroups: groups, unassignedCategories: fallback };
  }, [categories, categoryTypes]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Cosmetic['status'] | 'all'>(
    'all'
  );
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categoryLookup = useMemo(() => {
    const map = new Map<string, CategoryWithType>();
    categories.forEach((category) => {
      if (category.id) {
        map.set(category.id, category);
      }
    });
    return map;
  }, [categories]);

  const cosmeticsWithMutators = useMemo(
    () => attachMutators(items, updateItem, deleteItem),
    [items, updateItem, deleteItem]
  );

  const visibleTypedGroups = useMemo(() => {
    if (typeFilter === 'all') {
      return typedGroups;
    }
    return typedGroups.filter((group) => group.id === typeFilter);
  }, [typedGroups, typeFilter]);

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

      const category = item.category_id
        ? categoryLookup.get(item.category_id)
        : undefined;
      const categoryTypeId =
        category?.cosmetic_category_type_id ?? 'unassigned';

      const matchesType =
        typeFilter === 'all'
          ? true
          : categoryTypeId !== 'unassigned' && categoryTypeId === typeFilter;
      const matchesCategory =
        categoryFilter === 'all' || item.category_id === categoryFilter;
      return matchesTerm && matchesStatus && matchesType && matchesCategory;
    });
  }, [
    cosmeticsWithMutators,
    searchTerm,
    statusFilter,
    categoryFilter,
    typeFilter,
    categoryLookup,
  ]);

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
        <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'>
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

  const handleResetCategories = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
  };

  const handleSelectAllCategories = () => {
    setCategoryFilter('all');
  };

  const handleTypeSelect = (nextType: string) => {
    setTypeFilter((current) => (current === nextType ? 'all' : nextType));
    setCategoryFilter('all');
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategoryFilter(categoryId);
    const category = categoryLookup.get(categoryId);
    setTypeFilter(category?.cosmetic_category_type_id ?? 'all');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white border-b shadow-sm lg:sticky lg:top-0 lg:z-10'>
        <div className='px-4 py-4 space-y-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900'>
                Quản lý mỹ phẩm
              </h1>
              <p className='text-sm text-gray-500'>
                Theo dõi PAO, hạn dùng và các nhắc nhở chăm sóc cá nhân.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
              <Button
                variant='outline'
                size='sm'
                className='w-full sm:w-auto'
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
              <Link to='/inventory/cosmetics/add' className='w-full sm:w-auto'>
                <Button
                  size='sm'
                  className='bg-blue-600 hover:bg-blue-700 w-full sm:w-auto'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm mỹ phẩm
                </Button>
              </Link>
            </div>
          </div>

          <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
            <OverviewCard title='Tổng số' value={overview.total} />
            <OverviewCard title='Sắp hết hạn' value={overview.dueSoon} />
            <OverviewCard title='Đã hết hạn' value={overview.expired} />
            <OverviewCard title='Chưa mở' value={overview.unopened} />
          </div>

          <CosmeticsFilters
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            categoryTypes={categoryTypes}
            visibleTypedGroups={visibleTypedGroups}
            unassignedCategories={unassignedCategories}
            onResetCategories={handleResetCategories}
            onSelectAllCategories={handleSelectAllCategories}
            onTypeSelect={handleTypeSelect}
            onCategorySelect={handleCategorySelect}
          />
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
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'>
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
