import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Search } from 'lucide-react';

import type { FilterState } from './types';

interface RestaurantsToolbarProps {
  loading: boolean;
  filters: FilterState;
  availableCuisines: string[];
  onAddRestaurant: () => void;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onToggleSort: () => void;
}

export function RestaurantsToolbar({
  loading,
  filters,
  availableCuisines,
  onAddRestaurant,
  onFilterChange,
  onToggleSort,
}: Readonly<RestaurantsToolbarProps>) {
  return (
    <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
      <div className='px-4 py-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex-1'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 leading-tight'>
              Quản lý nhà hàng
            </h1>
          </div>

          <div className='flex sm:hidden'>
            <Button
              size='sm'
              onClick={onAddRestaurant}
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50'
            >
              {loading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Plus className='w-4 h-4' />
              )}
            </Button>
          </div>

          <div className='hidden sm:flex'>
            <Button
              size='sm'
              onClick={onAddRestaurant}
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Đang tải...
                </>
              ) : (
                <>
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm nhà hàng
                </>
              )}
            </Button>
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <Input
                placeholder='Tìm kiếm nhà hàng, loại món, địa chỉ...'
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className='pl-10'
              />
            </div>

            <Select
              value={filters.cuisine}
              onValueChange={(value) => onFilterChange('cuisine', value)}
            >
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder='Tất cả loại món' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả loại món</SelectItem>
                {availableCuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Sắp xếp:</span>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                onFilterChange('sortBy', value as FilterState['sortBy'])
              }
            >
              <SelectTrigger className='w-32'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>Tên</SelectItem>
                <SelectItem value='rating'>Đánh giá</SelectItem>
                <SelectItem value='lastVisited'>Lần cuối ghé</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant='outline'
              size='sm'
              onClick={onToggleSort}
              className='px-3'
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
