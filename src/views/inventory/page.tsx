import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Package, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from '@/components/bottom-nav';
import { useFoodItems } from '@/hooks/use-food-items';
import { useCategories } from '@/hooks/use-categories';
import { FoodItemCard } from '@/components/food-item-card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function InventoryPage() {
  const {
    items: inventory,
    deleteItem,
    isLoading,
    isError,
    error,
    refetch,
  } = useFoodItems();
  const { categories: userCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Combine user-defined categories with categories from existing inventory items
  const inventoryCategories = Array.from(
    new Set(inventory.map((item) => item.category))
  );
  const allUserCategories = userCategories.map((cat) => cat.name);
  const allCategories = Array.from(
    new Set([...allUserCategories, ...inventoryCategories])
  );
  const categories = ['all', ...allCategories.sort()];

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Không thể xóa thực phẩm. Vui lòng thử lại.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh inventory:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Đang tải kho...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 flex items-center justify-center'>
        <Alert variant='destructive'>
          <AlertDescription>
            Lỗi khi tải kho: {error?.message || 'Đã xảy ra lỗi không xác định.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-2xl font-bold text-gray-900'>Kho thực phẩm</h1>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                aria-label='Làm mới kho'
                className='bg-transparent'
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                Làm mới
              </Button>
              <Link to='/inventory/add'>
                <Button size='sm'>
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm thực phẩm
                </Button>
              </Link>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Tìm kiếm thực phẩm...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <div className='flex gap-2 overflow-x-auto pb-2'>
              {categories.map((category) => {
                const userCategory = userCategories.find(
                  (cat) => cat.name === category
                );
                const displayName =
                  category === 'all'
                    ? 'Tất cả'
                    : userCategory?.display_name ||
                      category.charAt(0).toUpperCase() + category.slice(1);

                return (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? 'default' : 'outline'
                    }
                    size='sm'
                    onClick={() => setSelectedCategory(category)}
                    className='whitespace-nowrap'
                  >
                    {displayName}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className='p-4'>
        {filteredInventory.length > 0 ? (
          <div className='space-y-3'>
            {filteredInventory.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <Package className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Không tìm thấy thực phẩm
            </h3>
            <p className='text-gray-500 mb-4'>
              {searchTerm || selectedCategory !== 'all'
                ? 'Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn'
                : 'Bắt đầu bằng cách thêm một số thực phẩm vào kho của bạn'}
            </p>
            <Link to='/inventory/add'>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Thêm thực phẩm đầu tiên
              </Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
