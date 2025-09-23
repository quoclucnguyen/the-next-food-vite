import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CategoryWithType } from '@/hooks/use-categories';
import type { CosmeticCategoryTypeRow } from '@/hooks/use-cosmetic-category-types';
import type { Cosmetic } from '@/hooks/use-cosmetics';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { STATUS_FILTERS } from '@/views/cosmetics/constants';
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { CategoryBadgeGroup } from './category-badge-group';

type CategoryGroup = {
  id: string;
  label: string;
  categories: CategoryWithType[];
};

type CosmeticsFiltersProps = Readonly<{
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: Cosmetic['status'] | 'all';
  onStatusFilterChange: (value: Cosmetic['status'] | 'all') => void;
  typeFilter: string | 'all';
  categoryFilter: string | 'all';
  categoryTypes: CosmeticCategoryTypeRow[];
  visibleTypedGroups: CategoryGroup[];
  unassignedCategories: CategoryWithType[];
  onResetCategories: () => void;
  onSelectAllCategories: () => void;
  onTypeSelect: (typeId: string) => void;
  onCategorySelect: (categoryId: string) => void;
}>;

export function CosmeticsFilters({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  categoryFilter,
  categoryTypes,
  visibleTypedGroups,
  unassignedCategories,
  onResetCategories,
  onSelectAllCategories,
  onTypeSelect,
  onCategorySelect,
}: CosmeticsFiltersProps) {
  const isMobile = useIsMobile?.() ?? false;
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(false);

  const searchField = (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
      <Input
        placeholder='Tìm kiếm tên, thương hiệu, ghi chú...'
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
        className='pl-10'
      />
    </div>
  );

  const statusTabs = (
    <Tabs
      value={statusFilter}
      onValueChange={(value) =>
        onStatusFilterChange(value as Cosmetic['status'] | 'all')
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
  );

  if (isMobile) {
    return (
      <div className='grid gap-3 grid-cols-1'>
        <div>{searchField}</div>
        <div>{statusTabs}</div>
        <div className='flex items-center justify-end'>
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2 w-full sm:w-auto'
                onClick={() => setFilterSheetOpen(true)}
              >
                <SlidersHorizontal className='w-4 h-4' />
                Bộ lọc
              </Button>
            </SheetTrigger>
            <SheetContent
              side='bottom'
              className='max-h-[80vh] overflow-y-auto'
            >
              <SheetHeader className='pb-2 text-left'>
                <SheetTitle>Bộ lọc mỹ phẩm</SheetTitle>
                <SheetDescription>
                  Chọn loại và danh mục để thu hẹp danh sách sản phẩm.
                </SheetDescription>
              </SheetHeader>
              <div className='space-y-3 py-2'>
                <div className='space-y-2'>
                  <p className='text-xs font-medium uppercase text-gray-500'>
                    Loại mỹ phẩm
                  </p>
                  <div className='flex flex-nowrap gap-2 overflow-x-auto pb-2'>
                    <Badge
                      variant={typeFilter === 'all' ? 'default' : 'outline'}
                      className='cursor-pointer whitespace-nowrap text-xs px-2 py-1'
                      onClick={onResetCategories}
                    >
                      Tất cả loại
                    </Badge>
                    {categoryTypes.map((type) => (
                      <Badge
                        key={type.id}
                        variant={typeFilter === type.id ? 'default' : 'outline'}
                        className='cursor-pointer whitespace-nowrap text-xs px-2 py-1'
                        onClick={() => onTypeSelect(type.id)}
                      >
                        {type.display_name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className='flex flex-nowrap gap-2 overflow-x-auto pb-2'>
                  <Badge
                    variant={categoryFilter === 'all' ? 'default' : 'outline'}
                    className='cursor-pointer whitespace-nowrap text-xs px-2 py-1'
                    onClick={onSelectAllCategories}
                  >
                    Tất cả danh mục
                  </Badge>
                </div>
                {visibleTypedGroups.map((group) => (
                  <CategoryBadgeGroup
                    key={group.id}
                    label={group.label}
                    categories={group.categories}
                    activeCategory={categoryFilter}
                    onSelect={onCategorySelect}
                    mobile
                  />
                ))}
                {typeFilter === 'all' && unassignedCategories.length > 0 && (
                  <CategoryBadgeGroup
                    label='Danh mục chưa gán'
                    categories={unassignedCategories}
                    activeCategory={categoryFilter}
                    onSelect={onCategorySelect}
                    mobile
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  return (
    <Collapsible
      open={desktopFiltersOpen}
      onOpenChange={setDesktopFiltersOpen}
      className='space-y-3'
    >
      <div className='grid gap-3 grid-cols-1 md:grid-cols-3 items-start'>
        <div className='md:col-span-1'>{searchField}</div>
        <div className='md:col-span-1'>{statusTabs}</div>
        <div className='md:col-span-1 flex items-start justify-end'>
          <CollapsibleTrigger asChild>
            <Button
              variant='outline'
              className='flex w-full md:w-auto items-center justify-between gap-2'
            >
              <span>Bộ lọc chi tiết</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  desktopFiltersOpen ? 'rotate-180' : 'rotate-0'
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className='block'>
        <div className='mt-3 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
          <div className='space-y-2'>
            <p className='text-xs font-medium uppercase text-gray-500'>
              Loại mỹ phẩm
            </p>
            <div className='flex flex-wrap gap-2'>
              <Badge
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                className='cursor-pointer'
                onClick={onResetCategories}
              >
                Tất cả loại
              </Badge>
              {categoryTypes.map((type) => (
                <Badge
                  key={type.id}
                  variant={typeFilter === type.id ? 'default' : 'outline'}
                  className='cursor-pointer'
                  onClick={() => onTypeSelect(type.id)}
                >
                  {type.display_name}
                </Badge>
              ))}
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Badge
              variant={categoryFilter === 'all' ? 'default' : 'outline'}
              className='cursor-pointer'
              onClick={onSelectAllCategories}
            >
              Tất cả danh mục
            </Badge>
          </div>
          {visibleTypedGroups.map((group) => (
            <CategoryBadgeGroup
              key={group.id}
              label={group.label}
              categories={group.categories}
              activeCategory={categoryFilter}
              onSelect={onCategorySelect}
            />
          ))}
          {typeFilter === 'all' && unassignedCategories.length > 0 && (
            <CategoryBadgeGroup
              label='Danh mục chưa gán'
              categories={unassignedCategories}
              activeCategory={categoryFilter}
              onSelect={onCategorySelect}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
